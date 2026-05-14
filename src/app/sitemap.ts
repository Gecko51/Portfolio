// Sitemap — convention Next 15+ (src/app/sitemap.ts).
// Génère sitemap.xml au build avec toutes les pages localisées (home + projects FR/EN).
// alternates.languages permet à Google d'indexer toutes les versions hreflang.
import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { getProjectSlugs } from '@/lib/projects';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Helper pour construire les alternates languages d'une page.
  const buildLanguages = (path: string): Record<string, string> => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = `${SITE_URL}/${locale}${path}`;
    }
    return languages;
  };

  // Entrées home pour chaque locale (priorité maximale).
  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: { languages: buildLanguages('') },
  }));

  // Entrées projets — slugs lus depuis les MDX de chaque locale.
  // IMPORTANT: les slugs MDX doivent être strictement identiques entre src/content/projects/fr/ et /en/.
  // Si un projet existe dans une seule locale, l'URL pour l'autre locale aboutira à 404.
  // Pour MVP : on assume la parité. À muscler si divergence : faire une union des deux locales.
  const slugs = await getProjectSlugs(routing.defaultLocale);
  const projectEntries: MetadataRoute.Sitemap = slugs.flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/projects/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: buildLanguages(`/projects/${slug}`) },
    })),
  );

  return [...homeEntries, ...projectEntries];
}
