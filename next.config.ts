// Configuration Next.js — plugin next-intl + headers de sécurité durcis (Phase 5).
// CSP autorise : Plausible (script + connect), JSON-LD inline, images data:, OG.
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Construction CSP — chaque directive sur sa propre ligne pour lisibilité et maintenance.
// 'unsafe-inline' sur script-src est nécessaire pour :
//   - JSON-LD Person (balise <script type="application/ld+json"> inline)
//   - Script d'init Plausible (queue window.plausible avant chargement du script externe)
// Mitigé par les autres restrictions (no eval, frame-ancestors none, object-src none).
// Passage à une nonce/hash strategy envisageable en v2 avec Next.js Middleware.
const cspDirectives = [
  "default-src 'self'",
  // Plausible script externalisé ; 'unsafe-inline' requis pour JSON-LD + init Plausible inline.
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  // Styles inline tolérés (Tailwind v4 utilities injectées au runtime + Framer Motion inline styles).
  "style-src 'self' 'unsafe-inline'",
  // Images : self + data: pour SVG inline + blob: pour Next/Image blur placeholders.
  "img-src 'self' data: blob:",
  // Fonts self-hosted via next/font (fichiers woff2 servis depuis /_next/static/media/).
  "font-src 'self' data:",
  // Plausible utilise sendBeacon vers plausible.io → doit être dans connect-src.
  "connect-src 'self' https://plausible.io",
  // Pas d'iframes tierces dans ce portfolio.
  "frame-src 'none'",
  // Anti-clickjacking — empêche l'intégration dans un iframe externe.
  "frame-ancestors 'none'",
  // Restreint la base URL aux ressources self (protection relative URL hijacking).
  "base-uri 'self'",
  // Restreint les actions de formulaire — pas de formulaire externe.
  "form-action 'self'",
  // Bloque Flash, Java applets et autres plugins legacy.
  "object-src 'none'",
  // Force HTTPS en production (no-op en localhost).
  'upgrade-insecure-requests',
].join('; ');

// Headers de sécurité appliqués à toutes les routes (DEV-RULES §7).
const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // interest-cohort=() désactive FLoC/Topics API Google.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Appliqué à toutes les routes publiques, y compris /api/og.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
