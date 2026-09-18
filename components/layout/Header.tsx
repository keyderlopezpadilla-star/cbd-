"use client";

/**
 * Site header: brand logo (with SVG fallback), primary navigation, cart icon
 * with live count from the Zustand store, and a language selector stub wired to
 * the i18n provider.
 */
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { locales, localeNames } from "@/lib/i18n/config";
import { useLocale, useT } from "@/lib/i18n";
import { primaryNav, routes } from "@/lib/routes";
import { useCartCount } from "@/lib/store/cart";

function BrandLogo({ alt }: { alt: string }) {
  // Prefer the real raster logo; fall back to the original SVG placeholder if
  // /brand/logo.png is missing (it ships as a placeholder until swapped).
  const [src, setSrc] = useState("/brand/logo.png");
  return (
    <Image
      src={src}
      alt={alt}
      width={44}
      height={44}
      priority
      onError={() => setSrc("/brand/logo.svg")}
      className="h-11 w-11 object-contain"
    />
  );
}

function LanguageSelector() {
  const [locale, setLocale] = useLocale();
  const t = useT();
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t.nav.changeLanguage}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as (typeof locales)[number])}
        aria-label={t.nav.changeLanguage}
        className="cursor-pointer rounded-full border border-gold/40 bg-transparent px-3 py-1.5 text-xs uppercase tracking-wider text-offwhite/80 hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-black text-offwhite">
            {l.toUpperCase()} · {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Header() {
  const t = useT();
  const count = useCartCount();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={routes.home} className="flex items-center gap-3" aria-label={t.brand.name}>
          <BrandLogo alt={t.brand.name} />
          <span className="hidden font-serif text-lg tracking-wide text-offwhite sm:block">
            {t.brand.name}
          </span>
        </Link>

        <nav aria-label={t.nav.menu} className="ml-auto hidden items-center gap-6 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm text-offwhite/75 transition-colors hover:text-gold"
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-4">
          <LanguageSelector />

          <Link
            href={routes.cart}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-offwhite/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`${t.nav.openCart} (${count})`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <path d="M3 4h2l2.4 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L21 7H6" />
              <circle cx="9.5" cy="20" r="1.2" />
              <circle cx="17.5" cy="20" r="1.2" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-semibold text-black">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t.nav.menu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-offwhite/80 hover:border-gold md:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label={t.nav.menu}
          className="border-t border-gold/20 bg-black/95 px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-offwhite/80 hover:bg-offwhite/5 hover:text-gold"
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
