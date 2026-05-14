// Plausible analytics — script cookieless, RGPD-friendly (pas de bandeau requis).
// Activé uniquement si NEXT_PUBLIC_PLAUSIBLE_DOMAIN est défini (skip en local dev).
// Utilise next/script avec strategy 'afterInteractive' — chargé après hydratation, sans bloquer.
import Script from 'next/script';

export function Plausible() {
  // Domain Plausible (ex: guillaumegay.fr) — undefined en local → no-op complet.
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <>
      {/* Script Plausible en mode "manual" — permet d'appeler window.plausible(event) custom
          depuis analytics.ts sans que le script auto-track les pageviews double. */}
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.manual.js"
        strategy="afterInteractive"
      />
      {/* Init manuelle : crée une queue window.plausible si le script externe n'est pas encore chargé,
          puis push le premier pageview. Plausible gère ensuite les navigations SPA via History API. */}
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };
plausible('pageview');`}
      </Script>
    </>
  );
}
