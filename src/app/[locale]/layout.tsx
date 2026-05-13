// Layout localisé — possède <html lang> et <body>.
// Pattern A next-intl : ce layout est propriétaire de la structure HTML complète.
// Providers GSAP et Lenis montés ici (Tasks 10-11). Header/Footer en Tasks 12-13.
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { CVButton } from '@/components/layout/CVButton';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { GsapProvider } from '@/components/providers/GsapProvider';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { routing } from '@/i18n/routing';
import { fontBody, fontDisplay, fontMono } from '@/styles/fonts';

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
    // lang= positionné dynamiquement selon la locale active.
    // Les variables CSS de polices sont injectées via les classes .variable de next/font.
    <html
      lang={locale}
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable}`}
    >
      <body>
        {/* NextIntlClientProvider rend les traductions disponibles côté Client Components. */}
        <NextIntlClientProvider>
          {/* GsapProvider enregistre ScrollTrigger une seule fois au montage. */}
          <GsapProvider>
            {/* LenisProvider active le smooth scroll global synchronisé avec GSAP. */}
            <LenisProvider>
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
            </LenisProvider>
          </GsapProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
