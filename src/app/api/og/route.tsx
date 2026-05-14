// Route /api/og — génère une OG image dynamique (1200×630) avec ImageResponse (next/og).
// Edge runtime pour la perf (latence minimale, pas de cold start Node).
// Params query: ?title=...&subtitle=...&locale=fr|en
// Note : ImageResponse est inclus dans next/og depuis Next.js 13+ (pas besoin d'@vercel/og).
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

// Edge runtime obligatoire pour ImageResponse (perf + bundle minimal).
export const runtime = 'edge';

// Couleurs du design system (dupliquées ici car Edge runtime ne peut pas lire les CSS vars).
const COLORS = {
  bg: '#0A0A0A',
  fg: '#F5F5F5',
  fgMuted: '#8A8A8A',
  accent: '#FF5B1F',
} as const;

export async function GET(request: NextRequest) {
  // Extraction des params avec fallbacks safe.
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Guillaume Gay';
  const subtitle = searchParams.get('subtitle') ?? 'AI Builder & Full Stack Developer';

  // Pied de page fixe — identique pour toutes les locales (pas de traduction nécessaire).
  const footer = 'Portfolio · 2026';

  try {
    // L'API ImageResponse rend du JSX en image PNG via Satori.
    // Limitations : pas de Tailwind utilities, juste style inline. Pas de hex avec alpha, utiliser rgba.
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: COLORS.bg,
          padding: '80px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gradient ember en haut-droit — signature visuelle */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60%',
            height: '60%',
            background:
              'radial-gradient(ellipse at top right, rgba(255,91,31,0.25) 0%, transparent 60%)',
          }}
        />

        {/* Kicker mono */}
        <div
          style={{
            display: 'flex',
            color: COLORS.fgMuted,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          GUILLAUME GAY
        </div>

        {/* Spacer flex pour pousser le titre vers le bas */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* Titre principal */}
        <div
          style={{
            display: 'flex',
            color: COLORS.fg,
            fontSize: 96,
            lineHeight: 1.05,
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>

        {/* Sous-titre */}
        <div
          style={{
            display: 'flex',
            color: COLORS.fgMuted,
            fontSize: 40,
            marginTop: 24,
            lineHeight: 1.3,
          }}
        >
          {subtitle}
        </div>

        {/* Footer ligne mono */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 60,
            color: COLORS.fgMuted,
            fontSize: 20,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>{footer}</span>
          <span style={{ color: COLORS.accent }}>●</span>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    // Erreur de rendu Satori — retourner 500 avec message descriptif.
    const message = e instanceof Error ? e.message : 'Unknown error';
    return new Response(`Failed to generate OG image: ${message}`, { status: 500 });
  }
}
