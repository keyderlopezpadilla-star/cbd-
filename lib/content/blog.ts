/**
 * Blog / Magazine content.
 *
 * ORIGINAL educational copy written for "The Best Dreams". Nothing here is
 * copied from any reference site. This is a small local content store; a real
 * project could swap it for an MDX pipeline or a headless CMS (Sanity,
 * Contentful) exposing the same `BlogPost` shape without touching the pages.
 *
 * Pure data - no React / Next.js imports - so it is server- and edge-safe.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Plain-text paragraphs; headings are prefixed with "## ". */
  body: string[];
  author: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
  tags: string[];
}

export const posts: BlogPost[] = [
  {
    slug: "que-es-el-cbd-guia-basica",
    title: "Qué es el CBD: guía básica para entenderlo desde cero",
    excerpt:
      "El cannabidiol (CBD) es uno de los cannabinoides más presentes en el cáñamo. Te explicamos qué es, en qué se diferencia del THC y por qué es legal en España.",
    body: [
      "El cannabidiol, conocido por sus siglas CBD, es uno de los más de cien cannabinoides que produce de forma natural la planta de cáñamo. A diferencia del THC, el CBD no tiene efecto psicoactivo, es decir, no altera el estado de conciencia ni produce el efecto asociado al consumo recreativo del cannabis.",
      "## CBD y THC: la gran diferencia",
      "El THC (tetrahidrocannabinol) es el compuesto responsable del efecto psicotrópico de la marihuana. El CBD, en cambio, interactúa con el organismo de una manera distinta y mucho más sutil. En España, los productos derivados del cáñamo industrial deben contener menos del 0,2% de THC para ser legales, y todos nuestros artículos cumplen ese límite.",
      "## El sistema endocannabinoide",
      "Nuestro cuerpo cuenta con un sistema endocannabinoide, una red de receptores que participa en el equilibrio de numerosas funciones. El CBD despierta interés precisamente por su relación con este sistema, aunque la investigación sigue en curso y ningún producto de cáñamo sustituye un tratamiento médico.",
      "## Formatos habituales",
      "El CBD llega al mercado en muchos formatos: flores y extractos de coleccionismo aromático, aceites de uso tópico, cosmética y más. Cada categoría tiene sus propias indicaciones legales de uso, que encontrarás siempre detalladas en la ficha de cada producto.",
      "En The Best Dreams seleccionamos cada genética y cada lote con mimo, y publicamos los análisis de laboratorio para que sepas exactamente qué estás comprando. Donde hay calidad no hay competencia.",
    ],
    author: "Equipo The Best Dreams",
    date: "2024-03-18",
    readingMinutes: 5,
    tags: ["CBD", "básicos", "legalidad"],
  },
  {
    slug: "terpenos-el-alma-aromatica-del-canamo",
    title: "Terpenos: el alma aromática del cáñamo",
    excerpt:
      "Limoneno, mirceno, pineno… Los terpenos son los responsables del aroma de cada variedad. Descubre qué son y por qué importan tanto como los cannabinoides.",
    body: [
      "Cuando abres un bote de flores de cáñamo y te envuelve ese aroma cítrico, terroso o a pino, estás percibiendo terpenos. Son compuestos aromáticos que la planta produce y que también encontramos en frutas, flores y especias de nuestro día a día.",
      "## Los terpenos más comunes",
      "El limoneno aporta notas cítricas y está presente también en la piel de los limones. El mirceno, terroso y balsámico, es uno de los más abundantes en el cáñamo. El pineno recuerda al bosque de coníferas, y el cariofileno tiene un carácter especiado, similar a la pimienta negra.",
      "## El efecto séquito",
      "Se conoce como efecto séquito a la idea de que cannabinoides y terpenos trabajan mejor en conjunto que por separado. Por eso cuidamos tanto el curado de nuestras flores y la elaboración en frío de nuestros extractos: buscamos preservar intacto ese perfil aromático original.",
      "## Cómo apreciarlos",
      "Conservar el producto en un bote hermético con filtro UV, lejos de la luz y el calor, ayuda a mantener los terpenos en su mejor estado durante más tiempo. Un buen molinillo y una conservación correcta marcan la diferencia en la experiencia aromática.",
      "Entender los terpenos es entender por qué dos variedades con el mismo porcentaje de CBD pueden oler y percibirse de forma completamente distinta.",
    ],
    author: "Equipo The Best Dreams",
    date: "2024-03-10",
    readingMinutes: 6,
    tags: ["terpenos", "aroma", "cultivo"],
  },
  {
    slug: "interior-exterior-invernadero-metodos-de-cultivo",
    title: "Interior, exterior e invernadero: métodos de cultivo explicados",
    excerpt:
      "El método de cultivo influye en el aroma, la resina y el carácter de cada cosecha. Comparamos indoor, outdoor y greenhouse con ejemplos de nuestro catálogo.",
    body: [
      "No todas las flores de cáñamo se cultivan igual. El método marca diferencias notables en la densidad del cogollo, la cantidad de resina y el perfil aromático final. En The Best Dreams trabajamos los tres grandes métodos.",
      "## Interior (indoor)",
      "El cultivo de interior se realiza en un entorno totalmente controlado, con iluminación LED, temperatura y humedad ajustadas. El resultado suele ser un cogollo compacto, muy resinoso y con un aroma intenso y limpio, como nuestra Amnesia Haze de interior.",
      "## Exterior (outdoor)",
      "Al sol mediterráneo, la planta crece de forma más natural y desarrolla perfiles terrosos y complejos. Es un cultivo más sostenible en consumo energético, con cosechas marcadas por el clima de cada temporada, como nuestra OG Kush de exterior.",
      "## Invernadero (greenhouse)",
      "El invernadero combina lo mejor de ambos mundos: aprovecha la luz solar pero mantiene un control del entorno que protege la cosecha. Suele dar cogollos muy resinosos y equilibrados, como nuestra Gorilla Glue de invernadero.",
      "Ninguno es mejor que otro en términos absolutos: cada método ofrece un carácter distinto. Conocerlos te ayuda a elegir la flor que mejor encaja con lo que buscas. Recuerda que se trata de producto de coleccionismo aromático, no apto para consumo humano por combustión.",
    ],
    author: "Equipo The Best Dreams",
    date: "2024-02-28",
    readingMinutes: 6,
    tags: ["cultivo", "flores", "calidad"],
  },
  {
    slug: "como-leer-un-analisis-de-laboratorio",
    title: "Cómo leer un análisis de laboratorio de CBD",
    excerpt:
      "Un certificado de análisis (COA) es tu mejor garantía de transparencia. Te enseñamos a interpretar los porcentajes de cannabinoides y los controles de seguridad.",
    body: [
      "Cada lote serio de producto de cáñamo debería venir acompañado de un certificado de análisis emitido por un laboratorio independiente. Es el documento que confirma qué contiene realmente el producto y que cumple con la legalidad vigente.",
      "## Perfil de cannabinoides",
      "La sección principal detalla el porcentaje de cada cannabinoide: CBD, CBG y, muy importante, THC. Para que un producto de cáñamo industrial sea legal en España, el THC debe mantenerse por debajo del 0,2%. Comprueba siempre este dato.",
      "## Controles de seguridad",
      "Un buen análisis va más allá de los cannabinoides: incluye pruebas de metales pesados, pesticidas, disolventes residuales y contaminación microbiológica. Estos controles garantizan que el producto es puro y seguro.",
      "## Trazabilidad del lote",
      "Fíjate en que el certificado indique el número de lote y la fecha del análisis, y en que coincida con el producto que tienes en la mano. Esa trazabilidad es lo que convierte un análisis en una verdadera garantía.",
      "En nuestra sección de Análisis publicamos los certificados de nuestros productos para que puedas consultarlos con total transparencia. Ningún análisis convierte un producto en medicamento: el CBD no sustituye un tratamiento médico.",
    ],
    author: "Equipo The Best Dreams",
    date: "2024-02-15",
    readingMinutes: 5,
    tags: ["laboratorio", "transparencia", "seguridad"],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
