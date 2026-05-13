# Portfolio Guillaume Gay — PRD

| Champ | Valeur |
|-------|--------|
| **Date** | 13 mai 2026 |
| **Version** | v0.1 (MVP) |
| **Auteur** | AI-Generated PRD |
| **Stack** | Next.js 15 (App Router) + TypeScript strict + Tailwind v4 + Framer Motion + GSAP + Lenis + R3F + next-intl, déployé sur Vercel |
| **Repo** | `guillaume-gay-portfolio` |
| **Domaine cible** | `guillaumegay.dev` (ou `guillaume-gay.fr`) — `[HYPOTHÈSE]` à confirmer |

---

## 1. Vision & Problème

**Problème concret.** Guillaume Gay est un AI Builder reconverti après 21 ans dans l'Armée de Terre, fondateur de Gecko Mind. Aujourd'hui son CV vit dans un PDF et son brand vit sur LinkedIn + geckomind.fr. Recruteurs, fondateurs et communauté tech n'ont pas un point d'entrée unique, narratif et premium pour comprendre son positionnement, son expertise et ses projets.

**Cible.**
1. **Communauté tech / personal branding** — devs, makers, indé hackers, audience LinkedIn/X qui suit le parcours reconversion → AI Builder.
2. **Recruteurs / freelance missions** — DSI, CTO, fondateurs startups qui cherchent un AI Builder expérimenté Claude / MCP / n8n pour missions freelance ou collaborations.

**Résultat attendu.** Un portfolio premium one-page (avec micro-routes pour les case studies projets) qui :
- Capte l'attention en 5 secondes avec un Hero animé fort.
- Raconte le pivot militaire → AI Builder de manière subtile mais mémorable.
- Démontre la profondeur technique via les projets (Gecko Mind Skills Ecosystem, Gecko Agent, geckomind.fr).
- Convertit en action : ouvrir LinkedIn, écrire un mail, voir GitHub, ou booker un call.

**Différenciation.**
- Inspiration `talvilozny.vercel.app` — scroll horizontal projets, transitions de page custom, animations scroll-triggered, curseur custom.
- Dark premium maximaliste, pas un portfolio dev générique GitHub Pages.
- Storytelling assumé : ce n'est pas un CV, c'est une vitrine cinématique.
- Bilingue FR/EN avec switcher fluide (next-intl).

---

## 2. User Stories (MVP)

> 🔴 Must-have · 🟡 Should-have · 🟢 Nice-to-have

1. 🔴 **En tant que** recruteur, **je veux** comprendre qui est Guillaume en moins de 10 secondes, **afin de** décider si je continue ou pas.
2. 🔴 **En tant que** visiteur, **je veux** un scroll smooth et premium, **afin de** percevoir immédiatement le niveau de qualité.
3. 🔴 **En tant que** dev curieux, **je veux** voir les projets en détail avec stack et liens GitHub, **afin de** évaluer le niveau technique.
4. 🔴 **En tant que** prospect Gecko Mind, **je veux** un CTA clair vers LinkedIn et email, **afin de** entrer en contact rapidement.
5. 🔴 **En tant que** visiteur anglophone, **je veux** switcher en EN, **afin de** consommer le contenu dans ma langue.
6. 🔴 **En tant que** visiteur, **je veux** voir les expériences clés dans une timeline élégante, **afin de** saisir le parcours en un coup d'œil.
7. 🟡 **En tant que** visiteur mobile, **je veux** que toutes les animations soient préservées ou adaptées sur mobile, **afin de** ne pas perdre le wow effect.
8. 🟡 **En tant que** visiteur, **je veux** télécharger le CV PDF directement, **afin de** le partager facilement.
9. 🟡 **En tant que** crawler SEO, **je veux** un site indexable avec metadata et Open Graph, **afin de** apparaître sur Google et bien s'afficher sur LinkedIn.
10. 🟢 **En tant que** visiteur, **je veux** un mode "easter egg" terminal (commande hidden), **afin de** découvrir un détail fun qui renforce la dimension AI Builder.

Répartition : 60% 🔴 (6), 30% 🟡 (3), 10% 🟢 (1).

---

## 3. Fonctionnalités Clés (MVP)

### Module 1 — Layout & Navigation

| Champ | Description |
|-------|-------------|
| **Nom** | Layout global animé |
| **Description** | Layout `[locale]` avec smooth scroll Lenis, curseur custom, transitions de page Framer Motion `AnimatePresence`. |
| **Critères d'acceptation** | Lenis actif, curseur custom visible desktop (off mobile), transitions inter-pages fluides sans flash blanc. |
| **Complexité** | Moyen |

