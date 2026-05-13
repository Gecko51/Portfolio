'use client';

// HeroBackground — choisit entre HeroShader (R3F) et HeroFallback (CSS) selon prefers-reduced-motion.
// Le shader est lazy-loaded via next/dynamic pour ne pas peser au SSR ni sur les navigateurs sans WebGL.
import dynamic from 'next/dynamic';

import { useReducedMotion } from '@/hooks/useReducedMotion';

import { HeroFallback } from './HeroFallback';

// Lazy load du shader R3F — ssr:false car WebGL = browser only.
// loading: fallback rendu pendant le téléchargement du chunk shader.
const HeroShader = dynamic(
  () => import('./HeroShader').then((mod) => ({ default: mod.HeroShader })),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  },
);

export function HeroBackground() {
  const reducedMotion = useReducedMotion();

  // Si l'user demande reduced-motion → on sert le gradient statique.
  // Sinon → on charge le shader (avec HeroFallback pendant le chunk download).
  if (reducedMotion) {
    return <HeroFallback />;
  }

  return <HeroShader />;
}
