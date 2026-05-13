# Phase 3 — Experience Timeline — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer la section Experience — timeline verticale avec progress line sticky, 3 blocs (Gecko Mind, Reconversion 2024, Armée de Terre compact), reveal au scroll item par item, bloc soft skills militaires valorisé. Tag de fin `v0.3-experience`.

**Architecture:** Timeline en grid 2 colonnes (progress line à gauche sticky, items à droite). Chaque item est un sub-component RSC avec ses données passées en props depuis `Experience` (server wrapper qui traduit). Animation reveal via GSAP ScrollTrigger (pattern AboutText), progress line height calculée avec `useScroll` Framer Motion + `useTransform`. Bloc militaire en variante `compact` (plus discret typographiquement) + bloc soft skills en pleine largeur sous la timeline (mise en valeur des transferables).

**Tech Stack:** Next.js 16 + React 19 + TS strict + Tailwind v4 + next-intl 4 + Framer Motion 12 + GSAP 3 + split-type — pas de nouvelles deps.

**Specs source :** `PRD.md` §3 Module 4 (Experience), `DEV-RULES.md` (notamment §10 prefers-reduced-motion + scroll-jacking abusif à éviter), `STRUCTURE.md` (colocation `sections/Experience/`, `ui/Tag.tsx`), `CV_Guillaume_Gay.md` (source de vérité pour le contenu).

---

## Décisions par défaut (à valider en review user)

1. **Pin vs sticky** — PRD dit "Pin section pendant le scroll". Interprétation : la **progress line** est sticky/pin (reste visible pendant la traversée), pas la section entière. Plus fluide avec Lenis smooth scroll, et meilleure accessibilité (un pin sec en JS scroll-jack peut casser le scroll-snap mobile).
2. **Bloc Armée — discrétion** — variante `compact` : typo plus petite, opacity 0.7 par défaut, pas de stack tags (pas pertinent), juste une mention agrégée "Sous-officier — 21 ans, principalement artillerie. 7 postes successifs en responsabilité croissante." Sans détailler chaque poste.
3. **Soft skills militaires** — bloc séparé sous les 3 items, fond `bg-bg-elevated`, kicker "Compétences transférables", liste des 4 compétences mises en avant (management 30 pers, formation, pilotage projet sous contrainte, décision environnement complexe). C'est ça la valeur, pas la chronologie.
4. **Pas de scroll horizontal** ici — c'est pour Phase 4 (projects).
5. **Progress line** : trait vertical 1px, height fixe = container height, fill animé via `scaleY` 0→1 selon scroll progress dans la section.

---

## File Structure

**Hooks**
- `src/hooks/useSectionScrollProgress.ts` — wrapper minimal autour de Framer `useScroll` qui retourne un `MotionValue<number>` 0-1 selon la position du scroll dans un container ref.

**UI**
- `src/components/ui/Tag.tsx` — pill component réutilisable pour les stack tags (sera consommé Phase 4 aussi).

**Sections Experience**
- `src/components/sections/Experience/Experience.tsx` — server wrapper RSC, traduit + compose.
- `src/components/sections/Experience/Timeline.tsx` — client wrapper, monte le container ref + passe progress motion value à TimelineProgress + applique reveal au scroll.
- `src/components/sections/Experience/TimelineProgress.tsx` — client, render la ligne sticky avec fill animé.
- `src/components/sections/Experience/TimelineItem.tsx` — server component pour un item standard (Gecko Mind, Reconversion).
- `src/components/sections/Experience/TimelineMilitary.tsx` — server component, variante compact + bloc soft skills.

**Types**
- `src/types/experience.ts` — type `ExperienceItem` partagé.

**Modifs**
- `src/messages/fr.json` + `en.json` — namespace Experience avec items + soft skills + military.
- `src/app/[locale]/page.tsx` — remplace le placeholder Experience par `<Experience />`.

---

## Task 1 : Composant Tag (ui réutilisable)

