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
    // Référence temporelle pour rendre l'amortissement indépendant du framerate (60 vs 120 Hz).
    let lastTime = performance.now();
    // Scale courant du ring — amorti séparément (pas de transition CSS) pour rester fluide.
    let scale = 1;

    const onMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      // Si un élément magnetic est sous le curseur, capturer son rect pour attirer le ring.
      const el = (event.target as Element).closest('[data-cursor-magnetic]');
      magnetTarget = el ? el.getBoundingClientRect() : null;
    };

    const tick = (now: number) => {
      // Delta time clampé à 100 ms — évite un saut brutal après un onglet inactif.
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Magnetic : si l'utilisateur survole un élément taggué, le ring se centre vers le rect.
      let ringX = target.x;
      let ringY = target.y;
      if (magnetTarget) {
        ringX = magnetTarget.left + magnetTarget.width / 2;
        ringY = magnetTarget.top + magnetTarget.height / 2;
      }

      // Amortissement exponentiel — alpha = 1 - exp(-damping * dt).
      // damping 28 = suivi rapide et fluide, framerate-independent (même feel en 60/120/144 Hz).
      const alpha = 1 - Math.exp(-28 * dt);
      ring.x += (ringX - ring.x) * alpha;
      ring.y += (ringY - ring.y) * alpha;

      if (dotRef.current) {
        // Offset = moitié de la taille du dot (h-5 w-5 = 20px → -10) pour centrer sur la souris.
        dotRef.current.style.transform = `translate3d(${target.x - 10}px, ${target.y - 10}px, 0)`;
      }
      if (ringRef.current) {
        // Le scale magnetic est aussi amorti (alpha) — transition douce sans flag CSS.
        const scaleTarget = magnetTarget ? 1.4 : 1;
        scale += (scaleTarget - scale) * alpha;
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
        className="pointer-events-none fixed top-0 left-0 z-50 h-5 w-5 rounded-full bg-fg mix-blend-difference"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 h-9 w-9 rounded-full border border-fg/40 mix-blend-difference"
      />
    </>
  );
}
