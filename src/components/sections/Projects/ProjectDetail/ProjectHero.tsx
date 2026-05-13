// ProjectHero — hero de la page détail projet.
// Affiche : cover background, kicker (year + role), titre XL, tagline, stack tags.
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { Tag } from '@/components/ui/Tag';
import type { Project } from '@/types/project';

type ProjectHeroProps = {
  project: Project;
};

export async function ProjectHero({ project }: ProjectHeroProps) {
  const t = await getTranslations('Projects');

  return (
    <header className="relative">
      {/* Cover en background avec gradient overlay pour lisibilité. */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          unoptimized
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent"
        />
      </div>

      {/* Texte sous le cover, dans un container max-width. */}
      <div className="relative mx-auto max-w-5xl px-6 md:px-12 -mt-24 md:-mt-32 z-10 flex flex-col gap-6 pb-12">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted">
          <span>
            {t('yearLabel')} {project.year}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t('roleLabel')} {project.role}
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl tracking-tight italic">{project.title}</h1>
        <p className="text-lg md:text-2xl text-fg-muted max-w-2xl leading-relaxed">
          {project.tagline}
        </p>
        <ul className="flex flex-wrap gap-2 mt-2">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
