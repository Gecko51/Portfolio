// Tag — pill réutilisable pour les stack tags (Phase 3 Experience, Phase 4 Projects).
// Server component pur (pas de state). Variante visuelle minimaliste, cohérente design system.
import type { ReactNode } from 'react';

type TagProps = {
  children: ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-bg-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-muted">
      {children}
    </span>
  );
}
