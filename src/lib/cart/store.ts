/**
 * Client-side cart persisted in localStorage as `{ productId, qty }[]` only.
 * Prices and names are never stored: they are resolved from the server-provided catalogue,
 * and the server recalculates everything at checkout.
 *
 * Exposed as an external store (useSyncExternalStore) so server render and first client
 * render both see an empty cart — no hydration mismatch.
 */
export const CART_STORAGE_KEY = "samrin_cart_v1";

export type CartLine = { productId: string; qty: number };

const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let snapshot: { raw: string | null; lines: CartLine[] } = { raw: null, lines: EMPTY };
// Fallback when localStorage is unavailable (private mode, blocked storage).
let memoryLines: CartLine[] | null = null;

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    const lines: CartLine[] = [];
    for (const item of data) {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as CartLine).productId === "string" &&
        Number.isInteger((item as CartLine).qty) &&
        (item as CartLine).qty > 0
      ) {
        lines.push({ productId: (item as CartLine).productId, qty: (item as CartLine).qty });
      }
    }
    return lines.length ? lines : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function getCartSnapshot(): CartLine[] {
  if (memoryLines) return memoryLines;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return snapshot.lines;
  }
  if (raw !== snapshot.raw) snapshot = { raw, lines: parse(raw) };
  return snapshot.lines;
}

export const getServerCartSnapshot = (): CartLine[] => EMPTY;

function emit() {
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (e.key === CART_STORAGE_KEY || e.key === null) emit();
}

export function subscribeToCart(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function write(lines: CartLine[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    memoryLines = null;
  } catch {
    memoryLines = lines;
  }
  emit();
}

const clamp = (qty: number, max: number) => Math.min(Math.max(Math.trunc(qty), 1), max);

export const cartActions = {
  add(productId: string, qty: number, max: number) {
    const lines = getCartSnapshot();
    const existing = lines.find((l) => l.productId === productId);
    write(
      existing
        ? lines.map((l) => (l.productId === productId ? { ...l, qty: clamp(l.qty + qty, max) } : l))
        : [...lines, { productId, qty: clamp(qty, max) }],
    );
  },
  setQty(productId: string, qty: number, max: number) {
    write(
      getCartSnapshot().map((l) =>
        l.productId === productId ? { ...l, qty: clamp(qty, max) } : l,
      ),
    );
  },
  remove(productId: string) {
    write(getCartSnapshot().filter((l) => l.productId !== productId));
  },
  clear() {
    write([]);
  },
};
