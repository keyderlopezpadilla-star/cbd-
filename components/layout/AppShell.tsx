"use client";

/**
 * AppShell - client boundary that mounts the i18n provider and the persistent
 * chrome (header, footer, age gate, brand loader) around page content, with the
 * page-transition wrapper handling route changes. Kept separate so the root
 * layout can stay a server component.
 */
import { I18nProvider } from "@/lib/i18n";
import { AgeGate } from "@/components/AgeGate";
import { BrandLoader } from "@/components/BrandLoader";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <BrandLoader />
      <AgeGate />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}

export default AppShell;
