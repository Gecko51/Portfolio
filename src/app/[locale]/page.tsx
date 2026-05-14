// Page d'accueil — toutes les sections du portfolio (Phase 5 close la home).
// RSC pur (DEV-RULES §1) — pas de 'use client'. Traductions via getTranslations.
import { setRequestLocale } from 'next-intl/server';

// Sections principales — server components pour la perf.
import { About } from '@/components/sections/About/About';
import { Contact } from '@/components/sections/Contact/Contact';
import { Experience } from '@/components/sections/Experience/Experience';
import { Hero } from '@/components/sections/Hero/Hero';
import { Projects } from '@/components/sections/Projects/Projects';

// Props : params est une Promise (Next 15+ App Router).
type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  // Await params obligatoire en Next 15+.
  const { locale } = await params;

  // Active le rendu statique pour cette locale.
  setRequestLocale(locale);

  return (
    <>
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
