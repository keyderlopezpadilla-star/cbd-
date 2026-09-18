/**
 * Mock commerce data for "The Best Dreams" (TBD).
 *
 * All copy here is ORIGINAL brand voice written for this project. It is not
 * copied from any reference site. Prices, stock and reviews are illustrative
 * sample data used to exercise the storefront while no real backend is wired.
 *
 * This module is pure data - no React / Next.js imports - so it can be replaced
 * by a Shopify Storefront API or Medusa.js adapter without touching the UI.
 *
 * Legal context (Spain): productos derivados de cáñamo industrial con menos del
 * 0,2% de THC. Consulta los disclaimers por categoría más abajo.
 */
import type { Category, Product } from "./types";

/** Local service zones for TBD (Valencia, España). */
export const BRAND_ZONES = ["Algemesí", "Sueca", "Tavernes", "Carcaixent"] as const;

export const BRAND = {
  name: "The Best Dreams",
  shortName: "TBD",
  slogan: "Donde hay calidad no hay competencia",
  region: "Valencia, España",
} as const;

export const categories: Category[] = [
  {
    slug: "flores-cbd",
    name: "Flores CBD",
    kind: "flores",
    description:
      "Cogollos de cáñamo seleccionados a mano en cultivos de interior, exterior e invernadero. Aroma intenso, resina abundante y un perfil de terpenos cuidado en cada cosecha.",
    consumptionDisclaimer:
      "Producto de coleccionismo aromático. No apto para consumo humano por combustión. Cáñamo industrial legal en España con menos del 0,2% de THC.",
  },
  {
    slug: "hachis-extractos",
    name: "Hachís y Extractos",
    kind: "hachis",
    description:
      "Resinas y extractos artesanales de cáñamo con alta concentración de cannabinoides. Elaboración en frío para preservar terpenos y textura.",
    consumptionDisclaimer:
      "Extracto aromático de coleccionismo. No apto para consumo humano. Cáñamo industrial legal en España con menos del 0,2% de THC.",
  },
  {
    slug: "aceites-cbd",
    name: "Aceites CBD",
    kind: "aceites",
    description:
      "Aceites de espectro completo y de amplio espectro, formulados con base de MCT o aceite de oliva virgen extra. Dosificación precisa con pipeta graduada.",
    consumptionDisclaimer:
      "Complemento de bienestar de uso tópico. No sustituye ningún tratamiento médico. Consulta a un profesional sanitario antes de usarlo.",
  },
  {
    slug: "vaporizadores",
    name: "Vaporizadores",
    kind: "vaporizadores",
    description:
      "Vaporizadores de conducción y convección para aromas de hierbas secas, con control de temperatura y materiales de grado alimentario.",
    consumptionDisclaimer:
      "Dispositivo aromático. Úsalo únicamente con hierbas de aromaterapia aptas. No sustituye ningún tratamiento médico.",
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    kind: "accesorios",
    description:
      "Molinillos, botes herméticos, papel y complementos premium para conservar y disfrutar tus aromas en las mejores condiciones.",
    consumptionDisclaimer: "Accesorio de uso general. Mantener fuera del alcance de los niños.",
  },
  {
    slug: "semillas-cbd-cbg",
    name: "Semillas CBD/CBG",
    kind: "semillas",
    description:
      "Genéticas ricas en CBD y CBG, feminizadas y estabilizadas, para cultivadores que buscan perfiles cannabinoides ricos y bajo contenido en THC.",
    consumptionDisclaimer:
      "Producto de coleccionismo genético. La germinación puede estar restringida según la legislación de tu país. Cumple siempre la normativa local.",
  },
];

/**
 * Helper to build weight variants with a per-gram price and a small volume
 * discount, keeping the sample data consistent and terse.
 */
function grams(entries: Array<[label: string, grams: number, price: number, available?: boolean]>) {
  return entries.map(([label, g, price, available = true]) => ({
    label,
    grams: g,
    price,
    available,
  }));
}

