"use server";

import { sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { settings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/session";
import { SETTINGS_TAG } from "@/lib/data/settings";

export type SettingsState = {
  status: "idle" | "saved" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"deliveryFeeLkr" | "contactEmail" | "whatsappNumber", string>>;
};

const blank = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

const schema = z.object({
  deliveryFeeLkr: z.preprocess(
    blank,
    z
      .string()
      .trim()
      .regex(/^\d{1,7}(\.\d{1,2})?$/, "Enter an amount like 350 or 350.00")
      .transform(Number)
      .optional(),
  ),
  contactEmail: z.preprocess(
    blank,
    z.string().trim().toLowerCase().email("Enter a valid email address").max(200).optional(),
  ),
  whatsappNumber: z.preprocess(
    (v) => {
      const digits = typeof v === "string" ? v.replace(/[^\d]/g, "") : "";
      return digits === "" ? undefined : digits;
    },
    z
      .string()
      .regex(/^\d{9,15}$/, "Use digits with the country code, e.g. 94771234567")
      .optional(),
  ),
});

export async function saveSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: SettingsState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as keyof NonNullable<SettingsState["fieldErrors"]>] ??=
        issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }
  const entries: [string, unknown][] = [
    ["deliveryFeeLkr", parsed.data.deliveryFeeLkr ?? null],
    ["contactEmail", parsed.data.contactEmail ?? null],
    ["whatsappNumber", parsed.data.whatsappNumber ?? null],
  ];
  // One atomic statement so a reader can never see half of the settings. Values are wrapped as
  // { v } (see lib/data/settings.ts).
  await getDb()
    .insert(settings)
    .values(entries.map(([key, value]) => ({ key, value: { v: value } })))
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: sql`excluded.value`, updatedAt: new Date() },
    });
  revalidateTag(SETTINGS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return { status: "saved", message: "Settings saved." };
}
