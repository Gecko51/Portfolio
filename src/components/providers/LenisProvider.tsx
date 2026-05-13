'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
// LenisProvider — smooth scroll global avec lerp 0.08 (PRD §8 et DEV-RULES §10).
// Désactivé si prefers-reduced-motion (DEV-RULES §10).
// Synchronise le ticker GSAP avec Lenis pour que ScrollTrigger reste cohérent (DEV-RULES §1).
import { type ReactNode, useEffect } from 'react';

// Type des props : uniquement les enfants React à envelopper.
type LenisProviderProps = {
  children: ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Respecter prefers-reduced-motion : pas de smooth scroll si l'user le demande.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Instanciation de Lenis avec lerp 0.08 pour un rendu fluide mais pas trop lent.
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    // Synchroniser Lenis et GSAP ScrollTrigger à chaque événement de scroll (DEV-RULES §1).
    lenis.on('scroll', ScrollTrigger.update);

    // Fonction de mise à jour enregistrée dans le ticker GSAP.
    // On la stocke pour pouvoir la retirer proprement dans le cleanup.
    // time est en secondes côté GSAP, Lenis attend des millisecondes → * 1000.
    const rafUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Ajouter la fonction au ticker GSAP pour synchroniser la boucle d'animation.
    gsap.ticker.add(rafUpdate);

    // Désactiver le lissage de lag GSAP pour éviter des décalages d'animation.
    gsap.ticker.lagSmoothing(0);

    // Cleanup : retirer le ticker et détruire l'instance Lenis pour éviter les fuites mémoire.
    // Appelé automatiquement si le composant est démonté (ex : Strict Mode double-mount en dev).
    return () => {
      gsap.ticker.remove(rafUpdate);
      lenis.destroy();
    };
  }, []);

  // Rendre les enfants sans nœud DOM supplémentaire.
  return <>{children}</>;
}
