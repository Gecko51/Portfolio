// Root layout — Next 16 exige que <html> et <body> vivent ici (pattern B).
// La langue dynamique selon la locale active est synchronisée côté client via LocaleLangSync
// (monté dans [locale]/layout.tsx). Le SSR initial utilise routing.defaultLocale.
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { routing } from '@/i18n/routing';
import { fontBody, fontDisplay, fontMono } from '@/styles/fonts';

import './globals.css';

// Métadonnées globales du site.
export const metadata: Metadata = {
  title: 'Guillaume Gay — AI Builder & Full Stack Developer',
  description:
    "Portfolio de Guillaume Gay, AI Builder reconverti après 21 ans dans l'Armée de Terre. Founder Gecko Mind.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

// Root layout : possède <html> et <body>, applique les variables CSS des polices via className.
// Le lang affiché en SSR est la locale par défaut ; LocaleLangSync (côté client) ajuste à la locale réelle.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={routing.defaultLocale}
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
