"use client";

import { useEffect, useRef, useState } from "react";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatLkr } from "@/lib/format";
import type { CartCatalogItem } from "@/lib/product-utils";
import { useCart } from "./cart-provider";
import { AddToCartButton } from "./add-to-cart-button";

/**
 * PDP buy box: quantity + add to cart, plus a sticky bottom bar on mobile that appears
 * once the main button scrolls out of view.
 */
export function PurchasePanel({ item }: { item: CartCatalogItem }) {
  const { maxQty } = useCart();
  const [qty, setQty] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting), {
      rootMargin: "0px 0px -1px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={anchor} className="flex flex-wrap items-center gap-4">
        <QuantityStepper value={qty} onChange={setQty} max={maxQty} />
        <AddToCartButton item={item} qty={qty} size="lg" className="min-w-52 flex-1 sm:flex-none" />
      </div>

      <div
        aria-hidden={!showBar}
        inert={!showBar}
        className={`border-gold/40 bg-surface-2/95 fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 shadow-[0_-8px_24px_-12px_rgb(4_40_16/0.25)] backdrop-blur transition-transform duration-300 lg:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-heading truncate text-sm font-medium">{item.name}</p>
            {item.priceLkr !== null && (
              <p className="text-muted text-sm">{formatLkr(item.priceLkr * qty)}</p>
            )}
          </div>
          <AddToCartButton item={item} qty={qty} size="sm" />
        </div>
      </div>
    </>
  );
}
