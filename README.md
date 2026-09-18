# The Best Dreams

Tienda online de **CBD y cáñamo legal premium** con estética _lujo rústico natural_
(negro/dorado + verde tierra) y animaciones 3D. Construida con Next.js (App Router),
TypeScript, Tailwind CSS y react-three-fiber sobre una capa de comercio **mock**
diseñada para conectarse más adelante a Shopify o Medusa sin tocar la UI.

> **Slogan:** _Donde hay calidad no hay competencia._
> **Zonas de servicio:** Algemesí · Sueca · Tavernes · Carcaixent (Valencia, España).

---

## Tabla de contenidos

- [Stack técnico](#stack-técnico)
- [Prerrequisitos](#prerrequisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts](#scripts)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Sistema de diseño y tokens](#sistema-de-diseño-y-tokens)
- [Cambiar el logo](#cambiar-el-logo)
- [Sustituir las mascotas placeholder por modelos 3D finales](#sustituir-las-mascotas-placeholder-por-modelos-3d-finales)
- [Sustituir la capa de comercio mock](#sustituir-la-capa-de-comercio-mock)
- [Checklists](#checklists)
- [Nota sobre el entorno de build (importante)](#nota-sobre-el-entorno-de-build-importante)

---

## Stack técnico

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** con tokens de diseño expuestos como variables CSS
- **react-three-fiber** / **@react-three/drei** / **three** para mascotas y escenas 3D
- **framer-motion** para animación de UI y transiciones de página
- **zustand** para el estado del carrito (con persistencia)
- **next/font** (Playfair Display + Inter) e **i18n** propio (ES por defecto, EN/FR/IT preparados)

## Prerrequisitos

- **Node.js 22** (LTS). Se recomienda gestionarlo con `nvm` (`nvm use 22`).
- **npm** (incluido con Node). No es necesario ningún servicio externo: el proyecto arranca
  contra datos mock.

## Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:3000
```

Copia `.env.example` a `.env.local` si quieres personalizar variables (todas son opcionales
mientras el proveedor de comercio sea `mock`; ver [Variables de entorno](#variables-de-entorno)).

> El fichero `next-env.d.ts` lo genera automáticamente Next.js en el primer arranque
> (`next dev` / `next build`) y está en `.gitignore`.

## Scripts

Todos definidos en `package.json`:

| Script              | Comando              | Descripción                       |
| ------------------- | -------------------- | --------------------------------- |
| `npm run dev`       | `next dev`           | Servidor de desarrollo en `:3000` |
| `npm run build`     | `next build`         | Build de producción               |
| `npm run start`     | `next start`         | Servir el build de producción     |
| `npm run lint`      | `next lint`          | ESLint (config `next`)            |
| `npm run typecheck` | `tsc --noEmit`       | Comprobación de tipos             |
| `npm run format`    | `prettier --write .` | Formateo con Prettier             |

## Variables de entorno

Definidas en `.env.example`. El build actual usa la capa de comercio **mock**, así que
**ninguna es obligatoria** todavía. Cópialas a `.env.local` cuando conectes un backend real.

| Variable                                      | Por defecto | Uso                                                      |
| --------------------------------------------- | ----------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_COMMERCE_PROVIDER`               | `mock`      | Selector de proveedor: `mock`, `shopify` o `medusa`      |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`            | (vacío)     | Dominio de la tienda Shopify (`tu-tienda.myshopify.com`) |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | (vacío)     | Token del Storefront API de Shopify                      |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL`              | (vacío)     | URL del backend Medusa (`http://localhost:9000`)         |
| `NEXT_PUBLIC_SITE_URL`                        | (vacío)     | URL pública del sitio (metadatos, canonical, sitemap)    |

## Estructura del proyecto

```
.
├── app/                       # App Router: rutas, layouts y páginas
│   ├── layout.tsx             # Layout raíz: fuentes next/font, AppShell
│   ├── globals.css            # Tokens de diseño (variables CSS) + estilos base
│   ├── page.tsx               # Home (hero 3D, secciones, novedades)
│   ├── loading.tsx            # Loader de marca a nivel de app
│   ├── not-found.tsx          # Página 404
│   ├── tienda/                # Catálogo
│   │   ├── page.tsx           # Listado general
│   │   └── [categoria]/page.tsx  # Categoría (SSG vía generateStaticParams)
│   ├── producto/[slug]/page.tsx  # Ficha de producto (SSG)
│   ├── analisis/page.tsx      # Análisis de laboratorio (PDFs)
│   ├── blog/                  # Magazine
│   │   ├── page.tsx           # Índice de artículos
│   │   └── [slug]/page.tsx    # Artículo (SSG)
│   ├── sobre-nosotros/page.tsx
│   ├── contacto/page.tsx
│   ├── carrito/page.tsx       # Carrito (estado Zustand)
│   ├── checkout/page.tsx      # Checkout multi-paso (MOCK, sin pago real)
│   └── legal/                 # Páginas legales
│       ├── aviso-legal/page.tsx
│       ├── terminos/page.tsx
│       ├── privacidad/page.tsx
│       ├── cookies/page.tsx
│       └── politica-envios/page.tsx
├── components/
│   ├── layout/                # AppShell, Header, Footer
│   ├── legal/                 # LegalLayout (+ bloque LEGAL_DISCLAIMERS)
│   ├── mascots/               # Sistema de mascotas 3D (ver más abajo)
│   │   ├── Mascot.tsx         # <Mascot name=... /> reutilizable (API pública)
│   │   ├── MascotCanvas.tsx   # <Canvas> r3f, dpr clamping, mapeo de eventos
│   │   ├── Mascot2DFallback.tsx  # Silueta 2D (sin WebGL / reduced-motion)
│   │   ├── registry.ts        # ÚNICA costura de intercambio a .glb
│   │   ├── types.ts           # MascotName, MascotEvent, MascotProps...
│   │   └── scenes/            # Escenas por mascota (placeholders low-poly)
│   ├── product/               # ProductCard, ProductDetail
│   ├── shop/                  # ShopCatalog, CatalogFilters
│   ├── sections/              # Hero3D, StorySection, TrustBlock, Newsletter
│   ├── ui/                    # Button, Badge, GlassCard, Section
│   ├── AgeGate.tsx            # Modal de verificación de edad 18+
│   ├── BrandLoader.tsx        # Loader con paloma dorada
│   └── PageTransition.tsx     # Transiciones de ruta (framer-motion)
├── lib/
│   ├── commerce/              # Capa de comercio (costura de intercambio)
│   │   ├── index.ts           # API pública: getProducts, getProductBySlug...
│   │   ├── mock-data.ts       # Datos de ejemplo (categorías + productos)
│   │   └── types.ts           # Category, Product, WeightVariant...
│   ├── store/cart.ts          # Store Zustand del carrito
│   ├── i18n/                  # config + provider + diccionarios es/en/fr/it
│   ├── content/blog.ts        # Contenido del magazine
│   ├── motion/                # useReducedMotion, useInViewOnce
│   └── routes.ts              # Tabla central de rutas
├── public/
│   ├── brand/                 # logo.svg (placeholder) + README (swap del logo)
│   ├── mascots/               # destino de los .glb finales + README
│   ├── products/              # imágenes de producto (placeholders)
│   └── lab-pdfs/              # certificados de análisis
├── docs/
│   ├── PERFORMANCE_CHECKLIST.md
│   └── LEGAL_CHECKLIST.md
├── tailwind.config.ts         # Tema Tailwind (mapea los tokens CSS)
├── next.config.mjs
└── tsconfig.json
```

## Sistema de diseño y tokens

Los tokens de color y tipografía se definen como **variables CSS** en `app/globals.css`
y se exponen a Tailwind en `tailwind.config.ts`, de modo que se usan como utilidades
(`bg-black`, `text-gold`, `text-offwhite`, etc.).

| Token          | Hex       | Uso                                   |
| -------------- | --------- | ------------------------------------- |
| `black`        | `#0B0B0A` | fondo base                            |
| `gold`         | `#C9A24B` | acentos, CTAs, bordes                 |
| `gold-bright`  | `#E8C572` | brillos, glows                        |
| `offwhite`     | `#F7F5F0` | texto sobre oscuro, aire              |
| `green-rustic` | `#3E4B34` | superficies secundarias               |
| `green-moss`   | `#5A6B45` | iconografía natural, textura orgánica |

Tipografía: titulares en **Playfair Display**, cuerpo en **Inter**, ambas cargadas con
`next/font/google` y `display: "swap"` (ver `app/layout.tsx`).

---

## Cambiar el logo

La marca real es un **águila dorada coronada con el wordmark "THE BEST DREAMS"**.

1. Coloca la imagen final en **`public/brand/logo.png`** (fondo transparente, idealmente
   ≥ 1024px de ancho, dorado sobre transparente para asentar sobre el fondo oscuro).
2. No hace falta tocar código: `components/layout/Header.tsx` referencia `/brand/logo.png`
   y usa **`/brand/logo.svg`** como _fallback_ automático (vía `onError`) mientras el PNG
   no exista.

El `public/brand/logo.svg` que se incluye es un **placeholder original** (emblema geométrico
dorado), no una reproducción del águila real. Detalles y paleta en
[`public/brand/README.md`](public/brand/README.md).

## Sustituir las mascotas placeholder por modelos 3D finales

El sistema de mascotas es un `<Mascot name="lion" />` reutilizable respaldado por escenas r3f.
Hoy cada mascota usa un **placeholder de geometría primitiva low-poly** (material toon). Los
`.glb` definitivos se conectan con un **cambio de una sola línea**, sin tocar los llamadores
ni la lógica de idle/eventos.

Roles de la tripulación: **lion** (guía/jefe → modal de edad + onboarding), **eagle**
(experto → producto/laboratorio), **panda** y **monkey** (ofertas → carrito/newsletter),
**dove** (paloma dorada, acento del loader).

1. Copia los modelos con estos nombres exactos bajo `public/mascots/`:

   ```
   public/mascots/lion.glb
   public/mascots/eagle.glb
   public/mascots/panda.glb
   public/mascots/monkey.glb
   public/mascots/dove.glb
   ```

2. Crea una escena GLB que respete el mismo contrato `MascotSceneProps`
   (por ejemplo `components/mascots/scenes/GLBScene.tsx`) usando `useGLTF`:

   ```tsx
   import { useGLTF } from "@react-three/drei";
   import { useRef } from "react";
   import * as THREE from "three";
   import type { MascotSceneProps } from "../types";
   import { useMascotMotion } from "./useMascotMotion";

   export function makeGLBScene(url: string) {
     function GLBScene({ event, reducedMotion }: MascotSceneProps) {
       const group = useRef<THREE.Group>(null);
       useMascotMotion(group, event, reducedMotion, true);
       const { scene } = useGLTF(url);
       return (
         <group ref={group}>
           <primitive object={scene} />
         </group>
       );
     }
     return GLBScene;
   }
   ```

3. Cambia **una línea** en `components/mascots/registry.ts`:

   ```diff
   - lion: LionScene,
   + lion: makeGLBScene("/mascots/lion.glb"),
   ```

No cambia ningún llamador (`<Mascot />`), ni el idle loop, ni las reacciones
(hover / click / scroll-into-view / add-to-cart). El fallback 2D
(`Mascot2DFallback.tsx`) y el respeto a `prefers-reduced-motion` siguen igual.

Guía completa (presupuesto de polígonos, escala, materiales toon) en
[`public/mascots/README.md`](public/mascots/README.md).

## Sustituir la capa de comercio mock

Toda la app lee los datos a través de la API pública de `lib/commerce/index.ts`. Es una
**capa de datos pura** (no importa React ni Next) implementada hoy sobre `lib/commerce/mock-data.ts`.
Para ir a producción, reimplementa el cuerpo de estas funciones contra el **Shopify Storefront API**
o **Medusa.js** manteniendo **exactamente las mismas firmas y tipos** (de `lib/commerce/types.ts`).
Los llamadores de la UI (páginas, componentes y el store del carrito) **no cambian**.

Firmas exportadas que deben conservarse:

```ts
getCategories(): Promise<Category[]>
getCategoryBySlug(slug: string): Promise<Category | undefined>
getProducts(args?: GetProductsArgs): Promise<Product[]>
getProductBySlug(slug: string): Promise<Product | undefined>
getFeaturedProducts(): Promise<Product[]>
searchProducts(query: string): Promise<Product[]>
priceFrom(product: Product): number      // helper síncrono
isAvailable(product: Product): boolean   // helper síncrono
```

Las funciones de lectura ya son `async` a propósito, de modo que el mock y un backend de red
comparten la firma y solo cambia el cuerpo. Usa el selector `NEXT_PUBLIC_COMMERCE_PROVIDER`
(`mock` | `shopify` | `medusa`) y las variables de Shopify/Medusa de `.env.example` para
elegir el adaptador.

> **El checkout es actualmente un MOCK.** `app/checkout/page.tsx` simula el flujo
> (envío → método → resumen → confirmación) y genera una referencia de pedido ficticia; no hay
> pasarela de pago real. Sustitúyelo por el checkout de Shopify/Medusa al conectar el backend.

## Checklists

- [`docs/PERFORMANCE_CHECKLIST.md`](docs/PERFORMANCE_CHECKLIST.md): objetivos Lighthouse ≥ 90 y
  medidas concretas de rendimiento a verificar antes del lanzamiento.
- [`docs/LEGAL_CHECKLIST.md`](docs/LEGAL_CHECKLIST.md): disclaimers CBD obligatorios en España,
  cada uno mapeado a su ubicación real en la app.

## Nota sobre el entorno de build (importante)

Este proyecto se generó en un sandbox con **modo de red `INTEGRATIONS_ONLY`**, donde el
registro de npm (`registry.npmjs.org`) estaba **bloqueado (403)**. Por tanto,
`npm install`, `npm run build`, `npm run typecheck` y `npm run lint` **no pudieron ejecutarse**
en ese entorno porque requieren descargar dependencias. Ejecuta esos comandos en un entorno
con acceso al registro de npm:

```bash
npm install
npm run typecheck && npm run lint && npm run build
```

Además, **solo en ese sandbox** Node debía invocarse como `env -u NODE_OPTIONS <comando>`
(porque `NODE_OPTIONS` apuntaba a un bootstrap inexistente que hacía fallar a Node). En un
entorno de desarrollo normal esto **no** es necesario: usa los comandos tal cual.
