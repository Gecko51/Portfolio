// Source de vérité unique pour les liens contact.
// Centralisé ici pour éviter les divergences entre Contact, Footer et JSON-LD SEO.
// displayValue : valeur d'affichage non-localisable (email, handle, domaine) — inutile de la dupliquer dans les fichiers de messages.
export type ContactLink = {
  // Clé d'identification stable (utilisée pour le tracking analytics).
  id: 'linkedin' | 'github' | 'gecko-mind';
  // URL absolue pour ouverture directe.
  href: string;
  // Préfixe pour Plausible event (ex: 'click_contact_linkedin').
  trackEvent: string;
  // Valeur affichée dans le CTA — non-localisable (même en FR et EN).
  displayValue: string;
};

export const CONTACT_LINKS: readonly ContactLink[] = [
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/gay-guillaume/',
    trackEvent: 'click_contact_linkedin',
    displayValue: '@gay-guillaume',
  },
  {
    id: 'github',
    href: 'https://github.com/Gecko51',
    trackEvent: 'click_contact_github',
    displayValue: '@Gecko51',
  },
  {
    id: 'gecko-mind',
    href: 'https://geckomind.fr',
    trackEvent: 'click_contact_geckomind',
    displayValue: 'geckomind.fr',
  },
] as const;
