'use client';

// ProjectsGallery — wrapper client de la galerie de projets.
// Desktop (>= md + pointer fine) : section pinnée pendant N viewports, strip horizontal translaté via GSAP ScrollTrigger.
// Mobile / coarse pointer : scroll horizontal natif avec scroll-snap (pas de pin, plus accessible).
// Le mode est choisi via useMediaQuery (DEV-RULES §10 anti-scroll-jacking).
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type ReactNode, useRef } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type ProjectsGalleryProps = {
  // Cards rendues côté server, injectées en children pour préserver RSC.
  children: ReactNode;
  // Nombre de cards (utile pour les dépendances du useGSAP).
  projectCount: number;
};

export function ProjectsGallery({ children, projectCount }: ProjectsGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Desktop = viewport >= md (768px) AND pointer fine (souris). Sinon on bascule sur le snap mobile.
  const isDesktop = useMediaQuery('(min-width: 768px) and (pointer: fine)');
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      // Pas de pin si mobile, coarse pointer, ou si l'utilisateur préfère moins de mouvement.
      if (!isDesktop) return;
      if (reducedMotion) return;
      if (!containerRef.current || !stripRef.current) return;

      const strip = stripRef.current;

      // Distance à translater = largeur totale du strip - largeur du viewport.
      // Calculée en runtime pour invalidateOnRefresh (resize, orientation, devtools).
      const getDistance = () => strip.scrollWidth - window.innerWidth;

      // Pin de la section pendant que le scroll vertical pilote la translation horizontale.
      // scrub: 1 → adoucit la translation (1s lag, feel smooth cohérent avec Lenis).
      const tween = gsap.to(strip, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        // Cleanup explicite : tue le ScrollTrigger ET le tween.
        // Évite les fuites mémoire en mode StrictMode (double-mount React).
        tween.scrollTrigger?.kill();
        tween.kill();
        // Refresh global pour que les autres triggers se repositionnent correctement.
        ScrollTrigger.refresh();
      };
    },
    { scope: containerRef, dependencies: [isDesktop, reducedMotion, projectCount] },
  );

  // Classe du strip adaptée selon desktop ou mobile.
  // Desktop : flex inline gap, padding horizontal, will-change-transform pour perf GPU (GSAP gère la translation).
  // Mobile : overflow-x scroll avec snap-mandatory, scroll-px pour la visibilité du premier item.
  const stripClassName = isDesktop
    ? 'flex gap-6 md:gap-10 will-change-transform px-6 md:px-12'
    : 'flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-6';

  return (
    // Wrapper container :
    // Desktop → overflow:hidden pour masquer le débordement horizontal pendant la translation GSAP.
    // Mobile → pas d'overflow override, le scroll natif gère l'affichage.
    <div ref={containerRef} className={isDesktop ? 'overflow-hidden' : ''}>
      <div ref={stripRef} className={stripClassName}>
        {children}
      </div>
    </div>
  );
}
