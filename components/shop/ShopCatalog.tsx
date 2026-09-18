"use client";

/**
 * ShopCatalog - client catalogue view for /tienda and /tienda/[categoria].
 *
 * Filters and sort are the single source of truth in the URL search params, so
 * a filtered catalogue is shareable and survives refresh/back-forward. On every
 * change we push a new URL and (re)query the provider-agnostic commerce API
 * (getProducts) with the parsed args - never touching mock data directly, so
 * the Shopify/Medusa swap seam stays intact.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getProducts } from "@/lib/commerce";
import type { Product, ProductFilters, SortOption } from "@/lib/commerce/types";
import { useT } from "@/lib/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import {
  CatalogFilters,
  type CatalogFilterState,
  type MethodValue,
} from "@/components/shop/CatalogFilters";

const VALID_SORTS: SortOption[] = [
  "precio-asc",
  "precio-desc",
  "novedad",
  "mas-vendidos",
  "disponibilidad",
];
const VALID_METHODS: MethodValue[] = ["interior", "exterior", "greenhouse"];
const DEFAULT_SORT: SortOption = "novedad";

function parseState(params: URLSearchParams): CatalogFilterState {
  const sortParam = params.get("orden");
  const methodsParam = (params.get("metodo") ?? "")
    .split(",")
    .filter((m): m is MethodValue => VALID_METHODS.includes(m as MethodValue));
  const priceMin = params.get("min");
  const priceMax = params.get("max");
  return {
    sort: VALID_SORTS.includes(sortParam as SortOption) ? (sortParam as SortOption) : DEFAULT_SORT,
    priceMin: priceMin ? Number(priceMin) : null,
    priceMax: priceMax ? Number(priceMax) : null,
    onlyAvailable: params.get("disponible") === "1",
    methods: methodsParam,
  };
}

export interface ShopCatalogProps {
  /** Restrict to a single category slug (category pages). */
  category?: string;
  /** Whether to show the cultivation-method filter (only meaningful for flores). */
  showMethod?: boolean;
}

export function ShopCatalog({ category, showMethod = true }: ShopCatalogProps) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(
    () => parseState(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Re-query the commerce API whenever the parsed filter state changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    const filters: ProductFilters = {
      priceMin: state.priceMin ?? undefined,
      priceMax: state.priceMax ?? undefined,
      onlyAvailable: state.onlyAvailable || undefined,
      methods: state.methods.length ? state.methods : undefined,
    };
    getProducts({ category, sort: state.sort, filters }).then((list) => {
      if (active) {
        setProducts(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [category, state.sort, state.priceMin, state.priceMax, state.onlyAvailable, state.methods]);

  const writeParams = useCallback(
    (next: CatalogFilterState) => {
      const params = new URLSearchParams();
      if (next.sort !== DEFAULT_SORT) params.set("orden", next.sort);
      if (next.priceMin != null) params.set("min", String(next.priceMin));
      if (next.priceMax != null) params.set("max", String(next.priceMax));
      if (next.onlyAvailable) params.set("disponible", "1");
      if (next.methods.length) params.set("metodo", next.methods.join(","));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const handleChange = useCallback(
    (partial: Partial<CatalogFilterState>) => writeParams({ ...state, ...partial }),
    [state, writeParams],
  );

  const handleClear = useCallback(
    () =>
      writeParams({
        sort: DEFAULT_SORT,
        priceMin: null,
        priceMax: null,
        onlyAvailable: false,
        methods: [],
      }),
    [writeParams],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <CatalogFilters
          state={state}
          onChange={handleChange}
          onClear={handleClear}
          showMethod={showMethod}
          resultCount={products.length}
        />
      </aside>

      <div>
        {loading ? (
          <p className="py-16 text-center text-offwhite/50">{t.common.loading}</p>
        ) : products.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="font-serif text-xl text-offwhite">Sin resultados</p>
            <p className="mt-2 text-sm text-offwhite/60">
              Prueba a ajustar los filtros o a limpiarlos para ver todo el catálogo.
            </p>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ShopCatalog;
