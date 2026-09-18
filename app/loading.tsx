/**
 * Route-level loading UI, shown during server navigations/streaming.
 *
 * On-brand dove accent with a calm pulse. The pulse is disabled under
 * prefers-reduced-motion via the global reduced-motion rule + motion-reduce
 * utilities; the <Mascot> itself also degrades to its 2D fallback.
 */
import { Mascot } from "@/components/mascots";

export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center"
      role="status"
      aria-live="polite"
    >
      <Mascot name="dove" size={120} reactTo={["idle"]} />
      <p className="animate-breathe font-serif text-lg tracking-wide text-gold motion-reduce:animate-none">
        Cargando…
      </p>
      <span className="sr-only">Cargando contenido</span>
    </div>
  );
}
