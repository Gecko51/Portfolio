// TimelineMilitary — bloc compact pour les 21 ans d'Armée de Terre.
// Plus discret typographiquement (texte plus petit, opacity réduite, pas de stack tags).
// Sous le bloc principal, un encart "Compétences transférables" met en valeur les soft skills.
// Le militaire est présenté comme contexte ; la VALEUR mise en avant ce sont les transférables.

import type { ExperienceItem } from '@/types/experience';

type TimelineMilitaryProps = {
  item: ExperienceItem;
  softSkillsKicker: string;
  softSkills: readonly string[];
};

export function TimelineMilitary({ item, softSkillsKicker, softSkills }: TimelineMilitaryProps) {
  return (
    <article data-timeline-item className="relative flex flex-col gap-6 pl-8 md:pl-12">
      {/* Pastille plus discrète (couleur muted au lieu d'accent) pour le bloc compact. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 h-2 w-2 rounded-full bg-fg-muted ring-4 ring-bg"
      />

      {/* Bloc compact : texte muted, taille réduite. */}
      <div className="flex flex-col gap-2 opacity-80">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
          {item.period}
        </span>
        <h3 className="font-display text-xl md:text-2xl tracking-tight text-fg-muted">
          {item.role} <span className="italic">— {item.organization}</span>
        </h3>
        <p className="text-sm text-fg-muted leading-relaxed max-w-2xl">{item.description}</p>
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
