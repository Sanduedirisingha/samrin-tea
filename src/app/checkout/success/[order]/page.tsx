import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClearCart } from "@/components/cart/clear-cart";
import { ButtonLink } from "@/components/ui/button";
import { getOrderConfirmation } from "@/lib/data/orders";
import { formatLkr } from "@/lib/format";
import { getPaymentProvider } from "@/lib/payments";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({ params }: PageProps<"/checkout/success/[order]">) {
  const { order: orderNumber } = await params;
  const order = await getOrderConfirmation(decodeURIComponent(orderNumber));
  if (!order) notFound();

  const provider = getPaymentProvider();
  const steps = [
    "Our team reviews your order and contacts you to confirm payment details and delivery arrangements.",
    "We confirm any applicable delivery charge before your tea is dispatched.",
    "Your Samrin tea is packed and on its way.",
  ];

  return (
    <div className="container-prose py-16 sm:py-24">
      <ClearCart />
      <div className="text-center">
        <CheckCircle2 aria-hidden className="text-forest mx-auto size-14" strokeWidth={1.4} />
        <p className="text-gold-ink mt-6 text-xs font-semibold tracking-[0.2em] uppercase">
          Thank you
        </p>
        <h1 className="text-forest mt-3 text-4xl sm:text-5xl">
          Your order is <em className="accent">placed.</em>
        </h1>
        <p className="text-muted mt-5 text-lg">
          Your order number is{" "}
          <strong className="text-deep font-semibold">{order.orderNumber}</strong>. Please keep it
          for reference.
        </p>
      </div>

      <section
        aria-labelledby="summary-heading"
        className="border-line bg-ivory mt-12 rounded-2xl border p-6 sm:p-8"
      >
        <h2 id="summary-heading" className="text-forest text-2xl">
          Order summary
        </h2>
        <ul className="divide-line mt-4 divide-y">
          {order.items.map((item) => (
            <li key={item.name} className="flex justify-between gap-4 py-3 text-[0.95rem]">
              <span>
                {item.name} <span className="text-muted">× {item.qty}</span>
              </span>
              <span className="font-medium whitespace-nowrap">{formatLkr(item.lineTotalLkr)}</span>
            </li>
          ))}
        </ul>
        <dl className="border-line mt-3 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatLkr(order.subtotalLkr)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd>
              {order.deliveryFeeLkr > 0 ? formatLkr(order.deliveryFeeLkr) : "Confirmed by our team"}
            </dd>
          </div>
          <div className="border-line flex justify-between border-t pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatLkr(order.totalLkr)}</dd>
          </div>
        </dl>
        <p className="text-muted mt-4 text-sm">
          Payment: {order.paymentStatus === "paid" ? "Paid" : provider.label}.
        </p>
      </section>

      <section aria-labelledby="next-heading" className="mt-12">
        <h2 id="next-heading" className="text-forest text-2xl">
          What happens next
        </h2>
        <ol className="mt-5 space-y-4">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="bg-forest text-ivory grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold">
                {i + 1}
              </span>
              <p className="text-muted pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6">
          Questions about your order? Call consumer care on{" "}
          <a href={siteConfig.hotline.href} className="text-forest font-medium underline">
            {siteConfig.hotline.display}
          </a>{" "}
          and quote {order.orderNumber}.
        </p>
      </section>

      <div className="mt-10 flex justify-center">
        <ButtonLink href="/shop" size="lg">
          Continue shopping
        </ButtonLink>
      </div>
    </div>
  );
}
