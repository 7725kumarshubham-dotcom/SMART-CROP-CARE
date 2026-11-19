import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { getPrismaClient } from "@/backend/db";

export const authCookieName = "smart-crop-session";
export const authSessionDurationSeconds = 60 * 60 * 24 * 7;

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(authCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: authSessionDurationSeconds
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(authCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(authCookieName)?.value;
  const prisma = getPrismaClient();
  if (!token || !prisma) return null;

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: { include: { farmProfile: true } } }
  });

  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await prisma.authSession.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

export async function deleteCurrentSession(token: string | undefined) {
  if (!token) return;
  const prisma = getPrismaClient();
  if (!prisma) return;

  await prisma.authSession.deleteMany({
    where: { tokenHash: hashSessionToken(token) }
  });
}
