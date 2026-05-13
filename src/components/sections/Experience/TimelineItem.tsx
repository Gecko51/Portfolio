// TimelineItem — carte expérience pour les blocs "main" (Gecko Mind, Reconversion).
// Server component : pas d'interactivité, le reveal est géré par Timeline (wrapper client).
// Le bloc "compact" militaire a son propre composant TimelineMilitary (typo plus discrète).
import { Tag } from '@/components/ui/Tag';
import type { ExperienceItem } from '@/types/experience';

type TimelineItemProps = {
  item: ExperienceItem;
};

export function TimelineItem({ item }: TimelineItemProps) {
  return (
    // data-timeline-item = cible des reveal scroll-triggers dans Timeline.tsx
    <article data-timeline-item className="relative flex flex-col gap-4 pl-8 md:pl-12">
      {/* Pastille marquant la position sur la progress line — alignée avec gauche du texte. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 h-2 w-2 rounded-full bg-accent ring-4 ring-bg"
      />
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
      {item.stack && item.stack.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-2">
          {item.stack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
