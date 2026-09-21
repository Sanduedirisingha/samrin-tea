import { z } from "zod";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blank = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

/** Only images uploaded through the admin, or the site's own image folders, are accepted. */
export const productImageSchema = z.object({
  src: z
    .string()
    .regex(
      /^\/(?:uploads\/products|images\/products|images\/site)\/[A-Za-z0-9._-]+$/,
      "Invalid image path",
    ),
  alt: z.string().trim().max(200),
  width: z.number().int().min(1).max(10000),
  height: z.number().int().min(1).max(10000),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(160),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug is required")
    .max(120)
    .regex(SLUG_RE, "Use lowercase letters, numbers and single hyphens"),
  range: z.enum(["strong", "bopf"], { error: "Choose a range" }),
  format: z.enum(["loose", "tea_bags"], { error: "Choose a format" }),
  packLabel: z.string().trim().min(1, "Pack label is required").max(120),
  netWeightG: z.coerce
    .number({ error: "Enter the net weight" })
    .int("Whole grams only")
    .min(0)
    .max(100000),
  unitsPerPack: z.preprocess(
    blank,
    z.coerce.number().int("Whole number").min(1).max(10000).optional(),
  ),
  tagline: z.string().trim().min(1, "Tagline is required").max(200),
  shortDescription: z.string().trim().min(1, "Short description is required").max(1000),
  description: z.string().trim().min(1, "Description is required").max(4000),
  chooseThisIf: z.string().trim().min(1, "This line is required").max(600),
  priceRs: z.preprocess(
    blank,
    z
      .string()
      .trim()
      .regex(/^\d{1,7}(\.\d{1,2})?$/, "Enter a price like 320 or 320.00")
      .optional(),
  ),
  sortOrder: z.coerce.number({ error: "Enter a number" }).int().min(0).max(100000),
  details: z
    .array(
      z.object({
        label: z.string().trim().min(1, "Label required").max(80),
        value: z.string().trim().min(1, "Value required").max(300),
      }),
    )
    .max(20),
  images: z.array(productImageSchema).max(10),
});

export type ProductFormFields = z.input<typeof productSchema>;
export const TEXT_FIELDS = [
  "name",
  "slug",
  "range",
  "format",
  "packLabel",
  "netWeightG",
  "unitsPerPack",
  "tagline",
  "shortDescription",
  "description",
  "chooseThisIf",
  "priceRs",
  "sortOrder",
] as const;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}
