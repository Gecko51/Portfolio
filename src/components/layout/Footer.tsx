// Footer minimal — crédit Claude Code + version build hash injecté au build.
// Server component : pas de state, lit les traductions via getTranslations.
import { getTranslations } from 'next-intl/server';

// Hash de build injecté via env var au build Vercel (NEXT_PUBLIC_BUILD_HASH).
// Fallback "dev" en local. Slice à 7 chars pour matcher git --short.
const buildHash = (process.env.NEXT_PUBLIC_BUILD_HASH ?? 'dev').slice(0, 7);

export async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="border-t border-border px-6 py-6 text-xs font-mono text-fg-muted flex flex-col sm:flex-row items-center justify-between gap-2">
      <span>{t('credit')}</span>
      <span className="flex items-center gap-2">
        <a
          href="https://claude.com/claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg transition-colors"
        >
          {t('builtWith')}
        </a>
        <span aria-hidden>·</span>
        <span>{t('version', { hash: buildHash })}</span>
      </span>
    </footer>
  );
}
