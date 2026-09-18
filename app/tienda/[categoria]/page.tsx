/**
 * Category listing (/tienda/[categoria]).
 *
 * Server component: resolves the category via the commerce API, 404s on unknown
 * slugs via notFound(), and statically pre-renders the six categories with
 * generateStaticParams. The interactive filtered grid is the same client
 * <ShopCatalog>, scoped to this category. The cultivation-method filter and
 * per-method sub-notes are only shown for the Flores family.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCategories, getCategoryBySlug } from "@/lib/commerce";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { GlassCard } from "@/components/ui";

interface CategoryPageProps {
  params: { categoria: string };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ categoria: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.categoria);
  if (!category) {
    return { title: "Categoría no encontrada" };
  }
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/tienda/${category.slug}` },
  };
}

const FLORES_METHOD_NOTES = [
  {
    title: "Interior",
    text: "Cultivo bajo luz LED en entorno controlado: cogollos densos, muy resinosos y de aroma limpio e intenso.",
  },
  {
    title: "Exterior",
    text: "Madurado al sol mediterráneo: perfiles terrosos y complejos, con el carácter de cada temporada.",
  },
  {
    title: "Invernadero",
    text: "Lo mejor del sol con el control de un entorno cerrado: cogollos equilibrados y muy resinosos.",
  },
];

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.categoria);
  if (!category) {
    notFound();
  }

  const isFlores = category.kind === "flores";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Categoría</p>
        <h1 className="mt-2 font-serif text-3xl text-offwhite sm:text-4xl">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-sm text-offwhite/65">{category.description}</p>
      </header>

      {isFlores && (
        <ul className="mb-8 grid gap-4 sm:grid-cols-3">
          {FLORES_METHOD_NOTES.map((note) => (
            <GlassCard as="li" key={note.title} className="p-5">
              <h2 className="font-serif text-lg text-gold">{note.title}</h2>
              <p className="mt-2 text-sm text-offwhite/65">{note.text}</p>
            </GlassCard>
          ))}
        </ul>
      )}

      <Suspense fallback={<p className="py-16 text-center text-offwhite/50">Cargando…</p>}>
        <ShopCatalog category={category.slug} showMethod={isFlores} />
      </Suspense>

      <GlassCard className="mt-12 p-5 text-xs leading-relaxed text-offwhite/55">
        {category.consumptionDisclaimer}
      </GlassCard>
    </div>
  );
}
