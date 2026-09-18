# Checklist de cumplimiento legal (CBD, España)

Lista de verificación de los **disclaimers y páginas legales obligatorios** para la venta de
productos derivados del cáñamo industrial en España. Cada punto se mapea a su ubicación real
en la app.

> **Aviso:** este proyecto es una tienda de demostración con datos mock. **Antes de producción,
> un asesor legal real debe revisar** todos los textos, disclaimers y políticas, así como la
> clasificación legal de cada producto. Esta checklist es una guía técnica, no asesoramiento legal.

## Verificación de edad (18+)

- [ ] Modal bloqueante de verificación de edad al entrar.
  - **Componente:** `components/AgeGate.tsx` (montado globalmente en
    `components/layout/AppShell.tsx`).
  - **Textos (ES):** `lib/i18n/dictionaries/es.ts` → `ageGate` ("¿Eres mayor de 18 años?",
    "Sí, soy mayor de 18 años", denegación para menores, y nota
    "Producto de cáñamo industrial legal en España con menos del 0,2% de THC. No apto para menores.").

## Cáñamo industrial legal en España, THC < 0,2%

- [ ] Declaración de legalidad y límite de THC visible en todo el sitio.
  - **Bloque legal global de páginas legales:** `components/legal/LegalLayout.tsx`
    (`LEGAL_DISCLAIMERS[0]`: "...legales en España, con un contenido de THC inferior al 0,2%").
  - **Página de análisis:** `app/analisis/page.tsx` ("...contenido de THC inferior al 0,2%").
  - **Disclaimers por categoría y por producto:** `lib/commerce/mock-data.ts`
    (`consumptionDisclaimer`) y su render en fichas (ver más abajo).

## "No sustituye tratamiento médico"

- [ ] Aviso de ausencia de finalidad terapéutica.
  - **Bloque legal global:** `components/legal/LegalLayout.tsx` (`LEGAL_DISCLAIMERS[2]`:
    "Ningún producto... tiene finalidad terapéutica ni sustituye un tratamiento médico.").
  - **Página de análisis:** `app/analisis/page.tsx` ("...el CBD no sustituye un tratamiento
    médico. Consulta a un profesional sanitario.").

## Disclaimers de consumo por categoría (aceites vs. "no apto para consumo humano")

- [ ] Cada categoría muestra su disclaimer de consumo según la variante.
  - **Datos:** `lib/commerce/mock-data.ts` → campo `consumptionDisclaimer` por categoría
    (flores/extractos/semillas: "no apto para consumo humano"; aceites y cosmética con su
    indicación de uso correspondiente).
  - **Render en página de categoría:** `app/tienda/[categoria]/page.tsx`
    (`category.consumptionDisclaimer`).
  - **Render en ficha de producto:** `app/producto/[slug]/page.tsx` resuelve el disclaimer
    efectivo (override de producto → default de categoría → texto genérico) y lo pasa a
    `components/product/ProductDetail.tsx`, que **siempre** lo muestra.
  - **Bloque legal global:** `components/legal/LegalLayout.tsx` (`LEGAL_DISCLAIMERS[1]`:
    "...no son aptos para consumo humano según la variante.").

## Páginas legales

- [ ] **Aviso legal**: `app/legal/aviso-legal/page.tsx` (ruta `/legal/aviso-legal`).
- [ ] **Términos y condiciones**: `app/legal/terminos/page.tsx` (ruta `/legal/terminos`).
- [ ] **Política de privacidad**: `app/legal/privacidad/page.tsx` (ruta `/legal/privacidad`).
- [ ] **Política de cookies**: `app/legal/cookies/page.tsx` (ruta `/legal/cookies`).
- [ ] **Política de envíos (y devoluciones)**: `app/legal/politica-envios/page.tsx`
      (ruta `/legal/politica-envios`).

Todas enlazadas desde el pie de página: `components/layout/Footer.tsx` (`legalLinks`), con las
rutas centralizadas en `lib/routes.ts` (`routes.legal.*`).

## Otros puntos a verificar antes de producción

- [ ] Banner/gestor de consentimiento de cookies real (además de la página de política) si se
      cargan cookies no esenciales o analítica.
- [ ] Datos de la empresa (razón social, NIF, domicilio, contacto) completos en el aviso legal.
- [ ] Revisar la clasificación legal producto a producto (coleccionismo aromático/genético,
      uso tópico, etc.) con asesoría legal.
- [ ] Coherencia entre los textos i18n (EN/FR/IT) y los disclaimers legales cuando se traduzcan.
- [ ] **Revisión final por un abogado especializado antes de vender al público.**
