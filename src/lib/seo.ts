// Helpers SEO — centralise SITE_URL, alternates hreflang et builders metadata.
// Utilisé par toutes les pages qui exposent generateMetadata (home, project detail, etc).
import type { Metadata } from 'next';

import { type Locale, routing } from '@/i18n/routing';

// URL canonique du site — env var en prod Vercel, fallback localhost en dev.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Construit l'objet alternates.languages pour une page localisée.
// pathname doit être la partie après le préfixe locale (ex: '' pour home, '/projects/gecko-agent').
// locale optionnel : si fourni, la canonical pointe vers cette locale (recommandation Google —
// chaque page pointe vers sa propre URL, hreflang gère les alternates).
// Si absent, fallback vers la locale par défaut (comportement legacy).
export function buildAlternates(
  pathname: string,
  locale?: Locale,
): NonNullable<Metadata['alternates']> {
  // Locale pour la canonical : on prend celle de la page courante si disponible.
  const canonicalLocale = locale ?? routing.defaultLocale;
  // Map locale → URL absolue (hreflang requiert URL complète).
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}${pathname}`;
  }
  // x-default pointe toujours vers la locale par défaut (recommandation Google).
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${pathname}`;
  return {
    canonical: `${SITE_URL}/${canonicalLocale}${pathname}`,
    languages,
  };
}

// Construit une URL OG dynamique vers /api/og avec params.
export function buildOgUrl(params: { title: string; subtitle?: string; locale: Locale }): string {
  const url = new URL('/api/og', SITE_URL);
  url.searchParams.set('title', params.title);
  if (params.subtitle) url.searchParams.set('subtitle', params.subtitle);
  url.searchParams.set('locale', params.locale);
  return url.toString();
}
