// Routing i18n — définition des locales supportées et de la locale par défaut.
// Cf. DEV-RULES §10 : importer Link/useRouter depuis @/i18n/navigation, jamais next/navigation.
import { defineRouting } from 'next-intl/routing';

// Tableau des locales disponibles dans le projet (fr = français, en = anglais)
export const LOCALES = ['fr', 'en'] as const;

// Type union dérivé du tableau : 'fr' | 'en'
export type Locale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'fr',
  // localePrefix 'always' → /fr/... et /en/... toujours explicites dans l'URL
  localePrefix: 'always',
});
