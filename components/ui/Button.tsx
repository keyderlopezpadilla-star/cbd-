"use client";

import { forwardRef } from "react";

type Variant = "gold" | "outline" | "ghost" | "green";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-black hover:bg-gold-bright gold-glow",
  outline: "border border-gold/60 text-gold hover:border-gold hover:bg-gold/10",
  ghost: "text-offwhite/80 hover:text-offwhite hover:bg-offwhite/5",
  green: "bg-green-rustic text-offwhite hover:bg-green-moss",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

/** Brand button. Gold is the primary CTA; outline/ghost/green are secondary. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "gold", size = "md", className, type = "button", ...props },
  ref,
) {
  const classes = [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
  return <button ref={ref} type={type} className={classes} {...props} />;
});

export default Button;
