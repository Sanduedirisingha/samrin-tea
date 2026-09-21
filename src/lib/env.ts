import { z } from "zod";

/**
 * Server-side environment, validated once and lazily so pages that never touch the
 * database (and `next build` without a DB) don't blow up on import.
 * Public (NEXT_PUBLIC_*) values live in `site-config.ts`.
 */
const serverSchema = z.object({
  DATABASE_URL: z
    .string({ error: "DATABASE_URL is not set" })
    .min(1, "DATABASE_URL is empty")
    .regex(/^postgres(ql)?:\/\//, "DATABASE_URL must start with postgres:// or postgresql://"),
  DELIVERY_FEE_LKR: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? Number(v) : null))
    .pipe(z.number().min(0).nullable()),
  FORM_SECRET: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      [
        "",
        "SAMRIN Tea — invalid environment configuration:",
        problems,
        "",
        "Copy .env.example to .env.local and set DATABASE_URL to your Neon *pooled* connection",
        "string (or run `npm run db:local` for an offline Postgres). See README.md.",
        "",
      ].join("\n"),
    );
  }
  cached = parsed.data;
  return cached;
}

/** Delivery fee in minor units (cents), or null when no fee is configured. */
export function getDeliveryFeeMinor(): number | null {
  const fee = getServerEnv().DELIVERY_FEE_LKR;
  return fee === null ? null : Math.round(fee * 100);
}
