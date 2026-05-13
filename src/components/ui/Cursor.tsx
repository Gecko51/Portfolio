'use client';

// Cursor — curseur custom desktop.
// Deux éléments superposés : dot (suit instantanément) et ring (suit avec lerp + magnetic).
// Le composant écoute mousemove en RAF pour éviter le re-render React à chaque pixel.
import { useEffect, useRef } from 'react';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Position cible (souris réelle) et position courante du ring (lerpée).
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let magnetTarget: DOMRect | null = null;
    let raf = 0;

    const onMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      // Si un élément magnetic est sous le curseur, capturer son rect pour attirer le ring.
      const el = (event.target as Element).closest('[data-cursor-magnetic]');
      magnetTarget = el ? el.getBoundingClientRect() : null;
    };

    const tick = () => {
      // Magnetic : si l'utilisateur survole un élément taggué, le ring se centre vers le rect.
      let ringX = target.x;
      let ringY = target.y;
      if (magnetTarget) {
        ringX = magnetTarget.left + magnetTarget.width / 2;
        ringY = magnetTarget.top + magnetTarget.height / 2;
      }

      // Lerp 0.15 — assez snappy pour rester réactif sans saccade.
      ring.x += (ringX - ring.x) * 0.15;
      ring.y += (ringY - ring.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x - 6}px, ${target.y - 6}px, 0)`;
      }
      if (ringRef.current) {
        const scale = magnetTarget ? 1.4 : 1;
        ringRef.current.style.transform = `translate3d(${ring.x - 18}px, ${ring.y - 18}px, 0) scale(${scale})`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Le curseur custom est purement décoratif → aria-hidden + pointer-events:none. */}
      {/* Le curseur système est masqué par CursorProvider (Task 5) via cursor:none sur <html>. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 h-3 w-3 rounded-full bg-fg mix-blend-difference"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 h-9 w-9 rounded-full border border-fg/40 mix-blend-difference transition-transform duration-200"
      />
    </>
  );
}
