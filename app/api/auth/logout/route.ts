import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authCookieName, clearAuthCookie, deleteCurrentSession } from "@/backend/auth";

export async function POST() {
  const token = (await cookies()).get(authCookieName)?.value;
  try {
    await deleteCurrentSession(token);
  } catch (error) {
    console.error("Local sign-out failed:", error);
    return NextResponse.json({ error: "We couldn't sign you out. Please try again." }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  return response;
}