| Champ | Description |
|-------|-------------|
| **Nom** | Navigation flottante |
| **Description** | Header fixed minimal (logo monogramme `GG` + nav fr/en + lien CV PDF). Scroll-aware (réduit au scroll down, revient au scroll up). |
| **Critères d'acceptation** | Réactif au scroll, switcher i18n persiste la route, accessible (ARIA, keyboard). |
| **Complexité** | Moyen |

| Champ | Description |
|-------|-------------|
| **Nom** | Switcher FR/EN |
| **Description** | next-intl avec routes `/fr/...` et `/en/...`, switch préserve la position scroll. |
| **Critères d'acceptation** | Pas de full reload, contenu traduit cohérent, langue détectée par défaut via `accept-language`. |
| **Complexité** | Moyen |

### Module 2 — Hero

| Champ | Description |
|-------|-------------|
| **Nom** | Hero cinématique |
| **Description** | Section plein écran avec : nom XL en typo display, baseline "AI Builder & Full Stack Developer", canvas WebGL léger (shader fragment avec noise + gradient ember) en background, animation reveal au mount (split text characters, GSAP). |
| **Critères d'acceptation** | LCP < 2.5s, shader fallback gradient CSS si WebGL indispo, texte lisible en toute circonstance. |
| **Complexité** | Complexe |

| Champ | Description |
|-------|-------------|
| **Nom** | Scroll indicator + transition vers About |
| **Description** | Indicateur scroll en bas (animation pulse). Au scroll, transition smooth vers section About avec scrub GSAP ScrollTrigger. |
| **Critères d'acceptation** | Disparait après le premier scroll user, scrub fluide sans saccade. |
| **Complexité** | Simple |

### Module 3 — About

| Champ | Description |
|-------|-------------|
| **Nom** | Section About narrative |
| **Description** | Texte éditorial type magazine — courte bio (3-4 paragraphes), reveal mot par mot au scroll (GSAP SplitText), photo portrait avec effet de masque ou ASCII shader subtil. |
| **Critères d'acceptation** | Texte traduit FR/EN, reveal déclenché à 30% viewport, photo optimisée Next/Image. |
| **Complexité** | Moyen |

| Champ | Description |
|-------|-------------|
| **Nom** | Bloc Stack mini-interactif |
| **Description** | Bloc dans About listant les catégories de compétences (AI/Claude, Web, Automation) avec marquee infinite ou icon cloud animé. |
| **Critères d'acceptation** | Animation marquee fluide sans jump, icons SVG optimisés. |
| **Complexité** | Simple |

### Module 4 — Experience (Timeline)

| Champ | Description |
|-------|-------------|
| **Nom** | Timeline expérience |
| **Description** | Timeline verticale avec 3 blocs principaux : Gecko Mind (2024+), Reconversion (2024), Armée de Terre (2003-2024 — bloc compact discret avec compétences transférables). ScrollTrigger pin + progress line. |
| **Critères d'acceptation** | Pin section pendant le scroll, ligne de progression synchronisée, militaire présenté discrètement mais valorisé en soft skills. |
| **Complexité** | Complexe |

### Module 5 — Projects (Scroll Horizontal)

| Champ | Description |
|-------|-------------|
| **Nom** | Galerie projets scroll horizontal |
| **Description** | Section pin avec scroll vertical → translation horizontale (GSAP ScrollTrigger). 3-5 cards XL : Gecko Mind, Gecko Agent, Skill Ecosystem, geckomind.fr, +1 slot. Chaque card : preview image, titre, stack tags, lien détail. |
| **Critères d'acceptation** | Scroll horizontal fluide desktop, fallback vertical scroll mobile, transitions au clic vers `/projects/[slug]`. |
| **Complexité** | Complexe |

| Champ | Description |
|-------|-------------|
| **Nom** | Pages détail projets |
| **Description** | Routes `/[locale]/projects/[slug]` avec MDX local : hero projet, problématique, stack, résultats, gallery, liens externes. Transition entrée custom (FLIP animation depuis la card). |
| **Critères d'acceptation** | Contenu MDX servi statiquement, transition FLIP sans flash, retour ← vers galerie qui restore le scroll position. |
| **Complexité** | Complexe |

### Module 6 — Contact

