// CVButton — lien de téléchargement du CV PDF selon la locale active.
// Server component asynchrone : lit la locale + les traductions côté serveur,
// puis délègue le rendu + tracking à CVButtonClient (client component).
import { getLocale, getTranslations } from 'next-intl/server';

import { CVButtonClient } from './CVButtonClient';

export async function CVButton() {
  // Lecture de la locale côté serveur (disponible avec next-intl v4 + App Router).
  const locale = await getLocale();
  const t = await getTranslations('Nav');

  // Le PDF est servi statiquement depuis /public/cv/.
  const fileName = locale === 'fr' ? 'Guillaume-Gay-CV-FR.pdf' : 'Guillaume-Gay-CV-EN.pdf';

  // Passage des données au wrapper client — seule CVButtonClient gère le onClick + track.
  return <CVButtonClient href={`/cv/${fileName}`} label={t('downloadCv')} locale={locale} />;
}
