// Accès filesystem aux MDX projets. Tout passage fs DOIT passer par ce module (DEV-RULES §4).
// API : getProjectSlugs(locale), getProjectMeta(slug, locale), getProject(slug, locale), getAllProjectsMeta(locale).
import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

import type { Project, ProjectMeta } from '@/types/project';

import { projectFrontmatterSchema } from './projects.schema';

// Racine du contenu MDX projets. Résolu une fois (process.cwd() pendant le build/runtime).
const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content', 'projects');

// Liste les slugs (nom de fichier sans .mdx) pour une locale.
export async function getProjectSlugs(locale: string): Promise<string[]> {
  const dir = path.join(CONTENT_ROOT, locale);
  const files = await fs.readdir(dir);
  return files.filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));
}

// Lit + parse + valide le frontmatter d'un projet (sans compiler le contenu MDX).
// Utile pour la galerie home (n'a pas besoin du body).
export async function getProjectMeta(slug: string, locale: string): Promise<ProjectMeta | null> {
  const filePath = path.join(CONTENT_ROOT, locale, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const { data } = matter(raw);
  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Frontmatter invalide pour ${locale}/${slug}.mdx : ${parsed.error.message}`);
  }
  return parsed.data;
}

// Lit + parse + valide + compile le MDX en ReactNode. Pour les pages détail.
export async function getProject(slug: string, locale: string): Promise<Project | null> {
  const filePath = path.join(CONTENT_ROOT, locale, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Frontmatter invalide pour ${locale}/${slug}.mdx : ${parsed.error.message}`);
  }

  // compileMDX retourne { content: ReactNode, frontmatter: {} }.
  // On passe le body MDX (sans frontmatter, déjà parsé par gray-matter) à source.
  const compiled = await compileMDX({
    source: content,
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  return { ...parsed.data, content: compiled.content };
}

// Liste tous les projets meta pour une locale, triés par order croissant. Filtre featured=true.
export async function getAllProjectsMeta(locale: string): Promise<ProjectMeta[]> {
  const slugs = await getProjectSlugs(locale);
  const metas = await Promise.all(slugs.map((slug) => getProjectMeta(slug, locale)));
  // Filtre les nulls et les projets non-featured, puis trie par order croissant.
  const featured = metas.filter((p): p is ProjectMeta => p?.featured ?? false);
  return featured.sort((a: ProjectMeta, b: ProjectMeta) => a.order - b.order);
}
