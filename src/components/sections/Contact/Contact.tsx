// Section Contact — server component, RSC par défaut (DEV-RULES §1).
// Compose le titre + intro + liste de ContactCTA (clients) pour le magnetic effect.
// Ancre #contact ciblée par la nav Header.
import { getTranslations } from 'next-intl/server';

import { ContactCTA } from './ContactCTA';
import { CONTACT_LINKS } from './contact-links';

// Icône flèche réutilisée (inline SVG, pas de lib pour éviter dep).
function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export async function Contact() {
  // Récupère les traductions du namespace 'Contact' (DEV-RULES §10 : zéro string en dur).
  const t = await getTranslations('Contact');

  // Map les links de la source unique vers le rendu.
  // label/aria via t() (localisables), value via link.displayValue (non-localisable — source unique contact-links.ts).
  // Ordre : LinkedIn d'abord (CTA principal), puis GitHub, puis Gecko Mind.
  const ctaConfig = CONTACT_LINKS.map((link) => {
    // Chaque id correspond exactement à une clé de traduction — mapping explicite pour TypeScript.
    const labelKey = {
      linkedin: 'linkedinLabel',
      github: 'githubLabel',
      email: 'emailLabel',
    } as const;

    const ariaKey = {
      linkedin: 'ariaLinkedin',
      github: 'ariaGithub',
      email: 'ariaEmail',
    } as const;

    return {
      id: link.id,
      // href et trackEvent portés ici pour éviter un second lookup dans le rendu.
      href: link.href,
      trackEvent: link.trackEvent,
      label: t(labelKey[link.id]),
      // displayValue vient de contact-links.ts — source unique, pas de duplication dans les messages.
      value: link.displayValue,
      aria: t(ariaKey[link.id]),
      // external porté depuis la source unique : true pour LinkedIn/GitHub (_blank), false pour l'email (mailto).
      external: link.external,
    };
  });

  return (
    <section id="contact" className="border-t border-border bg-bg px-6 py-32 md:py-48">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-muted">{t('kicker')}</p>
        <h2 className="mt-4 font-display text-5xl italic md:text-7xl">{t('title')}</h2>
        <p className="mt-6 max-w-2xl text-lg text-fg-muted">{t('intro')}</p>

        <ul className="mt-16 flex flex-col">
          {ctaConfig.map((cta) => (
            <li key={cta.id}>
              <ContactCTA
                href={cta.href}
                ariaLabel={cta.aria}
                label={cta.label}
                value={cta.value}
                trackEvent={cta.trackEvent}
                external={cta.external}
                icon={<ArrowIcon />}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
