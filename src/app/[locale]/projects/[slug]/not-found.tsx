// 404 propre pour un slug projet inconnu.
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('Projects');
  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <p className="font-mono text-fg-muted">404</p>
      <p className="font-display text-2xl text-center">Project introuvable.</p>
      <Link
        href="/#projects"
        className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-fg transition-colors"
      >
        {t('backToGallery')}
      </Link>
    </section>
  );
}
