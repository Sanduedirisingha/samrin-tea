import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { PageHeader } from "@/components/sections/page-header";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your cart"
        title={
          <>
            Your tea, <em className="accent">ready to go.</em>
          </>
        }
      />
      <div className="container-page">
        <CartView />
      </div>
    </>
  );
}