| Champ | Description |
|-------|-------------|
| **Nom** | Section Contact final |
| **Description** | Section fin de page avec gros CTA mailto + liens sociaux (LinkedIn, GitHub, X, Gecko Mind). Animation hover bold sur chaque lien (magnetic effect). |
| **Critères d'acceptation** | Liens cliquables, mailto fonctionnel, magnetic effect actif desktop. |
| **Complexité** | Moyen |

| Champ | Description |
|-------|-------------|
| **Nom** | Footer minimal |
| **Description** | Footer une ligne : © Guillaume Gay 2026 — Built with Claude Code — version commit hash. |
| **Critères d'acceptation** | Hash dynamique injecté au build, mention Claude Code et lien repo si open source. |
| **Complexité** | Simple |

### Module 7 — Cross-cutting

| Champ | Description |
|-------|-------------|
| **Nom** | SEO & Open Graph |
| **Description** | Metadata Next.js, sitemap, robots, OG dynamique (image générée Next/og avec nom + baseline + dégradé). |
| **Critères d'acceptation** | Score Lighthouse SEO ≥ 95, OG image preview correct sur Slack/LinkedIn/X. |
| **Complexité** | Moyen |

| Champ | Description |
|-------|-------------|
| **Nom** | CV PDF téléchargeable |
| **Description** | Bouton "CV" header → téléchargement direct du PDF (versions FR et EN selon locale active). |
| **Critères d'acceptation** | PDFs présents dans `/public/cv/`, nom du fichier propre (`Guillaume-Gay-CV-FR.pdf`). |
| **Complexité** | Simple |

| Champ | Description |
|-------|-------------|
| **Nom** | Analytics privacy-first |
| **Description** | Plausible.io (cookieless) ou Vercel Analytics. Tracking des CTAs (LinkedIn click, mailto, CV download). |
| **Critères d'acceptation** | Pas de cookie banner nécessaire, events custom trackés. |
| **Complexité** | Simple |

---

## 4. Stack Technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Langage** | TypeScript 5.x (strict, `noUncheckedIndexedAccess`) | Type safety totale, autocomplete IDE, refactor sûr. |
| **Framework** | Next.js 15 (App Router + RSC) | SSG/ISR pour SEO premium, routing file-based, Image optimization, Next/font auto-self-hosted, Vercel native. |
| **React** | React 19 | Concurrent features, Server Components, transitions natives. |
| **Styling** | Tailwind CSS v4 | Utility-first, build CSS minimal, design tokens via `@theme`, parfait pour design system custom. |
| **UI components** | shadcn/ui (cherry-picked) + composants custom | Base accessible (Radix UI sous le capot), full ownership du code, pas de runtime lourd. |
| **Animations base** | Framer Motion 12 | Transitions de pages `AnimatePresence`, `motion` components, layout animations, parfait pour les micro-interactions. |
| **Animations avancées** | GSAP 3.x + ScrollTrigger + SplitText | Pin sections, scroll horizontal, timeline complexe, text reveal char-by-char. GSAP licence free tier suffisante. |
| **Smooth scroll** | Lenis 1.x | Smooth scroll de référence, intégration GSAP/Framer parfaite, perf-friendly. |
| **WebGL** | React Three Fiber + drei + custom GLSL | Hero shader background léger (fragment shader noise + gradient), pas de modèles 3D lourds. |
| **i18n** | next-intl 4.x | App Router native, type-safe messages, middleware locale auto, SSR clean. |
| **MDX** | Contentlayer 2 ou `@next/mdx` natif | Case studies projets en MDX local, type-safe, statique. Privilégier `@next/mdx` natif (Contentlayer en maintenance limitée). |
| **Fonts** | Next/font (self-hosted) — combo : Migra (display serif) + Geist Sans (body) + JetBrains Mono (accents code) | Typo combo éditoriale + tech, optimisé CLS=0. |
| **Icons** | Lucide React + SVG custom | Stack moderne, tree-shakeable. |
| **Linting** | Biome 1.9 (lint + format) | Plus rapide que ESLint + Prettier, config unique. |
| **Validation** | Zod 3.x | Pour `contentlayer` schemas et form contact si ajouté plus tard. |
| **Analytics** | Plausible.io | Privacy-first, cookieless, pas de RGPD lourd, dashboard public possible. |
| **Déploiement** | Vercel | DX optimal Next.js, edge functions, OG image generation, ISR, preview deployments PR. |
| **DNS** | Cloudflare | Caching agressif, redirects, perf globale. |
| **Documentation IA** | Context7 MCP | Docs à jour Next.js 15, Framer Motion 12, GSAP, R3F, Lenis injectées dans le contexte Claude Code. Évite les hallucinations sur les APIs récentes. |

