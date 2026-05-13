// Schéma Zod du frontmatter d'un projet MDX. Source de vérité pour le typage et la validation.
// Cf. PRD §5 (modèle de données) et DEV-RULES §4 (validation Zod obligatoire).
import { z } from 'zod';

export const projectFrontmatterSchema = z.object({
  // Slug identique au nom du fichier (sans .mdx). Pas vérifié ici (fait dans lib/projects.ts).
  slug: z.string().min(1),
  // Titre affiché dans la card et le détail.
  title: z.string().min(1),
  // Punchline en 1 ligne (sous le titre).
  tagline: z.string().min(1),
  // Année du projet — affichée discrètement.
  year: z.number().int().min(2000).max(2100),
  // Rôle endossé sur le projet.
  role: z.string().min(1),
  // Stack technique — array de strings, affiché en pills.
  stack: z.array(z.string().min(1)).min(1),
  // Chemin vers l'image de couverture (servie depuis /public).
  cover: z.string().startsWith('/'),
  // Galerie d'images additionnelles (optionnelle, vide en Phase 4 placeholders).
  gallery: z.array(z.string().startsWith('/')).default([]),
  // Liens externes — tous optionnels.
  links: z
    .object({
      github: z.string().url().optional(),
      live: z.string().url().optional(),
      caseStudy: z.string().url().optional(),
    })
    .default({}),
  // Ordre d'apparition dans la galerie (plus petit = plus à gauche).
  order: z.number().int().nonnegative(),
  // Si false, le projet n'apparaît pas dans la galerie principale (réservé pour archives).
  featured: z.boolean().default(true),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
