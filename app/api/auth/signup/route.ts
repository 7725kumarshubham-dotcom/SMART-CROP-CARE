import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  authSessionDurationSeconds,
  createSessionToken,
  hashSessionToken,
  setAuthCookie
} from "@/backend/auth";
import { getPrismaClient } from "@/backend/db";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please complete the account form." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Please complete the account form." }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const confirmPassword = typeof input.confirmPassword === "string" ? input.confirmPassword : "";

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: "Enter a name between 2 and 100 characters." }, { status: 400 });
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return NextResponse.json({ error: "Use at least 8 characters, including a letter and a number." }, { status: 400 });
  }
  if (Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json({ error: "Choose a password that is no longer than 72 bytes." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Your passwords do not match." }, { status: 400 });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "The local database is not configured. Restart the app after setting DATABASE_URL." }, { status: 503 });
  }

  const sessionToken = createSessionToken();
  const expiresAt = new Date(Date.now() + authSessionDurationSeconds * 1000);
  try {
    const passwordHash = await hash(password, 12);
    const user = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: { name, phone, email, passwordHash },
        select: { id: true, name: true, phone: true, email: true }
      });
      await transaction.authSession.create({
        data: {
          tokenHash: hashSessionToken(sessionToken),
          userId: createdUser.id,
          expiresAt
        }
      });
      return createdUser;
    });

    const response = NextResponse.json({ user }, { status: 201 });
    setAuthCookie(response, sessionToken);
    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "An account already uses this email address or mobile number." }, { status: 409 });
    }
    console.error("Local account creation failed:", error);
    return NextResponse.json({ error: "We couldn't create your account. Please try again." }, { status: 500 });
  }
}
