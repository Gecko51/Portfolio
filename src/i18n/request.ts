// Configuration par requête — next-intl charge les messages JSON pour la locale active.
// Ce fichier est le point d'entrée déclaré dans next.config.ts via createNextIntlPlugin.
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale est une Promise dans next-intl 4 (App Router avec params async)
  const requested = await requestLocale;

  // Si la locale reçue n'est pas valide, on bascule sur la locale par défaut (fr)
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // Import dynamique du fichier JSON de messages correspondant à la locale
    // Note : les fichiers fr.json et en.json sont des stubs vides (Task 6 les remplira)
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
