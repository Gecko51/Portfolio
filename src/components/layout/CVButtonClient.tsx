'use client';

// Wrapper client minimal pour CVButton — ajoute le tracking analytics au téléchargement PDF.
// CVButton est un server component (lecture de locale côté serveur) ; cette couche client
// s'occupe uniquement du onClick + track, sans dupliquer la logique métier.
import { track } from '@/lib/analytics';

type CVButtonClientProps = {
  // URL du fichier PDF à télécharger (construite côté server dans CVButton).
  href: string;
  // Libellé traduit du bouton (passé depuis CVButton server).
  label: string;
  // Locale active (fr ou en) — envoyée comme propriété Plausible pour filtrer les stats.
  locale: string;
};

export function CVButtonClient({ href, label, locale }: CVButtonClientProps) {
  // Track l'événement avant que le navigateur déclenche le téléchargement.
  // Plausible utilise sendBeacon en interne → pas bloquant pour la navigation.
  const handleClick = () => {
    track('cv_download', { locale });
  };

  return (
    <a
      href={href}
      download
      onClick={handleClick}
      className="font-mono text-xs uppercase tracking-wide text-fg hover:text-accent transition-colors"
    >
      {label}
    </a>
  );
}
