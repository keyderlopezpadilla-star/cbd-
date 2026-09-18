/**
 * Política de cookies (/legal/cookies). Original Spanish copy.
 */
import type { Metadata } from "next";

import { LegalHeading, LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Política de cookies de The Best Dreams: qué son, qué tipos utilizamos y cómo gestionarlas desde tu navegador.",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de cookies" updated="marzo de 2024">
      <p>
        Una cookie es un pequeño archivo que un sitio web guarda en tu dispositivo para recordar
        información sobre tu visita. Esta política explica cómo las utiliza The Best Dreams.
      </p>

      <LegalHeading>Cookies técnicas</LegalHeading>
      <p>
        Usamos cookies y almacenamiento local estrictamente necesarios para el funcionamiento del
        Sitio, como recordar el contenido de tu carrito o tu preferencia de idioma. Estas no
        requieren consentimiento.
      </p>

      <LegalHeading>Cookies analíticas</LegalHeading>
      <p>
        En caso de activarse, las cookies analíticas nos ayudarían a entender de forma agregada cómo
        se usa el Sitio para mejorarlo. Solo se instalarían con tu consentimiento previo.
      </p>

      <LegalHeading>Cookies de terceros</LegalHeading>
      <p>
        El Sitio podría incorporar en el futuro servicios de terceros (por ejemplo, un proveedor de
        pago). En ese caso, dichos terceros podrían instalar sus propias cookies conforme a sus
        políticas.
      </p>

      <LegalHeading>Gestión de cookies</LegalHeading>
      <p>
        Puedes configurar o desactivar las cookies desde los ajustes de tu navegador. Ten en cuenta
        que desactivar las cookies técnicas puede afectar al funcionamiento del carrito y de otras
        funciones del Sitio.
      </p>
    </LegalLayout>
  );
}
