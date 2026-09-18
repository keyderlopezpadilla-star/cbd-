"use client";

/**
 * Site footer: local SEO service zones, quick links, legal links, and the
 * mandatory Spanish CBD disclaimers (cáñamo industrial <0,2% THC, no apto para
 * consumo humano según variante, no sustituye tratamiento médico).
 */
import Link from "next/link";

import { BRAND_ZONES } from "@/lib/commerce/mock-data";
import { useT } from "@/lib/i18n";
import { primaryNav, routes } from "@/lib/routes";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  const legalLinks = [
    { href: routes.legal.legalNotice, label: t.footer.legalLinks.legalNotice },
    { href: routes.legal.terms, label: t.footer.legalLinks.terms },
    { href: routes.legal.privacy, label: t.footer.legalLinks.privacy },
    { href: routes.legal.cookies, label: t.footer.legalLinks.cookies },
    { href: routes.legal.shipping, label: t.footer.legalLinks.shipping },
  ];

  return (
    <footer className="border-t border-gold/20 bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-serif text-xl text-offwhite">{t.brand.name}</p>
          <p className="mt-2 text-sm italic text-gold">“{t.brand.slogan}”</p>
          <p className="mt-4 text-sm text-offwhite/60">{t.footer.tagline}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
            {t.footer.zonesTitle}
          </h2>
          <p className="mt-3 text-sm text-offwhite/60">{t.footer.zonesIntro}</p>
          <p className="mt-2 text-sm text-offwhite/85">{BRAND_ZONES.join(" · ")}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
            {t.footer.exploreTitle}
          </h2>
          <ul className="mt-3 space-y-2">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="text-sm text-offwhite/70 hover:text-gold">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
            {t.footer.legalTitle}
          </h2>
          <ul className="mt-3 space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-offwhite/70 hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 text-xs leading-relaxed text-offwhite/50 sm:px-6">
          <p>{t.footer.disclaimers.legalSpain}</p>
          <p>{t.footer.disclaimers.notForConsumption}</p>
          <p>{t.footer.disclaimers.notMedical}</p>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-offwhite/40 sm:px-6">
          © {year} {t.brand.name}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
