# Phase 1 — Foundation — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialiser le squelette technique du portfolio (Next.js 15 + TS strict + Tailwind v4 + Biome + next-intl FR/EN + providers animations + layout) jusqu'au tag `v0.1-foundation`, conforme à PRD §10 Phase 1 et DEV-RULES.

**Architecture:** App Router avec routes localisées sous `[locale]`, RSC par défaut + sous-composants client pour les libs animation. Providers (Lenis, GSAP) montés dans le layout `[locale]`. Design tokens en CSS variables consommés par Tailwind v4 via `@theme`. Aucune section visuelle n'est encore implémentée — chaque section de la home est un placeholder ancré (`#hero`, `#about`, etc.) prêt à recevoir le contenu des phases suivantes.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5 strict · Tailwind v4 · Biome 1.9 · next-intl 4 · Framer Motion 12 · GSAP 3 + @gsap/react · Lenis · pnpm.

**Specs source (lecture obligatoire avant toute tâche) :** `PRD.md`, `DEV-RULES.md`, `STRUCTURE.md`, `CLAUDE.md`.

**Convention DEV-RULES rappelée :** avant d'écrire du code utilisant Next 15 / Tailwind v4 / next-intl 4 / GSAP / Framer Motion 12 / Lenis → **toujours requêter Context7** (`resolve-library-id` puis `query-docs`). Ne jamais inventer une API de mémoire.

**Convention linguistique :** tous les commentaires de code en français (cf. CLAUDE.md global).

---

## File Structure

Fichiers créés ou modifiés à l'issue de la Phase 1 :

**Racine :**
- `package.json` — deps + scripts (créé par `create-next-app`, complété)
- `pnpm-lock.yaml`
- `tsconfig.json` — TS strict + paths
- `biome.json` — config Biome
- `next.config.mjs` — security headers + i18n plugin
- `middleware.ts` — next-intl locale matching
- `postcss.config.mjs` — Tailwind v4
- `.env.example` — vars publiques documentées
- `.gitignore`
- `README.md`
- `.vscode/settings.json` — formatter Biome
- `.github/workflows/lighthouse.yml` — placeholder (off pour Phase 1)

**`src/app/`**
- `layout.tsx` — root layout (HTML lang dynamique, fonts, métadonnées de base)
- `globals.css` — Tailwind v4 import + tokens + base reset
- `[locale]/layout.tsx` — providers (Lenis, GSAP) + Header + Footer
- `[locale]/page.tsx` — Home avec sections placeholder
- `[locale]/not-found.tsx` — 404 sobre

**`src/i18n/`**
- `routing.ts` — locales + defaultLocale
- `request.ts` — `getRequestConfig`
- `navigation.ts` — `Link` / `useRouter` typés

**`src/messages/`**
- `fr.json` / `en.json` — textes Header/Footer/Nav uniquement (sections viennent en Phases 2+)

**`src/styles/`**
- `tokens.css` — CSS variables design tokens
- `fonts.ts` — déclarations `next/font`

**`src/lib/`**
- `utils.ts` — helper `cn()` (clsx + tailwind-merge)
- `animations.ts` — easings constantes (stub minimal)

**`src/components/providers/`**
- `LenisProvider.tsx` — smooth scroll + intégration GSAP
- `GsapProvider.tsx` — registration ScrollTrigger

**`src/components/layout/`**
- `Header.tsx` — header flottant scroll-aware
- `Footer.tsx` — credit "Built with Claude Code"
- `LocaleSwitcher.tsx` — switch FR/EN sans reload
- `CVButton.tsx` — bouton download CV PDF

**`src/types/`**
- `i18n.ts` — type `Messages` dérivé du JSON FR

**`public/`**
- `cv/Guillaume-Gay-CV-FR.pdf` (placeholder vide, à remplacer plus tard)
- `cv/Guillaume-Gay-CV-EN.pdf` (idem)
- `icon.svg` (placeholder monogramme GG)

---

## Note méthodologique

La Phase 1 est du scaffolding, pas du feature work TDD. Chaque tâche suit le pattern : **installer/configurer → vérifier que ça démarre/compile → commit**. Pas de tests unitaires (DEV-RULES §1 confirme : pas de tests E2E au MVP, Lighthouse en CI à partir de Phase 5).

La vérification se fait via : `pnpm dev` (démarrage propre), `pnpm build` (compilation), `pnpm tsc --noEmit` (types), `pnpm lint` (Biome), QA navigateur sur localhost.

---

## Task 1 : Initialiser le repo git et le projet Next.js 15

**Files:**
- Create: tout le scaffold `create-next-app`
- Create: `.git/` (init)

