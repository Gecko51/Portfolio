// STUB Phase 4 Task 10 — sera remplacé en Task 11.
import type { Project } from '@/types/project';

type ProjectHeroProps = {
  project: Project;
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return <h1>{project.title}</h1>;
}