### Alternatives écartées

| Tech écartée | Raison |
|--------------|--------|
| Astro | Moins adapté pour les transitions de page complexes et les animations app-like que demande l'inspiration Tal Vilozny. |
| Remix / React Router 7 | Stack moins outillée côté ISR + OG dynamique sur Vercel, courbe d'effort plus élevée. |
| Three.js vanilla | R3F donne un DX bien meilleur pour un usage léger limité au shader hero. |
| Sanity / Contentful | Overkill pour 5 case studies projets. MDX local suffit. |
| Anime.js / Motion One | Framer Motion + GSAP couvrent 100% des besoins. |

---

## 5. Modèle de Données

Pas de base de données. Contenu statique en MDX + i18n JSON.

### Schéma frontmatter projet

```yaml
# src/content/projects/[locale]/[slug].mdx
---
slug: string                # ex: "gecko-agent"
title: string               # "Gecko Agent"
tagline: string             # punchline en 1 ligne
year: number                # 2025
role: string                # "Founder & Developer"
stack: string[]             # ["Next.js", "TypeScript", "Anthropic API"]
cover: string               # "/projects/gecko-agent/cover.jpg"
gallery: string[]           # ["/projects/gecko-agent/01.jpg", ...]
links:
  github?: string
  live?: string
  case_study?: string
order: number               # ordre d'apparition dans la galerie
featured: boolean           # affiché dans la galerie principale
---
```

### Schéma messages i18n

```json
// src/messages/fr.json | en.json
{
  "Hero": {
    "name": "Guillaume Gay",
    "tagline": "AI Builder & Full Stack Developer",
    "cta": "Voir mon travail"
  },
  "About": { ... },
  "Experience": { ... },
  "Projects": { ... },
  "Contact": { ... },
  "Nav": { ... }
}
```

Validation via Zod schema dans `src/lib/content.schema.ts`.

---

## 6. Routes & Pages

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/` | Redirect vers `/fr` (ou `/en` selon `accept-language`) | ❌ |
| GET | `/[locale]` | Page home : Hero → About → Experience → Projects → Contact | ❌ |
| GET | `/[locale]/projects/[slug]` | Détail projet (MDX) | ❌ |
| GET | `/api/og` | OG image dynamique (Next/og) | ❌ |
| GET | `/sitemap.xml` | Sitemap auto-généré (next-sitemap ou route handler) | ❌ |
| GET | `/robots.txt` | Robots avec sitemap link | ❌ |
| GET | `/cv/[locale]` | Téléchargement PDF CV (static) | ❌ |

---

## 7. Pages & Navigation

| Page | Route | Composants clés |
|------|-------|-----------------|
| Home | `/[locale]` | `<Hero>` `<About>` `<Experience>` `<ProjectsGallery>` `<Contact>` `<Footer>` |
| Project Detail | `/[locale]/projects/[slug]` | `<ProjectHero>` `<ProjectContent>` (MDX) `<ProjectGallery>` `<ProjectNav>` |

Navigation interne : ancres + smooth scroll Lenis vers `#about`, `#experience`, `#projects`, `#contact`.

---

## 8. Direction Artistique

### Palette

| Token | Valeur | Usage |
|-------|--------|-------|
| `--bg` | `#0A0A0A` | Fond principal (noir profond, pas full black) |
| `--bg-elevated` | `#141414` | Cards, surfaces élevées |
| `--fg` | `#F5F5F5` | Texte principal |
| `--fg-muted` | `#8A8A8A` | Texte secondaire |
| `--accent` | `#FF5B1F` | Accent ember (variation Burnt Orange, lien visuel discret avec Gecko Mind) |
| `--accent-soft` | `#FFB07A` | Accent secondaire (hover, glow) |
| `--border` | `#1F1F1F` | Borders subtiles |

### Typographie

| Usage | Police | Poids |
|-------|--------|-------|
| Display (hero, headings XL) | Migra (ou Editorial New / PP Editorial Old) | 400 / 800 italic |
| Body | Geist Sans | 400 / 500 |
| Accent / labels / code | JetBrains Mono | 400 / 600 |

> `[HYPOTHÈSE]` Migra est une fonte payante (Pangram Pangram). Alternative gratuite : Fraunces ou Instrument Serif. À confirmer.

### Style

