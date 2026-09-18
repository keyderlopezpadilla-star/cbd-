export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add the warm gold glow around the card. */
  glow?: boolean;
  as?: "div" | "article" | "li";
}

/**
 * Frosted glass panel over the dark background, using the shared `.glass`
 * utility. Pass `glow` to add the brand gold aura (`GoldGlow` is a shorthand).
 */
export function GlassCard({
  glow = false,
  as = "div",
  className,
  children,
  ...props
}: GlassCardProps) {
  const Tag = as;
  const classes = ["glass rounded-2xl", glow ? "gold-glow" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}

/** Convenience: a GlassCard that always carries the gold glow. */
export function GoldGlow(props: Omit<GlassCardProps, "glow">) {
  return <GlassCard glow {...props} />;
}

export default GlassCard;
