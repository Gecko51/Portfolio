'use client';

// Header flottant scroll-aware — se cache au scroll vers le bas, réapparaît au scroll vers le haut.
// PRD §3 Module 1 : header minimal avec logo + actions.
// Reçoit les boutons (CV, LocaleSwitcher) via le prop `actions` pour respecter la frontière server/client :
// CVButton est un Server Component async, il ne peut pas être importé directement dans un Client Component.
// Le magnetic effect et le curseur custom arrivent en Phase 2.
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';

// DEV-RULES §10 : toujours importer Link depuis @/i18n/navigation.
import { Link } from '@/i18n/navigation';

type HeaderProps = {
  // Slot pour les actions à droite (CVButton + LocaleSwitcher) — passés depuis le layout server.
  actions: ReactNode;
};

export function Header({ actions }: HeaderProps) {
  // useScroll de framer-motion : suit la position de scroll de la page.
  const { scrollY } = useScroll();
  // État local : le header est-il caché (scrollé vers le bas) ?
  const [hidden, setHidden] = useState(false);
  const t = useTranslations('Nav');

  // Logique scroll-aware : compare la position courante à la précédente.
  // Seuil à 100px pour éviter le flicker au tout début du scroll.
  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    // En haut de page : toujours visible.
    if (current < 100) {
      setHidden(false);
      return;
    }
    // Scroll vers le bas → cacher. Scroll vers le haut → afficher.
    setHidden(current > previous);
  });

  return (
    <>
      {/* Lien d'accessibilité "skip to content" — DEV-RULES §2 : invisible sauf au focus clavier. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-bg-elevated focus:text-fg focus:px-4 focus:py-2 focus:rounded"
      >
        {t('skipToContent')}
      </a>

      {/* motion.header : animation de translation Y selon l'état hidden. */}
      <motion.header
        animate={hidden ? 'hidden' : 'visible'}
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-bg/80 backdrop-blur-sm border-b border-border"
      >
        {/* Logo / initiales — lien vers la page d'accueil localisée. */}
        <Link href="/" className="font-display text-xl tracking-tight">
          GG
        </Link>

        {/* Zone actions à droite : CV + LocaleSwitcher injectés depuis le layout. */}
        <nav className="flex items-center gap-6">{actions}</nav>
      </motion.header>
    </>
  );
}
