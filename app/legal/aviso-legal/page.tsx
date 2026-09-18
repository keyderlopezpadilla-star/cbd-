/**
 * Aviso legal (/legal/aviso-legal). Original Spanish copy.
 */
import type { Metadata } from "next";

import { LegalHeading, LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal de The Best Dreams: titularidad del sitio, condiciones de uso y marco legal del cáñamo industrial en España.",
  alternates: { canonical: "/legal/aviso-legal" },
};

export default function AvisoLegalPage() {
  return (
    <LegalLayout title="Aviso legal" updated="marzo de 2024">
      <p>
        El presente aviso legal regula el uso del sitio web de The Best Dreams (en adelante, “el
        Sitio”). El acceso y la navegación por el Sitio implican la aceptación de las condiciones
        aquí recogidas.
      </p>

      <LegalHeading>Titularidad</LegalHeading>
      <p>
        El Sitio es titularidad de The Best Dreams, con domicilio de actividad en la comarca de la
        Ribera (Valencia, España) y zonas de servicio en Algemesí, Sueca, Tavernes y Carcaixent. Los
        datos fiscales completos se facilitan a requerimiento de la autoridad competente.
      </p>

      <LegalHeading>Objeto y actividad</LegalHeading>
      <p>
        The Best Dreams comercializa productos derivados del cáñamo industrial legal en España, con
        un contenido de THC inferior al 0,2%. Determinados artículos (flores, extractos y semillas)
        se venden como productos de coleccionismo aromático o genético y no son aptos para consumo
        humano según la variante.
      </p>

      <LegalHeading>Condiciones de uso</LegalHeading>
      <p>
        El usuario se compromete a hacer un uso lícito del Sitio, a ser mayor de 18 años y a no
        emplear los contenidos con fines contrarios a la ley. The Best Dreams podrá modificar en
        cualquier momento la presentación y los contenidos del Sitio.
      </p>

      <LegalHeading>Propiedad intelectual</LegalHeading>
      <p>
        Todos los textos, diseños, marcas y elementos gráficos del Sitio son originales de The Best
        Dreams o se utilizan con autorización. Queda prohibida su reproducción sin consentimiento
        expreso.
      </p>

      <LegalHeading>Responsabilidad</LegalHeading>
      <p>
        The Best Dreams no se responsabiliza del uso indebido que terceros hagan de la información
        publicada. El usuario es responsable de cumplir la normativa vigente en su lugar de
        residencia.
      </p>
    </LegalLayout>
  );
}
