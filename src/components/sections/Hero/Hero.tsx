// Hero — wrapper RSC : traduit les textes côté serveur, compose les sous-composants client.
// Plein écran, position relative pour que le background absolute -z-10 reste contenu.
import { getTranslations } from 'next-intl/server';

import { HeroBackground } from './HeroBackground';
import { HeroText } from './HeroText';
import { ScrollIndicator } from './ScrollIndicator';

// Composant serveur async : récupère les traductions puis passe les strings aux enfants client.
export async function Hero() {
  // Récupère les traductions du namespace 'Hero' côté serveur (DEV-RULES §10 : zéro string en dur).
  const t = await getTranslations('Hero');

  return (
    // Section plein écran centrée — overflow-hidden pour contenir l'effet de fond.
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Fond animé (shader WebGL ou fallback gradient) — position absolute -z-10 */}
      <HeroBackground />

      {/* Texte principal : nom + tagline animés en entrée */}
      <HeroText name={t('name')} tagline={t('tagline')} />

      {/* Indicateur de scroll — ancré en bas de la section */}
      <ScrollIndicator label={t('scrollHint')} />
    </section>
  );
}
