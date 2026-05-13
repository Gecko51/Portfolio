'use client';

// Hook qui retourne true si l'utilisateur a activé prefers-reduced-motion.
// Réactif aux changements de préférence (matchMedia change listener).
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  // Démarre à false côté SSR pour éviter un hydration mismatch.
  // La valeur réelle est lue côté client au premier effect.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    // Compat : addEventListener est le standard moderne ; addListener restait pour Safari < 14.
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