export const products: Product[] = [
  // ── Flores CBD ────────────────────────────────────────────────────────────
  {
    id: "flor-amnesia-interior",
    slug: "amnesia-haze-interior",
    name: "Amnesia Haze · Interior",
    category: "flores-cbd",
    shortDescription: "Cogollo indoor cítrico y resinoso, cultivo de interior controlado.",
    description:
      "Amnesia Haze cultivada en interior bajo luz LED de espectro completo. Cogollos compactos, cubiertos de tricomas y con un aroma cítrico y especiado. Curada lentamente durante seis semanas para redondear el perfil aromático.",
    cbdPercent: 18,
    terpenes: ["Limoneno", "Terpinoleno", "Mirceno"],
    origin: "Cultivo propio en Algemesí (Valencia)",
    method: "interior",
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.8,
      count: 42,
      items: [
        {
          author: "Marta G.",
          rating: 5,
          date: "2024-02-11",
          title: "Aroma espectacular",
          body: "El olor cítrico llena la habitación al abrir el bote. Cogollos muy densos.",
        },
        {
          author: "Rubén P.",
          rating: 4,
          date: "2024-01-30",
          title: "Muy buena calidad",
          body: "Resina abundante y buen curado. Repetiré seguro.",
        },
      ],
    },
    variants: grams([
      ["1g", 1, 8.9],
      ["3g", 3, 24.9],
      ["5g", 5, 38.9],
      ["10g", 10, 69.9],
    ]),
    badges: ["mas-vendido"],
    publishedAt: "2024-01-15",
    unitsSold: 1280,
    labResultUrl: "/lab-pdfs/amnesia-haze-interior.pdf",
  },
  {
    id: "flor-og-kush-exterior",
    slug: "og-kush-exterior",
    name: "OG Kush · Exterior",
    category: "flores-cbd",
    shortDescription: "Cogollo outdoor terroso y pinoso, cultivo al sol mediterráneo.",
    description:
      "OG Kush de cultivo exterior en la huerta valenciana, madurada al sol. Aromas terrosos con un fondo de pino y combustible dulce. Un clásico atemporal con carácter.",
    cbdPercent: 14,
    terpenes: ["Mirceno", "Pineno", "Cariofileno"],
    origin: "Cultivo exterior en Sueca (Valencia)",
    method: "exterior",
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.5,
      count: 28,
      items: [
        {
          author: "Lucía R.",
          rating: 5,
          date: "2024-03-02",
          title: "Sabor clásico",
          body: "El toque terroso y pinoso está muy conseguido. Relación calidad-precio top.",
        },
      ],
    },
    variants: grams([
      ["1g", 1, 6.9],
      ["3g", 3, 18.9],
      ["5g", 5, 29.9],
      ["10g", 10, 54.9],
    ]),
    badges: ["oferta"],
    publishedAt: "2023-11-20",
    unitsSold: 940,
    labResultUrl: "/lab-pdfs/og-kush-exterior.pdf",
  },
  {
    id: "flor-gorilla-invernadero",
    slug: "gorilla-glue-invernadero",
    name: "Gorilla Glue · Invernadero",
    category: "flores-cbd",
    shortDescription: "Cogollo de invernadero muy resinoso, equilibrio sol y control.",
    description:
      "Gorilla Glue cultivada en invernadero (greenhouse): lo mejor del sol mediterráneo con el control de un entorno cerrado. Cogollos extremadamente pegajosos por su alta producción de resina.",
    cbdPercent: 16,
    cbgPercent: 1.2,
    terpenes: ["Cariofileno", "Limoneno", "Humuleno"],
    origin: "Invernadero en Tavernes (Valencia)",
    method: "greenhouse",
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.7,
      count: 19,
      items: [
        {
          author: "Diego M.",
          rating: 5,
          date: "2024-02-25",
          title: "Pegajosa de verdad",
          body: "Impresionante cantidad de resina. Se nota el mimo en el cultivo.",
        },
      ],
    },
    variants: grams([
      ["1g", 1, 7.9],
      ["3g", 3, 21.9],
      ["5g", 5, 34.9],
      ["10g", 10, 62.9],
    ]),
    badges: ["nuevo"],
    publishedAt: "2024-03-10",
    unitsSold: 320,
    labResultUrl: "/lab-pdfs/gorilla-glue-invernadero.pdf",
  },

  // ── Hachís y Extractos ──────────────────────────────────────────────────────
  {
    id: "hachis-marroqui",
    slug: "hachis-marroqui-premium",
    name: "Hachís Marroquí Premium",
    category: "hachis-extractos",
    shortDescription: "Resina prensada suave y aromática, elaboración tradicional.",
    description:
      "Resina de cáñamo elaborada con método tradicional en frío. Textura maleable, color tostado y un aroma especiado y dulce. Rica en cannabinoides y terpenos preservados.",
    cbdPercent: 32,
    cbgPercent: 2,
    terpenes: ["Mirceno", "Pineno"],
    origin: "Importación seleccionada, control de laboratorio en España",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.6,
      count: 33,
      items: [
        {
          author: "Sergio A.",
          rating: 5,
          date: "2024-01-18",
          title: "Textura perfecta",
          body: "Muy aromático y maleable. Calidad notable.",
        },
      ],
    },
    variants: grams([
      ["1g", 1, 11.9],
      ["3g", 3, 32.9],
      ["5g", 5, 49.9],
    ]),
    badges: ["mas-vendido"],
    publishedAt: "2023-12-05",
    unitsSold: 760,
    labResultUrl: "/lab-pdfs/hachis-marroqui.pdf",
  },
  {
    id: "extracto-dry-sift",
    slug: "dry-sift-cbd",
    name: "Dry Sift CBD",
    category: "hachis-extractos",
    shortDescription: "Polen tamizado en seco, terpenos intactos y máxima pureza.",
    description:
      "Extracto en seco (dry sift) obtenido tamizando cogollos de cáñamo a baja temperatura. Sin disolventes. Un polvo dorado muy aromático que conserva el perfil de terpenos original.",
    cbdPercent: 40,
    cbgPercent: 3,
    terpenes: ["Limoneno", "Terpinoleno"],
    origin: "Elaboración propia en Carcaixent (Valencia)",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.9,
      count: 12,
      items: [
        {
          author: "Nuria V.",
          rating: 5,
          date: "2024-03-14",
          title: "Purísimo",
          body: "Sin disolventes y con un aroma increíble. Se nota la artesanía.",
        },
      ],
    },
    variants: grams([
      ["1g", 1, 14.9],
      ["3g", 3, 39.9, false],
      ["5g", 5, 62.9],
    ]),
    badges: ["nuevo"],
    publishedAt: "2024-03-12",
    unitsSold: 180,
    labResultUrl: "/lab-pdfs/dry-sift-cbd.pdf",
  },

  // ── Aceites CBD ─────────────────────────────────────────────────────────────
  {
    id: "aceite-full-10",
    slug: "aceite-cbd-full-spectrum-10",
    name: "Aceite CBD Full Spectrum 10%",
    category: "aceites-cbd",
    shortDescription: "Espectro completo al 10% con base de MCT, pipeta graduada.",
    description:
      "Aceite de espectro completo con un 10% de CBD sobre base de aceite MCT de coco. Efecto séquito por la sinergia de cannabinoides y terpenos. Pipeta graduada para una dosificación precisa.",
    cbdPercent: 10,
    cbgPercent: 0.5,
    terpenes: ["Mirceno", "Linalool"],
    origin: "Formulado en España a partir de cáñamo ecológico europeo",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.7,
      count: 58,
      items: [
        {
          author: "Elena C.",
          rating: 5,
          date: "2024-02-08",
          title: "Muy buen producto",
          body: "La pipeta ayuda mucho a dosificar. Sabor natural agradable.",
        },
      ],
    },
    variants: grams([
      ["10ml", 10, 29.9],
      ["30ml", 30, 74.9],
    ]),
    badges: ["mas-vendido"],
    publishedAt: "2023-10-10",
    unitsSold: 2100,
    labResultUrl: "/lab-pdfs/aceite-full-10.pdf",
    consumptionDisclaimer:
      "Complemento de bienestar de uso tópico. No sustituye ningún tratamiento médico. No superar la dosis recomendada.",
  },
  {
    id: "aceite-broad-20",
    slug: "aceite-cbd-broad-spectrum-20",
    name: "Aceite CBD Broad Spectrum 20%",
    category: "aceites-cbd",
    shortDescription: "Amplio espectro al 20% sin THC, base de oliva virgen extra.",
    description:
      "Aceite de amplio espectro con un 20% de CBD y THC no detectable, sobre base de aceite de oliva virgen extra. Ideal para quienes buscan concentración alta sin THC.",
    cbdPercent: 20,
    terpenes: ["Limoneno", "Pineno"],
    origin: "Formulado en España con AOVE valenciano",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.8,
      count: 37,
      items: [
        {
          author: "Pau T.",
          rating: 5,
          date: "2024-03-01",
          title: "Concentración top",
          body: "Se nota la calidad del aceite de oliva. Muy contento.",
        },
      ],
    },
    variants: grams([
      ["10ml", 10, 49.9],
      ["30ml", 30, 129.9],
    ]),
    badges: [],
    publishedAt: "2024-01-05",
    unitsSold: 640,
    labResultUrl: "/lab-pdfs/aceite-broad-20.pdf",
    consumptionDisclaimer:
      "Complemento de bienestar de uso tópico. No sustituye ningún tratamiento médico. No superar la dosis recomendada.",
  },

  // ── Vaporizadores ───────────────────────────────────────────────────────────
  {
    id: "vaporizador-portatil",
    slug: "vaporizador-portatil-pro",
    name: "Vaporizador Portátil Pro",
    category: "vaporizadores",
    shortDescription: "Convección híbrida, control de temperatura y carga USB-C.",
    description:
      "Vaporizador portátil de convección híbrida con control de temperatura preciso (40-210 °C), cámara cerámica y carga rápida USB-C. Vapor suave y sabroso para aromas de hierbas secas.",
    cbdPercent: 0,
    terpenes: [],
    origin: "Diseño europeo, materiales de grado alimentario",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.6,
      count: 24,
      items: [
        {
          author: "Iván L.",
          rating: 5,
          date: "2024-02-20",
          title: "Muy buen vapor",
          body: "La batería aguanta mucho y el control de temperatura es preciso.",
        },
      ],
    },
    variants: [{ label: "Unidad", grams: 0, price: 119.9, available: true }],
    badges: [],
    publishedAt: "2023-09-15",
    unitsSold: 410,
  },
  {
    id: "vaporizador-sobremesa",
    slug: "vaporizador-sobremesa-classic",
    name: "Vaporizador de Sobremesa Classic",
    category: "vaporizadores",
    shortDescription: "Convección pura de sobremesa, sistema de globo y boquilla.",
    description:
      "Vaporizador de sobremesa de convección pura con sistema de globo y boquilla, temperatura estable para sesiones largas. Un referente en calidad de vapor para el hogar.",
    cbdPercent: 0,
    terpenes: [],
    origin: "Diseño europeo, materiales de grado alimentario",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.9,
      count: 15,
      items: [
        {
          author: "Cristina B.",
          rating: 5,
          date: "2024-03-05",
          title: "Calidad de vapor brutal",
          body: "El sistema de globo es muy cómodo. Inversión que merece la pena.",
        },
      ],
    },
    variants: [{ label: "Unidad", grams: 0, price: 289.9, available: false }],
    badges: ["agotado"],
    publishedAt: "2023-08-01",
    unitsSold: 150,
  },

  // ── Accesorios ──────────────────────────────────────────────────────────────
  {
    id: "accesorio-grinder",
    slug: "grinder-aluminio-4-piezas",
    name: "Grinder de Aluminio 4 Piezas",
    category: "accesorios",
    shortDescription: "Molinillo CNC de aluminio con tamiz de polen y cámara.",
    description:
      "Molinillo (grinder) de aluminio aeronáutico mecanizado por CNC, con cuatro piezas, dientes en diamante, tamiz de polen y cámara recolectora. Molienda uniforme y duradera.",
    cbdPercent: 0,
    terpenes: [],
    origin: "Aluminio de grado aeronáutico",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.7,
      count: 61,
      items: [
        {
          author: "Toni S.",
          rating: 5,
          date: "2024-01-22",
          title: "Muele de lujo",
          body: "Los dientes cortan muy bien y el tamiz recoge bastante polen.",
        },
      ],
    },
    variants: [
      { label: "Ø50mm", grams: 0, price: 24.9, available: true },
      { label: "Ø63mm", grams: 0, price: 32.9, available: true },
    ],
    badges: ["mas-vendido"],
    publishedAt: "2023-07-12",
    unitsSold: 1520,
  },
  {
    id: "accesorio-bote",
    slug: "bote-hermetico-uv",
    name: "Bote Hermético UV",
    category: "accesorios",
    shortDescription: "Bote de cristal con filtro UV para conservar aromas.",
    description:
      "Bote hermético de cristal con filtro UV que protege el contenido de la luz y preserva los terpenos. Cierre estanco con junta de silicona para mantener la humedad ideal.",
    cbdPercent: 0,
    terpenes: [],
    origin: "Cristal con tratamiento UV",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.5,
      count: 40,
      items: [
        {
          author: "Marina F.",
          rating: 4,
          date: "2024-02-14",
          title: "Conserva muy bien",
          body: "El cristal oscuro va genial para mantener el aroma. Buen cierre.",
        },
      ],
    },
    variants: [
      { label: "100ml", grams: 0, price: 9.9, available: true },
      { label: "250ml", grams: 0, price: 14.9, available: true },
    ],
    badges: ["oferta"],
    publishedAt: "2023-10-30",
    unitsSold: 880,
  },

  // ── Semillas CBD/CBG ────────────────────────────────────────────────────────
  {
    id: "semilla-cbd-fem",
    slug: "semillas-cbd-feminizadas",
    name: "Semillas CBD Feminizadas",
    category: "semillas-cbd-cbg",
    shortDescription: "Genética rica en CBD, feminizada y estabilizada, bajo THC.",
    description:
      "Genética feminizada seleccionada por su alto contenido en CBD y su bajo nivel de THC. Estabilizada para ofrecer cosechas homogéneas, aromáticas y resistentes.",
    cbdPercent: 15,
    cbgPercent: 1,
    terpenes: ["Mirceno", "Limoneno"],
    origin: "Banco de semillas europeo",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.8,
      count: 22,
      items: [
        {
          author: "Álvaro D.",
          rating: 5,
          date: "2024-02-28",
          title: "Germinación perfecta",
          body: "Germinaron todas y crecen muy homogéneas. Muy recomendable.",
        },
      ],
    },
    variants: [
      { label: "3 uds", grams: 0, price: 24.9, available: true },
      { label: "5 uds", grams: 0, price: 38.9, available: true },
      { label: "10 uds", grams: 0, price: 69.9, available: true },
    ],
    badges: ["mas-vendido"],
    publishedAt: "2023-11-01",
    unitsSold: 540,
    labResultUrl: "/lab-pdfs/semillas-cbd.pdf",
  },
  {
    id: "semilla-cbg-fem",
    slug: "semillas-cbg-feminizadas",
    name: "Semillas CBG Feminizadas",
    category: "semillas-cbd-cbg",
    shortDescription: "Genética rica en CBG, la 'madre de los cannabinoides'.",
    description:
      "Genética feminizada especializada en CBG, el llamado cannabinoide madre. Perfil raro y muy demandado, con floración rápida y estructura compacta.",
    cbdPercent: 4,
    cbgPercent: 14,
    terpenes: ["Pineno", "Cariofileno"],
    origin: "Banco de semillas europeo",
    method: null,
    images: ["/products/placeholder.jpg"],
    reviews: {
      rating: 4.6,
      count: 9,
      items: [
        {
          author: "Rosa M.",
          rating: 5,
          date: "2024-03-08",
          title: "Perfil CBG difícil de encontrar",
          body: "Muy contenta con la genética CBG. Floración rápida como indican.",
        },
      ],
    },
    variants: [
      { label: "3 uds", grams: 0, price: 29.9, available: true },
      { label: "5 uds", grams: 0, price: 46.9, available: true },
    ],
    badges: ["nuevo"],
    publishedAt: "2024-03-06",
    unitsSold: 110,
    labResultUrl: "/lab-pdfs/semillas-cbg.pdf",
  },
];

/** Slugs of products featured on the homepage. */
export const featuredSlugs = [
  "amnesia-haze-interior",
  "hachis-marroqui-premium",
  "aceite-cbd-full-spectrum-10",
  "grinder-aluminio-4-piezas",
];
