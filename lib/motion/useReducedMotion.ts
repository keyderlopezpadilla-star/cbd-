"use client";

import { useEffect, useState } from "react";

/**
 * useReducedMotion
 *
 * Returns `true` when the user has requested reduced motion via the OS/browser
 * `prefers-reduced-motion: reduce` setting. Used across the mascot system to
 * freeze intensive 3D animation into a static pose and to prefer the 2D
 * fallback on low-end devices.
 *
 * This is a small, dependency-free wrapper around `matchMedia` (rather than
 * framer-motion's `useReducedMotion`) so it can be shared by both r3f scenes
 * and plain DOM components without pulling framer-motion into the 3D bundle.
 * It is SSR-safe: it returns `false` on the server and during the first client
 * render, then updates once mounted.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);

    // Safari < 14 only supports the deprecated addListener/removeListener API.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return reduced;
}