- Scroll smooth ultra-fluide (Lenis lerp 0.08).
- Curseur custom : dot follower (12px) + outline magnetic.
- Transitions de page : fade + slight scale, durée 600-800ms.
- Reveal text : split chars + stagger 20ms.
- Hover sur liens : magnetic effect + soulignement animé.
- Scroll horizontal projects : pin + 80% viewport translate.

---

## 9. Contraintes Techniques

### Performance

- **LCP** < 2.5s (Hero text + shader background).
- **CLS** = 0 (fonts self-hosted via `next/font`, dimensions images définies).
- **INP** < 200ms.
- Hero shader : 60 fps desktop, dégradé statique fallback si `prefers-reduced-motion` ou GPU faible.
- Lazy load des sections en dessous du fold.
- Images Next/Image avec `placeholder="blur"` et `priority` seulement sur le hero.

### Accessibilité

- WCAG 2.1 AA minimum.
- `prefers-reduced-motion` respecté : les animations s'arrêtent ou se simplifient.
- Contraste ≥ 4.5:1 partout.
- Navigation clavier sur tous les liens et CTAs.
- ARIA labels sur les éléments interactifs non textuels (curseur custom invisible aux SR).
- Lang attribute sync avec next-intl.

### Sécurité

- Pas de form contact en MVP → pas de risque XSS de soumission.
- Headers Next.js : CSP strict, X-Frame-Options DENY, Referrer-Policy strict-origin.
- Pas de secret côté client (Plausible domain public OK).

### SEO

- Metadata Next 15 (`generateMetadata` async).
- OG image dynamique par page (nom + tagline + dégradé) via `@vercel/og`.
- JSON-LD `Person` schema sur la home.
- Sitemap auto + robots.txt.
- Canonical URL par page, `hreflang` alternates FR/EN.

### Tests (MVP)

- Pas de tests E2E au MVP (statique, animations difficiles à tester).
- Lighthouse CI sur chaque PR via GitHub Actions.
- Manual QA checklist en fin de chaque phase.

### Compatibilité

- Chrome / Safari / Firefox / Edge dernière version + N-1.
- iOS Safari 16+ / Android Chrome 110+.
- Pas de support IE/legacy.

---

## 10. Milestones de développement

```
Phase 1 — Foundation             → git tag v0.1-foundation
  - Init Next.js 15 + TypeScript strict + Tailwind v4 + Biome
  - Setup next-intl (locales fr/en) + middleware
  - Layout racine [locale] + fonts self-hosted (Migra/Fraunces + Geist + JetBrains Mono)
  - Design tokens CSS variables + theme provider (dark only)
  - Setup Lenis smooth scroll + provider
  - Setup Framer Motion + GSAP + ScrollTrigger
  - Header flottant + switcher i18n + bouton CV
  - Footer minimal
  - Page Home blanche avec sections ancres en placeholder

Phase 2 — Hero & About           → git tag v0.2-hero-about
  - Hero : layout + typo display + split text reveal GSAP
  - Hero : canvas R3F + fragment shader noise/gradient ember
  - Fallback CSS gradient si prefers-reduced-motion ou perf low
  - Scroll indicator animé
  - Curseur custom desktop (dot + magnetic outline)
  - Section About : texte éditorial + reveal scroll
  - Bloc stack mini-marquee
  - Photo portrait optimisée

Phase 3 — Experience timeline    → git tag v0.3-experience
  - Composant Timeline pin + progress line (ScrollTrigger)
  - 3 blocs : Gecko Mind, Reconversion, Armée de Terre (discret)
  - Cartes expérience avec stack tags
  - Reveal scroll par bloc
  - Compétences transférables militaires en bloc soft skills

Phase 4 — Projects gallery       → git tag v0.4-projects
  - Section ProjectsGallery scroll horizontal (GSAP pin + translate)
  - 5 cards XL : Gecko Mind, Gecko Agent, Skill Ecosystem, geckomind.fr, +1
  - Routes /[locale]/projects/[slug] + MDX integration
  - Transition FLIP card → detail page
  - Page détail projet : hero + content MDX + gallery
  - Navigation retour qui préserve scroll position

Phase 5 — Contact + Polish + Deploy → git tag v1.0-mvp
  - Section Contact magnetic links + CTAs
  - SEO complet : metadata, OG dynamique, sitemap, robots
  - JSON-LD Person
  - Analytics Plausible
  - QA cross-browser
  - Lighthouse audit ≥ 95 perf/a11y/SEO
  - Deploy Vercel + DNS Cloudflare
  - Release tag v1.0-mvp
```
