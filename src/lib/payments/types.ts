/**
 * Payment integration seam.
 *
 * To add a gateway (PayHere, Stripe, …): implement `PaymentProvider`, register it in
 * `./index.ts`, and point `PAYMENT_PROVIDER` at it. Redirect gateways return a `redirectUrl`
 * from `createPayment`; embedded ones can keep the customer on the confirmation page and
 * update `payment_status` from `handleWebhook`.
 */
export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

export type PaymentOrder = {
  id: string;
  orderNumber: string;
  totalLkr: number; // minor units
  customerEmail: string;
};

export type CreatePaymentResult = {
  status: PaymentStatus;
  /** Provider-side reference (session / transaction id), stored on the order. */
  reference?: string;
  /** If set, the customer is sent here to pay before returning to the success page. */
  redirectUrl?: string;
};

export interface PaymentProvider {
  /** Stored in orders.payment_provider. */
  readonly id: string;
  /** Shown to the customer in the checkout payment section. */
  readonly label: string;
  readonly description: string;
  createPayment(order: PaymentOrder): Promise<CreatePaymentResult>;
  /** Verify the signature and update the order. Called from /api/payments/webhook. */
  handleWebhook(request: Request): Promise<Response>;
  /** Map the provider's raw status string onto our payment_status enum. */
  mapStatus(raw: string): PaymentStatus;
}
