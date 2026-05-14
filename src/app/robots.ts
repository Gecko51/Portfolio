// Robots.txt — convention Next 15+ (src/app/robots.ts).
// Autorise toutes les routes publiques et déclare le sitemap.
import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // /api/og doit être accessible aux crawlers (LinkedIn, Slack, X) pour les link previews.
        // La règle plus spécifique /api/og prime sur le disallow /api/ selon le standard robots.
        allow: ['/', '/api/og'],
        // Bloquer les autres routes /api/ (internes Next.js) mais pas /api/og.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
