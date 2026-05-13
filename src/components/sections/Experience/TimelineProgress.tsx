'use client';

// TimelineProgress — ligne verticale qui suit la progression du scroll dans la section Experience.
// Position relative dans son conteneur (le parent Timeline gère le sticky positioning).
// `progress` est une MotionValue 0-1 mesurée par Timeline.tsx (parent) via Framer useScroll.
import { type MotionValue, motion, useTransform } from 'framer-motion';

type TimelineProgressProps = {
  // Progress 0-1 du scroll dans la section (mesuré par le parent Timeline).
  progress: MotionValue<number>;
};

export function TimelineProgress({ progress }: TimelineProgressProps) {
  // scaleY 0 → 1 selon progress. transform-origin top pour fill du haut vers le bas.
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="relative h-full">
      {/* Trait neutre (fond) — 1px de large, full height. */}
      <div aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-border" />
      {/* Trait actif (accent) — fill animé via scaleY. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-0 top-0 h-full w-px bg-accent"
      />
    </div>
  );
}
