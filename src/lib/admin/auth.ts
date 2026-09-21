import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { getAdminEnv } from "@/lib/env";

const digest = (v: string) => createHash("sha256").update(v).digest();

/** Constant-time comparison of email and password against the env credentials. */
export function checkCredentials(email: string, password: string): boolean {
  const admin = getAdminEnv();
  if (!admin) return false;
  const emailOk = timingSafeEqual(
    digest(email.trim().toLowerCase()),
    digest(admin.email.toLowerCase()),
  );
  const passOk = timingSafeEqual(digest(password), digest(admin.password));
  return emailOk && passOk;
}

/** In-memory brute-force throttle: 5 failures per 15 minutes per client (per server instance). */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, { count: number; first: number }>();

export function isLoginLocked(key: string): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordLoginFailure(key: string): void {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS)
    failures.set(key, { count: 1, first: Date.now() });
  else entry.count += 1;
}

export function clearLoginFailures(key: string): void {
  failures.delete(key);
}
