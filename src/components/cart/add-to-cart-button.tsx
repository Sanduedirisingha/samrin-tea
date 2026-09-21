"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CartCatalogItem } from "@/lib/product-utils";
import { useCart } from "./cart-provider";

export function AddToCartButton({
  item,
  qty = 1,
  size = "md",
  fullWidth,
  className,
}: {
  item: CartCatalogItem;
  qty?: number;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Button
      size={size}
      fullWidth={fullWidth}
      className={className}
      onClick={() => {
        add(item, qty);
        setJustAdded(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setJustAdded(false), 1600);
      }}
    >
      {justAdded ? (
        <Check aria-hidden className="size-4" />
      ) : (
        <ShoppingBag aria-hidden className="size-4" />
      )}
      {justAdded ? "Added" : "Add to cart"}
    </Button>
  );
}
