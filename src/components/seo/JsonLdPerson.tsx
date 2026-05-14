// Composant SEO — injecte un schema.org Person en JSON-LD.
// Render via <script type="application/ld+json"> côté server, pas de dangerous interaction.
// Schéma : https://schema.org/Person
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/seo';

type JsonLdPersonProps = {
  // Locale active pour adapter description et alternateName.
  locale: 'fr' | 'en';
};

export function JsonLdPerson({ locale }: JsonLdPersonProps) {
  // Données structurées Person — alimentent Knowledge Graph Google.
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Guillaume Gay',
    alternateName: 'Gecko51',
    // URL canonique de la personne — pointe toujours vers la locale par défaut
    // pour garantir une URL stable dans le Knowledge Graph Google (évite 2 entités).
    url: `${SITE_URL}/${routing.defaultLocale}`,
    image: `${SITE_URL}/images/portrait-placeholder.svg`,
    jobTitle: 'AI Builder & Full Stack Developer',
    description:
      locale === 'fr'
        ? "Solopreneur tech et AI Builder, founder Gecko Mind. 21 ans dans l'Armée de Terre, reconversion en 2024."
        : 'Tech solopreneur and AI Builder, founder of Gecko Mind. 21 years in the French Army, career switch in 2024.',
    sameAs: [
      'https://www.linkedin.com/in/gay-guillaume/',
      'https://github.com/Gecko51',
      'https://geckomind.fr',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Gecko Mind',
      url: 'https://geckomind.fr',
    },
  };

  // JSON.stringify safe ici : on contrôle tout l'input (aucun input utilisateur).
  // dangerouslySetInnerHTML requis car Next n'autorise pas <script>{...}</script> en JSX direct.
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires script tag with stringified JSON
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
