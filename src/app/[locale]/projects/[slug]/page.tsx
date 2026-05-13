// Page détail d'un projet — route /[locale]/projects/[slug].
// Statiquement générée via generateStaticParams (croise locales × slugs).
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { ProjectContent } from '@/components/sections/Projects/ProjectDetail/ProjectContent';
import { ProjectGallery } from '@/components/sections/Projects/ProjectDetail/ProjectGallery';
import { ProjectHero } from '@/components/sections/Projects/ProjectDetail/ProjectHero';
import { ProjectNav } from '@/components/sections/Projects/ProjectDetail/ProjectNav';
import { routing } from '@/i18n/routing';
import { getProject, getProjectSlugs } from '@/lib/projects';

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Pre-render toutes les combinaisons locale × slug au build (8 pages : 4 slugs × 2 locales).
export async function generateStaticParams() {
  const results: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    const slugs = await getProjectSlugs(locale);
    for (const slug of slugs) {
      results.push({ locale, slug });
    }
  }
  return results;
}

// Metadata dynamique par projet (SEO + Open Graph).
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale);
  if (!project) {
    return { title: 'Project not found' };
  }
  return {
    title: `${project.title} — Guillaume Gay`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} — Guillaume Gay`,
      description: project.tagline,
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProject(slug, locale);
  if (!project) {
    notFound();
  }

  return (
    <article className="relative">
      <ProjectNav locale={locale} />
      <ProjectHero project={project} locale={locale} />
      <ProjectContent>{project.content}</ProjectContent>
      {project.gallery.length > 0 && (
        <ProjectGallery images={project.gallery} alt={project.title} />
      )}
    </article>
  );
}
