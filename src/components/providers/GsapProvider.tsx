'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// GsapProvider — enregistre les plugins GSAP (ScrollTrigger).
// SplitText sera ajouté quand utilisé (Phase 2 Hero). Plugin payant : vérifier licence avant.
import { type ReactNode, useEffect } from 'react';

type GsapProviderProps = {
  children: ReactNode;
};

export function GsapProvider({ children }: GsapProviderProps) {
  useEffect(() => {
    // Enregistrement plugins GSAP côté client uniquement.
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return <>{children}</>;
}
