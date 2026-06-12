// StackMarquee — 3 lignes (Front-end/Back-end/Déploiement) défilant horizontalement en boucle infinie.
// Server component : pas de JS d'animation, tout est piloté par les @keyframes CSS (translateX -50%).
// Boucle sans saut : on rend DEUX moitiés strictement identiques ; -50% translate d'exactement une moitié.
type StackMarqueeProps = {
  rows: ReadonlyArray<{
    label: string;
    items: string;
  }>;
};

// Nombre minimal d'items par moitié. Garantit qu'une moitié dépasse la largeur du conteneur,
// sinon un « trou » vide apparaît dans le défilement sur écran large.
const MIN_ITEMS_PER_HALF = 12;
// Secondes de défilement par item → vitesse ~constante quelle que soit la longueur de la ligne.
const SECONDS_PER_ITEM = 6;

export function StackMarquee({ rows }: StackMarqueeProps) {
  return (
    <div className="flex flex-col gap-3 border-y border-border py-6 overflow-hidden">
      {rows.map((row) => {
        // Découpe la chaîne i18n "React · Next.js · ..." en items individuels (séparateur " · ").
        const items = row.items.split(' · ');
        // Répète les items assez de fois pour remplir la largeur (au moins MIN_ITEMS_PER_HALF par moitié).
        const reps = Math.ceil(MIN_ITEMS_PER_HALF / items.length);
        // Une moitié = la liste d'items répétée `reps` fois, mise à plat.
        const half = Array.from({ length: reps }, () => items).flat();
        // Durée inline ∝ nombre d'items → toutes les lignes défilent à vitesse similaire.
        const durationSeconds = half.length * SECONDS_PER_ITEM;

        return (
          <div key={row.label} className="flex items-center gap-6 text-fg-muted">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {row.label}
            </span>
            <div className="flex-1 overflow-hidden">
              {/* w-max : largeur de l'élément = largeur du contenu → translateX(-50%) = exactement une moitié. */}
              {/* animationDuration inline : surcharge le 30s de la classe pour normaliser la vitesse. */}
              <div
                className="animate-marquee flex w-max whitespace-nowrap text-sm font-mono"
                style={{ animationDuration: `${durationSeconds}s` }}
              >
                {/* Deux moitiés identiques (copy 0 + copy 1). */}
                {([0, 1] as const).map((copy) =>
                  half.map((name, i) => {
                    // a11y : on ne laisse lisible que la 1re occurrence réelle de chaque item.
                    // Le reste (répétitions + 2e moitié) est décoratif → aria-hidden.
                    const readable = copy === 0 && i < items.length;
                    return (
                      <span
                        key={`${copy}-${i}`}
                        className="inline-flex items-center"
                        aria-hidden={readable ? undefined : true}
                      >
                        <span>{name}</span>
                        {/* Séparateur décoratif ; mx-8 = noms nettement plus espacés qu'avant. */}
                        <span className="mx-8 opacity-40" aria-hidden="true">
                          ·
                        </span>
                      </span>
                    );
                  }),
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
