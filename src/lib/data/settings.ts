import "server-only";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { settings } from "@/db/schema";
import { getServerEnv } from "@/lib/env";
import { siteConfig } from "@/lib/site-config";

/** Editable in admin → Settings. A saved value (even "empty") overrides the env default. */
export type StoreSettings = {
  /** Flat delivery fee in LKR (major units), or null for "confirmed by our team". */
  deliveryFeeLkr: number | null;
  contactEmail: string | null;
  /** Digits with country code, e.g. 94771234567. */
  whatsappNumber: string | null;
};

export const SETTINGS_TAG = "settings";

/**
 * Values are stored as { v: value }. A bare JSON string like "94771234567" gets parsed twice by the
 * pg driver + Drizzle and comes back as a number, so primitives are always wrapped.
 */
const unwrap = (stored: unknown): unknown =>
  stored && typeof stored === "object" && !Array.isArray(stored) && "v" in stored
    ? (stored as { v: unknown }).v
    : stored;

const readRaw = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const rows = await getDb().select().from(settings);
    return Object.fromEntries(rows.map((r) => [r.key, unwrap(r.value)]));
  },
  ["settings:v1"],
  { revalidate: 60, tags: [SETTINGS_TAG] },
);

const asString = (v: unknown) => {
  const text = typeof v === "number" ? String(v) : v;
  return typeof text === "string" && text.trim() !== "" ? text.trim() : null;
};

/** Store settings with env fallbacks, as the storefront should see them. */
export async function getStoreSettings(): Promise<StoreSettings> {
  const raw = await readRaw();
  return {
    deliveryFeeLkr:
      "deliveryFeeLkr" in raw
        ? typeof raw.deliveryFeeLkr === "number"
          ? raw.deliveryFeeLkr
          : null
        : getServerEnv().DELIVERY_FEE_LKR,
    contactEmail: "contactEmail" in raw ? asString(raw.contactEmail) : (siteConfig.email ?? null),
    whatsappNumber:
      "whatsappNumber" in raw ? asString(raw.whatsappNumber) : (siteConfig.whatsapp ?? null),
  };
}

/** Delivery fee in minor units (cents), or null when none is configured. */
export async function getDeliveryFeeMinor(): Promise<number | null> {
  const { deliveryFeeLkr } = await getStoreSettings();
  return deliveryFeeLkr === null ? null : Math.round(deliveryFeeLkr * 100);
}
