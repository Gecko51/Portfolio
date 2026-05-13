# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## État actuel du projet

**Le repo est en phase de spécification — aucun code Next.js n'est encore initialisé.** Seuls existent :

- `PRD.md` — vision produit, user stories, modules MVP, stack technique, milestones (v0.1 → v1.0).
- `DEV-RULES.md` — règles de code, UI/UX, structure, données, sécurité, git, debug. **Source de vérité contraignante** pour tout code futur.
- `STRUCTURE.md` — arborescence cible Next.js 15 (App Router) avec conventions de nommage et path aliases.
- `CV_Guillaume_Gay.md` — contenu CV bilingue FR/EN qui alimentera la home et le PDF téléchargeable.

**Avant de coder quoi que ce soit, lire `DEV-RULES.md` en entier.** Ces règles overrident les conventions par défaut.

## Stack cible (à initialiser en Phase 1)

Next.js 15 (App Router + RSC) · React 19 · TypeScript strict (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`) · Tailwind v4 (`@theme`) · Framer Motion 12 · GSAP 3 + ScrollTrigger + SplitText · Lenis · React Three Fiber + drei + GLSL · next-intl 4 (fr/en) · MDX (`@next/mdx`) · Biome (lint + format) · pnpm · Vercel + Cloudflare DNS · Plausible.io.

Pas d'ESLint/Prettier (remplacés par Biome). Pas de Contentlayer (préférer `@next/mdx` natif).

## Commandes (après init Phase 1)

```bash
pnpm dev              # dev server (Turbopack)
pnpm build            # build production
pnpm start            # serve build local
pnpm lint             # biome check (lint + format diff)
pnpm format           # biome format --write
pnpm tsc --noEmit     # type check sans émission
```

Workflow de fin de phase (DEV-RULES §8) : `pnpm build` → `pnpm lint` → `pnpm tsc --noEmit` → QA manuelle → Lighthouse ≥ 90 → MAJ README → commit `chore(release): close phase X` → `git tag v0.X-[label]` → `git push --tags`.

## Architecture clé

Voir `STRUCTURE.md` pour l'arborescence détaillée. Points qui demandent plusieurs fichiers à lire pour comprendre :

- **Routing localisé** — toutes les routes vivent sous `src/app/[locale]/`. Les locales (`fr`, `en`) sont définies dans `src/i18n/routing.ts` et appliquées par `middleware.ts`. Pour les liens internes, importer `Link` / `useRouter` depuis `@/i18n/navigation`, **jamais** depuis `next/link` ou `next/navigation` directement.
- **RSC par défaut** — un composant n'est `'use client'` que s'il utilise state/effects/DOM listeners ou les libs animation (Framer, GSAP, Lenis, R3F). Pattern : wrapper server (`<About>`) qui rend un sous-composant client (`<AboutTextClient>`).
- **Providers globaux** dans `src/components/providers/` (Lenis, GSAP, Cursor), montés dans le layout `[locale]` — pas dans la page.
- **Sections colocalisées** — chaque section vit dans son dossier (`src/components/sections/Hero/`) avec ses sous-composants (`HeroShader.tsx`, `HeroText.tsx`).
- **Contenu MDX projets** dans `src/content/projects/[locale]/[slug].mdx`. Frontmatter validé par Zod (`src/lib/projects.schema.ts`). Lecture uniquement via `src/lib/projects.ts` — jamais de `fs.readFile` direct dans un composant.
- **Design tokens** en CSS variables dans `src/styles/tokens.css`, exposés à Tailwind v4 via `@theme` dans `globals.css`. Palette dark : `--bg #0A0A0A`, `--fg #F5F5F5`, accent ember `--accent #FF5B1F`.
- **Shaders GLSL** dans `src/components/shaders/`, chargés via raw-loader configuré dans `next.config.mjs`. `<HeroShader>` lazy-loaded via `next/dynamic` avec `ssr: false` et fallback gradient CSS.
- **Animations** — Framer pour transitions de pages et micro-interactions ; GSAP pour scroll-triggered, pin, scroll horizontal, SplitText. Easings centralisés dans `src/lib/animations.ts`. Tout `ScrollTrigger` créé dans `useGSAP()` (depuis `@gsap/react`) pour cleanup auto.

## Phases de développement

PRD §10 définit 5 phases avec tags git :

1. **v0.1-foundation** — init Next + i18n + layout + providers + page home placeholder.
2. **v0.2-hero-about** — Hero shader + About + curseur custom.
3. **v0.3-experience** — Timeline pin + progress line.
4. **v0.4-projects** — Galerie scroll horizontal + pages détail MDX + transition FLIP.
5. **v1.0-mvp** — Contact + SEO complet + analytics + deploy Vercel.

Ne pas mélanger les phases : terminer + tagger avant de passer à la suivante.

## Règles non négociables (extraits DEV-RULES)

- **Zéro string en dur dans le JSX** — tout passe par `useTranslations` / `getTranslations` (next-intl).
- **Jamais de `any`, jamais de `as unknown as T`.** Modéliser via Zod ou union discriminée.
- **Pas d'enum runtime** — utiliser des unions `as const` (`const LOCALES = ['fr', 'en'] as const`).
- **`prefers-reduced-motion` respecté partout** — shader → gradient statique, ScrollTriggers désactivés, transitions de page en fade 150ms.
- **Mobile-first 375px** — curseur custom off mobile, scroll horizontal projects → fallback vertical natif avec snap, magnetic effect off.
- **Path aliases obligatoires** — `@/components/...`, `@/lib/...`, `@/i18n/...`, etc. Jamais de `../../`.
- **Conventions de nommage** — composants PascalCase, utilitaires kebab-case, hooks `useXxx.ts`, slugs MDX kebab-case.
- **Commits** — format `type(scope): description`. Scopes : `hero`, `about`, `experience`, `projects`, `contact`, `i18n`, `seo`, `deps`, `ci`. Tag à chaque fin de phase.
- **Performance budget** — LCP < 2.5s, CLS = 0, INP < 200ms, bundle JS first load home < 200kb gzipped, Lighthouse perf/a11y/SEO ≥ 90.

## Documentation externe (Context7 MCP)

**Règle absolue** : avant d'écrire du code utilisant Next.js 15, React 19, Framer Motion 12, GSAP, R3F, Lenis, next-intl 4, Tailwind v4 ou `@vercel/og`, requêter Context7 (`resolve-library-id` puis `query-docs`). Ne **jamais** inventer une API de mémoire — les APIs récentes (App Router, Server Actions, hooks React 19, Tailwind v4 `@theme`) sont susceptibles d'être absentes ou périmées dans les données d'entraînement.

## Workflow de debug (DEV-RULES §9)

Pour tout bug non trivial : **Observer → Diagnostiquer (cause racine, pas symptôme) → 2-3 Hypothèses → Valider avec le dev si > 1 fichier touché → Corriger (fix minimal, pas de refactor opportuniste) → Expliquer (commit + commentaire pourquoi)**. Si le bug touche un shader GLSL ou la pipeline R3F → **STOP** et alerter.

## Identité visuelle

Portfolio dark premium maximaliste, **distinct de Gecko Mind** — ne pas réutiliser le gradient Solar Yellow → Burnt Orange. Accent ember `#FF5B1F` à utiliser avec parcimonie. Typo display = serif italique éditoriale (Migra ou fallback Fraunces / Instrument Serif). Aucune autre serif autorisée. Border radius max 12px — style tech-éditorial, pas friendly-rounded.

Footer doit créditer "Built with Claude Code" avec lien vers Anthropic (cohérent avec positionnement AI Builder).
