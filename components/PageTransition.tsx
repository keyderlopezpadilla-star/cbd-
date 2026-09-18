"use client";

/**
 * PageTransition - wraps route content in a framer-motion fade + subtle upward
 * slide, keyed on the pathname so it replays on navigation. Reduced motion =>
 * the animation is skipped and content renders statically.
 */
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { useReducedMotion } from "@/lib/motion/useReducedMotion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
