## Rapport Phase 4 — Projects Gallery

### Implémenté
- Deps MDX : gray-matter@4.0.3, next-mdx-remote@6.0.0, remark-gfm@4.0.1 (+ zod ajouté, oublié au plan)
- Schéma Zod du frontmatter projet (lib/projects.schema.ts) + types Project / ProjectMeta partagés
- lib/projects.ts : getProjectSlugs, getProjectMeta (sans body), getProject (avec compileMDX RSC), getAllProjectsMeta (sort par order, filter featured)
- 8 fichiers MDX (4 projets × FR/EN) : Gecko Mind, Gecko Agent, Skill Ecosystem, geckomind.fr
- 4 covers SVG placeholders (gradients sombres + titres mono/serif différenciés par projet)
- ProjectCard : carte XL aspect-3/4, cover Image fill + overlay gradient + footer year/role/title/tagline/stack tags, data-cursor-magnetic, Link localisé, snap-start
- ProjectsGallery (client) : useGSAP + ScrollTrigger pin + translateX desktop ; flex overflow-x scroll-snap-mandatory mobile/coarse pointer ; gate prefers-reduced-motion
- Projects wrapper RSC : compose getTranslations + getAllProjectsMeta + map ProjectCard
- Routes /[locale]/projects/[slug] : generateStaticParams (4 × 2 = 8 routes), generateMetadata avec Open Graph par projet, notFound() pour slug inconnu
- not-found.tsx localisé avec back link
- ProjectHero détail : cover background h-70vh, kicker year/role, titre display XL, tagline, stack tags
- ProjectContent : wrapper typographique pour MDX (h2/h3/ul/li/code stylés via arbitrary selectors Tailwind v4)
- ProjectGallery : grid 2 cols images (next/image fill unoptimized) — masquée si gallery vide
- ProjectNav : back link "← Retour à la galerie" / "← Back to gallery" avec data-cursor-magnetic
- i18n étendu : namespace Projects FR/EN (10 clés), placeholderProjects retiré

### Non implémenté (et pourquoi)
- FLIP exact card → detail page — Framer layoutId mal supporté entre routes App Router, fade simple natif Next suffit Phase 4 ; reporté à Phase 5 si critique
- Scroll restore au retour — repose sur scrollRestoration natif Next + Lenis, ancre #projects dans le back link pour scroll approx ; fallback sessionStorage à ajouter Phase 5 si retours utilisateurs négatifs
- 5ème card — PRD disait "3-5", on livre 4 solides (ajout trivial via nouveau MDX)
- Vraies images de gallery par projet — frontmatter.gallery vide partout, ProjectGallery masquée si vide
- Plugin @tailwindcss/typography — pas installé, on style via arbitrary selectors `[&_h2]:...` (plus de contrôle, moins de poids)

### Problèmes rencontrés (et résolutions)
- **Bug i18n locale context leak (Task 15)** : `ProjectHero` et `ProjectNav` appelaient `getTranslations('Projects')` sans passer la locale explicitement. En dev avec Turbopack, le contexte `setRequestLocale` peut fuir entre requêtes concurrentes, causant l'affichage de la locale FR sur les pages EN. Résolu en passant `locale` prop depuis `page.tsx` et en utilisant `getTranslations({ locale, namespace: 'Projects' })` dans les deux composants.
- **Route detail affichée comme `ƒ (Dynamic)` dans le build output** : comportement normal avec `next-intl` middleware qui couvre toutes les routes — le middleware fait que Next.js marque la route comme dynamique dans l'affichage, mais les 13 pages statiques ont bien été générées (confirmé par le compteur `13/13`). Pas d'impact sur les performances.

### Recommandations Phase 5
- Si l'audit utilisateur révèle des saccades sur le pin GSAP × Lenis : implémenter `ScrollTrigger.scrollerProxy` avec instance Lenis exposée.
- Vraies covers projet (JPG 4:3, ~800×1000) à fournir Phase 5 prep.
- Vraies images gallery (3-6 par projet) à fournir + frontmatter.gallery rempli.
- Si SEO crawler critique (lang attribute en SSR) : la racine layout utilise `routing.defaultLocale` comme fallback SSR ; `LocaleLangSync` corrige côté client — acceptable pour Phase 4, un Content-Language header middleware peut renforcer pour Phase 5 si nécessaire.
- Section Contact + form Phase 5 (PRD §3 Module 6).

### Vérifications

| Métrique | Résultat |
|----------|----------|
| pnpm typecheck | PASS |
| pnpm lint | PASS (biome, 64 fichiers, 0 erreurs) |
| pnpm build | PASS (13 routes statiques générées) |
| Bundle JS total (production chunks) | 1 831 kB (tous chunks, non-gzippé) |
| Bundle CSS total (production chunks) | 33,6 kB |
| HTML pré-rendu /fr | 63,1 kB |
| HTML pré-rendu /en | 62,4 kB |
| HTTP /fr | 200 |
| HTTP /en | 200 |
| HTTP /fr/projects/gecko-mind | 200 |
| HTTP /fr/projects/gecko-agent | 200 |
| HTTP /fr/projects/skill-ecosystem | 200 |
| HTTP /fr/projects/geckomind-fr | 200 |
| HTTP /en/projects/gecko-mind | 200 |
| HTTP /fr/projects/unknown | 404 |
| HTML galerie FR "Ce que je construis" | ✓ |
| HTML galerie EN "What I build" | ✓ |
| HTML détail FR contient "Le problème" (MDX h2) | ✓ |
| HTML détail EN contient "The problem" (MDX h2) | ✓ |
| HTML détail FR nav "← Retour à la galerie" | ✓ |
| HTML détail EN nav "← Back to gallery" | ✓ (corrigé Task 15) |
| Total commits Phase 4 | 16 commits (15 features + 1 fix i18n Task 15) |

### Tag

`git tag v0.4-projects` créé sur le commit de clôture Phase 4.
