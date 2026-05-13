// CVButton — lien de téléchargement du CV PDF selon la locale active.
// Server component asynchrone : pas de state client, lit la locale via getLocale().
import { getLocale, getTranslations } from 'next-intl/server';

export async function CVButton() {
  // Lecture de la locale côté serveur (disponible avec next-intl v4 + App Router).
  const locale = await getLocale();
  const t = await getTranslations('Nav');

  // Le PDF est servi statiquement depuis /public/cv/. Les fichiers seront créés en Task 14.
  const fileName = locale === 'fr' ? 'Guillaume-Gay-CV-FR.pdf' : 'Guillaume-Gay-CV-EN.pdf';

  return (
    <a
      href={`/cv/${fileName}`}
      download
      className="font-mono text-xs uppercase tracking-wide text-fg hover:text-accent transition-colors"
    >
      {t('downloadCv')}
    </a>
  );
}
