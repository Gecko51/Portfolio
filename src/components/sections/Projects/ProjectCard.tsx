// ProjectCard — carte XL dans la galerie. Server component, cliquable via Link localisé.
// Layout : image cover plein-card en background, overlay texte en bas (titre + tagline + tags).
import Image from 'next/image';

import { Tag } from '@/components/ui/Tag';
import { Link } from '@/i18n/navigation';
import type { ProjectMeta } from '@/types/project';

type ProjectCardProps = {
  project: ProjectMeta;
  // Label "Voir le projet" traduit, passé depuis le wrapper server.
  viewProjectLabel: string;
};

export function ProjectCard({ project, viewProjectLabel }: ProjectCardProps) {
  // [data-cursor-magnetic] active le ring magnetic du curseur custom au hover.
  // snap-start = scroll-snap cible sur mobile (fallback scroll horizontal natif).
  return (
    <article
      data-cursor-magnetic
      className="relative flex-shrink-0 h-[70vh] md:h-[80vh] aspect-[3/4] overflow-hidden rounded-lg border border-border group snap-start"
    >
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${viewProjectLabel} ${project.title}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">
          {viewProjectLabel} {project.title}
        </span>
      </Link>

      {/* Cover image — fill, object-cover, scale 105 au hover via transition. */}
      <Image
        src={project.cover}
        alt={project.title}
        fill
        unoptimized
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(min-width: 1024px) 60vw, (min-width: 768px) 80vw, 90vw"
      />

      {/* Overlay dégradé renforcé : zone basse 100% opaque pour isoler le footer du titre SVG,
          transition douce jusqu'au milieu, puis transparent en haut pour laisser voir le cover. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-bg from-30% via-bg/60 via-55% to-transparent"
      />

      {/* Contenu en bas de la card. */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-3 z-[5]">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted">
          {project.year} · {project.role}
        </span>
        <h3 className="font-display text-3xl md:text-5xl tracking-tight italic">{project.title}</h3>
        {/* line-clamp-2 cap la tagline à 2 lignes max — évite que le footer dépasse en hauteur
            sur mobiles très courts (ex: 375×600) et chevauche le titre SVG en background. */}
        <p className="text-sm md:text-base text-fg-muted max-w-md line-clamp-2">{project.tagline}</p>
        <ul className="flex flex-wrap gap-2 mt-2">
          {project.stack.slice(0, 4).map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
          {project.stack.length > 4 && (
            <li>
              <Tag>+{project.stack.length - 4}</Tag>
            </li>
          )}
        </ul>
      </footer>
    </article>
  );
}
