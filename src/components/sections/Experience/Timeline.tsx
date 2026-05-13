'use client';

// Timeline — wrapper client de la section Experience.
// Mesure la progression du scroll dans le container via Framer useScroll
// (offset start end → end start, classique pour un fill 0-1 sur la traversée).
// Applique aussi le reveal scroll-triggered sur chaque [data-timeline-item] via GSAP.
import { useGSAP } from '@gsap/react';
import { useScroll } from 'framer-motion';
import { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type ReactNode, useRef } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

import { TimelineProgress } from './TimelineProgress';

type TimelineProps = {
  children: ReactNode;
};

export function Timeline({ children }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Progress 0-1 : 0 quand le top du container atteint le bottom du viewport,
  // 1 quand le bottom du container atteint le top du viewport.
  // Effet : le fill commence quand on arrive sur la section et finit quand on en sort.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'] as const,
  });

  // Reveal scroll par bloc — pattern AboutText (Phase 2).
  useGSAP(
    () => {
      if (reducedMotion) return;
      if (!containerRef.current) return;

      const items = containerRef.current.querySelectorAll('[data-timeline-item]');
      const triggers: ScrollTrigger[] = [];

      for (const el of items) {
        const tween = gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
        const trigger = tween.scrollTrigger;
        if (trigger) triggers.push(trigger);
      }

      return () => {
        for (const t of triggers) t.kill();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={containerRef} className="relative grid grid-cols-[auto_1fr] gap-6 md:gap-10">
      {/* Colonne 1 : progress line — sticky pour rester visible pendant la traversée. */}
      <div className="sticky top-24 self-start h-[calc(100vh-12rem)] w-px">
        <TimelineProgress progress={scrollYProgress} />
      </div>
      {/* Colonne 2 : items en stack vertical. */}
      <div className="flex flex-col gap-20 md:gap-28">{children}</div>
    </div>
  );
}
