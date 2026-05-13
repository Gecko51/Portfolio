// Root layout — Next.js exige un root layout à la racine de app/.
// Pattern A (next-intl recommandé) : ce layout est un passthrough pur.
// C'est le [locale]/layout.tsx qui possède <html> et <body> pour gérer lang= dynamiquement.
// Note : Next.js peut émettre un avertissement sur l'absence de <html>/<body> ici — c'est attendu.
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

// Métadonnées globales du site.
export const metadata: Metadata = {
  title: 'Guillaume Gay — AI Builder & Full Stack Developer',
  description:
    "Portfolio de Guillaume Gay, AI Builder reconverti après 21 ans dans l'Armée de Terre. Founder Gecko Mind.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

// Passthrough : on délègue tout le rendu au layout localisé [locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
