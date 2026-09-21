import { z } from "zod";
import { normalisePhone, SL_PHONE } from "./checkout";

export const INQUIRY_TYPES = [
  { value: "general", label: "General question" },
  { value: "order_help", label: "Order help" },
  { value: "business", label: "Business supply" },
  { value: "sample", label: "Tasting sample" },
  { value: "visit", label: "Factory visit interest" },
] as const;

export type InquiryTypeValue = (typeof INQUIRY_TYPES)[number]["value"];
export const inquiryTypeValues = INQUIRY_TYPES.map((t) => t.value) as [
  InquiryTypeValue,
  ...InquiryTypeValue[],
];

export const BUSINESS_TYPES = [
  "Office",
  "Café / tea shop",
  "Restaurant / hotel",
  "Shop / retailer",
  "Other",
] as const;

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "Too long")
    .optional()
    .default("")
    .transform((v) => (v === "" ? undefined : v));

export const contactSchema = z
  .object({
    type: z.enum(inquiryTypeValues, { error: "Choose an enquiry type" }),
    name: z.string().trim().min(2, "Please tell us your name").max(120),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(200)
      .optional()
      .default("")
      .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address")
      .transform((v) => (v === "" ? undefined : v)),
    phone: z
      .string()
      .trim()
      .optional()
      .default("")
      .transform((v) => (v === "" ? undefined : normalisePhone(v)))
      .refine((v) => v === undefined || SL_PHONE.test(v), "Enter a Sri Lankan phone number"),
    businessName: optional(160),
    businessType: optional(80),
    location: optional(160),
    monthlyUsage: optional(160),
    productSlug: optional(120),
    message: z
      .string()
      .trim()
      .max(2000, "Please keep your message under 2,000 characters")
      .optional()
      .default("")
      .transform((v) => (v === "" ? undefined : v)),
  })
  .refine((v) => v.email !== undefined || v.phone !== undefined, {
    path: ["email"],
    message: "Please give us a phone number or an email address",
  })
  .refine(
    (v) => (v.type !== "general" && v.type !== "order_help" ? true : v.message !== undefined),
    {
      path: ["message"],
      message: "Please tell us how we can help",
    },
  );

export type ContactInput = z.infer<typeof contactSchema>;
