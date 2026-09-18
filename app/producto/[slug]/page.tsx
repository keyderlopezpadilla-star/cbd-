/**
 * Product detail (/producto/[slug]).
 *
 * Server component: resolves the product + its category from the commerce API,
 * 404s on unknown slugs via notFound(), and statically pre-renders every mock
 * slug with generateStaticParams. It computes the effective legal consumption
 * disclaimer (product override, else category default) on the server and hands
 * it, with the product, to the interactive client <ProductDetail>.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategoryBySlug, getProductBySlug, getProducts, priceFrom } from "@/lib/commerce";
import { ProductDetail } from "@/components/product/ProductDetail";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Producto no encontrado" };
  }
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const category = await getCategoryBySlug(product.category);
  const disclaimer =
    product.consumptionDisclaimer ??
    category?.consumptionDisclaimer ??
    "Producto de cáñamo industrial legal en España con menos del 0,2% de THC.";

  // Expose the "precio desde" as structured data for SEO / rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: "The Best Dreams" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: priceFrom(product).toFixed(2),
      availability: product.variants.some((v) => v.available)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} disclaimer={disclaimer} />
    </>
  );
}
