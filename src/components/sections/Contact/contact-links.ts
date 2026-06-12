// Source de vérité unique pour les liens contact.
// Centralisé ici pour éviter les divergences entre Contact, Footer et JSON-LD SEO.
// displayValue : valeur d'affichage non-localisable (email, handle, domaine) — inutile de la dupliquer dans les fichiers de messages.
export type ContactLink = {
  // Clé d'identification stable (utilisée pour le tracking analytics).
  id: 'linkedin' | 'github' | 'email';
  // URL absolue pour ouverture directe (ou mailto: pour l'email).
  href: string;
  // Préfixe pour Plausible event (ex: 'click_contact_linkedin').
  trackEvent: string;
  // Valeur affichée dans le CTA — non-localisable (même en FR et EN).
  displayValue: string;
  // Cible externe (ouverture _blank) ou non. L'email (mailto:) reste dans le même contexte.
  external: boolean;
};

export const CONTACT_LINKS: readonly ContactLink[] = [
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/gay-guillaume/',
    trackEvent: 'click_contact_linkedin',
    displayValue: '@gay-guillaume',
    external: true,
  },
  {
    id: 'github',
    href: 'https://github.com/Gecko51',
    trackEvent: 'click_contact_github',
    displayValue: '@Gecko51',
    external: true,
  },
  {
    id: 'email',
    href: 'mailto:gay.guillaume@orange.fr',
    trackEvent: 'click_contact_email',
    displayValue: 'gay.guillaume@orange.fr',
    external: false,
  },
] as const;
