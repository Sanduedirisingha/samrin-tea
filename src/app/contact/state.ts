import type { InquiryTypeValue } from "@/lib/validators/contact";

export type ContactFieldName =
  | "type"
  | "name"
  | "email"
  | "phone"
  | "businessName"
  | "businessType"
  | "location"
  | "monthlyUsage"
  | "message";

/** Lives outside actions.ts because "use server" files may only export async functions. */
export type ContactState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<ContactFieldName, string>>;
  values?: Record<string, string>;
  submittedType?: InquiryTypeValue;
};

export const initialContactState: ContactState = { status: "idle" };
