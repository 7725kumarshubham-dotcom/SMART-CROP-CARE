import { createHash, randomBytes } from "node:crypto";
import { getPrismaClient } from "./db.js";

export const authCookieName = "smart-crop-session";
export const authSessionDurationSeconds = 60 * 60 * 24 * 7;

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function setAuthCookie(response, token) {
  response.cookie(authCookieName, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: authSessionDurationSeconds * 1000
  });
}

export function clearAuthCookie(response) {
  response.clearCookie(authCookieName, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/"
  });
}

export async function getSessionUser(req) {
  const token = req.cookies?.[authCookieName];
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
