// ProjectContent — wrapper de typographie pour le contenu MDX compilé.
// Le children est le ReactNode produit par compileMDX (lib/projects.ts).
// Tailwind utility-first : pas de @tailwindcss/typography (pas installé), on style à la main via arbitrary selectors [&_h2]:..., [&_li]:..., etc.
import type { ReactNode } from 'react';

type ProjectContentProps = {
  children: ReactNode;
};

export function ProjectContent({ children }: ProjectContentProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-16 md:py-24">
      {/*
        Styles typographiques pour le MDX rendu.
        h2/h3/p/ul/code/etc. sont stylés via les sélecteurs descendants Tailwind v4.
      */}
      <div
        className={[
          'flex flex-col gap-6 text-base md:text-lg text-fg-muted leading-relaxed',
          '[&_h2]:font-display [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:tracking-tight [&_h2]:italic [&_h2]:text-fg [&_h2]:mt-12 [&_h2]:mb-2',
          '[&_h3]:font-display [&_h3]:text-2xl [&_h3]:tracking-tight [&_h3]:text-fg [&_h3]:mt-8 [&_h3]:mb-1',
          '[&_ul]:list-none [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-0',
          "[&_li]:relative [&_li]:pl-6 [&_li]:before:content-['→'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-accent",
          '[&_strong]:text-fg [&_strong]:font-medium',
          '[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-fg',
          '[&_code]:font-mono [&_code]:text-sm [&_code]:bg-bg-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-fg',
        ].join(' ')}
      >
        {children}
      </div>
    </section>
  );
}