- [ ] **Step 1 : Initialiser le repo git (le repo n'existe pas encore)**

Run depuis la racine du projet :
```bash
git init
git add CLAUDE.md PRD.md DEV-RULES.md STRUCTURE.md CV_Guillaume_Gay.md docs/
git commit -m "chore: import specs and CLAUDE.md baseline"
```

Expected : commit créé avec les 5 specs + le dossier docs.

- [ ] **Step 2 : Scaffold Next.js 15 dans le répertoire courant**

Run :
```bash
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --no-eslint
```

Réponses au prompt si demandées :
- TypeScript : Yes
- Tailwind : Yes (sera réécrit en v4 à la Task 4)
- src/ : Yes
- App Router : Yes
- import alias : `@/*`
- ESLint : No (on utilise Biome)

Expected : création de `package.json`, `tsconfig.json`, `src/app/`, `next.config.ts` (ou `.mjs`), `postcss.config.mjs`, etc. Aucune erreur.

- [ ] **Step 3 : Vérifier que le dev server démarre**

Run :
```bash
pnpm dev
```

Expected : sortie `✓ Ready in Xms` et `Local: http://localhost:3000`. Ouvrir le navigateur sur `http://localhost:3000` → page Next.js par défaut. Arrêter le serveur (Ctrl+C).

- [ ] **Step 4 : Commit du scaffold**

```bash
git add .
git commit -m "feat: bootstrap Next.js 15 with pnpm, TS, Tailwind, App Router"
```

---

## Task 2 : Configurer TypeScript strict + path aliases

**Files:**
- Modify: `tsconfig.json`

DEV-RULES §1 : strict + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` + `noImplicitOverride`. Path aliases conformes à STRUCTURE.md.

- [ ] **Step 1 : Réécrire tsconfig.json**

Contenu final :
```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
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
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2 : Vérifier le type check passe**

Run :
```bash
pnpm tsc --noEmit
```

Expected : sortie vide (aucune erreur). Si `verbatimModuleSyntax` casse un import existant de `create-next-app`, ajuster en `import type` selon nécessaire.

- [ ] **Step 3 : Commit**

```bash
git add tsconfig.json
git commit -m "feat(ts): enable strict mode and path aliases per DEV-RULES"
```

---

## Task 3 : Remplacer ESLint par Biome

**Files:**
- Create: `biome.json`
- Modify: `package.json` (scripts)

- [ ] **Step 1 : Installer Biome**

```bash
pnpm add -D --save-exact @biomejs/biome@^1.9.4
```

- [ ] **Step 2 : Créer biome.json**

Contenu :
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [".next", "node_modules", "public", "*.glsl", "*.mdx"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error",
        "noConsoleLog": "warn"
      },
      "style": {
        "noNonNullAssertion": "error",
        "useImportType": "error"
      },
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always",
      "jsxQuoteStyle": "double"
    }
  }
}
```

- [ ] **Step 3 : Ajouter scripts dans package.json**

Modifier la section `scripts` pour inclure :
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 4 : Vérifier lint clean**

```bash
pnpm lint
```

Expected : `Checked X files in Xms. No fixes applied.` ou éventuelles erreurs sur le code généré par `create-next-app` → exécuter `pnpm lint:fix` pour les corriger automatiquement.

- [ ] **Step 5 : Commit**

```bash
git add biome.json package.json pnpm-lock.yaml
git commit -m "chore(lint): replace ESLint with Biome 1.9"
```

---

## Task 4 : Setup Tailwind v4 + design tokens

**Files:**
- Modify: `package.json` (deps Tailwind v4)
- Modify: `postcss.config.mjs`
- Create: `src/styles/tokens.css`
- Modify: `src/app/globals.css`

DEV-RULES §2 : tokens dans CSS variables, exposés à Tailwind v4 via `@theme`. Palette : `--bg #0A0A0A`, `--fg #F5F5F5`, accent ember `#FF5B1F`.

- [ ] **Step 1 : Query Context7 pour Tailwind v4**

> Avant de modifier le setup : requêter Context7 sur `tailwindcss` v4 pour confirmer la syntaxe `@theme`, `@import "tailwindcss"`, et l'intégration PostCSS. Tailwind v4 abandonne `tailwind.config.js` au profit du CSS-first.

- [ ] **Step 2 : Installer Tailwind v4 (remplace v3 installée par create-next-app)**

```bash
pnpm remove tailwindcss
pnpm add -D tailwindcss@^4 @tailwindcss/postcss@^4
```

- [ ] **Step 3 : Réécrire postcss.config.mjs**

```javascript
// PostCSS — Tailwind v4 utilise le plugin dédié @tailwindcss/postcss
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

- [ ] **Step 4 : Créer src/styles/tokens.css**

```css
/* Design tokens du portfolio — exposés en CSS variables et consommés par Tailwind v4 via @theme. */
/* Palette : dark premium maximaliste, accent ember discret. Cf. PRD §8 et DEV-RULES §10. */
:root {
  /* Surfaces */
  --color-bg: #0a0a0a;
  --color-bg-elevated: #141414;
  --color-border: #1f1f1f;

  /* Texte */
  --color-fg: #f5f5f5;
  --color-fg-muted: #8a8a8a;

  /* Accents */
  --color-accent: #ff5b1f;
  --color-accent-soft: #ffb07a;

  /* Espaces et formes */
  --radius-sm: 4px;
  --radius: 8px;
  --radius-lg: 12px;
}
```

- [ ] **Step 5 : Réécrire src/app/globals.css**

```css
/* Globals — Tailwind v4 + tokens projet. */
@import 'tailwindcss';
@import '../styles/tokens.css';

