"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "./cart-provider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart, empty"}
      className="on-dark text-paper hover:bg-paper/10 relative grid size-11 place-items-center rounded-full transition-colors"
    >
      <ShoppingBag aria-hidden className="size-6" strokeWidth={1.6} />
      {count > 0 && (
        <span
          aria-hidden
          className="bg-gold text-deep ring-deep absolute top-1 right-0.5 grid min-w-5 place-items-center rounded-full px-1 text-[0.7rem] leading-5 font-semibold ring-2"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
