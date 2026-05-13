// ProjectNav — barre de navigation en haut de la page détail projet.
// Back link vers la galerie home (#projects anchor pour scroll restore approximatif).
// Server component avec traductions.
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export async function ProjectNav() {
  const t = await getTranslations('Projects');

  return (
    <nav className="mx-auto max-w-5xl px-6 md:px-12 pt-32 pb-4">
      <Link
        href="/#projects"
        data-cursor-magnetic
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted hover:text-accent transition-colors"
      >
        {t('backToGallery')}
      </Link>
    </nav>
  );
}
