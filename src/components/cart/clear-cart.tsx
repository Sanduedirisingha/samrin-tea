"use client";

import { useEffect } from "react";
import { cartActions } from "@/lib/cart/store";

/** Rendered on the order confirmation page: the order is saved, so the cart is emptied. */
export function ClearCart() {
  useEffect(() => {
    cartActions.clear();
  }, []);
  return null;
}
