/**
 * Análisis / Laboratorio (/analisis).
 *
 * Server component listing every product's lab certificate via the reusable
 * <LabResultCard>, which links to public/lab-pdfs/<file>.pdf (swappable
 * placeholders - see public/lab-pdfs/README.md) and shows a "pending" state for
 * products without a certificate yet. The Eagle ("The Expert") mascot provides
 * context on why third-party lab analysis matters.
 */
import type { Metadata } from "next";

import { getProducts } from "@/lib/commerce";
import { Mascot } from "@/components/mascots";
import { LabResultCard } from "@/components/LabResultCard";
import { GlassCard, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Análisis de laboratorio",
  description:
    "Certificados de análisis de laboratorios independientes de los productos de The Best Dreams. Perfil de cannabinoides y controles de seguridad, con THC inferior al 0,2%.",
  alternates: { canonical: "/analisis" },
};

export default async function LabPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-10 grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Transparencia</p>
          <h1 className="mt-2 font-serif text-3xl text-offwhite sm:text-4xl">
            Análisis y Laboratorio
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-offwhite/65">
            Publicamos los certificados de análisis de laboratorios independientes de nuestros
            productos. Cada informe detalla el perfil de cannabinoides (CBD, CBG y THC) y los
            controles de seguridad. Descárgalos en PDF.
          </p>
        </div>
        <div className="mx-auto flex flex-col items-center gap-2">
          <Mascot name="eagle" size={160} reactTo={["idle", "hover", "click", "inview"]} />
          <p className="max-w-[12rem] text-center text-xs italic text-offwhite/55">
            “The Expert revisa cada análisis contigo.”
          </p>
        </div>
      </header>

      <Section>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <LabResultCard key={product.id} product={product} />
          ))}
        </ul>
      </Section>

      <GlassCard className="mt-12 space-y-2 p-6 text-xs leading-relaxed text-offwhite/60">
        <p>
          Todos nuestros productos derivan del cáñamo industrial y son legales en España, con un
          contenido de THC inferior al 0,2%.
        </p>
        <p>
          Un certificado de análisis no convierte ningún producto en medicamento: el CBD no
          sustituye un tratamiento médico. Consulta a un profesional sanitario.
        </p>
      </GlassCard>
    </div>
  );
}
