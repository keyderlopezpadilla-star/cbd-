"use client";

/**
 * ProductDetail - the interactive detail view for /producto/[slug].
 *
 * Owns the image gallery, the weight-variant selector (which DYNAMICALLY drives
 * the displayed price and add-to-cart target), quantity, and the add-to-cart
 * action against the Zustand cart. The Eagle ("The Expert") mascot rotates
 * animated speech bubbles explaining cannabinoids, terpenes and lab results.
 *
 * The per-category / per-product legal consumption disclaimer is passed in from
 * the server page (resolved from the commerce category) and always shown.
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Product, WeightVariant } from "@/lib/commerce/types";
import { useT } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { routes } from "@/lib/routes";
import { useCartActions } from "@/lib/store/cart";
import { Mascot } from "@/components/mascots";
import { Badge, Button, GlassCard } from "@/components/ui";

const EAGLE_TIPS = [
  "Soy The Expert. El CBD no es psicoactivo: no altera tu estado de conciencia.",
  "Los terpenos son los responsables del aroma. Trabajan en sinergia con los cannabinoides.",
  "Cada lote se analiza en laboratorio independiente. Descarga el certificado para ver el detalle.",
  "El THC se mantiene por debajo del 0,2%, el límite legal en España para el cáñamo industrial.",
];

export interface ProductDetailProps {
  product: Product;
  /** Resolved consumption disclaimer (product override or category default). */
  disclaimer: string;
}

export function ProductDetail({ product, disclaimer }: ProductDetailProps) {
  const t = useT();
  const reducedMotion = useReducedMotion();
  const { add } = useCartActions();

  const [variant, setVariant] = useState<WeightVariant>(
    product.variants.find((v) => v.available) ?? product.variants[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addSignal, setAddSignal] = useState(0);
  const [added, setAdded] = useState(false);

  // Rotate the Eagle's speech bubble on a calm cadence (frozen on reduced motion).
  const [tip, setTip] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setTip((n) => (n + 1) % EAGLE_TIPS.length), 5200);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  function handleAdd() {
    if (!variant.available) return;
    add(product, variant, quantity);
    setAddSignal((n) => n + 1); // fire the mascot celebratory reaction
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  const canAdd = variant.available;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-offwhite/50" aria-label="Migas de pan">
        <Link href={routes.shop} className="hover:text-gold">
          Tienda
        </Link>{" "}
        / <span className="text-offwhite/70">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-gold/20 bg-black/40">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.badges.length > 0 && (
              <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                {product.badges.map((badge) => (
                  <Badge key={badge} badge={badge} label={t.badges[badge]} />
                ))}
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <ul className="mt-4 flex gap-3">
              {product.images.map((image, i) => (
                <li key={image}>
                  <button
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-pressed={activeImage === i}
                    className={[
                      "relative h-20 w-20 overflow-hidden rounded-xl border",
                      activeImage === i ? "border-gold" : "border-gold/20",
                    ].join(" ")}
                  >
                    <Image src={image} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Info + purchase */}
        <div>
          <h1 className="font-serif text-3xl text-offwhite sm:text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-offwhite/60">
            <span>
              ★ {product.reviews.rating.toFixed(1)} ({product.reviews.count} {t.common.reviews})
            </span>
          </div>
          <p className="mt-4 text-base leading-relaxed text-offwhite/75">{product.description}</p>

          {/* Cannabinoids + terpenes */}
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="glass rounded-xl p-3">
              <dt className="text-offwhite/50">{t.product.cbd}</dt>
              <dd className="text-lg text-gold">{product.cbdPercent}%</dd>
            </div>
            {product.cbgPercent ? (
              <div className="glass rounded-xl p-3">
                <dt className="text-offwhite/50">{t.product.cbg}</dt>
                <dd className="text-lg text-gold">{product.cbgPercent}%</dd>
              </div>
            ) : null}
            {product.terpenes.length > 0 && (
              <div className="glass col-span-2 rounded-xl p-3">
                <dt className="text-offwhite/50">{t.product.terpenes}</dt>
                <dd className="text-offwhite/85">{product.terpenes.join(" · ")}</dd>
              </div>
            )}
            <div className="glass rounded-xl p-3">
              <dt className="text-offwhite/50">{t.product.origin}</dt>
              <dd className="text-offwhite/85">{product.origin}</dd>
            </div>
            {product.method && (
              <div className="glass rounded-xl p-3">
                <dt className="text-offwhite/50">{t.product.method}</dt>
                <dd className="capitalize text-offwhite/85">{product.method}</dd>
              </div>
            )}
          </dl>

          {/* Variant selector (drives price) */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-offwhite/80">{t.product.variant}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  disabled={!v.available}
                  onClick={() => setVariant(v)}
                  aria-pressed={variant.label === v.label}
                  className={[
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    variant.label === v.label
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-gold/30 text-offwhite/75 hover:border-gold",
                    !v.available ? "cursor-not-allowed opacity-40 line-through" : "",
                  ].join(" ")}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic price + quantity + add-to-cart */}
          <div className="mt-6 flex flex-wrap items-end gap-4">
            <div>
              <span className="text-xs text-offwhite/50">Precio</span>
              <p className="font-serif text-3xl text-gold">
                {(variant.price * quantity).toFixed(2)}
                {t.common.currency}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-offwhite/50" htmlFor="qty">
                Cantidad
              </label>
              <input
                id="qty"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="h-11 w-20 rounded-lg border border-gold/30 bg-black/40 px-3 text-center text-offwhite focus-visible:border-gold focus-visible:outline-none"
              />
            </div>
            <Button
              size="lg"
              variant={canAdd ? "gold" : "outline"}
              disabled={!canAdd}
              onClick={handleAdd}
            >
              {!canAdd ? t.common.soldOut : added ? t.common.added : t.common.addToCart}
            </Button>
          </div>

          {/* Lab result download */}
          {product.labResultUrl && (
            <a
              href={product.labResultUrl}
              download
              className="mt-5 inline-flex items-center gap-2 text-sm text-gold hover:underline"
            >
              ⬇ {t.product.downloadLab}
            </a>
          )}

          {/* Legal consumption disclaimer */}
          <GlassCard className="mt-6 p-4 text-xs leading-relaxed text-offwhite/60">
            {disclaimer}
          </GlassCard>
        </div>
      </div>

      {/* Eagle "The Expert" with animated speech bubble */}
      <section className="mt-14 grid items-center gap-6 md:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <Mascot
            name="eagle"
            size={200}
            addToCartSignal={addSignal}
            reactTo={["idle", "hover", "click", "inview", "addtocart"]}
          />
        </div>
        <GlassCard glow className="relative p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">The Expert</p>
          <p
            key={tip}
            className="mt-2 text-lg italic leading-relaxed text-offwhite/85 motion-safe:animate-breathe"
          >
            “{EAGLE_TIPS[tip]}”
          </p>
        </GlassCard>
      </section>

      {/* Reviews */}
      {product.reviews.items.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-2xl text-offwhite">{t.product.reviewsTitle}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {product.reviews.items.map((review) => (
              <GlassCard as="li" key={`${review.author}-${review.date}`} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-offwhite">{review.title}</p>
                  <span className="text-sm text-gold">
                    {"★".repeat(review.rating)}
                    <span className="text-offwhite/25">{"★".repeat(5 - review.rating)}</span>
                  </span>
                </div>
                <p className="mt-2 text-sm text-offwhite/70">{review.body}</p>
                <p className="mt-3 text-xs text-offwhite/45">
                  {review.author} · {review.date}
                </p>
              </GlassCard>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;
