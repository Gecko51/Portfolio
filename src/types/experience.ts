// Type des items affichés dans la timeline Experience.
// Partagé entre Experience.tsx (construction) et TimelineItem.tsx (consommation).

export type ExperienceVariant = 'main' | 'compact';

export type ExperienceItem = {
  // Période lisible — ex: "Juin 2024 – Aujourd'hui"
  period: string;
  // Rôle principal — ex: "Founder & AI Builder"
  role: string;
  // Organisation — ex: "Gecko Mind"
  organization: string;
  // Description courte (1-2 phrases)
  description: string;
  // Stack technique — optionnel (le bloc militaire n'en a pas)
  stack?: readonly string[];
  // Variante visuelle : main pour les blocs récents, compact pour l'armée discrète
  variant: ExperienceVariant;
};
