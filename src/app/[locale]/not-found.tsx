// Page 404 sobre — Phase 1 minimal. Une version enrichie arrivera plus tard.
// RSC pur, pas de traduction nécessaire ici (message simple et universel).
export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-4">
      {/* Code erreur en police mono pour l'esthétique technique */}
      <p className="text-fg-muted font-mono">404</p>
      <p>Page introuvable.</p>
    </section>
  );
}
