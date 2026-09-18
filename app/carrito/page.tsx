"use client";

/**
 * Cart (/carrito).
 *
 * Client page reading the Zustand cart: line list with quantity edit + remove,
 * live subtotal, an on-brand empty state, and a link to the mock checkout. The
 * Deals mascot (panda) reacts whenever the cart changes (we forward a local
 * signal derived from the store's `itemAdded` counter).
 *
 * Metadata for this route lives in a sibling layout is not needed; the page is
 * client-side and title is set by the root template. Cart contents are
 * user-specific and not indexed.
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useT } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { useCartActions, useCartItemAdded, useCartLines, useCartSubtotal } from "@/lib/store/cart";
import { Mascot } from "@/components/mascots";
import { Button, GlassCard } from "@/components/ui";

export default function CartPage() {
  const t = useT();
  const lines = useCartLines();
  const subtotal = useCartSubtotal();
  const itemAdded = useCartItemAdded();
  const { updateQty, remove, clear } = useCartActions();

  // Avoid hydration mismatch: the persisted cart is only known on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6" aria-busy />;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-6 w-fit">
          <Mascot name="panda" size={180} reactTo={["idle", "hover", "click"]} />
        </div>
        <h1 className="font-serif text-3xl text-offwhite">Tu carrito está vacío</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-offwhite/60">
          Aún no has añadido productos. Descubre nuestra selección premium de CBD y cáñamo legal.
        </p>
        <Link href={routes.shop} className="mt-8 inline-block">
          <Button size="lg">Ir a la tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-offwhite sm:text-4xl">Tu carrito</h1>
        <button type="button" onClick={clear} className="text-sm text-offwhite/50 hover:text-gold">
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {lines.map((line) => (
            <GlassCard as="li" key={line.id} className="flex gap-4 p-4">
              <Link
                href={routes.product(line.slug)}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black/40"
              >
                {line.image && (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-lg text-offwhite">
                      <Link href={routes.product(line.slug)} className="hover:text-gold">
                        {line.name}
                      </Link>
                    </h2>
                    <p className="text-xs text-offwhite/50">{line.variantLabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    aria-label={`Eliminar ${line.name}`}
                    className="text-offwhite/40 hover:text-gold"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-full border border-gold/30">
                    <button
                      type="button"
                      onClick={() => updateQty(line.id, line.quantity - 1)}
                      aria-label="Reducir cantidad"
                      className="h-9 w-9 text-offwhite/70 hover:text-gold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm text-offwhite">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(line.id, line.quantity + 1)}
                      aria-label="Aumentar cantidad"
                      className="h-9 w-9 text-offwhite/70 hover:text-gold"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-serif text-lg text-gold">
                    {(line.price * line.quantity).toFixed(2)}
                    {t.common.currency}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </ul>

        {/* Summary + Deals mascot */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <GlassCard glow className="p-6">
            <div className="mb-4 flex justify-center">
              <Mascot
                name="panda"
                size={130}
                addToCartSignal={itemAdded}
                reactTo={["idle", "hover", "addtocart"]}
              />
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-offwhite/70">
                <dt>Subtotal</dt>
                <dd>
                  {subtotal.toFixed(2)}
                  {t.common.currency}
                </dd>
              </div>
              <div className="flex justify-between text-offwhite/50">
                <dt>Envío</dt>
                <dd>Calculado en el checkout</dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-gold/20 pt-4 font-serif text-xl text-offwhite">
              <span>Total</span>
              <span className="text-gold">
                {subtotal.toFixed(2)}
                {t.common.currency}
              </span>
            </div>
            <Link href={routes.checkout} className="mt-6 block">
              <Button size="lg" className="w-full">
                Tramitar pedido
              </Button>
            </Link>
            <Link
              href={routes.shop}
              className="mt-3 block text-center text-sm text-offwhite/50 hover:text-gold"
            >
              Seguir comprando
            </Link>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
