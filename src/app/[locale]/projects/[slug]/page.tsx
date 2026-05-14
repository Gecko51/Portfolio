// Page détail d'un projet — route /[locale]/projects/[slug].
// Statiquement générée via generateStaticParams (croise locales × slugs).
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { ProjectContent } from '@/components/sections/Projects/ProjectDetail/ProjectContent';
import { ProjectGallery } from '@/components/sections/Projects/ProjectDetail/ProjectGallery';
import { ProjectHero } from '@/components/sections/Projects/ProjectDetail/ProjectHero';
import { ProjectNav } from '@/components/sections/Projects/ProjectDetail/ProjectNav';
import { type Locale, routing } from '@/i18n/routing';
import { getProject, getProjectSlugs } from '@/lib/projects';
import { buildAlternates, buildOgUrl, SITE_URL } from '@/lib/seo';

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

// Metadata dynamique par projet (SEO + Open Graph + hreflang alternates).
// Note : getProject retourne le projet complet (frontmatter + MDX compilé).
// On réutilise le même appel pour éviter une double lecture fs.
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  // Cast safe : la locale a déjà été validée par le layout parent (hasLocale).
  const typedLocale = locale as Locale;

  // Récupère le frontmatter via le helper existant projects.ts.
  const project = await getProject(slug, typedLocale);

  // Si pas de projet, on retourne un metadata minimal (la page elle-même fera notFound()).
  if (!project) {
    return { title: 'Project not found' };
  }

  const canonicalPath = `/projects/${slug}`;
  const ogUrl = buildOgUrl({
    title: project.title,
    subtitle: project.tagline,
    locale: typedLocale,
  });

  return {
    title: `${project.title} — Guillaume Gay`,
    description: project.tagline,
    alternates: buildAlternates(canonicalPath),
    openGraph: {
      title: project.title,
      description: project.tagline,
      url: `${SITE_URL}/${typedLocale}${canonicalPath}`,
      type: 'article',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.tagline,
      images: [ogUrl],
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
