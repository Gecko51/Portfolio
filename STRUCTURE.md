# Portfolio Guillaume Gay — Structure

Arborescence cible du projet Next.js 15 (App Router) + TypeScript strict.

```
guillaume-gay-portfolio/
├── .github/
│   └── workflows/
│       └── lighthouse.yml              # CI Lighthouse sur chaque PR
├── .vscode/
│   └── settings.json                   # Format on save, Biome as default formatter
├── public/
│   ├── cv/
│   │   ├── Guillaume-Gay-CV-FR.pdf
│   │   └── Guillaume-Gay-CV-EN.pdf
│   ├── fonts/                          # Si self-hosted en dehors de next/font (rare)
│   ├── images/
│   │   ├── portrait.jpg                # Photo About
│   │   └── og/                         # OG fallback statiques
│   ├── projects/
│   │   ├── gecko-mind/
│   │   │   ├── cover.jpg
│   │   │   └── 01.jpg
│   │   ├── gecko-agent/
│   │   ├── skill-ecosystem/
│   │   └── geckomind-fr/
│   ├── favicon.ico
│   ├── icon.svg                        # Favicon SVG monogramme GG
│   └── apple-icon.png
├── src/
│   ├── app/
│   │   ├── [locale]/                   # Routes localisées (fr, en)
│   │   │   ├── layout.tsx              # Layout localisé : provider i18n, fonts, lenis, cursor
│   │   │   ├── page.tsx                # Home : Hero + About + Experience + Projects + Contact
│   │   │   ├── loading.tsx             # Skeleton minimal
│   │   │   ├── not-found.tsx           # 404 stylisée
│   │   │   └── projects/
│   │   │       └── [slug]/
│   │   │           ├── page.tsx        # Détail projet (MDX rendu)
│   │   │           └── opengraph-image.tsx  # OG dynamique par projet
│   │   ├── api/
│   │   │   └── og/
│   │   │       └── route.tsx           # OG image dynamique fallback (@vercel/og)
│   │   ├── globals.css                 # Tailwind v4 @import + design tokens
│   │   ├── layout.tsx                  # Root layout (html lang dynamique, analytics)
│   │   ├── opengraph-image.tsx         # OG home statique
│   │   ├── sitemap.ts                  # Sitemap auto FR/EN
│   │   ├── robots.ts                   # Robots avec sitemap link
│   │   └── manifest.ts                 # PWA manifest (minimal)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              # Header flottant scroll-aware
│   │   │   ├── Footer.tsx              # Footer minimal
│   │   │   ├── LocaleSwitcher.tsx      # Switcher FR/EN
│   │   │   └── CVButton.tsx            # Bouton download CV PDF
│   │   ├── providers/
│   │   │   ├── LenisProvider.tsx       # Smooth scroll provider
│   │   │   ├── GsapProvider.tsx        # Setup ScrollTrigger + plugins
│   │   │   └── CursorProvider.tsx      # Curseur custom magnetic
│   │   ├── sections/
│   │   │   ├── Hero/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── HeroShader.tsx      # R3F canvas + shader background
│   │   │   │   ├── HeroText.tsx        # Split text reveal GSAP
│   │   │   │   └── ScrollIndicator.tsx
│   │   │   ├── About/
│   │   │   │   ├── About.tsx
│   │   │   │   ├── AboutText.tsx       # Reveal mot par mot
│   │   │   │   └── StackMarquee.tsx    # Marquee infinite des skills
│   │   │   ├── Experience/
│   │   │   │   ├── Experience.tsx
│   │   │   │   ├── TimelineItem.tsx
│   │   │   │   └── TimelineProgress.tsx # Ligne de progression scroll
│   │   │   ├── Projects/
│   │   │   │   ├── ProjectsGallery.tsx # Container scroll horizontal
│   │   │   │   ├── ProjectCard.tsx     # Card XL avec preview
│   │   │   │   └── ProjectDetail/
│   │   │   │       ├── ProjectHero.tsx
│   │   │   │       ├── ProjectContent.tsx
│   │   │   │       └── ProjectGallery.tsx
│   │   │   └── Contact/
│   │   │       ├── Contact.tsx
│   │   │       └── MagneticLink.tsx    # Lien social avec magnetic effect
│   │   ├── ui/
│   │   │   ├── Button.tsx              # Composant Button custom
│   │   │   ├── Tag.tsx                 # Stack tag (pill)
│   │   │   ├── SplitText.tsx           # Helper split chars/words pour GSAP
│   │   │   ├── ScrollReveal.tsx        # Wrapper reveal au scroll
│   │   │   └── Cursor.tsx              # Composant curseur custom rendu
│   │   └── shaders/
│   │       ├── ember.frag.glsl         # Fragment shader Hero (noise + gradient)
│   │       └── ember.vert.glsl         # Vertex shader minimal
│   ├── content/
│   │   └── projects/
│   │       ├── fr/
│   │       │   ├── gecko-mind.mdx
│   │       │   ├── gecko-agent.mdx
│   │       │   ├── skill-ecosystem.mdx
│   │       │   └── geckomind-fr.mdx
│   │       └── en/
│   │           ├── gecko-mind.mdx
│   │           ├── gecko-agent.mdx
│   │           ├── skill-ecosystem.mdx
│   │           └── geckomind-fr.mdx
│   ├── i18n/
│   │   ├── routing.ts                  # Définition locales + defaultLocale (next-intl)
│   │   ├── request.ts                  # getRequestConfig pour next-intl
│   │   └── navigation.ts               # Link/redirect typés localisés
│   ├── messages/
│   │   ├── fr.json                     # Tous les textes FR
│   │   └── en.json                     # Tous les textes EN
│   ├── lib/
│   │   ├── projects.ts                 # Fonctions getProjects() / getProject(slug, locale)
│   │   ├── projects.schema.ts          # Zod schema frontmatter projet
│   │   ├── animations.ts               # Helpers animations Framer/GSAP (variants, easings)
│   │   ├── magnetic.ts                 # Helper magnetic effect (mousemove → translate)
│   │   ├── reduced-motion.ts           # Hook detect prefers-reduced-motion
│   │   ├── analytics.ts                # Wrapper Plausible event tracking
│   │   └── utils.ts                    # cn() + helpers généraux
│   ├── hooks/
│   │   ├── useMediaQuery.ts            # Detect breakpoints
│   │   ├── useScrollLock.ts            # Lock scroll pendant transitions
│   │   ├── useLenis.ts                 # Access instance Lenis
│   │   └── useIsomorphicLayoutEffect.ts # SSR-safe layoutEffect
│   ├── styles/
│   │   ├── tokens.css                  # CSS variables design system
│   │   └── fonts.ts                    # Déclarations next/font
│   └── types/
│       ├── project.ts                  # Type Project (dérivé Zod schema)
│       ├── i18n.ts                     # Type messages helper next-intl
│       └── globals.d.ts                # Module declarations (glsl, mdx)
├── .env.example                        # Variables exemples (NEXT_PUBLIC_SITE_URL, etc.)
├── .gitignore                          # Standard Next.js + .vercel
├── biome.json                          # Config Biome (lint + format)
├── middleware.ts                       # next-intl middleware (locale detection + redirects)
├── next.config.mjs                     # Config Next + MDX + GLSL loader + experimental
├── package.json
├── pnpm-lock.yaml                      # PNPM recommandé (perf + monorepo-friendly)
├── postcss.config.mjs                  # Tailwind v4 PostCSS
├── README.md                           # Doc projet + avancement par phase
├── tailwind.config.ts                  # Config Tailwind v4 (peut être inline globals.css)
└── tsconfig.json                       # TS strict + paths @/*
```

