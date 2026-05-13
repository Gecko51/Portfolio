# Phase 4 — Projects Gallery — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer la galerie projets — section scroll horizontal desktop (GSAP pin + translate), fallback scroll horizontal natif mobile avec snap, 4 cards XL (Gecko Mind, Gecko Agent, Skill Ecosystem, geckomind.fr), pages détail MDX `/[locale]/projects/[slug]` avec hero + content + gallery + back link, transition page fade. Tag `v0.4-projects`.

**Architecture:** Contenu MDX en `src/content/projects/[locale]/[slug].mdx` avec frontmatter validé par Zod (`gray-matter` pour parsing + `next-mdx-remote/rsc` pour compileMDX en RSC). Lib `src/lib/projects.ts` centralise les accès filesystem (jamais d'fs depuis un composant). ProjectsGallery = section pin GSAP avec translation horizontale du strip ; mobile = scroll horizontal natif avec `scroll-snap`. Pages détail = routes statiques générées via `generateStaticParams` croisant locales × slugs.

**Tech Stack:** Next.js 16 + React 19 + TS strict + Tailwind v4 + next-intl 4 + Framer Motion 12 + GSAP 3 (déjà installés) + **nouvelles deps : `gray-matter`, `next-mdx-remote`, `remark-gfm`**.

**Specs source :** `PRD.md` §3 Module 5 (Projects), §5 (frontmatter schema), §6 (routes), `DEV-RULES.md` §4 (MDX local, lecture via lib uniquement), `STRUCTURE.md` (colocation sections/Projects, content/projects).

**Convention DEV-RULES rappelée :** Context7 obligatoire avant `next-mdx-remote` + setup. Slug MDX = slug route.

---

## Décisions par défaut (à valider en review user)

1. **4 cards** au lieu de "3-5" PRD : Gecko Mind, Gecko Agent, Skill Ecosystem, geckomind.fr. Si un 5ème projet pertinent émerge, il sera trivial à ajouter (juste un MDX de plus).
2. **MDX runtime compilation via `next-mdx-remote/rsc`** plutôt que `@next/mdx` natif : facilite le couplage avec params dynamiques (locale + slug), moins de config Turbopack, pattern App Router standard.
3. **Pas de FLIP exact card → detail** : juste une transition fade entre routes via Framer AnimatePresence sur le layout root. FLIP layoutId est complexe en App Router (perdure entre route changes mal supporté). Reporté à Phase 5 si critique.
4. **Mobile = scroll horizontal natif avec snap** plutôt que stack vertical : préserve l'identité "galerie horizontale" du design.
5. **Covers projets = SVG placeholders** générés (similaire à `portrait-placeholder.svg`). Vraies images à remplacer en Phase 5.
6. **Scroll restore au retour** : on s'appuie d'abord sur le scrollRestoration natif Next + Lenis. Si broken, on ajoute sessionStorage manual (Phase 5 polish).

---

## File Structure

**Lib + types**
- `src/lib/projects.schema.ts` — Zod schema du frontmatter projet.
- `src/lib/projects.ts` — `getProjectSlugs(locale)`, `getProject(slug, locale)`, `getAllProjects(locale)` (lectures fs).
- `src/types/project.ts` — type `Project` dérivé du schema Zod.

**MDX content**
- `src/content/projects/fr/gecko-mind.mdx`
- `src/content/projects/fr/gecko-agent.mdx`
- `src/content/projects/fr/skill-ecosystem.mdx`
- `src/content/projects/fr/geckomind-fr.mdx`
- `src/content/projects/en/...` (4 fichiers équivalents)

**Assets**
- `public/projects/gecko-mind/cover.svg` (placeholder)
- `public/projects/gecko-agent/cover.svg`
- `public/projects/skill-ecosystem/cover.svg`
- `public/projects/geckomind-fr/cover.svg`

**Sections Projects (galerie home)**
- `src/components/sections/Projects/Projects.tsx` — server wrapper, fetch projets, traduit.
- `src/components/sections/Projects/ProjectsGallery.tsx` — client wrapper, GSAP pin + scroll horizontal (desktop) ; mobile = scroll natif avec snap.
- `src/components/sections/Projects/ProjectCard.tsx` — server card cliquable (Link vers detail).

**Project detail page**
- `src/app/[locale]/projects/[slug]/page.tsx` — route détail, `generateStaticParams`, `generateMetadata`, rend hero + content + gallery + nav.
- `src/app/[locale]/projects/[slug]/not-found.tsx` — 404 propre.
- `src/components/sections/Projects/ProjectDetail/ProjectHero.tsx` — hero détail (titre, tagline, year, role, stack tags).
- `src/components/sections/Projects/ProjectDetail/ProjectContent.tsx` — render MDX compilé.
- `src/components/sections/Projects/ProjectDetail/ProjectGallery.tsx` — grid d'images du projet (next/image).
- `src/components/sections/Projects/ProjectDetail/ProjectNav.tsx` — back link + lien externe (GitHub/live).

**Transitions**
- `src/components/providers/RouteTransition.tsx` — wrapper AnimatePresence sur le contenu pour fade entre routes.

**Modifs**
- `src/messages/fr.json` + `en.json` — namespace Projects (kicker, title, viewProject, backToGallery, etc.). Retire `placeholderProjects` de `Home`.
- `src/app/[locale]/page.tsx` — remplace placeholder Projects par `<Projects />`.
- `src/app/[locale]/layout.tsx` — mount `<RouteTransition>` autour de `{children}` dans `<main>` si on choisit cette approche.

---

## Note méthodologique

Pas de TDD. Validation = `pnpm typecheck` + `pnpm lint` + `pnpm build` + smoke tests curl + QA navigateur manuel.

---

## Task 1 : Install MDX deps + types

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1 : Installer les deps**

```bash
pnpm add gray-matter next-mdx-remote remark-gfm
```

Versions attendues : `gray-matter@^4`, `next-mdx-remote@^5`, `remark-gfm@^4`.

> Note Context7 : avant d'utiliser `next-mdx-remote/rsc`, vérifier que la version installée supporte Next 16. Si Context7 indique une version plus récente, suivre. `next-mdx-remote` est compatible Server Components depuis v4+.

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Aucun consommateur, build clean attendu.

- [ ] **Step 3 : Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat(deps): add gray-matter, next-mdx-remote, remark-gfm"
```

---

## Task 2 : Project schema Zod + type partagé

**Files:**
- Create: `src/lib/projects.schema.ts`
- Create: `src/types/project.ts`

DEV-RULES §4 : frontmatter validé par Zod, type dérivé.

- [ ] **Step 1 : Créer `src/lib/projects.schema.ts`**

```typescript
// Schéma Zod du frontmatter d'un projet MDX. Source de vérité pour le typage et la validation.
// Cf. PRD §5 (modèle de données) et DEV-RULES §4 (validation Zod obligatoire).
import { z } from 'zod';

export const projectFrontmatterSchema = z.object({
  // Slug identique au nom du fichier (sans .mdx). Pas vérifié ici (fait dans lib/projects.ts).
  slug: z.string().min(1),
  // Titre affiché dans la card et le détail.
  title: z.string().min(1),
  // Punchline en 1 ligne (sous le titre).
  tagline: z.string().min(1),
  // Année du projet — affichée discrètement.
  year: z.number().int().min(2000).max(2100),
  // Rôle endossé sur le projet.
  role: z.string().min(1),
  // Stack technique — array de strings, affiché en pills.
  stack: z.array(z.string().min(1)).min(1),
  // Chemin vers l'image de couverture (servie depuis /public).
  cover: z.string().startsWith('/'),
  // Galerie d'images additionnelles (optionnelle, vide en Phase 4 placeholders).
  gallery: z.array(z.string().startsWith('/')).default([]),
  // Liens externes — tous optionnels.
  links: z
    .object({
      github: z.string().url().optional(),
      live: z.string().url().optional(),
      caseStudy: z.string().url().optional(),
    })
    .default({}),
  // Ordre d'apparition dans la galerie (plus petit = plus à gauche).
  order: z.number().int().nonnegative(),
  // Si false, le projet n'apparaît pas dans la galerie principale (réservé pour archives).
  featured: z.boolean().default(true),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
```

- [ ] **Step 2 : Créer `src/types/project.ts`**

```typescript
// Type Project = frontmatter validé + contenu compilé prêt à rendre.
// Le frontmatter vient de projects.schema.ts ; le contenu est un ReactNode (output de compileMDX).
import type { ReactNode } from 'react';

import type { ProjectFrontmatter } from '@/lib/projects.schema';

export type Project = ProjectFrontmatter & {
  // ReactNode pré-compilé (côté serveur via next-mdx-remote/rsc) du body MDX.
  content: ReactNode;
};

// Pour la galerie home, on n'a pas besoin du contenu rendu — juste les meta.
export type ProjectMeta = ProjectFrontmatter;
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 4 : Commit**

```bash
git add src/lib/projects.schema.ts src/types/project.ts
git commit -m "feat(projects): add Zod frontmatter schema and Project type"
```

---

## Task 3 : Lib projects.ts (fs accessors)

**Files:**
- Create: `src/lib/projects.ts`

DEV-RULES §4 : `fs.readFile` UNIQUEMENT dans cette lib. Composants l'appellent, jamais l'inverse.

- [ ] **Step 1 : Créer `src/lib/projects.ts`**

```typescript
// Accès filesystem aux MDX projets. Tout passage fs DOIT passer par ce module (DEV-RULES §4).
// API : getProjectSlugs(locale), getProjectMeta(slug, locale), getProject(slug, locale), getAllProjectsMeta(locale).
import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

import { projectFrontmatterSchema } from './projects.schema';
import type { Project, ProjectMeta } from '@/types/project';

// Racine du contenu MDX projets. Résolu une fois (process.cwd() pendant le build/runtime).
const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content', 'projects');

// Liste les slugs (nom de fichier sans .mdx) pour une locale.
export async function getProjectSlugs(locale: string): Promise<string[]> {
  const dir = path.join(CONTENT_ROOT, locale);
  const files = await fs.readdir(dir);
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

// Lit + parse + valide le frontmatter d'un projet (sans compiler le contenu MDX).
// Utile pour la galerie home (n'a pas besoin du body).
export async function getProjectMeta(slug: string, locale: string): Promise<ProjectMeta | null> {
  const filePath = path.join(CONTENT_ROOT, locale, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const { data } = matter(raw);
  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Frontmatter invalide pour ${locale}/${slug}.mdx : ${parsed.error.message}`,
    );
  }
  return parsed.data;
}

