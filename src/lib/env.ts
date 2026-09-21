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
  /** Admin dashboard login. Leave unset to disable /admin entirely. */
  ADMIN_EMAIL: z.string().trim().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_SESSION_SECRET: z.string().optional(),
  /** Where uploaded product images are stored (default ./uploads, git-ignored). */
  UPLOAD_DIR: z.string().optional(),
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

/** Admin credentials, or null when the dashboard is not configured. */
export function getAdminEnv(): { email: string; password: string } | null {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = getServerEnv();
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return null;
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}
