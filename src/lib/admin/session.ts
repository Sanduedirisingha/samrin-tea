import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminEnv, getServerEnv } from "@/lib/env";

export const ADMIN_COOKIE = "samrin_admin";
const SESSION_SECONDS = 8 * 60 * 60;

function secret(): string {
  const env = getServerEnv();
  return (
    env.ADMIN_SESSION_SECRET ??
    createHash("sha256").update(`samrin-admin:${env.DATABASE_URL}`).digest("hex")
  );
}

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Creates a signed, expiring session cookie. HttpOnly + SameSite=Lax; Secure in production. */
export async function createAdminSession(email: string): Promise<void> {
  const payload = Buffer.from(
    JSON.stringify({ sub: email, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }),
  ).toString("base64url");
  (await cookies()).set(ADMIN_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
}

/** The signed-in admin, or null. Checks signature, expiry and that the admin still exists in env. */
export async function getAdminSession(): Promise<{ email: string } | null> {
  const admin = getAdminEnv();
  if (!admin) return null;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: string;
      exp?: number;
    };
    if (!data.sub || !data.exp || data.exp < Date.now() / 1000) return null;
    if (data.sub !== admin.email) return null;
    return { email: data.sub };
  } catch {
    return null;
  }
}

/**
 * Call at the top of EVERY admin page, server action and route handler. Layouts don't re-run on
 * client navigations, so they are not a sufficient guard on their own.
 */
export async function requireAdmin(): Promise<{ email: string }> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** For route handlers: rejects cross-site requests (the session cookie is SameSite=Lax). */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin GET/navigations don't send Origin
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
