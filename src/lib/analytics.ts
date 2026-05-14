// Helper analytics — wrapper typé autour de window.plausible (cookieless).
// No-op gracieux si Plausible n'est pas chargé (dev local, prefers-reduced-motion d'analytics, etc).
// Ref: https://plausible.io/docs/custom-event-goals

// Type minimal de l'API window.plausible exposée par le script Plausible.
type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | number | boolean> },
) => void;

// Étend Window pour TypeScript — pas de any (DEV-RULES §10).
declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

// Track event custom — appelé sur les CTAs (mailto, LinkedIn, CV download, etc).
export function track(event: string, props?: Record<string, string | number | boolean>): void {
  // SSR safety : window n'existe pas côté serveur, on no-op.
  if (typeof window === 'undefined') return;
  // Si Plausible script pas (encore) chargé, on no-op silencieusement.
  if (typeof window.plausible !== 'function') return;
  window.plausible(event, props ? { props } : undefined);
}