// Lit + parse + valide + compile le MDX en ReactNode. Pour les pages détail.
export async function getProject(slug: string, locale: string): Promise<Project | null> {
  const filePath = path.join(CONTENT_ROOT, locale, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Frontmatter invalide pour ${locale}/${slug}.mdx : ${parsed.error.message}`,
    );
  }

  const compiled = await compileMDX({
    source: content,
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  return { ...parsed.data, content: compiled.content };
}

// Liste tous les projets meta pour une locale, triés par order croissant. Filtre featured=true.
export async function getAllProjectsMeta(locale: string): Promise<ProjectMeta[]> {
  const slugs = await getProjectSlugs(locale);
  const metas = await Promise.all(slugs.map((slug) => getProjectMeta(slug, locale)));
  return metas
    .filter((p): p is ProjectMeta => p !== null && p.featured)
    .sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint
```

(Le build cassera si on lance `pnpm build` car aucun MDX n'existe encore — c'est OK, on les crée en Task 4. Ne pas exécuter `pnpm build` à ce stade.)

- [ ] **Step 3 : Commit**

```bash
git add src/lib/projects.ts
git commit -m "feat(projects): add lib/projects.ts with fs accessors and MDX compilation"
```

---

## Task 4 : MDX projets (8 fichiers : 4 projets × FR/EN)

**Files:**
- Create: `src/content/projects/fr/gecko-mind.mdx`
- Create: `src/content/projects/fr/gecko-agent.mdx`
- Create: `src/content/projects/fr/skill-ecosystem.mdx`
- Create: `src/content/projects/fr/geckomind-fr.mdx`
- Create: `src/content/projects/en/gecko-mind.mdx`
- Create: `src/content/projects/en/gecko-agent.mdx`
- Create: `src/content/projects/en/skill-ecosystem.mdx`
- Create: `src/content/projects/en/geckomind-fr.mdx`

Chaque fichier = frontmatter YAML + corps MDX (~150-300 mots).

- [ ] **Step 1 : Créer `src/content/projects/fr/gecko-mind.mdx`**

```mdx
---
slug: gecko-mind
title: Gecko Mind
tagline: Service done-for-you de prospection LinkedIn et création de contenu B2B
year: 2024
role: Founder & AI Builder
stack:
  - Claude Code
  - Anthropic API
  - n8n
  - Airtable
  - Linked Helper 2
  - Chrome Extensions
cover: /projects/gecko-mind/cover.svg
gallery: []
links:
  live: https://geckomind.fr
order: 1
featured: true
---

## Le problème

Les solopreneurs, freelances et dirigeants TPE/PME B2B savent que LinkedIn est leur meilleur canal d'acquisition, mais le temps qu'ils mettent à prospecter et créer du contenu mange l'opérationnel. Les outils sur étagère sont génériques ; les agences coûtent cher pour des résultats moyens.

## L'approche

Gecko Mind est un service done-for-you : on s'occupe de A à Z. Prospection conversationnelle qualifiée, création de contenu LinkedIn cohérent avec la voix du client, gestion des réponses jusqu'au RDV. Sous le capot, une stack IA modulaire : 25+ skills Claude orchestrés, n8n pour les workflows, Airtable comme source de vérité, extensions Chrome pour l'automation sécurisée des actions LinkedIn.

## Ce que j'opère

- Direction technique, marketing, sales et opérations en autonomie complète
- Architecture skill-driven : chaque tâche (scoring, contenu, prospection, qualif) est une skill Claude isolée et documentée
- Itération continue sur la voix client : prompts ajustés au fil des semaines selon le retour de leurs prospects
- Reporting hebdomadaire au client : volume contacts, réponses, RDV bookés
```

- [ ] **Step 2 : Créer `src/content/projects/fr/gecko-agent.mdx`**

```mdx
---
slug: gecko-agent
title: Gecko Agent
tagline: Chrome extension open source pour automatiser les workflows LinkedIn et web
year: 2024
role: Solo developer
stack:
  - TypeScript
  - Chrome Extension API
  - Anthropic API
  - Computer Use
cover: /projects/gecko-agent/cover.svg
gallery: []
links:
  github: https://github.com/Gecko51
order: 2
featured: true
---

## Pourquoi

Les outils LinkedIn du marché sont fermés, payants au volume, et stockent les données client chez le vendeur. J'avais besoin d'une brique automation qui tourne dans MON navigateur, sur MES sessions LinkedIn, sans transit serveur externe. Gecko Agent est né de ce besoin opérationnel pour Gecko Mind, puis rendu open source.

## Ce que ça fait

Extension Chrome qui pilote des actions LinkedIn et web depuis un panel custom : extraction de profils, envoi de messages templated, scraping de feeds, intégration optionnelle avec Claude pour les décisions complexes (qualification d'un profil, génération d'une réponse contextuelle).

## Stack technique

- Manifest V3 Chrome Extension
- TypeScript strict, build via Vite
- Anthropic API (function calling) pour les décisions assistées IA
- Pas de backend : tout en local, données dans `chrome.storage`
- Compatible Computer Use pour des scénarios plus complexes

## Pourquoi open source

L'écosystème IA + automation manque d'exemples concrets et maintenables. Gecko Agent vise à servir de référence sur ces patterns.
```

- [ ] **Step 3 : Créer `src/content/projects/fr/skill-ecosystem.mdx`**

```mdx
---
slug: skill-ecosystem
title: Gecko Mind Skill Ecosystem
tagline: Bibliothèque privée de 25+ skills Claude pour automatiser les opérations B2B
year: 2024
role: Architect & Operator
stack:
  - Claude Cowork
  - Claude Code
  - MCP
  - Anthropic API
  - Markdown
cover: /projects/skill-ecosystem/cover.svg
gallery: []
links: {}
order: 3
featured: true
---

## Le contexte

Opérer Gecko Mind à l'échelle imposait de standardiser les tâches récurrentes : génération de contenu LinkedIn, scoring de prospects, qualification conversationnelle, traitement email, facturation. Chaque tâche avait son prompt, ses inputs, ses outputs — sans architecture, c'est l'enfer à maintenir.

## L'architecture

Inspirée de l'approche Claude Cowork, chaque skill suit la même structure :

- `SKILL.md` — définition du rôle, des inputs/outputs, des règles métier
- `references/` — exemples, prompts longs, données de référence
- `examples/` — sorties attendues sur cas types

Cette structure est compatible Claude Code (skills custom invocables en CLI) et Claude Cowork (skills web disponibles dans les conversations client).

## L'inventaire

25+ skills aujourd'hui en production, couvrant :

- **Prospection** : scoring, qualification, prospection conversationnelle, gestion de cadence
- **Contenu** : génération posts LinkedIn, voix client, formats variés (carousels, texte long)
- **Ops** : traitement email, facturation, reporting, gestion calendrier
- **Méta** : skills d'orchestration qui composent les autres

## Ce que ça change

Chaque nouveau client a un onboarding standardisé : on instancie les skills, on personnalise la voix, on push en prod. La marge opérationnelle est devenue gérable solo.
```

- [ ] **Step 4 : Créer `src/content/projects/fr/geckomind-fr.mdx`**

```mdx
---
slug: geckomind-fr
title: geckomind.fr
tagline: Landing page de l'offre Gecko Mind — identité visuelle custom
year: 2024
role: Designer & Developer
stack:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Vercel
cover: /projects/geckomind-fr/cover.svg
gallery: []
links:
  live: https://geckomind.fr
order: 4
featured: true
---

## L'enjeu

Donner à Gecko Mind une vitrine premium qui convertit en RDV pré-qualifiés. Pas un site corporate générique : une page qui transmet le positionnement "AI Builder qui opère votre prospection".

## Le design

Identité visuelle custom : gradient Solar Yellow → Burnt Orange comme fil rouge, fonds anthracite pour le contraste, typographie Space Mono pour l'accent tech. Animations subtiles, copy concentré sur les bénéfices client.

## L'implémentation

Next.js + TypeScript + Tailwind CSS. Pages statiques pour la perf, images optimisées Next/Image, hosting Vercel avec preview deployments. SEO de base (metadata + sitemap + OG). Analytics privacy-first via Plausible.

## Les apprentissages

C'est l'itération qui valide : 3 versions majeures de copy avant d'avoir le bon tempo. Le design final est venu après avoir laissé reposer la v1 et collecté les retours qualitatifs des premiers prospects.
```

- [ ] **Step 5 : Créer les 4 fichiers EN équivalents dans `src/content/projects/en/`**

Pour chaque fichier FR, créer la version EN. Frontmatter identique structure (mêmes clés, mêmes valeurs sauf `title` qui peut être traduit si différent, `tagline` qui DOIT être traduit, `role` qui doit être traduit). Le body est traduit complètement.

`src/content/projects/en/gecko-mind.mdx` :

```mdx
---
slug: gecko-mind
title: Gecko Mind
tagline: Done-for-you LinkedIn prospecting and B2B content creation service
year: 2024
role: Founder & AI Builder
stack:
  - Claude Code
  - Anthropic API
  - n8n
  - Airtable
  - Linked Helper 2
  - Chrome Extensions
cover: /projects/gecko-mind/cover.svg
gallery: []
links:
  live: https://geckomind.fr
order: 1
featured: true
---

## The problem

B2B solopreneurs, freelancers and SME leaders know LinkedIn is their best acquisition channel, but the time they spend prospecting and creating content eats into operations. Off-the-shelf tools are generic; agencies are expensive for mediocre results.

## The approach

Gecko Mind is a done-for-you service: end-to-end ownership. Qualified conversational prospecting, LinkedIn content aligned with the client's voice, response handling all the way to booked meetings. Under the hood, a modular AI stack: 25+ orchestrated Claude skills, n8n for workflows, Airtable as source of truth, Chrome extensions for safe LinkedIn automation.

## What I operate

- Tech, marketing, sales and operations leadership in full autonomy
- Skill-driven architecture: each task (scoring, content, prospecting, qualification) is an isolated, documented Claude skill
- Continuous iteration on client voice: prompts tuned over weeks based on prospect feedback
- Weekly client reporting: contact volume, replies, meetings booked
```

`src/content/projects/en/gecko-agent.mdx` :

```mdx
---
slug: gecko-agent
title: Gecko Agent
tagline: Open source Chrome extension automating LinkedIn and web workflows
year: 2024
role: Solo developer
stack:
  - TypeScript
  - Chrome Extension API
  - Anthropic API
  - Computer Use
cover: /projects/gecko-agent/cover.svg
gallery: []
links:
  github: https://github.com/Gecko51
order: 2
featured: true
---

## Why

LinkedIn tools on the market are closed, volume-priced, and store client data on the vendor side. I needed an automation brick that runs in MY browser, on MY LinkedIn sessions, without external server transit. Gecko Agent was born from this operational need at Gecko Mind, then open-sourced.

## What it does

Chrome extension that drives LinkedIn and web actions from a custom panel: profile extraction, templated message sending, feed scraping, optional Claude integration for complex decisions (profile qualification, contextual reply generation).

## Tech stack

- Manifest V3 Chrome Extension
- TypeScript strict, build via Vite
- Anthropic API (function calling) for AI-assisted decisions
- No backend: everything local, data in `chrome.storage`
- Compatible with Computer Use for more complex scenarios

## Why open source

The AI + automation ecosystem lacks concrete, maintainable examples. Gecko Agent aims to serve as a reference on these patterns.
```

`src/content/projects/en/skill-ecosystem.mdx` :

```mdx
---
slug: skill-ecosystem
title: Gecko Mind Skill Ecosystem
tagline: Private library of 25+ Claude skills automating B2B operations
year: 2024
role: Architect & Operator
stack:
  - Claude Cowork
  - Claude Code
  - MCP
  - Anthropic API
  - Markdown
cover: /projects/skill-ecosystem/cover.svg
gallery: []
links: {}
order: 3
featured: true
---

## Context

Running Gecko Mind at scale required standardizing recurring tasks: LinkedIn content generation, prospect scoring, conversational qualification, email triage, invoicing. Each task had its prompt, its inputs, its outputs — without architecture, maintenance hell.

## The architecture

Inspired by Claude Cowork's approach, every skill follows the same structure:

- `SKILL.md` — role definition, inputs/outputs, business rules
- `references/` — examples, long prompts, reference data
- `examples/` — expected outputs on typical cases

This structure is compatible with both Claude Code (custom skills callable in CLI) and Claude Cowork (web skills available in client conversations).

## Inventory

25+ skills in production today, covering:

- **Prospecting**: scoring, qualification, conversational prospecting, cadence management
- **Content**: LinkedIn post generation, client voice, varied formats (carousels, long-form)
- **Ops**: email triage, invoicing, reporting, calendar management
- **Meta**: orchestration skills that compose the others

## What it changes

Each new client gets a standardized onboarding: instantiate skills, customize voice, ship to prod. The solo operational margin became manageable.
```

`src/content/projects/en/geckomind-fr.mdx` :

```mdx
---
slug: geckomind-fr
title: geckomind.fr
tagline: Landing page for the Gecko Mind offering — custom visual identity
year: 2024
role: Designer & Developer
stack:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Vercel
cover: /projects/geckomind-fr/cover.svg
gallery: []
links:
  live: https://geckomind.fr
order: 4
featured: true
---

## The challenge

Give Gecko Mind a premium storefront that converts into qualified meetings. Not a generic corporate website: a page that conveys the "AI Builder who runs your prospecting" positioning.

## The design

Custom visual identity: Solar Yellow → Burnt Orange gradient as the throughline, anthracite backgrounds for contrast, Space Mono typography for tech accent. Subtle animations, copy focused on client benefits.

## The implementation

Next.js + TypeScript + Tailwind CSS. Static pages for performance, optimized Next/Image, Vercel hosting with preview deployments. Basic SEO (metadata + sitemap + OG). Privacy-first analytics via Plausible.

## Learnings

Iteration validates: 3 major copy versions before getting the right tempo. The final design came after letting v1 settle and collecting qualitative feedback from first prospects.
```

- [ ] **Step 6 : Verify**

```bash
pnpm typecheck && pnpm lint
```

(Pas encore de build — la galerie consomme ces fichiers en Tasks 6-8.)

- [ ] **Step 7 : Commit**

```bash
git add src/content/projects/
git commit -m "feat(content): add 8 MDX project files (4 projects × fr/en)"
```

---

## Task 5 : Covers placeholders SVG (4 fichiers)

**Files:**
- Create: `public/projects/gecko-mind/cover.svg`
- Create: `public/projects/gecko-agent/cover.svg`
- Create: `public/projects/skill-ecosystem/cover.svg`
- Create: `public/projects/geckomind-fr/cover.svg`

Pattern : SVG dégradé sombre + texte sobre. Variant subtilement par projet (couleur accent ou texte) pour qu'on les distingue dans la galerie.

- [ ] **Step 1 : `public/projects/gecko-mind/cover.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f1f1f"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#g1)"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-style="italic"
        font-size="92" fill="#FF5B1F" opacity="0.85">Gecko Mind</text>
  <text x="50%" y="56%" text-anchor="middle" font-family="monospace" font-size="14"
        fill="#8a8a8a" opacity="0.6" letter-spacing="4">PROSPECTION LINKEDIN B2B</text>
</svg>
```

- [ ] **Step 2 : `public/projects/gecko-agent/cover.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1f1f1f"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#g2)"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-style="italic"
        font-size="92" fill="#F5F5F5" opacity="0.85">Gecko Agent</text>
  <text x="50%" y="56%" text-anchor="middle" font-family="monospace" font-size="14"
        fill="#8a8a8a" opacity="0.6" letter-spacing="4">CHROME EXTENSION · OPEN SOURCE</text>
</svg>
```

- [ ] **Step 3 : `public/projects/skill-ecosystem/cover.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g3" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#g3)"/>
  <text x="50%" y="44%" text-anchor="middle" font-family="Georgia, serif" font-style="italic"
        font-size="78" fill="#F5F5F5" opacity="0.85">Skill</text>
  <text x="50%" y="54%" text-anchor="middle" font-family="Georgia, serif" font-style="italic"
        font-size="78" fill="#FF5B1F" opacity="0.85">Ecosystem</text>
  <text x="50%" y="64%" text-anchor="middle" font-family="monospace" font-size="14"
        fill="#8a8a8a" opacity="0.6" letter-spacing="4">25+ SKILLS CLAUDE</text>
</svg>
```

- [ ] **Step 4 : `public/projects/geckomind-fr/cover.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="50%" stop-color="#1f1f1f"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#g4)"/>
  <text x="50%" y="48%" text-anchor="middle" font-family="monospace" font-size="48"
        fill="#FF5B1F" opacity="0.85" letter-spacing="2">geckomind.fr</text>
  <text x="50%" y="56%" text-anchor="middle" font-family="monospace" font-size="14"
        fill="#8a8a8a" opacity="0.6" letter-spacing="4">LANDING PAGE</text>
</svg>
```

- [ ] **Step 5 : Verify (présence des fichiers)**

```bash
ls public/projects/
ls public/projects/gecko-mind/
```

- [ ] **Step 6 : Commit**

```bash
git add public/projects/
git commit -m "feat(projects): add cover SVG placeholders for 4 projects"
```

---

## Task 6 : i18n Projects namespace

**Files:**
- Modify: `src/messages/fr.json`
- Modify: `src/messages/en.json`

- [ ] **Step 1 : Étendre `src/messages/fr.json`**

Lire d'abord la version actuelle. Ajouter le namespace `Projects` (et SUPPRIMER `Home.placeholderProjects`). Contenu final du JSON FR :

Le namespace `Home` ne contient plus que `placeholderContact`. Ajouter avant `Stack` (ordre alphabétique des namespaces n'est pas requis mais conserver cohérence). Le `Projects` namespace contient :

```json
"Projects": {
  "kicker": "Projets",
  "title": "Ce que je construis",
  "viewProject": "Voir le projet",
  "backToGallery": "← Retour à la galerie",
  "viewGithub": "Voir sur GitHub",
  "viewLive": "Voir le site",
  "scrollHint": "Faites défiler horizontalement",
  "yearLabel": "Année",
  "roleLabel": "Rôle",
  "stackLabel": "Stack"
}
```

- [ ] **Step 2 : Étendre `src/messages/en.json`** (structure identique)

```json
"Projects": {
  "kicker": "Projects",
  "title": "What I build",
  "viewProject": "View project",
  "backToGallery": "← Back to gallery",
  "viewGithub": "View on GitHub",
  "viewLive": "View live",
  "scrollHint": "Scroll horizontally",
  "yearLabel": "Year",
  "roleLabel": "Role",
  "stackLabel": "Stack"
}
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint
```

(Build cassera si `t('placeholderProjects')` est encore référencé dans page.tsx. C'est le cas — laisser la clé `placeholderProjects` dans `Home` pour cette task. Sera retirée en Task 9 quand `<Projects />` est wired.)

> **Revision** : garder `Home.placeholderProjects` dans les deux JSON pendant cette task. La suppression se fera en Task 9.

- [ ] **Step 4 : Commit**

```bash
git add src/messages/
git commit -m "feat(i18n): extend messages with Projects namespace"
```

---

## Task 7 : ProjectCard

**Files:**
- Create: `src/components/sections/Projects/ProjectCard.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Projects/ProjectCard.tsx`**

```tsx
// ProjectCard — carte XL dans la galerie. Server component, cliquable via Link localisé.
// Layout : image cover plein-card en background, overlay texte en bas (titre + tagline + tags).
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { Tag } from '@/components/ui/Tag';
import type { ProjectMeta } from '@/types/project';

type ProjectCardProps = {
  project: ProjectMeta;
  // Label "Voir le projet" traduit, passé depuis le wrapper server.
  viewProjectLabel: string;
};

export function ProjectCard({ project, viewProjectLabel }: ProjectCardProps) {
  // [data-cursor-magnetic] active le ring magnetic du curseur custom au hover.
  return (
    <article
      data-cursor-magnetic
      className="relative flex-shrink-0 h-[70vh] md:h-[80vh] aspect-[3/4] overflow-hidden rounded-lg border border-border group"
    >
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${viewProjectLabel} ${project.title}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">
          {viewProjectLabel} {project.title}
        </span>
      </Link>

      {/* Cover image — fill, object-cover, scale 105 au hover via transition. */}
      <Image
        src={project.cover}
        alt={project.title}
        fill
        unoptimized
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(min-width: 1024px) 60vw, (min-width: 768px) 80vw, 90vw"
      />

      {/* Overlay dégradé pour la lisibilité du texte. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/40 to-transparent"
      />

      {/* Contenu en bas de la card. */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-3 z-[5]">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted">
          {project.year} · {project.role}
        </span>
        <h3 className="font-display text-3xl md:text-5xl tracking-tight italic">
          {project.title}
        </h3>
        <p className="text-sm md:text-base text-fg-muted max-w-md">{project.tagline}</p>
        <ul className="flex flex-wrap gap-2 mt-2">
          {project.stack.slice(0, 4).map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
          {project.stack.length > 4 && (
            <li>
              <Tag>+{project.stack.length - 4}</Tag>
            </li>
          )}
        </ul>
      </footer>
    </article>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Projects/ProjectCard.tsx
git commit -m "feat(projects): add ProjectCard with cover image and magnetic data-attr"
```

---

## Task 8 : ProjectsGallery (scroll horizontal GSAP + mobile snap)

**Files:**
- Create: `src/components/sections/Projects/ProjectsGallery.tsx`

DEV-RULES §10 : pin max 1 viewport height (`+=100%`), mobile fallback scroll natif.

- [ ] **Step 1 : Créer `src/components/sections/Projects/ProjectsGallery.tsx`**

```tsx
'use client';

// ProjectsGallery — wrapper client de la galerie.
// Desktop (>= md) : section pinnée pendant N viewports, strip horizontal translaté via GSAP ScrollTrigger.
// Mobile (< md) : scroll horizontal natif avec scroll-snap (pas de pin, plus accessible).
// Le mode est choisi via useMediaQuery (DEV-RULES §10 anti-scroll-jacking).
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type ReactNode, useRef } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type ProjectsGalleryProps = {
  // Cards rendues côté server, injectées en children pour préserver RSC.
  children: ReactNode;
  // Nombre de cards (sert au calcul de la translation totale).
  projectCount: number;
};

export function ProjectsGallery({ children, projectCount }: ProjectsGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Desktop = pointer fine + viewport >= md (768px). Sinon mobile snap.
  const isDesktop = useMediaQuery('(min-width: 768px) and (pointer: fine)');
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!isDesktop) return;
      if (reducedMotion) return;
      if (!containerRef.current || !stripRef.current) return;

      // La distance à translater = largeur du strip - largeur du viewport.
      const strip = stripRef.current;
      const getDistance = () => strip.scrollWidth - window.innerWidth;

      // Pin de la section pendant que le scroll vertical pilote la translation horizontale.
      // `end` = distance × 1 (pin duration égale à la distance de scroll).
      const tween = gsap.to(strip, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        // Refresh global au cas où d'autres triggers seraient à ajuster.
        ScrollTrigger.refresh();
      };
    },
    { scope: containerRef, dependencies: [isDesktop, reducedMotion, projectCount] },
  );

  // Classe du strip change selon desktop/mobile.
  // Desktop : flex inline, sans scroll natif (GSAP gère la translation).
  // Mobile : overflow-x scroll avec snap mandatory.
  const stripClassName = isDesktop
    ? 'flex gap-6 md:gap-10 will-change-transform px-6 md:px-12'
    : 'flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-6 -webkit-overflow-scrolling-touch';

  return (
    // Wrapper conditionnel : desktop = pas de scroll natif overflow:hidden ; mobile = scroll natif.
    <div ref={containerRef} className={isDesktop ? 'overflow-hidden' : ''}>
      <div
        ref={stripRef}
        className={stripClassName}
        // Chaque enfant card a snap-start naturellement via la classe sur la card. (À ajouter en Task 7 update si besoin.)
      >
        {children}
      </div>
    </div>
  );
}
```

> Notes :
> - `useGSAP` avec deps `[isDesktop, ...]` re-évalue à chaque change (resize bascule mobile↔desktop) — cleanup automatique.
> - `invalidateOnRefresh: true` recalcule la distance au resize (orientation, devtools).
> - `scrub: 1` adoucit la translation (1s de lag) — feel "smooth scroll" cohérent avec Lenis.

> ⚠️ Risque connu : interaction Lenis + ScrollTrigger pin. Si le pin "saute" ou si la translation ne suit pas le scroll, il peut être nécessaire d'utiliser `ScrollTrigger.scrollerProxy` pour brancher Lenis. Tester d'abord la version simple ; ajouter le proxy seulement si bug visible.

- [ ] **Step 2 : Mettre à jour `src/components/sections/Projects/ProjectCard.tsx` pour ajouter `snap-start`**

Lire le fichier. Ajouter `snap-start` à l'`<article>` :

```tsx
className="relative flex-shrink-0 h-[70vh] md:h-[80vh] aspect-[3/4] overflow-hidden rounded-lg border border-border group snap-start"
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/sections/Projects/
git commit -m "feat(projects): add ProjectsGallery with GSAP horizontal scroll and mobile snap"
```

---

## Task 9 : Projects wrapper + wire dans page.tsx

**Files:**
- Create: `src/components/sections/Projects/Projects.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/messages/fr.json` (retirer placeholderProjects)
- Modify: `src/messages/en.json` (retirer placeholderProjects)

- [ ] **Step 1 : Créer `src/components/sections/Projects/Projects.tsx`**

```tsx
// Projects — wrapper RSC : traduit + lit la liste de projets via lib/projects.ts + compose la galerie.
import { getLocale, getTranslations } from 'next-intl/server';

import { getAllProjectsMeta } from '@/lib/projects';

import { ProjectCard } from './ProjectCard';
import { ProjectsGallery } from './ProjectsGallery';

export async function Projects() {
  const locale = await getLocale();
  const t = await getTranslations('Projects');
  const projects = await getAllProjectsMeta(locale);

  return (
    <section id="projects" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col gap-12">
        <header className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {t('kicker')}
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight italic">
            {t('title')}
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted mt-2">
            {t('scrollHint')}
          </p>
        </header>
      </div>

      {/* La gallery est en pleine largeur, séparée du wrapper container pour permettre le scroll horizontal. */}
      <ProjectsGallery projectCount={projects.length}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} viewProjectLabel={t('viewProject')} />
        ))}
      </ProjectsGallery>
    </section>
  );
}
```

- [ ] **Step 2 : Modifier `src/app/[locale]/page.tsx`** — remplacer placeholder Projects par `<Projects />`.

Final return :

```tsx
return (
  <>
    <Hero />
    <About />
    <Experience />
    <Projects />
    <section id="contact" className="min-h-screen flex items-center justify-center">
      <p className="text-fg-muted">{t('placeholderContact')}</p>
    </section>
  </>
);
```

Import : `import { Projects } from '@/components/sections/Projects/Projects';`

- [ ] **Step 3 : Retirer `placeholderProjects` de `src/messages/fr.json` et `en.json`**

Edit les deux JSON : supprimer la clé `Home.placeholderProjects`. `Home` ne contient plus que `placeholderContact`.

- [ ] **Step 4 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

All MUST pass. Si build échoue avec un message sur MDX, vérifier que les fichiers de Task 4 sont bien présents et que `getAllProjectsMeta` les lit correctement.

- [ ] **Step 5 : Smoke test**

```bash
# pnpm dev background, attendre Ready in
curl -s http://localhost:3000/fr | grep -i "Ce que je construis"     # title FR
curl -s http://localhost:3000/en | grep -i "What I build"            # title EN
curl -s http://localhost:3000/fr | grep -c "Gecko Mind"               # >= 1 (card)
curl -s http://localhost:3000/fr | grep -i "Skill Ecosystem"          # card
curl -s http://localhost:3000/fr | grep -i "Voir le projet"           # viewProject FR
curl -s http://localhost:3000/en | grep -i "View project"             # viewProject EN
# Kill dev server
```

- [ ] **Step 6 : Commit**

```bash
git add src/components/sections/Projects/Projects.tsx src/app/[locale]/page.tsx src/messages/
git commit -m "feat(projects): compose Projects gallery and wire into home page"
```

---

## Task 10 : Route /[locale]/projects/[slug] — page détail

**Files:**
- Create: `src/app/[locale]/projects/[slug]/page.tsx`
- Create: `src/app/[locale]/projects/[slug]/not-found.tsx`

- [ ] **Step 1 : Créer `src/app/[locale]/projects/[slug]/page.tsx`**

```tsx
// Page détail d'un projet — route /[locale]/projects/[slug].
// Statiquement générée via generateStaticParams (croise locales × slugs).
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectContent } from '@/components/sections/Projects/ProjectDetail/ProjectContent';
import { ProjectGallery } from '@/components/sections/Projects/ProjectDetail/ProjectGallery';
import { ProjectHero } from '@/components/sections/Projects/ProjectDetail/ProjectHero';
import { ProjectNav } from '@/components/sections/Projects/ProjectDetail/ProjectNav';
import { getProject, getProjectSlugs } from '@/lib/projects';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Pre-render toutes les combinaisons locale × slug au build.
export async function generateStaticParams() {
  const results: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    const slugs = await getProjectSlugs(locale);
    for (const slug of slugs) {
      results.push({ locale, slug });
    }
  }
  return results;
}

// Metadata dynamique par projet (SEO).
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale);
  if (!project) {
    return { title: 'Project not found' };
  }
  return {
    title: `${project.title} — Guillaume Gay`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} — Guillaume Gay`,
      description: project.tagline,
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProject(slug, locale);
  if (!project) {
    notFound();
  }

  return (
    <article className="relative">
      <ProjectNav />
      <ProjectHero project={project} />
      <ProjectContent>{project.content}</ProjectContent>
      {project.gallery.length > 0 && <ProjectGallery images={project.gallery} alt={project.title} />}
    </article>
  );
}
```

- [ ] **Step 2 : Créer `src/app/[locale]/projects/[slug]/not-found.tsx`**

```tsx
// 404 propre pour un slug projet inconnu.
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('Projects');
  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <p className="font-mono text-fg-muted">404</p>
      <p className="font-display text-2xl text-center">Project introuvable.</p>
      <Link
        href="/#projects"
        className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-fg transition-colors"
      >
        {t('backToGallery')}
      </Link>
    </section>
  );
}
```

> Note : Cette task crée la page mais ses 4 sous-composants (ProjectNav, ProjectHero, ProjectContent, ProjectGallery) n'existent pas encore. Le build VA CASSER tant que Tasks 11-14 ne sont pas faites. Skipper `pnpm build` pour cette task, faire juste typecheck (qui peut aussi échouer sur les imports manquants).

Pour rendre cette task self-contained et le build green, créer des stubs minimaux des 4 composants au même moment, puis Tasks 11-14 les remplaceront. Stubs :

```tsx
// stubs/ProjectNav.tsx
export function ProjectNav() { return null; }

// stubs/ProjectHero.tsx
import type { Project } from '@/types/project';
export function ProjectHero({ project }: { project: Project }) { return <h1>{project.title}</h1>; }

// stubs/ProjectContent.tsx
import type { ReactNode } from 'react';
export function ProjectContent({ children }: { children: ReactNode }) { return <div>{children}</div>; }

// stubs/ProjectGallery.tsx
export function ProjectGallery({ images, alt }: { images: readonly string[]; alt: string }) {
  return <div>{images.length} images for {alt}</div>;
}
```

Créer ces 4 stubs dans `src/components/sections/Projects/ProjectDetail/` AVANT le commit. Tasks 11-14 les remplaceront par les vraies implémentations.

- [ ] **Step 3 : Créer les 4 stubs (chemins exacts)**

`src/components/sections/Projects/ProjectDetail/ProjectNav.tsx` :
```tsx
// STUB Phase 4 Task 10 — sera remplacé en Task 14.
export function ProjectNav() {
  return null;
}
```

`src/components/sections/Projects/ProjectDetail/ProjectHero.tsx` :
```tsx
// STUB Phase 4 Task 10 — sera remplacé en Task 11.
import type { Project } from '@/types/project';

export function ProjectHero({ project }: { project: Project }) {
  return <h1>{project.title}</h1>;
}
```

`src/components/sections/Projects/ProjectDetail/ProjectContent.tsx` :
```tsx
// STUB Phase 4 Task 10 — sera remplacé en Task 12.
import type { ReactNode } from 'react';

export function ProjectContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
```

`src/components/sections/Projects/ProjectDetail/ProjectGallery.tsx` :
```tsx
// STUB Phase 4 Task 10 — sera remplacé en Task 13.
type ProjectGalleryProps = {
  images: readonly string[];
  alt: string;
};

export function ProjectGallery({ images, alt }: ProjectGalleryProps) {
  return <div data-stub={alt}>{images.length} images</div>;
}
```

- [ ] **Step 4 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

All MUST pass. Le build inclut maintenant 8 nouvelles routes statiques (4 slugs × 2 locales).

- [ ] **Step 5 : Smoke test**

```bash
# pnpm dev background
curl -I http://localhost:3000/fr/projects/gecko-mind   # 200
curl -I http://localhost:3000/en/projects/gecko-agent  # 200
curl -I http://localhost:3000/fr/projects/unknown      # 404
# Kill dev server
```

- [ ] **Step 6 : Commit**

```bash
git add src/app/[locale]/projects/ src/components/sections/Projects/ProjectDetail/
git commit -m "feat(projects): add detail page route with stubs (to be replaced Tasks 11-14)"
```

---

## Task 11 : ProjectHero (page détail)

**Files:**
- Modify: `src/components/sections/Projects/ProjectDetail/ProjectHero.tsx`

- [ ] **Step 1 : Remplacer le stub par l'implémentation finale**

```tsx
// ProjectHero — hero de la page détail projet.
// Affiche : kicker (year + role), titre XL, tagline, stack tags, cover image.
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Tag } from '@/components/ui/Tag';
import type { Project } from '@/types/project';

