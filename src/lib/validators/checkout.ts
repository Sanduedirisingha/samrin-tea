import { z } from "zod";
import { SRI_LANKA_DISTRICTS } from "@/lib/districts";
import { shopConfig } from "@/lib/site-config";

/** Sri Lankan numbers: +94 7x xxx xxxx, 07x xxx xxxx, or a 0-prefixed landline. */
export const SL_PHONE = /^(?:\+94|0)[1-9]\d{8}$/;

/** Canonical storage form: +94XXXXXXXXX. */
export function normalisePhone(input: string): string {
  const compact = input.replace(/[\s\-()]/g, "");
  if (compact.startsWith("+94")) return compact;
  if (compact.startsWith("0094")) return `+94${compact.slice(4)}`;
  if (compact.startsWith("0")) return `+94${compact.slice(1)}`;
  if (/^94\d{9}$/.test(compact)) return `+${compact}`;
  return compact;
}

const trimmed = (label: string, min = 1, max = 200) =>
  z.string().trim().min(min, `${label} is required`).max(max, `${label} is too long`);

export const cartItemsSchema = z
  .array(
    z.object({
      productId: z.uuid(),
      qty: z.number().int().min(1).max(shopConfig.maxQtyPerLine),
    }),
  )
  .min(1, "Your cart is empty")
  .max(50);

export const checkoutSchema = z.object({
  fullName: trimmed("Full name", 2, 120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .transform(normalisePhone)
    .refine((v) => SL_PHONE.test(v), "Enter a Sri Lankan phone number, e.g. 077 123 4567"),
  addressLine1: trimmed("Address", 3, 200),
  addressLine2: z.string().trim().max(200).optional().default(""),
  city: trimmed("City", 2, 100),
  district: z.enum(SRI_LANKA_DISTRICTS, { error: "Choose your district" }),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Postal code is 5 digits"),
  notes: z
    .string()
    .trim()
    .max(500, "Please keep notes under 500 characters")
    .optional()
    .default(""),
  idempotencyKey: z.string().trim().min(8, "Please reload the page and try again").max(100),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutFieldName = keyof CheckoutInput;
