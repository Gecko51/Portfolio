// HeroFallback — gradient CSS statique imitant l'ember.
// Server component pur, rendu :
//   - quand prefers-reduced-motion est actif (DEV-RULES §10)
//   - en SSR initial avant que HeroShader (lazy + ssr:false) ne se monte
//   - si WebGL échoue (très rare, mais le composant reste valide)
export function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255, 91, 31, 0.35), transparent 70%), linear-gradient(to top, #0a0a0a 0%, #141414 100%)',
      }}
    />
  );
}