**Files:**
- Create: `src/components/ui/Tag.tsx`

DEV-RULES + STRUCTURE.md : composant générique pour les stack tags des cartes expérience et projets.

- [ ] **Step 1 : Créer `src/components/ui/Tag.tsx`**

```tsx
// Tag — pill réutilisable pour les stack tags (Phase 3 Experience, Phase 4 Projects).
// Server component pur (pas de state). Variante visuelle minimaliste, cohérente design system.
import type { ReactNode } from 'react';

type TagProps = {
  children: ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-bg-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-muted">
      {children}
    </span>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/ui/Tag.tsx
git commit -m "feat(ui): add Tag pill component"
```

---

## Task 2 : Type ExperienceItem partagé

**Files:**
- Create: `src/types/experience.ts`

- [ ] **Step 1 : Créer `src/types/experience.ts`**

```typescript
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
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/types/experience.ts
git commit -m "feat(types): add ExperienceItem shared type"
```

---

## Task 3 : Étendre messages i18n (Experience namespace)

**Files:**
- Modify: `src/messages/fr.json`
- Modify: `src/messages/en.json`

- [ ] **Step 1 : Étendre `src/messages/fr.json`**

Lire le fichier actuel et AJOUTER (ne pas supprimer les sections existantes) le namespace `Experience` avec cette structure. Supprimer aussi `Home.placeholderExperience` qui ne sera plus consommé. Contenu final :

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
    "placeholderProjects": "Projects — à venir Phase 4",
    "placeholderContact": "Contact — à venir Phase 5"
  },
  "Hero": {
    "name": "Guillaume Gay",
    "tagline": "AI Builder & Full Stack Developer",
    "scrollHint": "scroll"
  },
  "About": {
    "kicker": "À propos",
    "paragraph1": "Solopreneur tech, AI Builder. Après 21 ans dans l'Armée de Terre, j'ai pivoté en 2024 vers la programmation assistée par IA et l'automatisation B2B.",
    "paragraph2": "Je conçois et opère Gecko Mind — un service done-for-you de prospection LinkedIn et création de contenu pour solopreneurs, freelances et dirigeants TPE/PME B2B.",
    "paragraph3": "Stack maison : écosystème Claude (Code, Cowork, MCP, API), n8n, Airtable, extensions Chrome custom. Approche pragmatique, ship fast, architecture modulaire.",
    "portraitAlt": "Portrait de Guillaume Gay"
  },
  "Stack": {
    "categoryAI": "AI / Claude",
    "categoryWeb": "Web",
    "categoryAutomation": "Automation",
    "itemsAI": "Claude Code · Claude Cowork · MCP · Anthropic API · Prompt Engineering",
    "itemsWeb": "Next.js · TypeScript · React · Tailwind · Supabase · shadcn/ui",
    "itemsAutomation": "n8n · Airtable · Chrome Extensions · LinkedIn Helper · Python"
  },
  "Experience": {
    "kicker": "Parcours",
    "title": "De l'artillerie à l'IA",
    "geckoMindPeriod": "Juin 2024 – Aujourd'hui",
    "geckoMindRole": "Founder & AI Builder",
    "geckoMindOrg": "Gecko Mind",
    "geckoMindDescription": "Service done-for-you de prospection LinkedIn B2B et création de contenu pour solopreneurs, freelances et dirigeants TPE/PME. Direction technique, marketing, sales et opérations en autonomie complète.",
    "reconversionPeriod": "2024",
    "reconversionRole": "Reconversion tech",
    "reconversionOrg": "Formations & build",
    "reconversionDescription": "Formations en ligne intensives (développement web, IA, automatisation, growth hacking). Lancement du projet open source Gecko Agent. Mise en place de la stack Gecko Mind et premiers clients.",
    "armyPeriod": "2003 – 2024 · 21 ans",
    "armyRole": "Sous-officier",
    "armyOrg": "Armée de Terre française",
    "armyDescription": "Carrière complète, principalement dans l'artillerie. 7 postes successifs en responsabilité croissante (administration RH, opérateur radar et radio, pilote d'engins blindés, chef d'équipe observation avancée, sous-officier matériels).",
    "softSkillsKicker": "Compétences transférables",
    "softSkillManagement": "Management d'équipe jusqu'à 30 personnes",
    "softSkillFormation": "Conception et animation de formations",
    "softSkillPilotage": "Pilotage de projets sous contrainte forte",
    "softSkillDecision": "Prise de décision en environnement complexe"
  }
}
```

- [ ] **Step 2 : Étendre `src/messages/en.json`** (structure identique)

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
    "placeholderProjects": "Projects — coming Phase 4",
    "placeholderContact": "Contact — coming Phase 5"
  },
  "Hero": {
    "name": "Guillaume Gay",
    "tagline": "AI Builder & Full Stack Developer",
    "scrollHint": "scroll"
  },
  "About": {
    "kicker": "About",
    "paragraph1": "Tech solopreneur, AI Builder. After 21 years in the French Army, I transitioned in 2024 to AI-assisted programming and B2B automation.",
    "paragraph2": "I design and operate Gecko Mind — a done-for-you LinkedIn prospecting and content creation service for solopreneurs, freelancers and B2B SME decision-makers.",
    "paragraph3": "Inhouse stack: Claude ecosystem (Code, Cowork, MCP, API), n8n, Airtable, custom Chrome extensions. Pragmatic, ship-fast, modular architecture.",
    "portraitAlt": "Portrait of Guillaume Gay"
  },
  "Stack": {
    "categoryAI": "AI / Claude",
    "categoryWeb": "Web",
    "categoryAutomation": "Automation",
    "itemsAI": "Claude Code · Claude Cowork · MCP · Anthropic API · Prompt Engineering",
    "itemsWeb": "Next.js · TypeScript · React · Tailwind · Supabase · shadcn/ui",
    "itemsAutomation": "n8n · Airtable · Chrome Extensions · LinkedIn Helper · Python"
  },
  "Experience": {
    "kicker": "Experience",
    "title": "From artillery to AI",
    "geckoMindPeriod": "Jun 2024 – Present",
    "geckoMindRole": "Founder & AI Builder",
    "geckoMindOrg": "Gecko Mind",
    "geckoMindDescription": "Done-for-you LinkedIn B2B prospecting and content creation service for solopreneurs, freelancers and B2B SME leaders. End-to-end ownership of tech, marketing, sales and operations.",
    "reconversionPeriod": "2024",
    "reconversionRole": "Tech transition",
    "reconversionOrg": "Training & building",
    "reconversionDescription": "Intensive online training (web development, AI, automation, growth hacking). Launched the Gecko Agent open source project. Built the Gecko Mind stack and onboarded first clients.",
    "armyPeriod": "2003 – 2024 · 21 years",
    "armyRole": "Senior NCO",
    "armyOrg": "French Army",
    "armyDescription": "Full career, primarily in artillery. 7 successive positions with increasing responsibility (HR administration, radar/radio operator, armored vehicle driver, advanced observation team deputy, NCO in charge of unit equipment).",
    "softSkillsKicker": "Transferable skills",
    "softSkillManagement": "Managing teams of up to 30 people",
    "softSkillFormation": "Training design and delivery",
    "softSkillPilotage": "Project management under high pressure",
    "softSkillDecision": "Decision-making in complex environments"
  }
}
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Le typecheck vérifie que `placeholderExperience` n'est plus consommé. Si page.tsx le référence encore (ce qui devrait être le cas — Phase 2 Task 6 avait supprimé Hero/About mais pas Experience), il faudra le retirer en Task 7. Pour cette task, garder le placeholder dans page.tsx tant que Experience n'existe pas → ajouter quand même `placeholderExperience` dans fr.json/en.json pour ne pas casser le build maintenant. **Correction** : remettre `placeholderExperience` dans `Home` namespace pour les deux JSON tant que Task 7 n'est pas faite.

Donc dans fr.json/en.json, garder `placeholderExperience` pendant cette task. La suppression réelle se fera dans Task 7. Réécrire les JSON ci-dessus en ajoutant cette clé temporairement :

`Home` namespace devient :
```json
"Home": {
  "placeholderExperience": "Experience — à venir Phase 3",
  "placeholderProjects": "Projects — à venir Phase 4",
  "placeholderContact": "Contact — à venir Phase 5"
}
```

(Même chose pour en.json avec "coming Phase 3".)

- [ ] **Step 4 : Commit**

```bash
git add src/messages/
git commit -m "feat(i18n): extend messages with Experience namespace"
```

---

## Task 4 : TimelineItem (server, variante main)

**Files:**
- Create: `src/components/sections/Experience/TimelineItem.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Experience/TimelineItem.tsx`**

```tsx
// TimelineItem — carte expérience pour les blocs "main" (Gecko Mind, Reconversion).
// Server component : pas d'interactivité, le reveal est géré par Timeline (wrapper client).
// Le bloc "compact" militaire a son propre composant TimelineMilitary (typo plus discrète).
import { Tag } from '@/components/ui/Tag';
import type { ExperienceItem } from '@/types/experience';

