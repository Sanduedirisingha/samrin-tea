"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatLkr } from "@/lib/format";
import { productHref } from "@/lib/product-utils";
import { useCart } from "./cart-provider";

export function CartView() {
  const { lines, subtotal, count, maxQty, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        action={<ButtonLink href="/shop">Shop tea</ButtonLink>}
      >
        Add a pack of Samrin Strong or Premium BOPF and it will appear here.
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <ul className="divide-line border-line divide-y border-y">
        {lines.map(({ productId, qty, item, lineTotal }) => (
          <li
            key={productId}
            className="grid grid-cols-[5.5rem_1fr] gap-4 py-6 sm:grid-cols-[7rem_1fr]"
          >
            <Link
              href={productHref(item.slug)}
              className="bg-ivory relative block aspect-[4/5] overflow-hidden rounded-lg"
            >
              {item.image && (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              )}
            </Link>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={productHref(item.slug)}
                    className="text-forest font-serif text-lg leading-snug hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-muted mt-1 text-sm">{item.formatLabel}</p>
                </div>
                {item.purchasable && (
                  <p className="font-medium whitespace-nowrap">{formatLkr(lineTotal)}</p>
                )}
              </div>

              {item.purchasable && item.priceLkr !== null ? (
                <p className="text-muted mt-1 text-sm">{formatLkr(item.priceLkr)} each</p>
              ) : (
                <p role="alert" className="text-error mt-2 text-sm font-medium">
                  This item is no longer available to order online. Please remove it to continue.
                </p>
              )}

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                {item.purchasable ? (
                  <QuantityStepper
                    value={qty}
                    onChange={(n) => setQty(productId, n)}
                    max={maxQty}
                    label={`Quantity for ${item.name}`}
                  />
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => remove(productId)}
                  className="text-muted hover:text-error inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm transition-colors"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 aria-hidden className="size-4" />
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside
        aria-label="Order summary"
        className="border-line bg-ivory rounded-2xl border p-6 lg:sticky lg:top-28"
      >
        <h2 className="text-forest text-2xl">Summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">
              Subtotal ({count} {count === 1 ? "item" : "items"})
            </dt>
            <dd className="font-medium">{formatLkr(subtotal)}</dd>
          </div>
        </dl>
        <p className="text-muted mt-4 text-sm">
          Delivery is calculated and confirmed at checkout, and by our team.
        </p>
        <div className="mt-6 space-y-3">
          {lines.some((l) => !l.item.purchasable) ? (
            <Button fullWidth size="lg" disabled>
              Checkout
            </Button>
          ) : (
            <ButtonLink href="/checkout" fullWidth size="lg">
              Checkout
            </ButtonLink>
          )}
          <ButtonLink href="/shop" variant="secondary" fullWidth>
            Continue shopping
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}
