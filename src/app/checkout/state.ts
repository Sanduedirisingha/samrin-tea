import type { CheckoutFieldName } from "@/lib/validators/checkout";

/** Lives outside actions.ts because "use server" files may only export async functions. */
export type CheckoutState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<CheckoutFieldName, string>>;
  /** Echoed back so React's form reset doesn't wipe what the customer typed. */
  values?: Record<string, string>;
};

export const initialCheckoutState: CheckoutState = { status: "idle" };