/* Mapping tokens → Tailwind v4 design tokens via @theme. */
@theme {
  --color-bg: var(--color-bg);
  --color-bg-elevated: var(--color-bg-elevated);
  --color-fg: var(--color-fg);
  --color-fg-muted: var(--color-fg-muted);
  --color-accent: var(--color-accent);
  --color-accent-soft: var(--color-accent-soft);
  --color-border: var(--color-border);
  --radius-sm: var(--radius-sm);
  --radius: var(--radius);
  --radius-lg: var(--radius-lg);
}

/* Reset minimal et base dark only. */
html,
body {
  background: var(--color-bg);
  color: var(--color-fg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Focus ring custom — DEV-RULES §2 : pas de bleu navigateur. */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

- [ ] **Step 6 : Supprimer tailwind.config.ts s'il existe (Tailwind v4 = CSS-first, plus de fichier de config JS)**

```bash
rm -f tailwind.config.ts tailwind.config.js tailwind.config.mjs
```

- [ ] **Step 7 : Vérifier la compilation Tailwind**

```bash
pnpm dev
```

Ouvrir `http://localhost:3000`. Le fond doit être noir `#0A0A0A` (variable appliquée). Arrêter le serveur.

- [ ] **Step 8 : Commit**

```bash
git add package.json pnpm-lock.yaml postcss.config.mjs src/styles/ src/app/globals.css
git commit -m "feat(ui): setup Tailwind v4 with CSS design tokens"
```

---

## Task 5 : Setup next-intl avec routing FR/EN

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/navigation.ts`
- Create: `middleware.ts` (racine)
- Modify: `next.config.mjs`

- [ ] **Step 1 : Query Context7 pour next-intl 4**

> Requêter `next-intl` 4 sur Context7. APIs ciblées : `defineRouting`, `getRequestConfig`, `createNavigation`, `createMiddleware`. La signature a évolué entre v3 et v4.

- [ ] **Step 2 : Installer next-intl**

```bash
pnpm add next-intl@^4
```

- [ ] **Step 3 : Créer src/i18n/routing.ts**

```typescript
// Routing i18n — définition des locales supportées et de la locale par défaut.
// Cf. DEV-RULES §10 : importer Link/useRouter depuis @/i18n/navigation, jamais next/navigation.
import { defineRouting } from 'next-intl/routing';

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'fr',
  // localePrefix 'always' → /fr/... et /en/... explicites
  localePrefix: 'always',
});
```

- [ ] **Step 4 : Créer src/i18n/request.ts**

```typescript
// Configuration par requête — next-intl charge les messages JSON pour la locale active.
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale renvoie une promise dans next-intl 4 (App Router async params)
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 5 : Créer src/i18n/navigation.ts**

```typescript
// Wrappers typés pour Link, useRouter, redirect — toujours utiliser ces exports dans le projet.
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 6 : Créer middleware.ts à la racine**

```typescript
// Middleware next-intl — détecte la locale via accept-language, redirige / vers /fr ou /en.
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match toutes les routes sauf API, _next, fichiers statiques.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 7 : Modifier next.config.mjs pour activer le plugin next-intl**

Contenu complet :
```javascript
// Configuration Next.js — plugin next-intl + headers de sécurité (DEV-RULES §7).
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Les security headers complets seront ajoutés à la Task 15.
};

export default withNextIntl(nextConfig);
```

> Si `create-next-app` a généré `next.config.ts`, le supprimer et utiliser uniquement `next.config.mjs`.

