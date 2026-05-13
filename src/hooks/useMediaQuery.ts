'use client';

// Hook qui matche une media query CSS et reste réactif.
// Exemples : useMediaQuery('(pointer: fine)') → true sur desktop avec souris.
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  // false par défaut côté SSR.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
