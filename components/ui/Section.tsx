"use client";

import { motion } from "framer-motion";

import { useInViewOnce } from "@/lib/motion/useInViewOnce";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

type SectionTag = "section" | "div" | "article";

/**
 * Concrete motion components keyed by tag. Indexing this map yields a single
 * component per key instead of the union JSX type produced by `motion[as]`,
 * which `tsc` can reject as a non-callable JSX element. They are unified under
 * the shared `motion.div` component type so JSX sees one callable signature.
 */
const motionTags: Record<SectionTag, typeof motion.div> = {
  section: motion.section,
  div: motion.div,
  article: motion.article,
};

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /** Render as a different element. Defaults to <section>. */
  as?: SectionTag;
  /** Disable the in-view reveal (e.g. above-the-fold content). */
  noReveal?: boolean;
  id?: string;
}

/**
 * Section wrapper with a one-shot fade + rise reveal when scrolled into view.
 * Respects prefers-reduced-motion: motion is skipped and content is shown
 * immediately.
 */
export function Section({
  children,
  className,
  as = "section",
  noReveal = false,
  id,
}: SectionProps) {
  const reducedMotion = useReducedMotion();
  const [ref, inView] = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  const animate = !reducedMotion && !noReveal;
  const MotionTag = motionTags[as];

  return (
    <MotionTag
      ref={ref}
      id={id}
      className={className}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={animate ? (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }) : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}

export default Section;
