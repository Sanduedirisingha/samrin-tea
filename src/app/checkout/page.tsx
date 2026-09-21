import type { Metadata } from "next";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { PageHeader } from "@/components/sections/page-header";
import { getDeliveryFeeMinor } from "@/lib/data/settings";
import { getPaymentProvider } from "@/lib/payments";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
  alternates: { canonical: "/checkout" },
};

// Delivery fee comes from env at request time, so don't bake it in at build.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const provider = getPaymentProvider();
  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title={
          <>
            Nearly <em className="accent">there.</em>
          </>
        }
      />
      <div className="container-page">
        <CheckoutForm
          payment={{ label: provider.label, description: provider.description }}
          deliveryFeeMinor={await getDeliveryFeeMinor()}
        />
      </div>
    </>
  );
}
