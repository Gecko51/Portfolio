// Type Project = frontmatter validé + contenu compilé prêt à rendre.
// Le frontmatter vient de projects.schema.ts ; le contenu est un ReactNode (output de compileMDX).
import type { ReactNode } from 'react';

import type { ProjectFrontmatter } from '@/lib/projects.schema';

export type Project = ProjectFrontmatter & {
  // ReactNode pré-compilé (côté serveur via next-mdx-remote/rsc) du body MDX.
  content: ReactNode;
};

// Pour la galerie home, on n'a pas besoin du contenu rendu — juste les meta.
export type ProjectMeta = ProjectFrontmatter;
