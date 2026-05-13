'use client';

// AboutText — 3 paragraphes éditoriaux + kicker, reveal mot par mot au scroll.
// GSAP ScrollTrigger : déclenché quand 30% du viewport atteint, toggle play one-shot.
// PRD §3 Module 3.
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import SplitType from 'split-type';

import { useReducedMotion } from '@/hooks/useReducedMotion';

type AboutTextProps = {
  kicker: string;
  paragraphs: readonly string[];
};

export function AboutText({ kicker, paragraphs }: AboutTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      if (!containerRef.current) return;

      // Split chaque paragraphe en mots.
      const paragraphEls = containerRef.current.querySelectorAll('[data-split="paragraph"]');
      const splits: SplitType[] = [];

      for (const el of paragraphEls) {
        const split = new SplitType(el as HTMLElement, { types: 'words' });
        splits.push(split);

        if (!split.words) continue;

        gsap.from(split.words, {
          opacity: 0.15,
          y: 8,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.015,
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });
      }

      return () => {
        // Revert chaque instance SplitType pour restaurer le DOM original.
        for (const s of splits) {
          s.revert();
        }
        // Kill uniquement les ScrollTriggers de ce composant (scope via useGSAP suffit normalement,
        // mais on est explicite pour éviter les fuites en cas de StrictMode double-mount).
        const triggersToKill = ScrollTrigger.getAll().filter((t) => {
          const trigger = t.trigger;
          return trigger instanceof Element && containerRef.current?.contains(trigger);
        });
        for (const t of triggersToKill) {
          t.kill();
        }
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{kicker}</p>
      {paragraphs.map((paragraph, idx) => (
        <p
          // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are stable static content
          key={idx}
          data-split="paragraph"
          className="font-display text-2xl md:text-3xl leading-[1.4] tracking-tight"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
