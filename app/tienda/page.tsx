/**
 * Shop catalogue (/tienda).
 *
 * Server component that renders the page shell + metadata and delegates the
 * interactive, URL-driven catalogue (filters, sort, grid) to the client
 * <ShopCatalog>. ShopCatalog uses useSearchParams, so it is wrapped in a
 * <Suspense> boundary as required by the Next.js App Router.
 */
import type { Metadata } from "next";
import { Suspense } from "react";

import { ShopCatalog } from "@/components/shop/ShopCatalog";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Catálogo completo de The Best Dreams: flores CBD, hachís y extractos, aceites, vaporizadores, accesorios y semillas. Filtra por precio, disponibilidad y método de cultivo.",
  alternates: { canonical: "/tienda" },
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Tienda</p>
        <h1 className="mt-2 font-serif text-3xl text-offwhite sm:text-4xl">Todo el catálogo</h1>
        <p className="mt-3 max-w-2xl text-sm text-offwhite/65">
          CBD y cáñamo legal premium, analizado en laboratorio. Usa los filtros para encontrar
          exactamente lo que buscas.
        </p>
      </header>

      <Suspense fallback={<p className="py-16 text-center text-offwhite/50">Cargando…</p>}>
        <ShopCatalog />
      </Suspense>
    </div>
  );
}
