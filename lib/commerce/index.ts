/**
 * Commerce API - provider-agnostic storefront data access.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SWAP SEAM
 * ─────────────────────────────────────────────────────────────────────────────
 * Every function in this module is the public contract the UI depends on. Today
 * it is implemented over the local mock data in `mock-data.ts`. To go live,
 * replace this module's implementation with a Shopify Storefront API adapter or
 * a Medusa.js adapter that returns the SAME types from `types.ts` - the UI
 * callers (pages, components, the cart store) must NOT change.
 *
 * The functions are declared `async` on purpose so the mock and a real network
 * backend share the same signatures; only the body swaps.
 *
 * IMPORTANT: this module is a pure data layer. It must not import React,
 * Next.js, or any browser-only API.
 */
import {
  BRAND,
  BRAND_ZONES,
  categories as allCategories,
  featuredSlugs,
  products as allProducts,
} from "./mock-data";
import type { Category, GetProductsArgs, Product, SortOption, WeightVariant } from "./types";

export { BRAND, BRAND_ZONES };
export type * from "./types";

/** Lowest price across a product's variants (used for "precio desde"). */
export function priceFrom(product: Product): number {
  return product.variants.reduce(
    (min, v) => (v.price < min ? v.price : min),
    Number.POSITIVE_INFINITY,
  );
}

/** Whether any variant of the product is purchasable. */
export function isAvailable(product: Product): boolean {
  return product.variants.some((v) => v.available) && !product.badges.includes("agotado");
}

function inPriceRange(product: Product, min?: number, max?: number): boolean {
  const prices = product.variants.map((v) => v.price);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  if (min !== undefined && hi < min) return false;
  if (max !== undefined && lo > max) return false;
  return true;
}

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "precio-asc":
      sorted.sort((a, b) => priceFrom(a) - priceFrom(b));
      break;
    case "precio-desc":
      sorted.sort((a, b) => priceFrom(b) - priceFrom(a));
      break;
    case "novedad":
      sorted.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
      break;
    case "mas-vendidos":
      sorted.sort((a, b) => b.unitsSold - a.unitsSold);
      break;
    case "disponibilidad":
      sorted.sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)));
      break;
  }
  return sorted;
}

// ── Catalogue reads ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return allCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return allCategories.find((c) => c.slug === slug);
}

export async function getProducts(args: GetProductsArgs = {}): Promise<Product[]> {
  const { category, sort, filters } = args;
  let list = allProducts;

  if (category) {
    list = list.filter((p) => p.category === category);
  }

  if (filters) {
    const { priceMin, priceMax, onlyAvailable, methods } = filters;
    list = list.filter((p) => {
      if (!inPriceRange(p, priceMin, priceMax)) return false;
      if (onlyAvailable && !isAvailable(p)) return false;
      if (methods && methods.length > 0) {
        if (!p.method || !methods.includes(p.method)) return false;
      }
      return true;
    });
  }

  if (sort) {
    list = sortProducts(list, sort);
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return allProducts.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return featuredSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allProducts.filter((p) => {
    const haystack = [p.name, p.shortDescription, p.description, p.origin, ...p.terpenes]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** Re-exported so UI can render a variant price without importing internals. */
export type { WeightVariant };
