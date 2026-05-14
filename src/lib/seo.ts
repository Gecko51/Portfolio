// Helpers SEO — centralise SITE_URL, alternates hreflang et builders metadata.
// Utilisé par toutes les pages qui exposent generateMetadata (home, project detail, etc).
import type { Metadata } from 'next';

import { type Locale, routing } from '@/i18n/routing';

// URL canonique du site — env var en prod Vercel, fallback localhost en dev.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Construit l'objet alternates.languages pour une page localisée.
// pathname doit être la partie après le préfixe locale (ex: '' pour home, '/projects/gecko-agent').
export function buildAlternates(pathname: string): NonNullable<Metadata['alternates']> {
  // Map locale → URL absolue (hreflang requiert URL complète).
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${pathname}`;
  }
  // x-default pointe vers la locale par défaut (recommandation Google).
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${pathname}`;
  return {
    canonical: `${SITE_URL}/${routing.defaultLocale}${pathname}`,
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
