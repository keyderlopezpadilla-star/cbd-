import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { AppShell } from "@/components/layout/AppShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Best Dreams",
    template: "%s · The Best Dreams",
  },
  description:
    "The Best Dreams · CBD y cáñamo legal premium. Donde hay calidad no hay competencia. Envíos en Algemesí, Sueca, Tavernes y Carcaixent (Valencia).",
  keywords: [
    "CBD",
    "cáñamo legal",
    "CBD premium",
    "CBD Algemesí",
    "CBD Sueca",
    "CBD Tavernes",
    "CBD Carcaixent",
    "CBD Valencia",
    "The Best Dreams",
  ],
  authors: [{ name: "The Best Dreams" }],
  openGraph: {
    title: "The Best Dreams",
    description: "Donde hay calidad no hay competencia.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-black text-offwhite">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
