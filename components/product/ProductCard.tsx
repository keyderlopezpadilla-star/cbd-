"use client";

/**
 * ProductCard - catalogue card with a subtle 3D tilt on hover and a gold edge
 * glow. Pointer movement tilts the card in perspective; the effect is fully
 * disabled under prefers-reduced-motion. Add-to-cart adds the cheapest
 * available variant to the Zustand cart, which in turn fires the mascot's
 * `itemAdded` signal.
 */
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { isAvailable, priceFrom } from "@/lib/commerce";
import type { Product } from "@/lib/commerce/types";
import { useT } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { routes } from "@/lib/routes";
import { useCartActions } from "@/lib/store/cart";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const MAX_TILT = 8; // degrees

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const t = useT();
  const reducedMotion = useReducedMotion();
  const { add } = useCartActions();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [added, setAdded] = useState(false);

  const available = isAvailable(product);
  const cheapest = product.variants.reduce((lo, v) => (v.price < lo.price ? v : lo));

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * MAX_TILT * 2, ry: px * MAX_TILT * 2 });
  }

  function resetTilt() {
    setTilt({ rx: 0, ry: 0 });
  }

  function handleAdd() {
    const variant = product.variants.find((v) => v.available) ?? cheapest;
    add(product, variant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className={["group [perspective:1200px]", className].filter(Boolean).join(" ")}>
      <div
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
        style={{
          transform: reducedMotion ? undefined : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
        className="glass relative flex h-full flex-col overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-200 ease-out group-hover:gold-glow motion-reduce:transition-none"
      >
        {product.badges.length > 0 && (
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <Badge key={badge} badge={badge} label={t.badges[badge]} />
            ))}
          </div>
        )}

        <Link
          href={routes.product(product.slug)}
          className="relative block aspect-square overflow-hidden bg-black/40"
          aria-label={`${t.common.viewProduct}: ${product.name}`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-serif text-lg leading-tight">
            <Link href={routes.product(product.slug)} className="hover:text-gold">
              {product.name}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm text-offwhite/65">{product.shortDescription}</p>

          <div className="mt-1 flex items-center gap-2 text-xs text-offwhite/60">
            <span className="rounded bg-green-rustic/40 px-2 py-0.5 text-gold-bright">
              {t.product.cbd} {product.cbdPercent}%
            </span>
            {product.cbgPercent ? (
              <span className="rounded bg-green-rustic/40 px-2 py-0.5 text-gold-bright">
                {t.product.cbg} {product.cbgPercent}%
              </span>
            ) : null}
            <span aria-hidden>·</span>
            <span>
              ★ {product.reviews.rating.toFixed(1)} ({product.reviews.count})
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <div className="flex flex-col">
              <span className="text-xs text-offwhite/50">{t.common.from}</span>
              <span className="font-serif text-xl text-gold">
                {priceFrom(product).toFixed(2)}
                {t.common.currency}
              </span>
            </div>
            <Button
              size="sm"
              variant={available ? "gold" : "outline"}
              disabled={!available}
              onClick={handleAdd}
              aria-label={`${t.common.addToCart}: ${product.name}`}
            >
              {!available ? t.common.soldOut : added ? t.common.added : t.common.addToCart}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
