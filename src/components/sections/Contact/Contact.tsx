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

  // Map les links de la source unique vers le rendu — label/value/aria via t().
  // Conserver l'ordre : email d'abord (CTA principal), puis socials.
  const ctaConfig = [
    { id: 'email' as const, label: t('emailLabel'), value: t('emailValue'), aria: t('ariaEmail'), external: false },
    { id: 'linkedin' as const, label: t('linkedinLabel'), value: t('linkedinValue'), aria: t('ariaLinkedin'), external: true },
    { id: 'github' as const, label: t('githubLabel'), value: t('githubValue'), aria: t('ariaGithub'), external: true },
    {
      id: 'gecko-mind' as const,
      label: t('geckoMindLabel'),
      value: t('geckoMindValue'),
      aria: t('ariaGeckoMind'),
      external: true,
    },
  ];

  return (
    <section id="contact" className="border-t border-border bg-bg px-6 py-32 md:py-48">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-muted">{t('kicker')}</p>
        <h2 className="mt-4 font-display text-5xl italic md:text-7xl">{t('title')}</h2>
        <p className="mt-6 max-w-2xl text-lg text-fg-muted">{t('intro')}</p>

        <ul className="mt-16 flex flex-col">
          {ctaConfig.map((cta) => {
            // Lookup du link correspondant dans la source unique.
            const link = CONTACT_LINKS.find((l) => l.id === cta.id);
            if (!link) return null;
            return (
              <li key={cta.id}>
                <ContactCTA
                  href={link.href}
                  ariaLabel={cta.aria}
                  label={cta.label}
                  value={cta.value}
                  trackEvent={link.trackEvent}
                  external={cta.external}
                  icon={<ArrowIcon />}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
