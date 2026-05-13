'use client';

// LocaleLangSync — synchronise <html lang> avec la locale active après hydratation.
// Nécessaire avec le pattern B (root layout possède <html> avec lang par défaut),
// pour que les pages /en aient bien lang="en" au runtime client.
// Limitation acceptée : le SSR initial servira toujours lang=defaultLocale ;
// les crawlers sans JS verront cette valeur statique. Pour Phase 5 on pourra optimiser via headers.
import { useEffect } from 'react';

type LocaleLangSyncProps = {
  locale: string;
};

export function LocaleLangSync({ locale }: LocaleLangSyncProps) {
  useEffect(() => {
    // Mute le lang attribute sur <html> sans re-render React (DOM direct).
    document.documentElement.lang = locale;
  }, [locale]);

  // Pas de rendu visuel — purement side-effect.
  return null;
}
