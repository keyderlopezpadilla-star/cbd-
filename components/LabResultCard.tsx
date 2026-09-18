"use client";

/**
 * LabResultCard - a reusable certificate card for the Análisis page (and any
 * other place that surfaces a lab result). It links to the PDF under
 * public/lab-pdfs/<file>.pdf via the product's `labResultUrl`. When a product
 * has no certificate yet, it shows an on-brand "pending" placeholder instead of
 * a broken link. Real signed PDFs are dropped into public/lab-pdfs with the
 * same file names (see public/lab-pdfs/README.md) - fully swappable.
 */
import { useT } from "@/lib/i18n";
import type { Product } from "@/lib/commerce/types";
import { routes } from "@/lib/routes";
import { GlassCard } from "@/components/ui";
import Link from "next/link";

export interface LabResultCardProps {
  product: Product;
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
      <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
    </svg>
  );
}

export function LabResultCard({ product }: LabResultCardProps) {
  const t = useT();
  const hasCertificate = Boolean(product.labResultUrl);

  return (
    <GlassCard as="li" className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg text-offwhite">
            <Link href={routes.product(product.slug)} className="hover:text-gold">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wider text-offwhite/50">
            {t.product.cbd} {product.cbdPercent}%
            {product.cbgPercent ? ` · ${t.product.cbg} ${product.cbgPercent}%` : ""}
          </p>
        </div>
        <span
          className={[
            "inline-flex h-2.5 w-2.5 shrink-0 rounded-full",
            hasCertificate ? "bg-green-moss" : "bg-offwhite/30",
          ].join(" ")}
          aria-hidden
        />
      </div>

      {hasCertificate ? (
        <a
          href={product.labResultUrl}
          download
          className="mt-auto inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-sm text-gold transition-colors hover:border-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <DownloadIcon />
          {t.lab.download}
        </a>
      ) : (
        <p className="mt-auto rounded-xl border border-dashed border-offwhite/20 px-4 py-2 text-xs text-offwhite/50">
          {t.lab.placeholder}
        </p>
      )}
    </GlassCard>
  );
}

export default LabResultCard;
