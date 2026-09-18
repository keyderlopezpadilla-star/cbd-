/**
 * Central route table so the header/footer/cards link consistently. Pure data
 * so it can be imported anywhere (server or client). FEAT-004 builds the actual
 * page files behind these paths.
 */
export const routes = {
  home: "/",
  shop: "/tienda",
  category: (slug: string) => `/tienda/${slug}`,
  product: (slug: string) => `/producto/${slug}`,
  lab: "/analisis",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  about: "/sobre-nosotros",
  contact: "/contacto",
  cart: "/carrito",
  checkout: "/checkout",
  legal: {
    terms: "/legal/terminos",
    privacy: "/legal/privacidad",
    cookies: "/legal/cookies",
    shipping: "/legal/politica-envios",
    legalNotice: "/legal/aviso-legal",
  },
} as const;

/** Primary navigation entries, keyed to i18n `nav.*` labels. */
export const primaryNav = [
  { key: "shop", href: routes.shop },
  { key: "lab", href: routes.lab },
  { key: "blog", href: routes.blog },
  { key: "about", href: routes.about },
  { key: "contact", href: routes.contact },
] as const;
