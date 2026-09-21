import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { getServerEnv } from "@/lib/env";

/** Minimum time a human needs to fill a form; anything faster is treated as a bot. */
export const MIN_FILL_MS = 3_000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function secret() {
  const env = getServerEnv();
  return env.FORM_SECRET ?? createHash("sha256").update(`samrin:${env.DATABASE_URL}`).digest("hex");
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

/** Signed "form rendered at" token, embedded in a hidden field. */
export function createFormToken(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function verifyFormToken(token: unknown): boolean {
  if (typeof token !== "string") return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  const expected = sign(issuedAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const age = Date.now() - Number(issuedAt);
  return age >= MIN_FILL_MS && age <= MAX_AGE_MS;
}

/**
 * Hook for a CAPTCHA (e.g. Cloudflare Turnstile). Read the widget's token from the form
 * (`cf-turnstile-response`), POST it to Turnstile's siteverify endpoint with your secret key,
 * and return the result. Currently a no-op so the honeypot + timing + rate limit guards apply.
 */
export async function verifyCaptcha(_token: FormDataEntryValue | null): Promise<boolean> {
  void _token;
  return true;
}

/** Best-effort client IP, hashed so raw addresses are never stored. */
export async function getIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${secret()}:${ip}`).digest("hex").slice(0, 32);
}
