// Page d'accueil — toutes les sections du portfolio (Phase 5 close la home).
// RSC pur (DEV-RULES §1) — pas de 'use client'. Traductions via getTranslations.
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

// Sections principales — server components pour la perf.
import { About } from '@/components/sections/About/About';
import { Contact } from '@/components/sections/Contact/Contact';
import { Experience } from '@/components/sections/Experience/Experience';
import { Hero } from '@/components/sections/Hero/Hero';
import { Projects } from '@/components/sections/Projects/Projects';
import { JsonLdPerson } from '@/components/seo/JsonLdPerson';
import { type Locale } from '@/i18n/routing';
import { buildAlternates, buildOgUrl, SITE_URL } from '@/lib/seo';

// Props : params est une Promise (Next 15+ App Router).
type HomeProps = {
  params: Promise<{ locale: string }>;
};

// generateMetadata async — exécuté au build SSG par locale.
// Récupère titre/tagline traduits + construit alternates hreflang + OG dynamique.
// Note : pas besoin de setRequestLocale ici — on passe locale explicitement à getTranslations (next-intl v4).
export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  // Cast safe : la locale a déjà été validée par le layout parent (hasLocale).
  const typedLocale = locale as Locale;

  // Traductions Hero et About pour construire title et description.
  const t = await getTranslations({ locale: typedLocale, namespace: 'Hero' });
  const tAbout = await getTranslations({ locale: typedLocale, namespace: 'About' });

  const title = `${t('name')} — ${t('tagline')}`;
  const description = tAbout('paragraph1');

  return {
    title,
    description,
    alternates: buildAlternates(''),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${typedLocale}`,
      siteName: t('name'),
      locale: typedLocale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [
        {
          url: buildOgUrl({ title: t('name'), subtitle: t('tagline'), locale: typedLocale }),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [buildOgUrl({ title: t('name'), subtitle: t('tagline'), locale: typedLocale })],
    },
  };
}

export default async function Home({ params }: HomeProps) {
  // Await params obligatoire en Next 15+.
  const { locale } = await params;

  // Active le rendu statique pour cette locale.
  setRequestLocale(locale);

  // Cast safe : validé par le layout parent via hasLocale.
  const typedLocale = locale as Locale;

  return (
    <>
      {/* JSON-LD Person — schema.org injecté dans le <head> côté server pour SEO */}
      <JsonLdPerson locale={typedLocale} />
      {/* Section Hero — plein écran avec fond animé, nom et tagline */}
      <Hero />
      {/* Section About — texte éditorial + portrait + marquee de stack technique */}
      <About />
      {/* Section Experience — timeline avec Gecko Mind, Reconversion, Armée de Terre */}
      <Experience />
      {/* Section Projects — galerie de projets avec scroll horizontal animé (GSAP desktop, snap mobile) */}
      <Projects />
      {/* Section Contact — magnetic links + CTAs (email, LinkedIn, GitHub, Gecko Mind) */}
      <Contact />
    </>
  );
}