- [ ] **Step 8 : Vérifier (étape différée : impossible tant que les messages et le layout localisé n'existent pas — passe à la Task 6 puis Task 8 avant de tester)**

- [ ] **Step 9 : Commit**

```bash
git add src/i18n/ middleware.ts next.config.mjs package.json pnpm-lock.yaml
git commit -m "feat(i18n): setup next-intl 4 routing for fr/en"
```

---

## Task 6 : Créer les fichiers messages FR/EN minimaux

**Files:**
- Create: `src/messages/fr.json`
- Create: `src/messages/en.json`
- Create: `src/types/i18n.ts`

Phase 1 = textes Nav/Header/Footer uniquement. Les sections (Hero, About, etc.) recevront leurs clés aux Phases 2+.

- [ ] **Step 1 : Créer src/messages/fr.json**

```json
{
  "Nav": {
    "skipToContent": "Aller au contenu",
    "home": "Accueil",
    "about": "À propos",
    "experience": "Parcours",
    "projects": "Projets",
    "contact": "Contact",
    "downloadCv": "Télécharger le CV",
    "switchToEnglish": "English"
  },
  "Footer": {
    "credit": "© Guillaume Gay 2026",
    "builtWith": "Built with Claude Code",
    "version": "build {hash}"
  },
  "Home": {
    "placeholderHero": "Hero — à venir Phase 2",
    "placeholderAbout": "About — à venir Phase 2",
    "placeholderExperience": "Experience — à venir Phase 3",
    "placeholderProjects": "Projects — à venir Phase 4",
    "placeholderContact": "Contact — à venir Phase 5"
  }
}
```

- [ ] **Step 2 : Créer src/messages/en.json**

```json
{
  "Nav": {
    "skipToContent": "Skip to content",
    "home": "Home",
    "about": "About",
    "experience": "Experience",
    "projects": "Projects",
    "contact": "Contact",
    "downloadCv": "Download CV",
    "switchToEnglish": "Français"
  },
  "Footer": {
    "credit": "© Guillaume Gay 2026",
    "builtWith": "Built with Claude Code",
    "version": "build {hash}"
  },
  "Home": {
    "placeholderHero": "Hero — coming Phase 2",
    "placeholderAbout": "About — coming Phase 2",
    "placeholderExperience": "Experience — coming Phase 3",
    "placeholderProjects": "Projects — coming Phase 4",
    "placeholderContact": "Contact — coming Phase 5"
  }
}
```

- [ ] **Step 3 : Créer src/types/i18n.ts pour typer les messages**

```typescript
// Type Messages dérivé du JSON FR — next-intl utilise ce type pour autocomplete des clés.
import type messages from '@/messages/fr.json';

type Messages = typeof messages;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}

export type {};
```

- [ ] **Step 4 : Commit**

```bash
git add src/messages/ src/types/
git commit -m "feat(i18n): add Nav/Footer/Home placeholder messages for fr/en"
```

---

## Task 7 : Configurer les polices (next/font)

**Files:**
- Create: `src/styles/fonts.ts`

PRD §8 : Migra (display, payant — fallback Instrument Serif) + Geist Sans (body) + JetBrains Mono (accents).

- [ ] **Step 1 : Installer Geist (package officiel Vercel)**

```bash
pnpm add geist
```

- [ ] **Step 2 : Créer src/styles/fonts.ts**

```typescript
// Déclarations next/font — fonts self-hosted, optimisé CLS=0 (DEV-RULES §1).
// Display = Instrument Serif italique (fallback gratuit pour Migra, cf. PRD §8 hypothèse).
import { Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';

export const fontDisplay = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

// GeistSans est exporté directement avec sa variable CSS, pas d'appel constructeur.
export const fontBody = GeistSans;
```

- [ ] **Step 3 : Ajouter les variables font dans tokens.css (mise à jour)**

Ajouter à la fin de `src/styles/tokens.css` :
```css
/* Variables font injectées par next/font dans <html className={...}>. */
:root {
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-display-stack: var(--font-display), 'Instrument Serif', Georgia, serif;
  --font-mono-stack: var(--font-mono), 'JetBrains Mono', ui-monospace, monospace;
}

html {
  font-family: var(--font-sans);
}
```

- [ ] **Step 4 : Commit**

```bash
git add package.json pnpm-lock.yaml src/styles/fonts.ts src/styles/tokens.css
git commit -m "feat(ui): setup self-hosted fonts (Instrument Serif + Geist + JetBrains Mono)"
```

---

## Task 8 : Restructurer en routes localisées + layouts

**Files:**
- Modify: `src/app/layout.tsx` (root)
- Delete: `src/app/page.tsx` (généré par create-next-app)
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/not-found.tsx`

- [ ] **Step 1 : Réécrire src/app/layout.tsx (root layout minimal)**

```tsx
// Root layout — Next.js exige un root layout. On délègue l'essentiel au layout [locale].
// Ce layout n'a pas d'<html> car next-intl + App Router gèrent le lang dans [locale]/layout.
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Guillaume Gay — AI Builder & Full Stack Developer',
  description: 'Portfolio de Guillaume Gay, AI Builder reconverti après 21 ans dans l\'Armée de Terre. Founder Gecko Mind.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
```

- [ ] **Step 2 : Supprimer le page.tsx généré par create-next-app**

```bash
rm src/app/page.tsx
```

- [ ] **Step 3 : Créer src/app/[locale]/layout.tsx**

```tsx
// Layout localisé — contient <html lang>, providers i18n + futurs Lenis/GSAP, header, footer.
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { fontBody, fontDisplay, fontMono } from '@/styles/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Pré-rend les deux locales en static (DEV-RULES §1 : RSC par défaut).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Next 15 : params est une Promise → await obligatoire.
  const { locale } = await params;

  // Validation locale — 404 si non supportée.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Active le rendu static pour cette locale.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4 : Créer src/app/[locale]/page.tsx (Home avec sections placeholder)**

```tsx
// Home — sections placeholder ancrées. Le contenu réel arrive aux Phases 2-5.
import { getTranslations, setRequestLocale } from 'next-intl/server';

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <>
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">{t('placeholderHero')}</p>
      </section>
      <section id="about" className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">{t('placeholderAbout')}</p>
      </section>
      <section id="experience" className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">{t('placeholderExperience')}</p>
      </section>
      <section id="projects" className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">{t('placeholderProjects')}</p>
      </section>
      <section id="contact" className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">{t('placeholderContact')}</p>
      </section>
    </>
  );
}
```

> Note : les classes `text-fg-muted` fonctionnent grâce au mapping `@theme` de Task 4 (Tailwind v4 crée automatiquement les utilities depuis les `--color-*` déclarés).

- [ ] **Step 5 : Créer src/app/[locale]/not-found.tsx**

```tsx
// 404 sobre — phase 1, juste un texte centré.
export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-fg-muted font-mono">404</p>
      <p>Page introuvable.</p>
    </section>
  );
}
```

> Note : Header/Footer importés mais pas encore créés → la build cassera. Sera résolu après Tasks 12-13. Continuer sans tester pour l'instant.

- [ ] **Step 6 : Commit (sera resté en état non-buildable jusqu'à Task 13 — assumer)**

```bash
git add src/app/
git commit -m "feat(app): scaffold localized [locale] layout and home placeholder"
```

---

## Task 9 : Installer les libs d'animation

**Files:**
- Modify: `package.json`

- [ ] **Step 1 : Installer Framer Motion, GSAP, @gsap/react, Lenis, clsx + tailwind-merge**

```bash
pnpm add framer-motion@^12 gsap@^3 @gsap/react@^2 lenis@^1
pnpm add clsx tailwind-merge
```

- [ ] **Step 2 : Créer src/lib/utils.ts (helper cn)**

```typescript
// cn() — concaténation de classes Tailwind avec dedupe et conflits résolus.
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3 : Créer src/lib/animations.ts (easings constantes)**

```typescript
// Constantes d'animation partagées — Framer Motion et GSAP.
// Stub minimal Phase 1. Sera enrichi aux Phases 2+.
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
} as const;
```

- [ ] **Step 4 : Commit**

```bash
git add package.json pnpm-lock.yaml src/lib/
git commit -m "feat(deps): add framer-motion, gsap, lenis, cn helper"
```

---

## Task 10 : Créer LenisProvider

**Files:**
- Create: `src/components/providers/LenisProvider.tsx`

- [ ] **Step 1 : Query Context7 pour Lenis**

> Requêter `lenis` pour confirmer l'API d'instanciation (constructeur, options `lerp`, méthode `raf`, integration GSAP `ScrollTrigger`).

- [ ] **Step 2 : Créer src/components/providers/LenisProvider.tsx**

```tsx
'use client';

// LenisProvider — smooth scroll global avec lerp 0.08 (PRD §8 et DEV-RULES §10).
// Désactivé si prefers-reduced-motion (DEV-RULES §10).
import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type LenisProviderProps = {
  children: ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Respecter prefers-reduced-motion : pas de smooth scroll si l'user le demande.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    // Synchroniser Lenis et GSAP ScrollTrigger (DEV-RULES §1).
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/providers/LenisProvider.tsx
git commit -m "feat(providers): add LenisProvider with GSAP sync and reduced-motion guard"
```

---

## Task 11 : Créer GsapProvider

**Files:**
- Create: `src/components/providers/GsapProvider.tsx`

- [ ] **Step 1 : Créer src/components/providers/GsapProvider.tsx**

```tsx
'use client';

// GsapProvider — enregistre les plugins GSAP (ScrollTrigger).
// SplitText sera ajouté quand utilisé (Phase 2 Hero). Plugin payant : vérifier licence avant.
import { useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type GsapProviderProps = {
  children: ReactNode;
};

export function GsapProvider({ children }: GsapProviderProps) {
  useEffect(() => {
    // Enregistrement plugins GSAP côté client uniquement.
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2 : Mounter Lenis + Gsap dans le layout [locale]**

Modifier `src/app/[locale]/layout.tsx` — wrapper `<NextIntlClientProvider>` avec les providers d'animation :

```tsx
// Imports à ajouter :
import { LenisProvider } from '@/components/providers/LenisProvider';
import { GsapProvider } from '@/components/providers/GsapProvider';

// Dans le return, remplacer le contenu de <body> par :
<body>
  <NextIntlClientProvider>
    <GsapProvider>
      <LenisProvider>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </LenisProvider>
    </GsapProvider>
  </NextIntlClientProvider>
</body>
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/providers/GsapProvider.tsx src/app/[locale]/layout.tsx
git commit -m "feat(providers): add GsapProvider and mount animation providers in layout"
```

---

## Task 12 : Construire Header + LocaleSwitcher + CVButton

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/LocaleSwitcher.tsx`
- Create: `src/components/layout/CVButton.tsx`

- [ ] **Step 1 : Créer src/components/layout/LocaleSwitcher.tsx**

```tsx
'use client';

// LocaleSwitcher — switch FR ↔ EN en préservant le path (next-intl 4 useRouter localisé).
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { LOCALES, type Locale } from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Nav');

  // Locale cible = l'autre locale.
  const targetLocale: Locale = locale === 'fr' ? 'en' : 'fr';

  const handleSwitch = () => {
    router.replace(pathname, { locale: targetLocale });
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className="font-mono text-xs uppercase tracking-wide text-fg-muted hover:text-fg transition-colors"
      aria-label={t('switchToEnglish')}
    >
      {targetLocale.toUpperCase()}
    </button>
  );
}

// Référence pour suppression d'éventuel warning : LOCALES exporté côté lib mais pas consommé ici.
void LOCALES;
```

> Nettoyer le `void LOCALES;` final qui est juste un garde-fou — il est superflu, ne pas l'inclure. Version finale propre du composant : retirer la dernière ligne.

- [ ] **Step 2 : Créer src/components/layout/CVButton.tsx**

```tsx
// CVButton — bouton de téléchargement du CV PDF selon la locale active.
// Server component : pas de state.
import { getLocale, getTranslations } from 'next-intl/server';

export async function CVButton() {
  const locale = await getLocale();
  const t = await getTranslations('Nav');
  const fileName = locale === 'fr' ? 'Guillaume-Gay-CV-FR.pdf' : 'Guillaume-Gay-CV-EN.pdf';

  return (
    <a
      href={`/cv/${fileName}`}
      download
      className="font-mono text-xs uppercase tracking-wide text-fg hover:text-accent transition-colors"
    >
      {t('downloadCv')}
    </a>
  );
}
```

- [ ] **Step 3 : Créer src/components/layout/Header.tsx (scroll-aware via Framer Motion)**

```tsx
'use client';

// Header flottant scroll-aware — réduit au scroll down, revient au scroll up (PRD §3 Module 1).
// Magnetic et curseur custom viennent en Phase 2.
import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';
import { CVButton } from './CVButton';

export function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const t = useTranslations('Nav');

  // Sur scroll : direction down → hide, direction up → show. Au-dessus de 100px seulement.
  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current < 100) {
      setHidden(false);
      return;
    }
    setHidden(current > previous);
  });

  return (
    <>
      {/* Skip link a11y — DEV-RULES §2 */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-bg-elevated focus:text-fg focus:px-4 focus:py-2 focus:rounded"
      >
        {t('skipToContent')}
      </a>

      <motion.header
        animate={hidden ? 'hidden' : 'visible'}
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-bg/80 backdrop-blur-sm border-b border-border"
      >
        <Link href="/" className="font-display text-xl tracking-tight">
          GG
        </Link>

        <nav className="flex items-center gap-6">
          <CVButton />
          <LocaleSwitcher />
        </nav>
      </motion.header>
    </>
  );
}
```

> Note : `font-display`, `bg-bg`, etc. proviennent automatiquement de `@theme` (Tailwind v4) si les classes sont déclarées dans tokens. Si nécessaire, ajouter aux tokens : `--font-display` mappé sur `var(--font-display-stack)`.

- [ ] **Step 4 : Ajuster src/styles/tokens.css pour exposer les font tokens à Tailwind**

Ajouter dans `globals.css` à l'intérieur du `@theme { ... }` :
```css
--font-display: var(--font-display-stack);
--font-mono: var(--font-mono-stack);
--font-sans: var(--font-sans);
```

- [ ] **Step 5 : Commit**

```bash
git add src/components/layout/
git commit -m "feat(layout): add scroll-aware Header with LocaleSwitcher and CVButton"
```

---

## Task 13 : Construire Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1 : Créer src/components/layout/Footer.tsx**

```tsx
// Footer minimal — crédit Claude Code + version build hash injecté au build.
import { getTranslations } from 'next-intl/server';

// Hash de build injecté via env var au build Vercel (NEXT_PUBLIC_BUILD_HASH).
const buildHash = (process.env.NEXT_PUBLIC_BUILD_HASH ?? 'dev').slice(0, 7);

export async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="border-t border-border px-6 py-6 text-xs font-mono text-fg-muted flex flex-col sm:flex-row items-center justify-between gap-2">
      <span>{t('credit')}</span>
      <span className="flex items-center gap-2">
        <a
          href="https://claude.com/claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg transition-colors"
        >
          {t('builtWith')}
        </a>
        <span aria-hidden>·</span>
        <span>{t('version', { hash: buildHash })}</span>
      </span>
    </footer>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(layout): add minimal Footer with Claude Code credit"
```

---

## Task 14 : Ajouter les PDFs CV placeholder et favicon

**Files:**
- Create: `public/cv/Guillaume-Gay-CV-FR.pdf` (placeholder)
- Create: `public/cv/Guillaume-Gay-CV-EN.pdf` (placeholder)
- Create: `public/icon.svg` (placeholder GG)

- [ ] **Step 1 : Créer le dossier cv et y placer des PDFs placeholder**

Sur Windows / PowerShell :
```bash
mkdir -p public/cv
# Crée 2 PDFs vides (à remplacer par les vrais avant prod).
# Méthode portable : fichier binaire minimal PDF 1.0 valide.
```

Créer chacun des deux fichiers via Write avec ce contenu PDF minimal valide :
```
%PDF-1.0
1 0 obj<</Pages 2 0 R>>endobj
2 0 obj<</Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Parent 2 0 R>>endobj
trailer<</Root 1 0 R>>
```

> Alternative simple : générer un PDF blank via un outil ou remplacer par le PDF réel quand prêt. Pour Phase 1, un fichier 0-byte fait l'affaire — le lien fonctionnera, le download donnera un fichier vide à remplacer.

- [ ] **Step 2 : Créer un favicon SVG monogramme GG**

`public/icon.svg` :
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="6" fill="#0A0A0A"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-style="italic" font-size="16" fill="#F5F5F5">GG</text>
</svg>
```

- [ ] **Step 3 : Commit**

```bash
git add public/
git commit -m "feat(assets): add placeholder CV PDFs and GG favicon"
```

---

## Task 15 : Security headers + housekeeping (README, .env, .vscode)

**Files:**
- Modify: `next.config.mjs` (headers de sécurité)
- Create: `.env.example`
- Modify: `README.md`
- Create: `.vscode/settings.json`

- [ ] **Step 1 : Ajouter les headers de sécurité dans next.config.mjs**

DEV-RULES §7. Contenu final de `next.config.mjs` :
```javascript
// Configuration Next.js — plugin next-intl + headers de sécurité (DEV-RULES §7).
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

> CSP strict est volontairement omis pour Phase 1 (Plausible + fonts + WebGL Phase 2 le complexifient). Sera ajouté à Phase 5.

- [ ] **Step 2 : Créer .env.example**

```bash
# URL canonique du site (SSR metadata, OG, sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Domaine Plausible — Phase 5
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=guillaumegay.dev

# Hash de build injecté par Vercel automatiquement (VERCEL_GIT_COMMIT_SHA)
# NEXT_PUBLIC_BUILD_HASH=
```

- [ ] **Step 3 : Réécrire README.md**

```markdown
# Portfolio Guillaume Gay

Portfolio one-page premium — Next.js 15 + TypeScript strict + Tailwind v4 + Framer Motion + GSAP + Lenis + R3F + next-intl.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Framer Motion 12 · GSAP 3 · Lenis · React Three Fiber · next-intl 4 · MDX · Biome · pnpm · Vercel.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Le site démarre sur http://localhost:3000 et redirige vers /fr ou /en selon `accept-language`.

## Scripts

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Build production |
| `pnpm start` | Serve build local |
| `pnpm lint` | Biome check |
| `pnpm lint:fix` | Biome check --write |
| `pnpm format` | Biome format --write |
| `pnpm typecheck` | tsc --noEmit |

## Avancement

- [x] **Phase 1 — Foundation** (`v0.1-foundation`) — init Next + i18n + providers + layout placeholder
- [ ] **Phase 2 — Hero & About** (`v0.2-hero-about`)
- [ ] **Phase 3 — Experience timeline** (`v0.3-experience`)
- [ ] **Phase 4 — Projects gallery** (`v0.4-projects`)
- [ ] **Phase 5 — Contact + Polish + Deploy** (`v1.0-mvp`)

## Documentation

- `PRD.md` — vision produit et user stories
- `DEV-RULES.md` — règles de code et de workflow
- `STRUCTURE.md` — arborescence cible
- `CLAUDE.md` — guidance pour Claude Code

## Deploy

Vercel (prod sur `main`, preview sur `dev` et PRs). DNS Cloudflare.
```

- [ ] **Step 4 : Créer .vscode/settings.json**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "[typescript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[typescriptreact]": { "editor.defaultFormatter": "biomejs.biome" },
  "[javascript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[json]": { "editor.defaultFormatter": "biomejs.biome" }
}
```

- [ ] **Step 5 : Commit**

```bash
git add next.config.mjs .env.example README.md .vscode/
git commit -m "chore(security): add headers, .env.example, README, vscode settings"
```

---

## Task 16 : QA finale + tag v0.1-foundation

**Files:** aucun (validation)

DEV-RULES §8 : workflow de fin de phase.

- [ ] **Step 1 : Vérifier le build production**

```bash
pnpm build
```

Expected : sortie `✓ Generating static pages (X/X)` sans erreur. Les routes `/fr` et `/en` doivent apparaître dans la liste des pages buildées.

- [ ] **Step 2 : Vérifier lint clean**

```bash
pnpm lint
```

Expected : `Checked X files. No fixes applied.`

- [ ] **Step 3 : Vérifier type check**

```bash
pnpm typecheck
```

Expected : aucune sortie (zéro erreur TS).

- [ ] **Step 4 : QA manuelle en navigateur (`pnpm dev`)**

Checklist à exécuter sur `http://localhost:3000` :
- [ ] `/` redirige vers `/fr` (locale par défaut) ou `/en` selon accept-language
- [ ] `/fr` affiche la page avec sections placeholder
- [ ] `/en` affiche la page avec sections placeholder en anglais
- [ ] Click sur le LocaleSwitcher dans le header → switch FR ↔ EN sans full reload, position scroll préservée
- [ ] Click sur "Télécharger le CV" / "Download CV" → téléchargement du PDF placeholder
- [ ] Skip link visible au focus clavier (Tab)
- [ ] Header reste fixed, se cache au scroll down, réapparait au scroll up
- [ ] Smooth scroll Lenis actif (scroll molette doit donner un effet fluide)
- [ ] Active `prefers-reduced-motion` dans DevTools (Rendering → Emulate CSS media features) → Lenis désactivé, scroll natif
- [ ] Footer affiche "© Guillaume Gay 2026 · Built with Claude Code · build dev"
- [ ] DevTools Console : zéro erreur ou warning critique
- [ ] DevTools Network : fonts servies en self-hosted depuis `_next/static/` (pas de requête vers fonts.googleapis.com)
- [ ] DevTools Headers : presence de `X-Frame-Options: DENY`, `Strict-Transport-Security`, etc.

- [ ] **Step 5 : Lighthouse audit (Chrome DevTools, mode incognito)**

Run un Lighthouse audit en mode desktop sur `/fr`. Cibles DEV-RULES §10 :
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 90

> Note : Phase 1 est minimaliste donc les scores devraient être très élevés. Si un score < 90, diagnostiquer avant de tagger.

- [ ] **Step 6 : Commit final de release**

```bash
git add -A
git commit -m "chore(release): close phase 1 — foundation"
```

- [ ] **Step 7 : Tag v0.1-foundation**

```bash
git tag v0.1-foundation
git log --oneline -1
```

Expected : commit taggé visible. Pas de `git push --tags` à ce stade (le remote n'est pas encore configuré — sera fait à Phase 5 deploy).

- [ ] **Step 8 : Rapport de phase**

Créer `docs/superpowers/reports/2026-05-13-phase-1-foundation.md` avec le template DEV-RULES §8 :

```markdown
## Rapport Phase 1 — Foundation

### Implémenté
- Next.js 15 + TS strict + path aliases + Biome
- Tailwind v4 + design tokens CSS variables (palette dark + accent ember)
- next-intl 4 routing fr/en + middleware + messages placeholder
- Fonts self-hosted (Instrument Serif + Geist Sans + JetBrains Mono)
- Layout [locale] + page Home avec sections placeholder ancrées
- LenisProvider + GsapProvider (avec garde prefers-reduced-motion)
- Header scroll-aware (Framer Motion) + LocaleSwitcher + CVButton
- Footer minimal avec crédit Claude Code
- Security headers (HSTS, X-Frame-Options, Referrer-Policy, etc.)
- README + .env.example + .vscode settings

### Non implémenté (et pourquoi)
- CSP strict — reporté à Phase 5 (Plausible + WebGL ajoutent de la complexité)
- CV PDFs réels — placeholders 0-byte, à remplacer avec les vrais avant prod
- Migra display font — payante (Pangram Pangram), Instrument Serif en fallback Phase 1
- Lighthouse CI — workflow .github/workflows/lighthouse.yml reporté à Phase 5

### Problèmes rencontrés
- [À compléter pendant l'exécution]

### Recommandations Phase 2
- Avant le shader Hero R3F, vérifier la perf baseline (Lighthouse Performance ≥ 90 sans shader).
- Décider du sort de Migra (achat ou maintien Instrument Serif).
- Phase 2 introduira `<HeroShader>` lazy-loaded via `next/dynamic` + fallback CSS gradient.

### Lighthouse (Phase 1 placeholder home)
- Performance : 9X
- Accessibility : 9X
- Best practices : 9X
- SEO : 9X
```

- [ ] **Step 9 : Commit du rapport**

```bash
git add docs/superpowers/reports/
git commit -m "docs: add Phase 1 foundation report"
```

---

## Self-Review

**Spec coverage (vs PRD §10 Phase 1) :**
- ✅ Init Next.js 15 + TS strict + Tailwind v4 + Biome → Tasks 1-4
- ✅ Setup next-intl (fr/en) + middleware → Tasks 5-6
- ✅ Layout [locale] + fonts self-hosted → Tasks 7-8
- ✅ Design tokens CSS variables + theme provider (dark only) → Task 4
- ✅ Setup Lenis smooth scroll + provider → Task 10
- ✅ Setup Framer Motion + GSAP + ScrollTrigger → Tasks 9-11
- ✅ Header flottant + switcher i18n + bouton CV → Task 12
- ✅ Footer minimal → Task 13
- ✅ Page Home blanche avec sections ancres placeholder → Task 8

**Placeholder scan :**
- Aucune mention de "TBD" ou "implement later" dans les steps de code (toutes les implémentations sont fournies).
- "À compléter pendant l'exécution" dans le rapport Phase 1 est attendu (placeholder dans le template, pas dans le plan lui-même).
- CV PDFs placeholder vide est documenté explicitement comme limitation Phase 1.

**Type consistency :**
- `Locale` exporté depuis `@/i18n/routing` et réutilisé dans `LocaleSwitcher` ✓
- `LOCALES` constant utilisé via `routing.locales` ✓
- Imports `Link`, `useRouter`, `usePathname` toujours depuis `@/i18n/navigation` ✓

**Risques connus à signaler à l'exécutant :**
1. **Migra non installé** — Instrument Serif en fallback. Si Guillaume veut Migra, prévoir l'achat + le self-host avant Phase 2.
2. **CSS Tailwind v4 syntax** — v4 est en RC/release récente. Si la syntaxe `@theme` a évolué, requêter Context7 et adapter avant Task 4.
3. **next-intl 4 API** — l'API a changé entre v3 et v4 (notamment `requestLocale` promise, `setRequestLocale`). Requêter Context7 si doute.
4. **PDFs vides** — un PDF vraiment 0-byte peut faire bugger certains navigateurs au download. Utiliser plutôt le snippet PDF minimal valide donné en Task 14 Step 1.

---

## Execution Handoff

Plan complet sauvegardé dans `docs/superpowers/plans/2026-05-13-phase-1-foundation.md`. Deux options d'exécution :

**1. Subagent-Driven (recommandé)** — Je dispatche un subagent frais par tâche, je review entre chaque tâche, itération rapide.

**2. Inline Execution** — J'exécute les tâches dans cette session via executing-plans, batch d'exécution avec checkpoints.

**Quelle approche tu préfères ?**
