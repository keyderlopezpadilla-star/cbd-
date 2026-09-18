/**
 * Home page.
 *
 * Server component that fetches featured categories + products from the mock
 * commerce layer and composes the client sections:
 *   - Hero3D: lazy-loaded 3D pollen hero with a 2D / reduced-motion fallback.
 *   - Featured categories grid.
 *   - Brand scroll-storytelling (origen del cultivo -> proceso -> producto ->
 *     confianza), each chapter revealing on in-view.
 *   - Featured products grid (ProductCard tilt).
 *   - TrustBlock + Newsletter (Deals mascot).
 *
 * PageTransition wrapping is provided by AppShell in app/layout.tsx.
 */
import Link from "next/link";

import { getCategories, getFeaturedProducts } from "@/lib/commerce";
import { routes } from "@/lib/routes";
import { Hero3D } from "@/components/sections/Hero3D";
import { Newsletter } from "@/components/sections/Newsletter";
import { StorySection } from "@/components/sections/StorySection";
import { TrustBlock } from "@/components/sections/TrustBlock";
import { ProductCard } from "@/components/product/ProductCard";
import { Section } from "@/components/ui";

const STORY = [
  {
    kicker: "Origen del cultivo",
    title: "De la huerta valenciana a tu casa",
    body: "Todo empieza en la tierra. Cultivamos y seleccionamos cáñamo en Algemesí, Sueca, Tavernes y Carcaixent, respetando los ritmos del sol mediterráneo y un cuidado casi artesanal en cada planta.",
  },
  {
    kicker: "Proceso",
    title: "Curado lento, elaboración en frío",
    body: "La calidad no tiene prisa. Curamos las flores despacio para redondear su aroma y elaboramos nuestros extractos en frío, preservando intactos los terpenos y el carácter de cada cosecha.",
  },
  {
    kicker: "Producto",
    title: "Perfiles ricos, formatos para cada gusto",
    body: "Flores, hachís y extractos, aceites, vaporizadores, accesorios y semillas. Cada producto llega con su perfil de cannabinoides y terpenos detallado, para que elijas con criterio.",
  },
  {
    kicker: "Confianza",
    title: "Transparencia analizada en laboratorio",
    body: "Publicamos los certificados de análisis de laboratorios independientes. Sabrás siempre qué contiene lo que compras, con un THC por debajo del 0,2% que garantiza su legalidad en España.",
  },
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts()]);

  return (
    <>
      <Hero3D />

      {/* Featured categories */}
      <Section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Categorías</p>
            <h2 className="mt-2 font-serif text-3xl text-offwhite">Explora nuestro catálogo</h2>
          </div>
          <Link href={routes.shop} className="hidden text-sm text-gold hover:underline sm:block">
            Ver toda la tienda →
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={routes.category(category.slug)}
                className="glass group flex h-full flex-col justify-between gap-4 rounded-2xl p-6 transition-all duration-300 hover:gold-glow"
              >
                <div>
                  <h3 className="font-serif text-xl text-offwhite group-hover:text-gold">
                    {category.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-offwhite/60">
                    {category.description}
                  </p>
                </div>
                <span className="text-sm text-gold">Descubrir →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Brand scroll-storytelling */}
      <div className="border-y border-gold/10 bg-[linear-gradient(180deg,transparent,rgba(62,75,52,0.12),transparent)]">
        {STORY.map((chapter, i) => (
          <StorySection
            key={chapter.kicker}
            index={i + 1}
            kicker={chapter.kicker}
            title={chapter.title}
            body={chapter.body}
            flip={i % 2 === 1}
          />
        ))}
      </div>

      {/* Featured products */}
      <Section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Selección</p>
        <h2 className="mt-2 font-serif text-3xl text-offwhite">Destacados de la casa</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </Section>

      <TrustBlock />
      <Newsletter />
    </>
  );
}
