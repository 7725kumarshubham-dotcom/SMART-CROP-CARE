import { compare } from "bcryptjs";
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
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (!email || email.length > 254 || !password) {
    return NextResponse.json({ error: "Enter a valid email address and password." }, { status: 400 });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json({ error: "The database is not configured. Set DATABASE_URL and redeploy the app." }, { status: 503 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash || !(await compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    const sessionToken = createSessionToken();
    await prisma.authSession.create({
      data: {
        tokenHash: hashSessionToken(sessionToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + authSessionDurationSeconds * 1000)
      }
    });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email }
    });
    setAuthCookie(response, sessionToken);
    return response;
  } catch (error) {
    console.error("Local sign-in failed:", error);
    return NextResponse.json({ error: "We couldn't sign you in. Please try again." }, { status: 500 });
  }
}
