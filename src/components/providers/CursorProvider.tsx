'use client';

// CursorProvider — monte le curseur custom uniquement sur desktop avec souris,
// si l'utilisateur n'a pas activé prefers-reduced-motion.
// Masque le curseur système via une classe CSS globale appliquée au document.
import { type ReactNode, useEffect } from 'react';

import { Cursor } from '@/components/ui/Cursor';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CursorProviderProps = {
  children: ReactNode;
};

export function CursorProvider({ children }: CursorProviderProps) {
  // Active uniquement si pointer fine (souris) ET pas de prefers-reduced-motion.
  const isFinePointer = useMediaQuery('(pointer: fine)');
  const prefersReducedMotion = useReducedMotion();
  const enabled = isFinePointer && !prefersReducedMotion;

  useEffect(() => {
    // Masque le curseur système quand le custom est actif.
    document.documentElement.style.cursor = enabled ? 'none' : '';
    return () => {
      document.documentElement.style.cursor = '';
    };
  }, [enabled]);

  return (
    <>
      {children}
      {enabled && <Cursor />}
    </>
  );
}
