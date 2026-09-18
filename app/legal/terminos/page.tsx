/**
 * Términos y condiciones (/legal/terminos). Original Spanish copy.
 */
import type { Metadata } from "next";

import { LegalHeading, LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de compra de The Best Dreams: proceso de pedido, precios, pagos, edad mínima y uso legal de los productos de cáñamo.",
  alternates: { canonical: "/legal/terminos" },
};

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y condiciones" updated="marzo de 2024">
      <p>
        Estas condiciones regulan la relación entre The Best Dreams y las personas que realizan
        compras a través del Sitio. Al confirmar un pedido, el usuario acepta estos términos.
      </p>

      <LegalHeading>Edad mínima</LegalHeading>
      <p>
        La compra está reservada a personas mayores de 18 años. Al continuar, el usuario declara
        cumplir este requisito. Nos reservamos el derecho de verificar la edad cuando sea necesario.
      </p>

      <LegalHeading>Productos y descripción</LegalHeading>
      <p>
        Nos esforzamos por describir cada producto con precisión, incluyendo su perfil de
        cannabinoides y terpenos. Los productos de cáñamo industrial son legales en España con un
        THC inferior al 0,2%. Las flores, extractos y semillas se ofrecen como artículos de
        coleccionismo y no son aptos para consumo humano según la variante.
      </p>

      <LegalHeading>Precios y pago</LegalHeading>
      <p>
        Los precios se muestran en euros e incluyen los impuestos aplicables. El proceso de pago del
        Sitio es, en su estado actual, una demostración: no se procesan cobros reales hasta la
        integración de un proveedor de pago autorizado.
      </p>

      <LegalHeading>Proceso de pedido</LegalHeading>
      <p>
        Una vez confirmado el pedido, el usuario recibirá una confirmación con la referencia
        correspondiente. The Best Dreams podrá rechazar o cancelar pedidos por falta de stock,
        errores de precio o sospecha de incumplimiento de estas condiciones.
      </p>

      <LegalHeading>Legislación aplicable</LegalHeading>
      <p>
        Estas condiciones se rigen por la legislación española. Para cualquier controversia, las
        partes se someten a los juzgados y tribunales que correspondan conforme a derecho.
      </p>
    </LegalLayout>
  );
}
