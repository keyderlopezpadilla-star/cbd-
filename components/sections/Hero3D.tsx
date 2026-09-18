"use client";

/**
 * Hero3D - the home hero.
 *
 * The decorative 3D pollen field (Hero3DScene) is lazy-loaded via
 * next/dynamic({ ssr: false }) so it never blocks first paint or SSR. When the
 * user prefers reduced motion or the device has no WebGL, the 3D layer is never
 * mounted and a static brand gradient (the same one used as the dynamic import
 * placeholder) is shown instead. The foreground copy, CTAs and Lion welcome
 * hook render identically in both cases.
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useT } from "@/lib/i18n";
import { isWebGLAvailable } from "@/components/mascots/webgl";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { routes } from "@/lib/routes";
import { Mascot } from "@/components/mascots";
import { Button } from "@/components/ui";

/** Static brand gradient used as the reduced-motion / no-WebGL / loading state. */
function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(201,162,75,0.22),transparent_60%),radial-gradient(80%_60%_at_80%_100%,rgba(90,107,69,0.28),transparent_60%)]"
    >
      <div className="animate-float absolute left-[15%] top-[30%] h-24 w-24 rounded-full bg-gold/10 blur-2xl motion-reduce:animate-none" />
      <div className="animate-breathe absolute right-[18%] top-[45%] h-32 w-32 rounded-full bg-green-moss/20 blur-3xl motion-reduce:animate-none" />
    </div>
  );
}

const Hero3DScene = dynamic(() => import("./Hero3DScene"), {
  ssr: false,
  loading: () => <HeroBackdrop />,
});

export function Hero3D() {
  const t = useT();
  const reducedMotion = useReducedMotion();
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    setUse3D(!reducedMotion && isWebGLAvailable());
  }, [reducedMotion]);

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-black">
      {use3D ? <Hero3DScene /> : <HeroBackdrop />}

      {/* Foreground content sits above the 3D/2D backdrop. */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-gold">{t.brand.name}</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-offwhite sm:text-6xl">
            Donde hay calidad
            <br />
            <span className="text-gold text-gold-glow">no hay competencia</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-offwhite/70 sm:text-lg">
            CBD y cáñamo legal premium, seleccionado y analizado con mimo. Cultivo propio en
            Algemesí, Sueca, Tavernes y Carcaixent.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={routes.shop}>
              <Button size="lg">Explorar la tienda</Button>
            </Link>
            <Link href={routes.lab}>
              <Button size="lg" variant="outline">
                Ver análisis de laboratorio
              </Button>
            </Link>
          </div>
        </div>

        {/* Lion = "The Guide" welcome hook. */}
        <div className="flex flex-col items-center gap-3">
          <Mascot name="lion" size={220} reactTo={["idle", "hover", "click", "inview"]} />
          <p className="max-w-xs text-center text-sm italic text-offwhite/60">
            “Bienvenido a The Best Dreams. Déjate guiar por la calidad.”
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}

export default Hero3D;
