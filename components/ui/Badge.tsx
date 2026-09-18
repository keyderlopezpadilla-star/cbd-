import type { ProductBadge } from "@/lib/commerce/types";

const styles: Record<ProductBadge, string> = {
  oferta: "bg-gold text-black",
  agotado: "bg-black/70 text-offwhite/80 border border-offwhite/30",
  nuevo: "bg-green-moss text-offwhite",
  "mas-vendido": "bg-gold-bright text-black",
};

const labels: Record<ProductBadge, string> = {
  oferta: "Oferta",
  agotado: "Agotado",
  nuevo: "Nuevo",
  "mas-vendido": "Más vendido",
};

export interface BadgeProps {
  badge: ProductBadge;
  /** Optional translated label; defaults to the Spanish label. */
  label?: string;
  className?: string;
}

/** Small merchandising pill for product badges. */
export function Badge({ badge, label, className }: BadgeProps) {
  const classes = [
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
    styles[badge],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{label ?? labels[badge]}</span>;
}

export default Badge;
