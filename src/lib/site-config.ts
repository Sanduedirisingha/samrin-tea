/** Public, non-secret site facts. Everything here comes from the client documents or env. */
const clean = (v: string | undefined) => (v && v.trim() !== "" ? v.trim() : undefined);

export const siteConfig = {
  name: "SAMRIN Tea",
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/+$/, ""),
  tagline: "Factory Fresh · Single Region Unblended · Directly From The Factory",
  description:
    "Pure Ceylon black tea from Ruhuna, Sri Lanka. Single region, unblended, directly from the Samrin Tea Factory.",
  hotline: { display: "+94 71 77 45 777", href: "tel:+94717745777" },
  website: { display: "www.samrintea.com", href: "https://www.samrintea.com" },
  /** Optional — rows are hidden when unset (not confirmed by the client). */
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/[^\d]/g, ""),
  mfNumber: "MF 1543",
  packerRegistration: "TC/LC/PR/1371",
  factory: {
    name: "Samrin Tea Factory",
    address: ["Nakiyadeniya", "Galle district", "Sri Lanka"],
  },
  manufacturer: {
    name: "Samrin Holdings (Pvt) Ltd",
    address: ["Samrin Estate", "Nakiyadeniya", "Galle"],
  },
  distributor: {
    name: "Geo Consumer Solutions (Pvt) Ltd",
    address: ["62B, Hiripitiya", "Pannipitiya"],
  },
} as const;

/** Trilingual line exactly as printed on the approved pack artwork. */
export const trilingualLine = "තේ · TEA · தேயிலை";

/** Business rules that must not be hard-coded in components. */
export const shopConfig = {
  maxQtyPerLine: 20,
  currency: "LKR",
  factoryVisitsFrom: "November 2026",
} as const;