type ProjectHeroProps = {
  project: Project;
};

export async function ProjectHero({ project }: ProjectHeroProps) {
  const t = await getTranslations('Projects');

  return (
    <header className="relative">
      {/* Cover en background avec gradient overlay pour lisibilité. */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          unoptimized
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent"
        />
      </div>

      {/* Texte sous le cover, dans un container max-width. */}
      <div className="relative mx-auto max-w-5xl px-6 md:px-12 -mt-24 md:-mt-32 z-10 flex flex-col gap-6 pb-12">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted">
          <span>
            {t('yearLabel')} {project.year}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t('roleLabel')} {project.role}
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl tracking-tight italic">
          {project.title}
        </h1>
        <p className="text-lg md:text-2xl text-fg-muted max-w-2xl leading-relaxed">
          {project.tagline}
        </p>
        <ul className="flex flex-wrap gap-2 mt-2">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Projects/ProjectDetail/ProjectHero.tsx
git commit -m "feat(projects): implement ProjectHero on detail page"
```

---

## Task 12 : ProjectContent (MDX render avec typographie)

**Files:**
- Modify: `src/components/sections/Projects/ProjectDetail/ProjectContent.tsx`

- [ ] **Step 1 : Remplacer le stub**

```tsx
// ProjectContent — wrapper de typographie pour le contenu MDX compilé.
// Le children est le ReactNode produit par compileMDX (lib/projects.ts).
// Tailwind utility-first : pas de @tailwindcss/typography (pas installé), on style à la main.
import type { ReactNode } from 'react';

type ProjectContentProps = {
  children: ReactNode;
};

export function ProjectContent({ children }: ProjectContentProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-16 md:py-24">
      {/*
        Styles typographiques pour le MDX rendu.
        h2/h3/p/ul/code/etc. sont stylés via les sélecteurs descendants.
        L'astuce : utilise [&_h2] etc. pour cibler les éléments enfants sans plugin typography.
      */}
      <div
        className="
          flex flex-col gap-6
          text-base md:text-lg text-fg-muted leading-relaxed
          [&_h2]:font-display [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:tracking-tight [&_h2]:italic [&_h2]:text-fg [&_h2]:mt-12 [&_h2]:mb-2
          [&_h3]:font-display [&_h3]:text-2xl [&_h3]:tracking-tight [&_h3]:text-fg [&_h3]:mt-8 [&_h3]:mb-1
          [&_ul]:list-none [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-0
          [&_li]:relative [&_li]:pl-6 [&_li]:before:content-['→'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-accent
          [&_strong]:text-fg [&_strong]:font-medium
          [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-fg
          [&_code]:font-mono [&_code]:text-sm [&_code]:bg-bg-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-fg
        "
      >
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Projects/ProjectDetail/ProjectContent.tsx
git commit -m "feat(projects): implement ProjectContent with MDX typography"
```

---

## Task 13 : ProjectGallery (images du projet)

**Files:**
- Modify: `src/components/sections/Projects/ProjectDetail/ProjectGallery.tsx`

- [ ] **Step 1 : Remplacer le stub**

```tsx
// ProjectGallery — grid d'images additionnelles d'un projet (frontmatter.gallery).
// Pas affichée si gallery est vide (filtré au call site dans la page detail).
import Image from 'next/image';

type ProjectGalleryProps = {
  images: readonly string[];
  // Alt commun à toutes les images (le titre du projet) — chaque image numérotée pour différenciation.
  alt: string;
};

export function ProjectGallery({ images, alt }: ProjectGalleryProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 md:px-12 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((src, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: images are stable content
            key={idx}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={src}
              alt={`${alt} — image ${idx + 1}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Projects/ProjectDetail/ProjectGallery.tsx
git commit -m "feat(projects): implement ProjectGallery image grid"
```

---

## Task 14 : ProjectNav (back link + external links)

**Files:**
- Modify: `src/components/sections/Projects/ProjectDetail/ProjectNav.tsx`

- [ ] **Step 1 : Remplacer le stub**

```tsx
// ProjectNav — barre de navigation en haut de la page détail projet.
// Back link vers la galerie home + (en bas de page on pourrait ajouter prev/next mais Phase 4 = MVP).
// Server component avec traductions.
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export async function ProjectNav() {
  const t = await getTranslations('Projects');

  return (
    <nav className="mx-auto max-w-5xl px-6 md:px-12 pt-32 pb-4">
      <Link
        href="/#projects"
        data-cursor-magnetic
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted hover:text-accent transition-colors"
      >
        {t('backToGallery')}
      </Link>
    </nav>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Smoke test (navigation)**

```bash
# pnpm dev background
curl -s http://localhost:3000/fr/projects/gecko-mind | grep -i "Retour à la galerie"
curl -s http://localhost:3000/en/projects/gecko-mind | grep -i "Back to gallery"
# Kill dev server
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/sections/Projects/ProjectDetail/ProjectNav.tsx
git commit -m "feat(projects): implement ProjectNav back link"
```

---

## Task 15 : QA finale + tag v0.4-projects

**Files:**
- Create: `docs/superpowers/reports/2026-05-13-phase-4-projects.md`

- [ ] **Step 1 : Verifications**

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Tous PASS. Le build doit montrer ~10 routes statiques (`/[locale]` × 2 + `/[locale]/projects/[slug]` × 8 + middleware).

- [ ] **Step 2 : Smoke tests extensifs**

```bash
# pnpm dev background, attendre Ready in
curl -I http://localhost:3000/fr                                                    # 200
curl -I http://localhost:3000/en                                                    # 200
curl -I http://localhost:3000/fr/projects/gecko-mind                                # 200
curl -I http://localhost:3000/fr/projects/gecko-agent                               # 200
curl -I http://localhost:3000/fr/projects/skill-ecosystem                           # 200
curl -I http://localhost:3000/fr/projects/geckomind-fr                              # 200
curl -I http://localhost:3000/en/projects/gecko-mind                                # 200
curl -I http://localhost:3000/fr/projects/unknown                                   # 404

# Galerie home
curl -s http://localhost:3000/fr | grep -i "Ce que je construis"                    # title FR
curl -s http://localhost:3000/fr | grep -c "Gecko Mind"                             # >= 1
curl -s http://localhost:3000/fr | grep -i "Skill Ecosystem"                        # card

# Page détail
curl -s http://localhost:3000/fr/projects/gecko-mind | grep -i "Founder & AI Builder"
curl -s http://localhost:3000/fr/projects/gecko-mind | grep -i "Le problème"        # MDX heading
curl -s http://localhost:3000/en/projects/gecko-mind | grep -i "The problem"        # MDX heading EN
curl -s http://localhost:3000/fr/projects/gecko-agent | grep -i "open source"

# Kill dev server
```

- [ ] **Step 3 : Bundle size + perf check**

Capter le first load JS de `/[locale]` (galerie home) et `/[locale]/projects/[slug]` (page détail). Le détail devrait être plus léger que la home (pas de Hero shader R3F). La home reste à ~305 kB ± Phase 4 incremental (~+30 kB pour MDX runtime).

- [ ] **Step 4 : QA navigateur manuelle** (à exécuter par utilisateur après livraison, à documenter dans rapport) :
- [ ] Galerie home affiche 4 cards XL avec covers SVG sombres + titres serif italique + tagline + tags
- [ ] Desktop : scroll vertical → translation horizontale du strip (GSAP pin), section reste à l'écran pendant la traversée
- [ ] Mobile : scroll horizontal natif des cards avec snap (chaque card se cale au bord viewport)
- [ ] Click sur une card → navigue vers `/fr/projects/<slug>` (ou en) avec contenu MDX rendu
- [ ] Page détail affiche : nav back link en haut, hero avec cover + titre + tagline + year/role + stack, contenu MDX stylé (h2/h3/p/ul), pas de gallery si vide
- [ ] Click sur "← Retour à la galerie" → revient à la home, scroll position préservée sur la section #projects (ou top de section au pire)
- [ ] Switch FR ↔ EN sur la page détail → reste sur le même slug avec contenu traduit
- [ ] DevTools `prefers-reduced-motion: reduce` → scroll horizontal GSAP désactivé, fallback mobile-style sur desktop
- [ ] Curseur custom : ring magnetise quand on survole une card (data-cursor-magnetic)
- [ ] DevTools Console : zéro erreur

- [ ] **Step 5 : Créer le rapport**

`docs/superpowers/reports/2026-05-13-phase-4-projects.md` :

```markdown
## Rapport Phase 4 — Projects Gallery

### Implémenté
- Deps MDX : gray-matter, next-mdx-remote, remark-gfm
- Schéma Zod du frontmatter projet + type Project partagé (frontmatter + content compilé)
- lib/projects.ts — getProjectSlugs, getProjectMeta, getProject (compileMDX), getAllProjectsMeta (sort par order, filter featured)
- 8 fichiers MDX (4 projets × FR/EN) : Gecko Mind, Gecko Agent, Skill Ecosystem, geckomind.fr
- 4 covers SVG placeholders (gradients sombres + titres mono/serif)
- ProjectCard : carte XL avec cover + overlay gradient + titre/tagline/year/role/stack tags, data-cursor-magnetic, Link localisé
- ProjectsGallery : useGSAP pin + translateX desktop (md+, pointer:fine), mobile = flex overflow-x scroll-snap-mandatory
- Projects wrapper RSC : compose getTranslations + getAllProjectsMeta + map ProjectCard
- Routes /[locale]/projects/[slug] : generateStaticParams (4 × 2 = 8 routes), generateMetadata SEO + OG
- ProjectHero détail : cover background, kicker year/role mono, titre display XL, tagline, stack tags
- ProjectContent : wrapper typographique pour MDX (h2/h3/p/ul/code stylés via Tailwind arbitrary selectors)
- ProjectGallery : grid 2 cols images (next/image fill)
- ProjectNav : back link avec data-cursor-magnetic
- i18n étendu : namespace Projects FR/EN

### Non implémenté (et pourquoi)
- FLIP exact card → detail page — Framer layoutId mal supporté entre routes App Router, fade simple suffit Phase 4
- Scroll restore au retour — repose sur scrollRestoration natif Next + Lenis ; un fallback sessionStorage manual sera ajouté Phase 5 si retours utilisateurs le justifient
- 5ème card — PRD disait "3-5", on en a livré 4 solides (1 slot supplémentaire trivial à ajouter via un nouveau MDX)
- Vraies images de gallery par projet — frontmatter.gallery est vide partout, ProjectGallery est masqué si vide
- Plugin @tailwindcss/typography — pas installé, on style via arbitrary selectors `[&_h2]:...` (plus contrôle, moins de poids)

### Problèmes rencontrés (et résolutions)
- [À compléter pendant l'exécution]

### Recommandations Phase 5
- Si l'audit utilisateur révèle des saccades sur le pin GSAP × Lenis : implémenter `ScrollTrigger.scrollerProxy` avec Lenis instance.
- Vraies covers projet (JPG 4:3) à fournir Phase 5 prep.
- Vraies images gallery (3-6 par projet) à fournir + activer ProjectGallery.
- Si SEO crawler critique : ajouter rewrite middleware pour set Content-Language header.
- Page contact + form Phase 5 reste à faire (PRD §3 Module 6).

### Vérifications

| Métrique | Résultat |
|----------|----------|
| pnpm typecheck | PASS |
| pnpm lint | PASS |
| pnpm build | PASS (~10 routes statiques) |
| Bundle first load /[locale] | XXX kB |
| Bundle first load /[locale]/projects/[slug] | XXX kB |
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
| Total commits Phase 4 | X commits |

### Tag

`git tag v0.4-projects` créé sur le commit final.
```

REMPLACER les XXX par les vraies valeurs mesurées.

- [ ] **Step 6 : Release commit + tag**

```bash
git add -A
git diff --cached --quiet || git commit -m "chore(release): close phase 4 — projects gallery"
git tag v0.4-projects
git log --oneline -8
git tag --list
```

- [ ] **Step 7 : Cleanup dev.log si présent**

```bash
rm -f dev.log
```

---

## Self-Review

**Spec coverage (vs PRD §3 Module 5) :**
- ✅ Section ProjectsGallery scroll horizontal desktop + mobile fallback → Task 8
- ✅ 4 cards XL avec preview, titre, stack tags → Task 7 + 9
- ✅ Routes `/[locale]/projects/[slug]` + MDX → Tasks 4, 10
- ⚠️ Transition FLIP card → detail — non implémenté (fade simple natif Next), documenté comme déviation
- ✅ Page détail : hero + content MDX + gallery + back link → Tasks 11-14
- ⚠️ Navigation retour qui préserve scroll position — repose sur Next natif, à valider en QA

**Spec coverage (vs DEV-RULES) :**
- ✅ MDX frontmatter validé Zod → Task 2
- ✅ Lecture fs uniquement dans lib/projects.ts → Task 3
- ✅ Pas d'import circulaire (lib/projects → schema, types/project → schema ; aucun retour)
- ✅ prefers-reduced-motion respecté (gallery pin off, mobile fallback) → Task 8
- ✅ Pin ≤ 1 viewport (anti scroll-jacking abusif) → Task 8 `end: +=getDistance()`

**Placeholder scan :**
- "[À compléter pendant l'exécution]" : template rapport, OK.
- Pas de TBD/TODO dans code.

**Type consistency :**
- `Project = ProjectFrontmatter & { content: ReactNode }` cohérent entre types/project.ts et lib/projects.ts return type
- `ProjectMeta` (sans content) consommé par ProjectsGallery, ProjectCard, Projects
- `gallery: readonly string[]` cohérent entre ProjectGallery props et ProjectFrontmatter (Zod default `[]`)
- `links` Zod schema cohérent avec consommation potentielle (Phase 4 ne consomme pas encore links externes — ProjectNav peut être étendu Phase 5)

**Risques connus à signaler à l'exécutant :**
1. **next-mdx-remote/rsc** : si Context7 indique une version récente avec API différente (e.g., `compileMDX` renommé), adapter. La signature actuelle est `compileMDX({ source, options })`.
2. **GSAP pin + Lenis** : si le pin sautille, voir Task 8 note sur `ScrollTrigger.scrollerProxy`.
3. **next/image avec SVG** : `unoptimized` partout (déjà appliqué Phase 2 Portrait).
4. **i18n key removal** : `Home.placeholderProjects` retiré en Task 9 SEULEMENT après que `<Projects />` est wired, sinon page.tsx casse le build.
5. **Stubs Tasks 10** : ne pas oublier de remplacer les 4 stubs dans Tasks 11-14 — sinon les pages détail seront moches.

---

## Execution Handoff

Plan complet dans `docs/superpowers/plans/2026-05-13-phase-4-projects.md`. Subagent-driven par défaut.
