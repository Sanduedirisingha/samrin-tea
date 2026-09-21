import type { PaymentProvider, PaymentStatus } from "./types";

/** No online payment: the team confirms payment details after the order is placed. */
export const manualPaymentProvider: PaymentProvider = {
  id: "manual",
  label: "Payment confirmed by our team",
  description:
    "Payment details are confirmed by our team after you place the order. You won't be charged online.",
  async createPayment() {
    return { status: "unpaid" };
  },
  async handleWebhook() {
    return new Response("Not implemented", { status: 501 });
  },
  mapStatus(raw: string): PaymentStatus {
    return raw === "paid" || raw === "failed" || raw === "refunded" ? raw : "unpaid";
  },
};
