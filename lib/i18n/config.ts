/**
 * i18n configuration.
 *
 * Spanish (`es`) is the default and the only fully-populated dictionary. The
 * structure is ready for EN/FR/IT: each of those dictionaries imports `es` as
 * its fallback so missing keys never break the UI (see dictionaries/*.ts).
 *
 * This module is pure config - no React imports - so it can be used on the
 * server, in metadata, and in the client provider alike.
 */
export const locales = ["es", "en", "fr", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  it: "Italiano",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
