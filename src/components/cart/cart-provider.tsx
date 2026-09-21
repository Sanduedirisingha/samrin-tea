"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  cartActions,
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeToCart,
} from "@/lib/cart/store";
import type { CartCatalogItem } from "@/lib/product-utils";
import { shopConfig } from "@/lib/site-config";
import { useToast } from "./toast";

export type ResolvedCartLine = {
  productId: string;
  qty: number;
  item: CartCatalogItem;
  /** Unit × qty in minor units; 0 for lines that can't be purchased. */
  lineTotal: number;
};

type CartContextValue = {
  lines: ResolvedCartLine[];
  /** Total units of purchasable items (drives the header badge). */
  count: number;
  /** Minor units. Indicative only — the server recalculates at checkout. */
  subtotal: number;
  maxQty: number;
  add: (item: CartCatalogItem, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/**
 * The 5-item catalogue is fetched on the server (layout) and passed in, so the cart can
 * resolve names/prices locally. localStorage holds only { productId, qty }.
 */
export function CartProvider({
  catalog,
  children,
}: {
  catalog: CartCatalogItem[];
  children: ReactNode;
}) {
  const { toast } = useToast();
  const stored = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const maxQty = shopConfig.maxQtyPerLine;

  const value = useMemo<CartContextValue>(() => {
    const byId = new Map(catalog.map((c) => [c.id, c]));
    const lines = stored.flatMap<ResolvedCartLine>((l) => {
      const item = byId.get(l.productId);
      if (!item) return [];
      const unit = item.purchasable && item.priceLkr !== null ? item.priceLkr : 0;
      return [{ productId: l.productId, qty: l.qty, item, lineTotal: unit * l.qty }];
    });
    const buyable = lines.filter((l) => l.item.purchasable);
    return {
      lines,
      count: buyable.reduce((n, l) => n + l.qty, 0),
      subtotal: buyable.reduce((sum, l) => sum + l.lineTotal, 0),
      maxQty,
      add: () => undefined,
      setQty: (id, qty) => cartActions.setQty(id, qty, maxQty),
      remove: (id) => cartActions.remove(id),
      clear: () => cartActions.clear(),
    };
  }, [stored, catalog, maxQty]);

  const add = useCallback(
    (item: CartCatalogItem, qty = 1) => {
      cartActions.add(item.id, qty, maxQty);
      toast(`Added to cart — ${item.name}`, { label: "View cart", href: "/cart" });
    },
    [toast, maxQty],
  );

  const ctx = useMemo(() => ({ ...value, add }), [value, add]);
  return <CartContext.Provider value={ctx}>{children}</CartContext.Provider>;
}
