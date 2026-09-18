/**
 * Spanish dictionary (default locale).
 *
 * This is the single source of truth for UI copy. The `Dictionary` type is
 * inferred from this object, so every other locale must satisfy the same shape
 * (they fall back to these values for any key they don't override).
 *
 * All copy here is ORIGINAL brand voice for "The Best Dreams".
 */
export const es = {
  brand: {
    name: "The Best Dreams",
    slogan: "Donde hay calidad no hay competencia",
  },
  nav: {
    home: "Inicio",
    shop: "Tienda",
    categories: "Categorías",
    lab: "Análisis / Laboratorio",
    blog: "Magazine",
    about: "Nosotros",
    contact: "Contacto",
    cart: "Carrito",
    search: "Buscar",
    menu: "Menú",
    openCart: "Abrir el carrito",
    changeLanguage: "Cambiar idioma",
  },
  common: {
    from: "Desde",
    addToCart: "Añadir al carrito",
    added: "Añadido",
    soldOut: "Agotado",
    viewProduct: "Ver producto",
    reviews: "reseñas",
    loading: "Cargando…",
    currency: "€",
  },
  badges: {
    oferta: "Oferta",
    agotado: "Agotado",
    nuevo: "Nuevo",
    "mas-vendido": "Más vendido",
  },
  filters: {
    title: "Filtros",
    sort: "Ordenar por",
    price: "Precio",
    availability: "Disponibilidad",
    onlyAvailable: "Solo disponibles",
    method: "Método de cultivo",
    methodInterior: "Interior",
    methodExterior: "Exterior",
    methodGreenhouse: "Invernadero",
    clear: "Limpiar filtros",
    sortOptions: {
      "precio-asc": "Precio: de menor a mayor",
      "precio-desc": "Precio: de mayor a menor",
      novedad: "Novedades",
      "mas-vendidos": "Más vendidos",
      disponibilidad: "Disponibilidad",
    },
  },
  product: {
    cbd: "CBD",
    cbg: "CBG",
    terpenes: "Terpenos",
    origin: "Origen del cultivo",
    method: "Método",
    variant: "Formato",
    labResult: "Certificado de laboratorio",
    downloadLab: "Descargar análisis (PDF)",
    reviewsTitle: "Reseñas de clientes",
  },
  trust: {
    title: "Comprar en The Best Dreams",
    shipping: {
      title: "Envío en 24/48h",
      text: "Preparamos y enviamos tu pedido en 24/48 horas con seguimiento.",
    },
    securePayment: {
      title: "Pago seguro",
      text: "Transacciones cifradas y métodos de pago verificados.",
    },
    returns: {
      title: "Devoluciones",
      text: "14 días para devolver tu compra sin complicaciones.",
    },
    support: {
      title: "Atención al cliente",
      text: "Te ayudamos por teléfono, email y chat de lunes a sábado.",
    },
  },
  newsletter: {
    title: "Únete al club The Best Dreams",
    incentive: "Consigue un 10% de descuento en tu primera compra.",
    text: "Suscríbete a nuestra newsletter y recibe novedades, ofertas y contenido sobre el mundo del CBD.",
    placeholder: "Tu correo electrónico",
    cta: "Quiero mi descuento",
    consent:
      "Al suscribirte aceptas nuestra política de privacidad. Puedes darte de baja cuando quieras.",
    success: "¡Bienvenido/a al club! Revisa tu correo para tu código de descuento.",
  },
  ageGate: {
    title: "Verificación de edad",
    heading: "¿Eres mayor de 18 años?",
    intro:
      "The Best Dreams comercializa productos derivados del cáñamo destinados exclusivamente a personas adultas. Confirma tu edad para continuar.",
    welcome: "Nuestro guía te da la bienvenida.",
    confirm: "Sí, soy mayor de 18 años",
    deny: "No, soy menor de 18 años",
    denied:
      "Lo sentimos, debes ser mayor de edad para acceder a esta tienda. Vuelve cuando cumplas los 18 años.",
    back: "Volver",
    legal:
      "Producto de cáñamo industrial legal en España con menos del 0,2% de THC. No apto para menores.",
  },
  footer: {
    tagline: "CBD y cáñamo legal premium.",
    zonesTitle: "Zonas de servicio",
    zonesIntro: "Enviamos a toda España y servimos de forma especial en:",
    exploreTitle: "Explorar",
    legalTitle: "Legal",
    followTitle: "Síguenos",
    rights: "Todos los derechos reservados.",
    legalLinks: {
      terms: "Términos y condiciones",
      privacy: "Política de privacidad",
      cookies: "Política de cookies",
      shipping: "Política de envíos",
      legalNotice: "Aviso legal",
    },
    disclaimers: {
      legalSpain:
        "Todos nuestros productos derivan del cáñamo industrial y son legales en España, con un contenido de THC inferior al 0,2%.",
      notForConsumption:
        "Producto no apto para consumo humano según la variante. Consulta la ficha de cada producto.",
      notMedical:
        "Ningún producto de The Best Dreams sustituye un tratamiento médico. Consulta a un profesional sanitario.",
    },
  },
  loader: {
    label: "Cargando The Best Dreams…",
  },
  lab: {
    title: "Análisis y Laboratorio",
    intro:
      "Publicamos los certificados de análisis de laboratorios independientes de nuestros productos. Descárgalos en PDF.",
    placeholder: "Certificado pendiente de publicación. Próximamente disponible en PDF.",
    download: "Descargar certificado (PDF)",
  },
} as const;

export type Dictionary = typeof es;

export default es;