type TimelineItemProps = {
  item: ExperienceItem;
};

export function TimelineItem({ item }: TimelineItemProps) {
  return (
    // data-timeline-item = cible des reveal scroll-triggers dans Timeline.tsx
    <article data-timeline-item className="relative flex flex-col gap-4 pl-8 md:pl-12">
      {/* Pastille marquant la position sur la progress line — alignée avec gauche du texte. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 h-2 w-2 rounded-full bg-accent ring-4 ring-bg"
      />
      <header className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
          {item.period}
        </span>
        <h3 className="font-display text-2xl md:text-3xl tracking-tight">
          {item.role}{' '}
          <span className="text-fg-muted italic">— {item.organization}</span>
        </h3>
      </header>
      <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-2xl">
        {item.description}
      </p>
      {item.stack && item.stack.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-2">
          {item.stack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Experience/TimelineItem.tsx
git commit -m "feat(experience): add TimelineItem main variant"
```

---

## Task 5 : TimelineMilitary (server, variante compact + soft skills)

**Files:**
- Create: `src/components/sections/Experience/TimelineMilitary.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Experience/TimelineMilitary.tsx`**

```tsx
// TimelineMilitary — bloc compact pour les 21 ans d'Armée de Terre.
// Plus discret typographiquement (texte plus petit, opacity réduite, pas de stack tags).
// Sous le bloc principal, un encart "Compétences transférables" met en valeur les soft skills.
// Le militaire est présenté comme contexte ; la VALEUR mise en avant ce sont les transférables.
import type { ExperienceItem } from '@/types/experience';

type TimelineMilitaryProps = {
  item: ExperienceItem;
  softSkillsKicker: string;
  softSkills: readonly string[];
};

export function TimelineMilitary({ item, softSkillsKicker, softSkills }: TimelineMilitaryProps) {
  return (
    <article data-timeline-item className="relative flex flex-col gap-6 pl-8 md:pl-12">
      {/* Pastille plus discrète (couleur muted au lieu d'accent) pour le bloc compact. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 h-2 w-2 rounded-full bg-fg-muted ring-4 ring-bg"
      />

      {/* Bloc compact : texte muted, taille réduite. */}
      <div className="flex flex-col gap-2 opacity-80">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
          {item.period}
        </span>
        <h3 className="font-display text-xl md:text-2xl tracking-tight text-fg-muted">
          {item.role}{' '}
          <span className="italic">— {item.organization}</span>
        </h3>
        <p className="text-sm text-fg-muted leading-relaxed max-w-2xl">{item.description}</p>
      </div>

      {/* Encart soft skills : c'est la valeur, mis en avant visuellement. */}
      <div className="rounded border border-border bg-bg-elevated p-5 md:p-6 flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          {softSkillsKicker}
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {softSkills.map((skill) => (
            <li key={skill} className="flex items-start gap-2 text-sm text-fg">
              <span aria-hidden="true" className="text-accent leading-relaxed">
                →
              </span>
              <span>{skill}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Experience/TimelineMilitary.tsx
git commit -m "feat(experience): add TimelineMilitary compact variant with soft skills"
```

---

## Task 6 : TimelineProgress (progress line sticky animée)

**Files:**
- Create: `src/components/sections/Experience/TimelineProgress.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Experience/TimelineProgress.tsx`**

```tsx
'use client';

// TimelineProgress — ligne verticale qui suit la progression du scroll dans la section Experience.
// Position sticky pour rester visible pendant le traversée de la section.
// `progress` est une MotionValue 0-1 mesurée par Timeline.tsx (parent) via Framer useScroll.
import { motion, type MotionValue, useTransform } from 'framer-motion';

type TimelineProgressProps = {
  // Progress 0-1 du scroll dans la section (mesuré par le parent Timeline).
  progress: MotionValue<number>;
};

export function TimelineProgress({ progress }: TimelineProgressProps) {
  // scaleY 0 → 1 selon progress. transform-origin top pour fill du haut vers le bas.
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="relative h-full">
      {/* Trait neutre (fond) — 1px de large, full height. */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-px bg-border"
      />
      {/* Trait actif (accent) — fill animé via scaleY. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-0 top-0 h-full w-px bg-accent"
      />
    </div>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Experience/TimelineProgress.tsx
git commit -m "feat(experience): add TimelineProgress animated sticky line"
```

---

## Task 7 : Timeline (client wrapper) + Experience composé + wire page

**Files:**
- Create: `src/components/sections/Experience/Timeline.tsx`
- Create: `src/components/sections/Experience/Experience.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/messages/fr.json` (retirer placeholderExperience)
- Modify: `src/messages/en.json` (retirer placeholderExperience)

- [ ] **Step 1 : Créer `src/components/sections/Experience/Timeline.tsx`**

```tsx
'use client';

// Timeline — wrapper client de la section Experience.
// Mesure la progression du scroll dans le container via Framer useScroll
// (offset start end → end start, classique pour un fill 0-1 sur la traversée).
// Applique aussi le reveal scroll-triggered sur chaque [data-timeline-item] via GSAP.
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScroll } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

import { TimelineProgress } from './TimelineProgress';

type TimelineProps = {
  children: ReactNode;
};

export function Timeline({ children }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Progress 0-1 : 0 quand le top du container atteint le bottom du viewport,
  // 1 quand le bottom du container atteint le top du viewport.
  // Effet : le fill commence quand on arrive sur la section et finit quand on en sort.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Reveal scroll par bloc — pattern AboutText (Phase 2).
  useGSAP(
    () => {
      if (reducedMotion) return;
      if (!containerRef.current) return;

      const items = containerRef.current.querySelectorAll('[data-timeline-item]');
      const triggers: ScrollTrigger[] = [];

      for (const el of items) {
        const tween = gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
        const trigger = tween.scrollTrigger;
        if (trigger) triggers.push(trigger);
      }

      return () => {
        for (const t of triggers) t.kill();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={containerRef} className="relative grid grid-cols-[auto_1fr] gap-6 md:gap-10">
      {/* Colonne 1 : progress line — sticky pour rester visible pendant la traversée. */}
      <div className="sticky top-24 self-start h-[calc(100vh-12rem)] w-px">
        <TimelineProgress progress={scrollYProgress} />
      </div>
      {/* Colonne 2 : items en stack vertical. */}
      <div className="flex flex-col gap-20 md:gap-28">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2 : Créer `src/components/sections/Experience/Experience.tsx`**

```tsx
// Experience — wrapper RSC : traduit les textes, construit les data items, compose la Timeline.
// Cf. PRD §3 Module 4.
import { getTranslations } from 'next-intl/server';

import type { ExperienceItem } from '@/types/experience';

import { Timeline } from './Timeline';
import { TimelineItem } from './TimelineItem';
import { TimelineMilitary } from './TimelineMilitary';

export async function Experience() {
  const t = await getTranslations('Experience');

  // Construction typée des items à partir des messages i18n.
  const geckoMind: ExperienceItem = {
    period: t('geckoMindPeriod'),
    role: t('geckoMindRole'),
    organization: t('geckoMindOrg'),
    description: t('geckoMindDescription'),
    stack: ['Claude Code', 'Anthropic API', 'n8n', 'Airtable', 'Next.js', 'TypeScript'],
    variant: 'main',
  };

  const reconversion: ExperienceItem = {
    period: t('reconversionPeriod'),
    role: t('reconversionRole'),
    organization: t('reconversionOrg'),
    description: t('reconversionDescription'),
    stack: ['Next.js', 'React', 'TypeScript', 'Anthropic API'],
    variant: 'main',
  };

  const army: ExperienceItem = {
    period: t('armyPeriod'),
    role: t('armyRole'),
    organization: t('armyOrg'),
    description: t('armyDescription'),
    variant: 'compact',
  };

  const softSkills = [
    t('softSkillManagement'),
    t('softSkillFormation'),
    t('softSkillPilotage'),
    t('softSkillDecision'),
  ] as const;

  return (
    <section id="experience" className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-5xl flex flex-col gap-16">
        <header className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {t('kicker')}
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight italic">
            {t('title')}
          </h2>
        </header>
        <Timeline>
          <TimelineItem item={geckoMind} />
          <TimelineItem item={reconversion} />
          <TimelineMilitary
            item={army}
            softSkillsKicker={t('softSkillsKicker')}
            softSkills={softSkills}
          />
        </Timeline>
      </div>
    </section>
  );
}
```

- [ ] **Step 3 : Modifier `src/app/[locale]/page.tsx`**

Lire d'abord pour voir l'état exact. Remplacer la section experience placeholder par `<Experience />`. Ajouter l'import. Final return :

```tsx
return (
  <>
    <Hero />
    <About />
    <Experience />
    <section id="projects" className="min-h-screen flex items-center justify-center">
      <p className="text-fg-muted">{t('placeholderProjects')}</p>
    </section>
    <section id="contact" className="min-h-screen flex items-center justify-center">
      <p className="text-fg-muted">{t('placeholderContact')}</p>
    </section>
  </>
);
```

Import à ajouter : `import { Experience } from '@/components/sections/Experience/Experience';`

- [ ] **Step 4 : Retirer `placeholderExperience` de `src/messages/fr.json` et `en.json`**

Maintenant qu'Experience est wired, supprimer les clés `Home.placeholderExperience` des deux JSON. Le namespace `Home` ne contient plus que `placeholderProjects` et `placeholderContact`.

- [ ] **Step 5 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

All MUST pass.

- [ ] **Step 6 : Smoke test (background dev server)**

```bash
curl -s http://localhost:3000/fr | grep -i "De l'artillerie à l'IA"      # title FR
curl -s http://localhost:3000/en | grep -i "From artillery to AI"        # title EN
curl -s http://localhost:3000/fr | grep -i "Founder & AI Builder"        # geckoMindRole
curl -s http://localhost:3000/fr | grep -i "21 ans"                      # armyPeriod FR
curl -s http://localhost:3000/en | grep -i "21 years"                    # armyPeriod EN
curl -s http://localhost:3000/fr | grep -i "Compétences transférables"   # softSkillsKicker FR
curl -s http://localhost:3000/en | grep -i "Transferable skills"         # softSkillsKicker EN
```

- [ ] **Step 7 : Commit**

```bash
git add src/components/sections/Experience/ src/app/[locale]/page.tsx src/messages/
git commit -m "feat(experience): compose Experience section with Timeline, items, military bloc"
```

---

## Task 8 : QA finale + tag v0.3-experience

**Files:**
- Create: `docs/superpowers/reports/2026-05-13-phase-3-experience.md`

- [ ] **Step 1 : Verifications**

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Tous PASS.

- [ ] **Step 2 : Smoke tests**

```bash
# pnpm dev en background, attendre Ready in
curl -I http://localhost:3000/fr   # 200
curl -I http://localhost:3000/en   # 200
curl -s http://localhost:3000/fr | grep -c "Gecko Mind"                # >= 1
curl -s http://localhost:3000/fr | grep -i "Reconversion tech"         # match
curl -s http://localhost:3000/fr | grep -i "Sous-officier"             # army role FR
curl -s http://localhost:3000/en | grep -i "Senior NCO"                # army role EN
curl -s http://localhost:3000/fr | grep -i "Management d'équipe"       # softSkill FR
curl -s http://localhost:3000/en | grep -i "Managing teams"            # softSkill EN
curl -s http://localhost:3000/fr | grep -i "Anthropic API"             # stack tag

# Bundle size — capter la "First Load JS" du /[locale] dans le build output ou via .next/static
# Kill dev server
```

- [ ] **Step 3 : QA navigateur manuelle** (à exécuter par utilisateur après livraison, à documenter dans le rapport) :
- [ ] Section Experience visible entre About et Projects placeholder
- [ ] 3 items affichés : Gecko Mind, Reconversion, Armée (compact)
- [ ] Progress line à gauche, fill ember au scroll
- [ ] Pastille accent sur les 2 items main, pastille muted sur le militaire
- [ ] Bloc soft skills sous l'item militaire avec 4 entrées
- [ ] Stack tags présents sous geckoMind et reconversion (Claude Code, n8n, Next.js, etc.)
- [ ] Reveal scroll par bloc : chaque item apparaît avec fade+slide quand on scroll dessus
- [ ] Mobile (375px) : grid passe à 1 colonne, progress line visible et fonctionnelle
- [ ] FR ↔ EN switch fonctionne (LocaleSwitcher)
- [ ] DevTools `prefers-reduced-motion: reduce` → reveal off, progress line statique
- [ ] DevTools Console : zéro erreur

- [ ] **Step 4 : Créer le rapport**

`docs/superpowers/reports/2026-05-13-phase-3-experience.md` :

```markdown
## Rapport Phase 3 — Experience Timeline

### Implémenté
- Type ExperienceItem partagé (period, role, organization, description, stack?, variant)
- Composant ui/Tag (pill réutilisable, sera consommé par Phase 4 Projects aussi)
- TimelineItem (variante main) : pastille accent, role + org, description, stack tags
- TimelineMilitary (variante compact) : opacity 0.7, typo plus petite, pas de stack ; encart soft skills mis en avant
- TimelineProgress : ligne sticky 1px, fill animé via Framer useTransform scaleY 0→1
- Timeline (wrapper client) : Framer useScroll target ref offset start-end → end-start, reveal GSAP ScrollTrigger par [data-timeline-item], garde reduced-motion
- Experience : 3 items (Gecko Mind, Reconversion, Armée), soft skills (4 entrées)
- i18n étendu : namespace Experience FR/EN (kicker, title, 3 × {period, role, org, description}, softSkillsKicker, 4 soft skills)

### Non implémenté (et pourquoi)
- Pin physique de la section — interprétation : progress line est sticky/pin, pas la section entière (DEV-RULES §10 anti-scroll-jacking + meilleure compat Lenis smooth scroll)
- Détail des 7 postes militaires successifs — agrégé dans une phrase "7 postes successifs" pour rester discret (PRD §3 Module 4 : "militaire présenté discrètement")

### Problèmes rencontrés (et résolutions)
- [À compléter pendant l'exécution]

### Recommandations Phase 4
- Phase 4 va introduire le scroll horizontal projects — pin GSAP cette fois nécessaire. Vérifier que ça reste fluide avec Lenis ; ScrollTrigger.scrollerProxy peut être utile.
- Le composant Tag est prêt à être réutilisé pour les stack tags projets.

### Vérifications

| Métrique | Résultat |
|----------|----------|
| pnpm typecheck | PASS |
| pnpm lint | PASS |
| pnpm build | PASS |
| Bundle first load /[locale] | XXX kB |
| HTTP /fr et /en | 200 |
| HTML FR contient "De l'artillerie à l'IA" | ✓ |
| HTML EN contient "From artillery to AI" | ✓ |
| HTML FR contient "Sous-officier" | ✓ |
| HTML EN contient "Senior NCO" | ✓ |
| HTML FR contient "Management d'équipe" | ✓ |
| HTML EN contient "Managing teams" | ✓ |
| HTML contient "Anthropic API" (stack tag) | ✓ |
| Total commits Phase 3 | X commits |

### Tag

`git tag v0.3-experience` créé sur le commit final.
```

REPLACE les XXX avec les vraies valeurs mesurées.

- [ ] **Step 5 : Release commit + tag**

```bash
git add -A
git diff --cached --quiet || git commit -m "chore(release): close phase 3 — experience timeline"
git tag v0.3-experience
git log --oneline -10
git tag --list
```

- [ ] **Step 6 : Cleanup dev.log** (si présent)

```bash
rm -f dev.log
```

- [ ] **Step 7 : Push optionnel**

L'utilisateur peut déclencher le push lui-même avec `/git`. Ne pas push automatiquement.

---

## Self-Review

**Spec coverage (vs PRD §3 Module 4) :**
- ✅ Timeline verticale 3 blocs (Gecko Mind, Reconversion, Armée) → Task 7
- ✅ Pin section + progress line synchronisée → Task 6 + 7 (progress line sticky, pas pin section — décision documentée)
- ✅ Reveal scroll par bloc → Task 7 Timeline GSAP ScrollTrigger
- ✅ Militaire discret + compétences transférables valorisées → Task 5 TimelineMilitary
- ✅ Stack tags sur cartes expérience → Tasks 1 (Tag) + 4 (TimelineItem)

**Placeholder scan :**
- "[À compléter pendant l'exécution]" : template rapport, normal.
- Aucune autre TBD/TODO dans le plan.

**Type consistency :**
- `ExperienceItem` typé centralement, consommé par Experience.tsx (build) et TimelineItem/TimelineMilitary (props).
- `softSkills: readonly string[]` cohérent entre TimelineMilitary.tsx props et la construction `as const` dans Experience.tsx.
- `progress: MotionValue<number>` cohérent entre TimelineProgress.tsx props et Timeline.tsx `scrollYProgress`.

**Risques connus à signaler à l'exécutant :**
1. **Sticky positioning + GSAP ScrollTrigger** : pas de conflit attendu (la progress line est sticky pur CSS, le reveal GSAP cible des items distincts). Mais si l'on remarque que la progress line "skippe" sur scroll Lenis, vérifier que `ScrollTrigger.normalizeScroll(true)` n'est pas activé (peut interférer avec position:sticky).
2. **`useScroll` offset string** : Framer Motion 12 accepte `['start end', 'end start']` comme strings. Si TS se plaint, utiliser `['start end' as const, 'end start' as const]` ou caster.
3. **Hauteur sticky calc(100vh - 12rem)** : ajustée pour laisser de la place au header (16x4=64px → top-24 = 6rem). Si le header change de taille en Phase 5, ajuster.
4. **next-intl key removal** : retirer `placeholderExperience` du JSON FR mais l'oublier en EN (ou inverse) → le type `IntlMessages` est dérivé du FR, le typecheck attrape le mismatch. Faire les deux en même temps.

---

## Execution Handoff

Plan complet dans `docs/superpowers/plans/2026-05-13-phase-3-experience.md`. Comme pour Phases 1 et 2, **subagent-driven** par défaut sauf indication contraire.
