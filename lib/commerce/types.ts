/**
 * Commerce domain types.
 *
 * These types describe the shape of the storefront data as the UI consumes it.
 * They are deliberately provider-agnostic: today they are backed by the mock
 * data in `mock-data.ts`, but the same shapes can be produced by a Shopify
 * Storefront API adapter or a Medusa.js adapter later (see `index.ts`).
 *
 * IMPORTANT: this module is pure data. It must not import React, Next.js or any
 * browser API so it can run on the server, in edge runtimes, and in tests.
 */

/** The six mandatory catalogue families for "The Best Dreams". */
export type CategoryKind =
  "flores" | "hachis" | "aceites" | "vaporizadores" | "accesorios" | "semillas";

/** Cultivation method for flowers / extracts. `null` when it does not apply. */
export type CultivationMethod = "interior" | "exterior" | "greenhouse" | null;

/** Merchandising badges surfaced on cards and product pages. */
export type ProductBadge = "oferta" | "agotado" | "nuevo" | "mas-vendido";

/** Sort options exposed by the catalogue. */
export type SortOption =
  "precio-asc" | "precio-desc" | "novedad" | "mas-vendidos" | "disponibilidad";

export interface Category {
  slug: string;
  name: string;
  description: string;
  kind: CategoryKind;
  /** Legal consumption note shown for every product in this family. */
  consumptionDisclaimer: string;
}

/** A purchasable weight/size variant with its own price and stock. */
export interface WeightVariant {
  /** Human label, e.g. "1g", "3g", "5g", "10g", "500g", "10ml". */
  label: string;
  /** Numeric weight in grams (or millilitres for oils) used for sorting. */
  grams: number;
  /** Price in EUR for this variant. */
  price: number;
  /** Whether this specific variant can be added to the cart. */
  available: boolean;
}

export interface Review {
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface ProductReviews {
  /** Average rating, 0-5. */
  rating: number;
  /** Total number of reviews. */
  count: number;
  items: Review[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Category slug this product belongs to. */
  category: string;
  shortDescription: string;
  description: string;
  /** CBD content as a percentage (0-100). */
  cbdPercent: number;
  /** CBG content as a percentage, when relevant. */
  cbgPercent?: number;
  /** Dominant terpenes. */
  terpenes: string[];
  /** Origin of the crop / raw material. */
  origin: string;
  /** Cultivation method, or null for non-flower products. */
  method: CultivationMethod;
  /** Image paths under /public. First image is the primary. */
  images: string[];
  reviews: ProductReviews;
  /** Weight/size variants; at least one. */
  variants: WeightVariant[];
  badges: ProductBadge[];
  /** Publish date (ISO) used for the "novedad" sort. */
  publishedAt: string;
  /** Units sold, used for the "mas-vendidos" sort. */
  unitsSold: number;
  /** URL of the third-party lab certificate (PDF), when available. */
  labResultUrl?: string;
  /** Per-product consumption disclaimer (overrides the category default). */
  consumptionDisclaimer?: string;
}

/** A line in the shopping cart: a specific variant of a product. */
export interface CartLine {
  /** Stable line id: `${productId}:${variantLabel}`. */
  id: string;
  productId: string;
  slug: string;
  name: string;
  /** Variant label, e.g. "5g". */
  variantLabel: string;
  /** Unit price in EUR at the time it was added. */
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  lines: CartLine[];
  subtotal: number;
  count: number;
}

/** Filter set accepted by `getProducts`. */
export interface ProductFilters {
  /** Minimum variant price (EUR). */
  priceMin?: number;
  /** Maximum variant price (EUR). */
  priceMax?: number;
  /** Only products that have at least one available variant. */
  onlyAvailable?: boolean;
  /** Restrict to these cultivation methods. */
  methods?: Exclude<CultivationMethod, null>[];
}

export interface GetProductsArgs {
  /** Restrict to a single category slug. */
  category?: string;
  sort?: SortOption;
  filters?: ProductFilters;
}