## Notes architecturales

### Pourquoi cette structure

- **`src/app/[locale]/`** — App Router avec routing localisé via next-intl. Toutes les routes vivent sous `[locale]` pour avoir `/fr/...` et `/en/...` côte à côte.
- **`src/components/sections/`** — Une section = un dossier. Permet de colocaliser sous-composants spécifiques (HeroShader, HeroText). Évite un dossier `components/` plat ingérable.
- **`src/components/providers/`** — Tous les providers React (Lenis, GSAP, Cursor) sont des composants client séparés, branchés dans le layout localisé pour pouvoir contrôler le mount via i18n.
- **`src/content/projects/[locale]/`** — Contenu MDX traduit par locale. Permet de servir le bon MDX selon `params.locale`. Front-matter validé via Zod (`projects.schema.ts`).
- **`src/components/shaders/`** — Les shaders GLSL vivent à côté du code GPU qui les consomme. Loader Webpack via `next.config.mjs` (`raw-loader` ou `@vercel/turbopack-loader`).
- **`src/i18n/`** — Convention next-intl 4 : `routing.ts`, `request.ts`, `navigation.ts`. Pas de mélange avec `src/lib/`.
- **`src/styles/tokens.css`** — Design tokens exposés en CSS variables, importés dans `globals.css`. Tailwind v4 `@theme` peut les consommer directement.
- **`src/types/`** — Types partagés. Types locaux à un composant restent colocalisés.

### Conventions de nommage

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Composants React | PascalCase | `ProjectCard.tsx` |
| Fichiers utilitaires | kebab-case | `reduced-motion.ts` |
| Hooks | camelCase préfixé `use` | `useMediaQuery.ts` |
| Variables CSS | kebab-case préfixées `--` | `--bg-elevated` |
| Constantes | UPPER_SNAKE_CASE | `DEFAULT_LOCALE` |
| Types | PascalCase | `type Project` |
| Slugs MDX | kebab-case | `gecko-agent.mdx` |

### Path aliases (tsconfig)

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/i18n/*": ["./src/i18n/*"],
      "@/messages/*": ["./src/messages/*"]
    }
  }
}
```

### Convention RSC vs Client

- **Server par défaut.** Toutes les pages et la majorité des composants statiques (Footer, Tag, Button).
- **Client uniquement si nécessaire.** Tout composant qui utilise `useState`, `useEffect`, listeners DOM, ou les libs animation (Framer Motion, GSAP, Lenis, R3F) est marqué `'use client'`.
- **Pattern.** Préférer isoler la partie interactive dans un sous-composant client et garder le wrapper en server (ex: `<About>` server qui rend `<AboutTextClient>`).

### Fichiers de config racine

| Fichier | Rôle |
|---------|------|
| `next.config.mjs` | Config Next + MDX plugin + GLSL raw loader + Image config + headers sécurité |
| `middleware.ts` | next-intl middleware (locale matching, redirects `/` → `/fr` ou `/en`) |
| `biome.json` | Lint + format unifié (replace ESLint + Prettier) |
| `tsconfig.json` | TS strict + paths + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` |
| `postcss.config.mjs` | Tailwind v4 via PostCSS |
| `.env.example` | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |
