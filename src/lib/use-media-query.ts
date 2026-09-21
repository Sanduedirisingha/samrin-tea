"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Server render (and first client render) report `false`. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Wide screens that haven't asked for reduced motion get the pinned, scroll-linked sections. */
export const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
