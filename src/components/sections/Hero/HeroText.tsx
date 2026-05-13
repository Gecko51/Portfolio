'use client';

// HeroText — nom XL en typo display + tagline, reveal char-by-char au mount via GSAP + split-type.
// Si prefers-reduced-motion : pas d'animation, le texte est visible direct.
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import SplitType from 'split-type';

import { useReducedMotion } from '@/hooks/useReducedMotion';

type HeroTextProps = {
  name: string;
  tagline: string;
};

export function HeroText({ name, tagline }: HeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      // useGSAP : cleanup automatique des animations à l'unmount.
      // En reduced-motion : on s'arrête tôt, le texte reste visible sans split.
      if (reducedMotion) return;

      const nameEl = containerRef.current?.querySelector('[data-split="name"]');
      const taglineEl = containerRef.current?.querySelector('[data-split="tagline"]');
      if (!nameEl || !taglineEl) return;

      // Split en chars pour le nom, en mots pour la tagline.
      const nameSplit = new SplitType(nameEl as HTMLElement, { types: 'chars' });
      const taglineSplit = new SplitType(taglineEl as HTMLElement, { types: 'words' });

      // Animation timeline : nom puis tagline, easing custom.
      // On vérifie que les tableaux chars/words ne sont pas null avant d'animer.
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      if (nameSplit.chars) {
        tl.from(nameSplit.chars, {
          y: '100%',
          opacity: 0,
          duration: 1,
          stagger: 0.02,
        });
      }

      if (taglineSplit.words) {
        tl.from(
          taglineSplit.words,
          {
            y: '50%',
            opacity: 0,
            duration: 0.8,
            stagger: 0.04,
          },
          '-=0.5',
        );
      }

      // Cleanup explicite des splits — useGSAP gère le tween, pas le DOM split.
      return () => {
        nameSplit.revert();
        taglineSplit.revert();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center gap-6 text-center">
      <h1
        data-split="name"
        className="font-display text-[clamp(3.5rem,12vw,12rem)] leading-[0.9] tracking-tight italic"
      >
        {name}
      </h1>
      <p
        data-split="tagline"
        className="font-mono text-sm md:text-base uppercase tracking-[0.2em] text-fg-muted"
      >
        {tagline}
      </p>
    </div>
  );
}
