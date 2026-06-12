// TimelineMilitary — bloc pour les 21 ans d'Armée de Terre.
// Le bloc texte (période / rôle / description) est aligné typographiquement sur TimelineItem
// (mêmes tailles, mêmes couleurs, même pastille accent) pour rester cohérent avec le reste de la section.
// En plus du bloc texte, un encart "Compétences transférables" met en valeur les soft skills.

import type { ExperienceItem } from '@/types/experience';

type TimelineMilitaryProps = {
  item: ExperienceItem;
  softSkillsKicker: string;
  softSkills: readonly string[];
};

export function TimelineMilitary({ item, softSkillsKicker, softSkills }: TimelineMilitaryProps) {
  return (
    <article data-timeline-item className="relative flex flex-col gap-6 pl-8 md:pl-12">
      {/* Pastille accent, identique aux autres items de la timeline. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 h-2 w-2 rounded-full bg-accent ring-4 ring-bg"
      />

      {/* Bloc texte aligné sur TimelineItem : mêmes tailles/couleurs, plus d'opacity réduite. */}
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
            {item.period}
          </span>
          <h3 className="font-display text-2xl md:text-3xl tracking-tight">
            {item.role} <span className="text-fg-muted italic">— {item.organization}</span>
          </h3>
        </header>
        <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-2xl">
          {item.description}
        </p>
      </div>

      {/* Encart soft skills : c'est la valeur, mis en avant visuellement. */}
      <div className="rounded border border-border bg-bg-elevated p-5 md:p-6 flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          {softSkillsKicker}
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {softSkills.map((skill) => (
            <li key={skill} className="flex items-start gap-2 text-sm text-fg">
              <span aria-hidden="true" className="text-accent leading-relaxed">
                →
              </span>
              <span>{skill}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
