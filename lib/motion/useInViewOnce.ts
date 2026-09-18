"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseInViewOnceOptions {
  /** Fraction of the element that must be visible before it counts as in view. */
  threshold?: number;
  /** Root margin passed to the IntersectionObserver (e.g. "0px 0px -10% 0px"). */
  rootMargin?: string;
  /** When false the observer is never attached (element is treated as in view). */
  enabled?: boolean;
}

/**
 * useInViewOnce
 *
 * Attaches an IntersectionObserver to the returned ref and flips `inView` to
 * `true` the first time the element enters the viewport. It then disconnects,
 * so the value only ever transitions false -> true once. This powers the
 * mascot "scroll into view" reaction, which should fire a single greeting
 * rather than re-triggering on every scroll.
 *
 * SSR-safe and degrades gracefully: if IntersectionObserver is unavailable the
 * element is reported as in view immediately.
 */
export function useInViewOnce<T extends Element = HTMLDivElement>(
  options: UseInViewOnceOptions = {},
): [RefObject<T>, boolean] {
  const { threshold = 0.35, rootMargin = "0px", enabled = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, enabled]);

  return [ref, inView];
}
