// Source de vérité unique pour les liens contact.
// Centralisé ici pour éviter les divergences entre Contact, Footer et JSON-LD SEO.
export type ContactLink = {
  // Clé d'identification stable (utilisée pour le tracking analytics).
  id: 'email' | 'linkedin' | 'github' | 'gecko-mind';
  // URL absolue ou mailto: pour ouverture directe.
  href: string;
  // Préfixe pour Plausible event (ex: 'click_contact_email').
  trackEvent: string;
};

export const CONTACT_LINKS: readonly ContactLink[] = [
  { id: 'email', href: 'mailto:gay.guillaume@orange.fr', trackEvent: 'click_contact_email' },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/gay-guillaume/', trackEvent: 'click_contact_linkedin' },
  { id: 'github', href: 'https://github.com/Gecko51', trackEvent: 'click_contact_github' },
  { id: 'gecko-mind', href: 'https://geckomind.fr', trackEvent: 'click_contact_geckomind' },
] as const;
