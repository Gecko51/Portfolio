'use client';

// LocaleSwitcher — bascule FR ↔ EN en préservant le chemin courant (next-intl 4 useRouter localisé).
// Client component car il gère un événement click.
import { useLocale, useTranslations } from 'next-intl';

// DEV-RULES §10 : toujours importer depuis @/i18n/navigation, jamais depuis next/navigation.
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { track } from '@/lib/analytics';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Nav');

  // La locale cible est l'autre locale (logique binaire FR/EN).
  const targetLocale: Locale = locale === 'fr' ? 'en' : 'fr';

  const handleSwitch = () => {
    // Track le switch avant la navigation — Plausible sendBeacon est non-bloquant.
    track('locale_switch', { from: locale, to: targetLocale });
    // router.replace pour ne pas ajouter d'entrée dans l'historique de navigation.
    // DEV-RULES §10 : router localisé via @/i18n/navigation.
    router.replace(pathname, { locale: targetLocale });
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className="font-mono text-xs uppercase tracking-wide text-fg-muted hover:text-fg transition-colors"
      aria-label={t('switchToEnglish')}
    >
      {targetLocale.toUpperCase()}
    </button>
  );
}
