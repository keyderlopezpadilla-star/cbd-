/**
 * Política de privacidad (/legal/privacidad). Original Spanish copy.
 */
import type { Metadata } from "next";

import { LegalHeading, LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de The Best Dreams: qué datos tratamos, con qué finalidad, la base legal y cómo ejercer tus derechos conforme al RGPD.",
  alternates: { canonical: "/legal/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad" updated="marzo de 2024">
      <p>
        En The Best Dreams tratamos tus datos personales conforme al Reglamento General de
        Protección de Datos (RGPD) y a la normativa española vigente. Esta política explica qué
        información recogemos y cómo la usamos.
      </p>

      <LegalHeading>Responsable del tratamiento</LegalHeading>
      <p>
        El responsable del tratamiento es The Best Dreams. Puedes contactar con nosotros a través de
        la página de contacto del Sitio para cualquier cuestión relativa a tus datos.
      </p>

      <LegalHeading>Datos que tratamos</LegalHeading>
      <p>
        Tratamos los datos que nos facilitas voluntariamente: nombre, datos de contacto y dirección
        de envío al realizar un pedido, y tu correo si te suscribes a la newsletter. En el estado de
        demostración actual, el Sitio no almacena estos datos de forma permanente.
      </p>

      <LegalHeading>Finalidad y base legal</LegalHeading>
      <p>
        Usamos tus datos para gestionar pedidos y consultas (ejecución de un contrato) y para
        enviarte comunicaciones comerciales si has dado tu consentimiento. Puedes retirar ese
        consentimiento en cualquier momento.
      </p>

      <LegalHeading>Conservación</LegalHeading>
      <p>
        Conservamos los datos el tiempo necesario para la finalidad para la que se recogieron y para
        cumplir las obligaciones legales aplicables.
      </p>

      <LegalHeading>Tus derechos</LegalHeading>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiéndonos a través de la página de contacto. También puedes reclamar ante
        la Agencia Española de Protección de Datos.
      </p>
    </LegalLayout>
  );
}
