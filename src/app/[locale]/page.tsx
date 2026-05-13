// Page d'accueil — sections placeholder pour les ancres de navigation.
// Le contenu réel arrive aux Phases 2-5 (hero, about, experience, projects, contact).
// RSC pur (DEV-RULES §1) — pas de 'use client'. Traductions via getTranslations (DEV-RULES §10).
import { getTranslations, setRequestLocale } from 'next-intl/server';

// Import du composant About — section avec texte éditorial, portrait et marquee de stack.
import { About } from '@/components/sections/About/About';
// Import du composant Experience — section timeline avec items main + compact militaire.
import { Experience } from '@/components/sections/Experience/Experience';
// Import du composant Hero — section plein écran avec fond animé, nom et tagline.
import { Hero } from '@/components/sections/Hero/Hero';

// Props : params est une Promise (Next 15+ App Router).
type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  // Await params obligatoire en Next 15+.
  const { locale } = await params;

  // Active le rendu statique pour cette locale.
  setRequestLocale(locale);

  // Récupère les traductions du namespace 'Home' (DEV-RULES §10 : zéro string en dur).
  const t = await getTranslations('Home');

  return (
    <>
      {/* Section Hero — plein écran avec fond animé, nom et tagline */}
      <Hero />

      {/* Section About — texte éditorial + portrait + marquee de stack technique */}
      <About />

      {/* Section Experience — timeline avec Gecko Mind, Reconversion, Armée de Terre */}
      <Experience />

      {/* Section Projects — ancre #projects pour la navigation */}
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">{t('placeholderProjects')}</p>
      </section>

      {/* Section Contact — ancre #contact pour la navigation */}
      <section id="contact" className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">{t('placeholderContact')}</p>
      </section>
    </>
  );
}
