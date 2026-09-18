"use client";

/**
 * BrandLoader - a brief intro overlay showing the golden dove mascot and the
 * wordmark while the app hydrates. Reduced motion => it never shows (instant,
 * no spinner). Otherwise it fades away after a short, fixed delay.
 */
import { useEffect, useState } from "react";

import { useT } from "@/lib/i18n";
import { Mascot } from "@/components/mascots";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

const VISIBLE_MS = 1100;

export function BrandLoader() {
  const t = useT();
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setDone(true);
      return;
    }
    const id = window.setTimeout(() => setDone(true), VISIBLE_MS);
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  // Reduced motion => render nothing at all (instant).
  if (reducedMotion || done) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-4 bg-black transition-opacity duration-500"
      role="status"
      aria-live="polite"
    >
      <Mascot name="dove" size={140} reactTo={["idle"]} />
      <p className="animate-breathe font-serif text-xl tracking-wide text-gold">{t.brand.name}</p>
      <span className="sr-only">{t.loader.label}</span>
    </div>
  );
}

export default BrandLoader;
