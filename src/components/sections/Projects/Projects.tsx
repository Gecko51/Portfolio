// Projects — wrapper RSC : traduit + lit la liste de projets via lib/projects.ts + compose la galerie.
// Ce composant est un Server Component pur (async function) : il récupère les données et les traductions
// côté serveur, puis passe les children (ProjectCard) à ProjectsGallery (client).
import { getLocale, getTranslations } from 'next-intl/server';

import { getAllProjectsMeta } from '@/lib/projects';

import { ProjectCard } from './ProjectCard';
import { ProjectsGallery } from './ProjectsGallery';

export async function Projects() {
  // Récupère la locale active (ex: 'fr' ou 'en') pour charger les bons MDX.
  const locale = await getLocale();

  // Récupère les traductions du namespace 'Projects'.
  const t = await getTranslations('Projects');

  // Charge la liste des projets (métadonnées) pour la locale courante.
  const projects = await getAllProjectsMeta(locale);

  return (
    <section id="projects" className="relative pt-20 pb-32 md:pt-28 md:pb-48">
      {/* Header de section : kicker mono, titre display, hint de scroll */}
      {/* mb-* : écarte le bloc texte des cards de la galerie en dessous. */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12 mb-12 md:mb-16">
        <header className="flex flex-col gap-3">
          {/* Kicker — label mono minuscule au-dessus du titre principal. */}
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {t('kicker')}
          </span>
          {/* Titre principal de la section en font display italic. */}
          <h2 className="font-display text-4xl md:text-6xl tracking-tight italic">{t('title')}</h2>
          {/* Hint de scroll horizontal pour indiquer à l'utilisateur le comportement de la galerie. */}
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted mt-2">
            {t('scrollHint')}
          </p>
        </header>
      </div>

      {/* La gallery est en pleine largeur, séparée du wrapper container pour permettre le scroll horizontal. */}
      <ProjectsGallery projectCount={projects.length}>
        {projects.map((project) => (
          // Chaque ProjectCard reçoit les métadonnées du projet + le label traduit "Voir le projet".
          <ProjectCard key={project.slug} project={project} viewProjectLabel={t('viewProject')} />
        ))}
      </ProjectsGallery>
    </section>
  );
}
