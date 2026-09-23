import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || "visionova-production-admin-session-secret-2026";
const SECRET_KEY = new TextEncoder().encode(SESSION_SECRET);
const COOKIE_NAME = "visionova_admin_session";

export async function createAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function checkIsAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return false;
    }
    return await verifyAdminToken(sessionCookie.value);
  } catch {
    return false;
  }
}

export function validateAdminCredentials(email: string, pass: string): boolean {
  const rawEmail = process.env.ADMIN_EMAIL || "visionova@gmail.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "visionova";

  const configuredEmail = rawEmail.replace(/^["']|["']$/g, "").trim();
  const configuredPassword = rawPassword.replace(/^["']|["']$/g, "").trim();

  if (!email || !pass) {
    return false;
  }

  return (
    email.trim().toLowerCase() === configuredEmail.toLowerCase() &&
    pass.trim() === configuredPassword
  );
}
