import { manualPaymentProvider } from "./manual";
import type { PaymentProvider } from "./types";

const providers: Record<string, PaymentProvider> = {
  [manualPaymentProvider.id]: manualPaymentProvider,
  // payhere: payhereProvider,
};

/** Selected by PAYMENT_PROVIDER (defaults to the manual provider). */
export function getPaymentProvider(): PaymentProvider {
  return providers[process.env.PAYMENT_PROVIDER ?? "manual"] ?? manualPaymentProvider;
}

export type { PaymentProvider } from "./types";
