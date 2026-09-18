"use client";

/**
 * i18n provider + hooks.
 *
 * Wrap the app in <I18nProvider> (see app/layout.tsx). Components read copy via
 * `useT()`, which returns the active dictionary, and `useLocale()` for the
 * current locale plus a setter (the header's language selector uses this).
 *
 * ES is the default; other locales currently fall back to the ES dictionary
 * (see dictionaries/*.ts), so the UI is always fully populated.
 */
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { defaultLocale, isLocale, type Locale } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "tbd-locale";

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.lang = next;
      } catch {
        // Ignore storage failures (private mode, etc.).
      }
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an <I18nProvider>");
  }
  return ctx;
}

/** Returns the active dictionary. Usage: `const t = useT(); t.nav.cart`. */
export function useT(): Dictionary {
  return useI18n().t;
}

/** Returns the current locale and a setter. */
export function useLocale(): [Locale, (locale: Locale) => void] {
  const { locale, setLocale } = useI18n();
  return [locale, setLocale];
}

export { defaultLocale, isLocale };
export type { Locale, Dictionary };
