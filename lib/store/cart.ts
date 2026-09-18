"use client";

/**
 * Cart store (Zustand + persist).
 *
 * State lives in localStorage so the basket survives reloads. The store is
 * decoupled from the commerce provider: it stores plain `CartLine` snapshots
 * (name, price, image at add-time), so swapping the mock backend for
 * Shopify/Medusa does not affect it.
 *
 * The `itemAdded` counter is a monotonic signal: it increments every time a
 * line is added. The Deals mascot (panda/monkey) subscribes to it via
 * `useCartItemAdded()` and forwards it to <Mascot addToCartSignal={...} /> to
 * fire the celebratory reaction, without the cart knowing anything about 3D.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import type { CartLine, Product, WeightVariant } from "@/lib/commerce/types";

interface CartState {
  lines: CartLine[];
  /** Monotonic counter incremented on every add - a signal for the mascot. */
  itemAdded: number;
  add: (product: Product, variant: WeightVariant, quantity?: number) => void;
  remove: (lineId: string) => void;
  updateQty: (lineId: string, quantity: number) => void;
  clear: () => void;
}

function lineId(productId: string, variantLabel: string): string {
  return `${productId}:${variantLabel}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      itemAdded: 0,

      add: (product, variant, quantity = 1) =>
        set((state) => {
          const id = lineId(product.id, variant.label);
          const existing = state.lines.find((l) => l.id === id);
          const lines = existing
            ? state.lines.map((l) => (l.id === id ? { ...l, quantity: l.quantity + quantity } : l))
            : [
                ...state.lines,
                {
                  id,
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  variantLabel: variant.label,
                  price: variant.price,
                  quantity,
                  image: product.images[0],
                } satisfies CartLine,
              ];
          return { lines, itemAdded: state.itemAdded + 1 };
        }),

      remove: (lineId) => set((state) => ({ lines: state.lines.filter((l) => l.id !== lineId) })),

      updateQty: (lineId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.id !== lineId)
              : state.lines.map((l) => (l.id === lineId ? { ...l, quantity } : l)),
        })),

      clear: () => set({ lines: [] }),
    }),
    {
      name: "tbd-cart",
      // Only persist the basket contents, not the transient mascot signal.
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

// ── Typed selector hooks ───────────────────────────────────────────────────────

/** All cart lines. */
export const useCartLines = (): CartLine[] => useCartStore((s) => s.lines);

/** Total number of units across all lines. */
export const useCartCount = (): number =>
  useCartStore((s) => s.lines.reduce((n, l) => n + l.quantity, 0));

/** Cart subtotal in EUR. */
export const useCartSubtotal = (): number =>
  useCartStore((s) => s.lines.reduce((sum, l) => sum + l.price * l.quantity, 0));

/** The monotonic add signal for the Deals mascot. */
export const useCartItemAdded = (): number => useCartStore((s) => s.itemAdded);

/**
 * Cart actions bundled for convenience.
 *
 * The selector builds a fresh object, so it is wrapped in `useShallow` to
 * compare the action references shallowly. The actions are stable across the
 * store's lifetime, so consumers (ProductCard, ProductDetail, cart, checkout)
 * do not re-render when unrelated cart state (lines, itemAdded) changes.
 */
export const useCartActions = () =>
  useCartStore(
    useShallow((s) => ({
      add: s.add,
      remove: s.remove,
      updateQty: s.updateQty,
      clear: s.clear,
    })),
  );
