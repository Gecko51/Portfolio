'use client';

// HeroShader — wrapper R3F Canvas, full-screen absolu derrière le contenu Hero.
// Lazy-loaded via next/dynamic depuis HeroBackground (ssr: false) pour éviter le poids R3F au SSR.
import { Canvas } from '@react-three/fiber';

import { EmberMesh } from './EmberMesh';

export function HeroShader() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {/* Camera orthographic : le quad [-1,1]x[-1,1] couvre exactement le viewport. */}
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: false }}
      >
        <EmberMesh />
      </Canvas>
    </div>
  );
}
