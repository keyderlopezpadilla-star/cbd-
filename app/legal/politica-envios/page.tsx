/**
 * Política de envíos (/legal/politica-envios). Original Spanish copy.
 */
import type { Metadata } from "next";

import { BRAND_ZONES } from "@/lib/commerce/mock-data";
import { LegalHeading, LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Política de envíos",
  description:
    "Política de envíos y devoluciones de The Best Dreams: plazos, costes, zonas de servicio en Valencia y condiciones de devolución.",
  alternates: { canonical: "/legal/politica-envios" },
};

export default function PoliticaEnviosPage() {
  return (
    <LegalLayout title="Política de envíos" updated="marzo de 2024">
      <p>
        En The Best Dreams preparamos y enviamos tu pedido con el mayor cuidado. Aquí encontrarás la
        información sobre plazos, costes y devoluciones.
      </p>

      <LegalHeading>Plazos de entrega</LegalHeading>
      <p>
        Preparamos y enviamos los pedidos en un plazo de 24 a 48 horas laborables, con seguimiento.
        Los tiempos de tránsito pueden variar según el destino y el operador logístico.
      </p>

      <LegalHeading>Costes de envío</LegalHeading>
      <p>
        El envío es gratuito para pedidos iguales o superiores a 50 €. Por debajo de ese importe se
        aplica una tarifa fija que se muestra en el resumen del pedido antes de confirmar la compra.
      </p>

      <LegalHeading>Zonas de servicio</LegalHeading>
      <p>
        Enviamos a toda España. Ofrecemos un servicio especialmente cuidado en nuestra comarca:{" "}
        {BRAND_ZONES.join(", ")} (Valencia).
      </p>

      <LegalHeading>Devoluciones</LegalHeading>
      <p>
        Dispones de 14 días naturales desde la recepción para desistir de tu compra, salvo en los
        productos precintados que, por razones de higiene o conservación, no puedan devolverse una
        vez abiertos. El producto debe conservar su estado y embalaje originales.
      </p>

      <LegalHeading>Incidencias</LegalHeading>
      <p>
        Si tu pedido llega dañado o incompleto, contáctanos lo antes posible a través de la página
        de contacto y lo resolveremos con la mayor rapidez.
      </p>
    </LegalLayout>
  );
}
