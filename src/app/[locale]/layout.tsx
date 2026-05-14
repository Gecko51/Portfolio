// Layout localisé — pattern B : ne rend PAS <html>/<body> (le root layout les possède).
// Rôle : validation de la locale, setRequestLocale pour SSG, providers, Header, main, Footer.
// La langue côté client est synchronisée via <LocaleLangSync /> (DOM direct sur document.documentElement).
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { Plausible } from '@/components/analytics/Plausible';
import { CVButton } from '@/components/layout/CVButton';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { CursorProvider } from '@/components/providers/CursorProvider';
import { GsapProvider } from '@/components/providers/GsapProvider';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { LocaleLangSync } from '@/components/providers/LocaleLangSync';
import { routing } from '@/i18n/routing';

// Pré-génère les routes statiques pour chaque locale supportée (DEV-RULES §1 : RSC par défaut).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Props du layout : params est une Promise (Next 15+ App Router).
type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Next 15+ : params est une Promise → await obligatoire avant d'utiliser ses valeurs.
  const { locale } = await params;

  // Validation de la locale — 404 si la locale n'est pas dans la liste supportée.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Active le rendu statique pour cette locale (obligatoire avec next-intl v4 + App Router).
  setRequestLocale(locale);

  return (
    // NextIntlClientProvider rend les traductions disponibles côté Client Components.
    <NextIntlClientProvider>
      {/* LocaleLangSync ajuste <html lang> côté client après hydratation pour matcher la locale réelle. */}
      <LocaleLangSync locale={locale} />
      {/* GsapProvider enregistre ScrollTrigger une seule fois au montage. */}
      <GsapProvider>
        {/* LenisProvider active le smooth scroll global synchronisé avec GSAP. */}
        <LenisProvider>
          {/* CursorProvider — monte le curseur custom uniquement sur desktop avec souris,
              si l'utilisateur n'a pas activé prefers-reduced-motion. */}
          <CursorProvider>
            {/* Header scroll-aware — actions (CVButton, LocaleSwitcher) passés en prop depuis le server layout.
                Composition server/client : CVButton est async server, Header est client. */}
            <Header
              actions={
                <>
                  <CVButton />
                  <LocaleSwitcher />
                </>
              }
            />
            {/* id="main" cible du lien "skip to content" dans le Header. */}
            <main id="main">{children}</main>
            <Footer />
          </CursorProvider>
        </LenisProvider>
      </GsapProvider>
      {/* Plausible monté hors des providers d'animation pour éviter toute interaction.
          No-op si NEXT_PUBLIC_PLAUSIBLE_DOMAIN n'est pas défini (dev local). */}
      <Plausible />
    </NextIntlClientProvider>
  );
}
