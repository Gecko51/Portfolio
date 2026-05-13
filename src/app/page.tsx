// Root page — capture `/` (sans préfixe locale) et redirige vers la locale par défaut.
// Le middleware next-intl avec localePrefix:'always' ne génère pas toujours cette redirection
// sur Next 16 — ce fichier garantit le comportement attendu.
// Pour une détection Accept-Language plus fine, voir Phase 5 (à optimiser via headers()).
import { redirect } from 'next/navigation';

import { routing } from '@/i18n/routing';

export default function RootPage() {
  // Redirect server-side : pas de flicker côté client, status 307.
  redirect(`/${routing.defaultLocale}`);
}
