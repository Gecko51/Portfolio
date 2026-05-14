// Robots.txt — convention Next 15+ (src/app/robots.ts).
// Autorise toutes les routes publiques et déclare le sitemap.
import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Pas d'admin/dashboard à protéger sur ce portfolio statique.
        // /api/og est accessible publiquement (utilisé par les crawlers pour les previews sociales).
        // On disallow uniquement les chemins d'internals Next (_next/).
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
