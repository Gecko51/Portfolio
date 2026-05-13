'use client';

// EmberMesh — composant R3F qui rend le quad full-screen + shaderMaterial avec uTime animé.
// Utilisé à l'intérieur de <Canvas> dans HeroShader.tsx (Task 9).
// Cf. PRD §3 Module 2 (Hero shader) et DEV-RULES §1 (R3F isolation).
import type {} from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { ShaderMaterial } from 'three';

import { emberFrag, emberVert } from '@/components/shaders/ember';

export function EmberMesh() {
  const materialRef = useRef<ShaderMaterial>(null);

  // Uniforms — uTime sera muté in-place par useFrame, useMemo évite la recréation à chaque render.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  // Met à jour uTime à chaque frame R3F.
  // On vérifie l'existence de uTime avant mutation car Three.js type uniforms comme un objet indexé.
  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (mat?.uniforms.uTime) {
      mat.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh>
      {/* Quad qui couvre tout le viewport — orthographic camera fournie par <Canvas orthographic>. */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={emberVert}
        fragmentShader={emberFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
}
