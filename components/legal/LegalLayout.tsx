/**
 * LegalLayout - shared shell for the /legal/* pages.
 *
 * Renders a consistent header (title + last-updated date), a readable prose
 * column, and the mandatory Spanish CBD disclaimers block at the foot of every
 * legal page (producto legal en España, cáñamo industrial <0,2% THC, no apto
 * para consumo humano según variante, no sustituye tratamiento médico).
 *
 * This is a server component: pure presentation, no client hooks, so legal copy
 * ships in the initial HTML for SEO.
 */
import { GlassCard } from "@/components/ui/GlassCard";

export const LEGAL_DISCLAIMERS = [
  "Todos los productos de The Best Dreams derivan del cáñamo industrial y son legales en España, con un contenido de THC inferior al 0,2%.",
  "Determinados productos (flores, extractos y semillas) son artículos de coleccionismo aromático o genético y no son aptos para consumo humano según la variante. Consulta la ficha de cada producto.",
  "Ningún producto de The Best Dreams tiene finalidad terapéutica ni sustituye un tratamiento médico. Consulta siempre a un profesional sanitario.",
] as const;

export interface LegalLayoutProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="border-b border-gold/20 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Información legal</p>
        <h1 className="mt-3 font-serif text-3xl text-offwhite sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-offwhite/50">Última actualización: {updated}</p>
      </header>

      <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-offwhite/75">
        {children}
      </div>

      <GlassCard className="mt-12 space-y-2 p-6 text-xs leading-relaxed text-offwhite/60">
        <p className="font-semibold uppercase tracking-wider text-gold">Avisos obligatorios</p>
        {LEGAL_DISCLAIMERS.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </GlassCard>
    </div>
  );
}

/** Small helpers so each legal page keeps consistent heading/paragraph styling. */
export function LegalHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-xl text-offwhite">{children}</h2>;
}

export default LegalLayout;
