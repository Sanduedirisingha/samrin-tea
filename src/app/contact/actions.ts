"use server";

import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { getCatalog } from "@/lib/data/products";
import { getIpHash, verifyCaptcha, verifyFormToken } from "@/lib/form-guard";
import { isInquiryRateLimited } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validators/contact";
import type { ContactFieldName, ContactState } from "./state";

const fields = [
  "type",
  "name",
  "email",
  "phone",
  "businessName",
  "businessType",
  "location",
  "monthlyUsage",
  "productSlug",
  "message",
] as const;

export async function submitInquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values: Record<string, string> = {};
  for (const f of fields) values[f] = String(formData.get(f) ?? "");

  // 1. Honeypot: real people never see or fill this field. Pretend success so bots move on.
  if (String(formData.get("company_website") ?? "").trim() !== "") {
    return { status: "success", submittedType: "general" };
  }

  // 2. Minimum-time check (signed token issued when the page was rendered).
  if (!verifyFormToken(formData.get("form_token"))) {
    return {
      status: "error",
      message: "That was very quick — please take a moment and send it again.",
      values,
    };
  }

  // 3. CAPTCHA hook (Turnstile later).
  if (!(await verifyCaptcha(formData.get("cf-turnstile-response")))) {
    return {
      status: "error",
      message: "We couldn't verify you're human. Please try again.",
      values,
    };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactFieldName;
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }
  const input = parsed.data;

  // 4. Per-IP rate limit (durable, counted from the inquiries table).
  const ipHash = await getIpHash();
  if (await isInquiryRateLimited(ipHash)) {
    return {
      status: "error",
      message: "You've sent several messages recently. Please call us on +94 71 77 45 777 instead.",
      values,
    };
  }

  // Only keep a product reference that actually exists.
  let productSlug = input.productSlug;
  if (productSlug && !(await getCatalog()).some((p) => p.slug === productSlug))
    productSlug = undefined;

  // Business details are only relevant to business and sample enquiries.
  const isBusinessy = input.type === "business" || input.type === "sample";

  try {
    await getDb()
      .insert(inquiries)
      .values({
        type: input.type,
        name: input.name,
        email: input.email,
        phone: input.phone,
        businessName: isBusinessy ? input.businessName : undefined,
        businessType: isBusinessy ? input.businessType : undefined,
        location: isBusinessy ? input.location : undefined,
        monthlyUsage: isBusinessy ? input.monthlyUsage : undefined,
        productSlug,
        message: input.message,
        ipHash,
      });
  } catch (error) {
    console.error("submitInquiry failed", error);
    return {
      status: "error",
      message:
        "We couldn't send your message just now. Please try again, or call us on +94 71 77 45 777.",
      values,
    };
  }

  return { status: "success", submittedType: input.type };
}
