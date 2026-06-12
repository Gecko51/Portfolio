// About — wrapper RSC : grid 2 colonnes desktop (texte + portrait), marquee plein-largeur sous.
// Cf. PRD §3 Module 3.
import { getTranslations } from 'next-intl/server';

import { AboutText } from './AboutText';
import { Portrait } from './Portrait';
import { StackMarquee } from './StackMarquee';

export async function About() {
  // Récupère les traductions du namespace 'About' pour les textes éditoriaux.
  const t = await getTranslations('About');
  // Récupère les traductions du namespace 'Stack' pour les lignes du marquee.
  const tStack = await getTranslations('Stack');

  // Tableau des 3 paragraphes passés à AboutText — as const garantit le type readonly string[].
  const paragraphs = [t('paragraph1'), t('paragraph2'), t('paragraph3')] as const;

  // Tableau des 3 lignes du marquee : libellé de catégorie + items séparés par des tirets.
  // Catégories alignées sur le CV : Front-end / Back-end / Déploiement.
  const stackRows = [
    { label: tStack('categoryFrontend'), items: tStack('itemsFrontend') },
    { label: tStack('categoryBackend'), items: tStack('itemsBackend') },
    { label: tStack('categoryDeploy'), items: tStack('itemsDeploy') },
  ] as const;

  return (
    // Section About avec ancre #about pour la navigation.
    // py-32 md:py-48 : espacement vertical généreux pour aérer la mise en page.
    <section id="about" className="relative px-6 py-32 md:py-48">
      {/* Conteneur centré limité à 6xl avec gap vertical entre grille et marquee. */}
      <div className="mx-auto max-w-6xl flex flex-col gap-16">
        {/* Grille 1 colonne mobile → 2 colonnes desktop (texte légèrement plus large). */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-start">
          {/* Bloc éditorial : kicker + 3 paragraphes avec animation word-by-word. */}
          <AboutText kicker={t('kicker')} paragraphs={paragraphs} />
          {/* Portrait : photo placeholder SVG, remplacée en Phase 5. */}
          <Portrait alt={t('portraitAlt')} />
        </div>
        {/* Marquee plein-largeur sous la grille : 3 lignes de stack défilantes. */}
        <StackMarquee rows={stackRows} />
      </div>
    </section>
  );
}
