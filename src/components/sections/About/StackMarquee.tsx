// StackMarquee — 3 lignes (Front-end/Back-end/Déploiement) défilant horizontalement en boucle infinie.
// Server component : pas de JS d'animation, tout est en CSS @keyframes.
// Pattern : on duplique le contenu pour avoir une translation continue sans saut visible.
type StackMarqueeProps = {
  rows: ReadonlyArray<{
    label: string;
    items: string;
  }>;
};

export function StackMarquee({ rows }: StackMarqueeProps) {
  return (
    <div className="flex flex-col gap-3 border-y border-border py-6 overflow-hidden">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-6 text-fg-muted">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {row.label}
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee flex gap-6 whitespace-nowrap text-sm font-mono">
              {/* Le contenu est dupliqué pour que la translation -50% boucle sans saut. */}
              <span>{row.items}</span>
              <span aria-hidden="true">·</span>
              <span aria-hidden="true">{row.items}</span>
              <span aria-hidden="true">·</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
