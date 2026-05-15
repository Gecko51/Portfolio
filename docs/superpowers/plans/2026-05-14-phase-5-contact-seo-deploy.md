# Phase 5 — Contact + SEO + Analytics + Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finir le portfolio v1.0-mvp — section Contact magnétique, SEO complet (metadata + OG dynamique + sitemap + robots + JSON-LD), analytics Plausible cookieless, CSP strict, audit Lighthouse ≥ 95, déploiement Vercel + DNS Cloudflare, release tag `v1.0-mvp`.

**Architecture:**
- Server Components par défaut (DEV-RULES §1). `Contact` est server ; `ContactCTA` (magnetic effect) est client uniquement où nécessaire.
- SEO 100% statique (SSG) — `generateMetadata` async sur chaque route, `@vercel/og` pour OG image générée par edge runtime, `sitemap.ts` + `robots.ts` au format conventions Next 15+.
- Plausible.io cookieless — script via `next/script` (strategy `afterInteractive`), fonction helper `track(event, props)` typée stricte.
- CSP strict via `next.config.ts` headers — allow `plausible.io` script + `data:` images pour OG.
- Build hash injecté via `NEXT_PUBLIC_BUILD_HASH` au build Vercel.

**Tech Stack:** Next.js 16 (App Router + RSC) · React 19 · TypeScript strict · `@vercel/og` · `next-intl 4` · GSAP (magnetic effect) · Plausible.io · Vercel + Cloudflare DNS.

**Pré-requis :** Avant chaque task qui touche une API Next 16 (`generateMetadata`, `sitemap.ts`, `robots.ts`, `ImageResponse`, `headers()`), interroger Context7 — `resolve-library-id` puis `query-docs` — pour récupérer la signature courante. Ne pas inventer d'API de mémoire (CLAUDE.md project).

---

## File Structure

**Créations :**
- `src/components/sections/Contact/Contact.tsx` — section server, render des CTAs traduits
- `src/components/sections/Contact/ContactCTA.tsx` — client component, magnetic effect GSAP
- `src/components/sections/Contact/contact-links.ts` — source unique des liens (email, LinkedIn, GitHub, X, Gecko Mind)
- `src/components/seo/JsonLdPerson.tsx` — JSON-LD `Person` schema (server, inline `<script type="application/ld+json">`)
- `src/lib/seo.ts` — helpers `buildMetadata({...})`, `buildAlternates(pathname)`, `SITE_URL`
- `src/lib/analytics.ts` — `track(event, props?)` typé (no-op si Plausible absent)
- `src/components/analytics/Plausible.tsx` — `<Script>` Plausible cookieless
- `src/app/api/og/route.tsx` — `ImageResponse` edge runtime, OG dynamique avec title + tagline + gradient ember
- `src/app/sitemap.ts` — sitemap.xml généré (home FR/EN + projects FR/EN)
- `src/app/robots.ts` — robots.txt avec sitemap link
- `.env.example` — `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_BUILD_HASH`
- `docs/superpowers/reports/2026-05-14-phase-5-report.md` — rapport de clôture

**Modifications :**
- `src/messages/fr.json` — ajouter namespace `Contact`
- `src/messages/en.json` — ajouter namespace `Contact`
- `src/app/[locale]/page.tsx` — remplacer placeholder par `<Contact />`, ajouter `generateMetadata`, ajouter `<JsonLdPerson />`
- `src/app/[locale]/projects/[slug]/page.tsx` — ajouter `generateMetadata` avec OG par projet
- `src/app/[locale]/layout.tsx` — monter `<Plausible />` (lazy, après hydratation)
- `src/components/layout/CVButton.tsx` — instrumenter `track('cv_download')` au click
- `src/components/layout/LocaleSwitcher.tsx` — instrumenter `track('locale_switch')` au click
- `next.config.ts` — ajouter CSP strict (allow Plausible) + Permissions-Policy renforcée
- `src/lib/projects.schema.ts` (si besoin) — confirmer présence d'un champ `summary` utilisable en OG
- `README.md` — doc Phase 5 et instructions de déploiement Vercel

---

## Task 1 — Messages i18n Contact (FR/EN)

**Files:**
- Modify: `src/messages/fr.json`
- Modify: `src/messages/en.json`

- [ ] **Step 1: Ajouter le namespace `Contact` dans `fr.json`**

Insérer entre `"Projects"` et la fermeture `}` :

```json
  "Contact": {
    "kicker": "Contact",
    "title": "On en parle ?",
    "intro": "Que tu sois solopreneur, freelance ou dirigeant TPE/PME B2B, parlons de ton acquisition et de ton automatisation.",
    "emailLabel": "Email",
    "emailValue": "gay.guillaume@orange.fr",
    "linkedinLabel": "LinkedIn",
    "linkedinValue": "@gay-guillaume",
    "githubLabel": "GitHub",
    "githubValue": "@Gecko51",
    "geckoMindLabel": "Gecko Mind",
    "geckoMindValue": "geckomind.fr",
    "ariaEmail": "Envoyer un email à Guillaume Gay",
    "ariaLinkedin": "Profil LinkedIn de Guillaume Gay",
    "ariaGithub": "Profil GitHub de Guillaume Gay",
    "ariaGeckoMind": "Site Gecko Mind"
  }
```

- [ ] **Step 2: Ajouter le namespace `Contact` dans `en.json`**

Même structure, traduit :

```json
  "Contact": {
    "kicker": "Contact",
    "title": "Let's talk.",
    "intro": "Whether you're a solopreneur, freelancer or B2B SME founder, let's discuss your acquisition and automation.",
    "emailLabel": "Email",
    "emailValue": "gay.guillaume@orange.fr",
    "linkedinLabel": "LinkedIn",
    "linkedinValue": "@gay-guillaume",
    "githubLabel": "GitHub",
    "githubValue": "@Gecko51",
    "geckoMindLabel": "Gecko Mind",
    "geckoMindValue": "geckomind.fr",
    "ariaEmail": "Send email to Guillaume Gay",
    "ariaLinkedin": "Guillaume Gay's LinkedIn profile",
    "ariaGithub": "Guillaume Gay's GitHub profile",
    "ariaGeckoMind": "Gecko Mind website"
  }
```

- [ ] **Step 3: Retirer le namespace `placeholderContact` devenu obsolète**

Dans `fr.json` et `en.json`, supprimer la clé `"Home": { "placeholderContact": ... }` (sera remplacée par la section Contact réelle).

- [ ] **Step 4: Vérifier qu'aucune référence ne casse**

```bash
grep -rn "placeholderContact" src/
```
Expected : 1 ligne dans `src/app/[locale]/page.tsx` (sera supprimée Task 4).

- [ ] **Step 5: Commit**

```bash
git add src/messages/fr.json src/messages/en.json
git commit -m "feat(i18n): add Contact namespace and remove placeholder"
```

---

## Task 2 — Source unique des liens contact

**Files:**
- Create: `src/components/sections/Contact/contact-links.ts`

- [ ] **Step 1: Créer le fichier**

```ts
// Source de vérité unique pour les liens contact.
// Centralisé ici pour éviter les divergences entre Contact, Footer et JSON-LD SEO.
export type ContactLink = {
  // Clé d'identification stable (utilisée pour le tracking analytics).
  id: 'email' | 'linkedin' | 'github' | 'gecko-mind';
  // URL absolue ou mailto: pour ouverture directe.
  href: string;
  // Préfixe pour Plausible event (ex: 'click_contact_email').
  trackEvent: string;
};

export const CONTACT_LINKS: readonly ContactLink[] = [
  { id: 'email', href: 'mailto:gay.guillaume@orange.fr', trackEvent: 'click_contact_email' },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/gay-guillaume/', trackEvent: 'click_contact_linkedin' },
  { id: 'github', href: 'https://github.com/Gecko51', trackEvent: 'click_contact_github' },
  { id: 'gecko-mind', href: 'https://geckomind.fr', trackEvent: 'click_contact_geckomind' },
] as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Contact/contact-links.ts
git commit -m "feat(contact): add single source of truth for contact links"
```

---

## Task 3 — Helper analytics (avant ContactCTA pour pouvoir l'utiliser)

**Files:**
- Create: `src/lib/analytics.ts`

- [ ] **Step 1: Créer le module analytics**

```ts
// Helper analytics — wrapper typé autour de window.plausible (cookieless).
// No-op gracieux si Plausible n'est pas chargé (dev local, prefers-reduced-motion d'analytics, etc).
// Ref: https://plausible.io/docs/custom-event-goals

// Type minimal de l'API window.plausible exposée par le script Plausible.
type PlausibleFn = (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;

// Étend Window pour TypeScript — pas de any (DEV-RULES §10).
declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

// Track event custom — appelé sur les CTAs (mailto, LinkedIn, CV download, etc).
export function track(event: string, props?: Record<string, string | number | boolean>): void {
  // SSR safety : window n'existe pas côté serveur, on no-op.
  if (typeof window === 'undefined') return;
  // Si Plausible script pas (encore) chargé, on no-op silencieusement.
  if (typeof window.plausible !== 'function') return;
  window.plausible(event, props ? { props } : undefined);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat(analytics): add Plausible track helper with SSR-safe no-op fallback"
```

---

## Task 4 — Composant ContactCTA (magnetic effect, client)

**Files:**
- Create: `src/components/sections/Contact/ContactCTA.tsx`

- [ ] **Step 1: Créer le composant client avec magnetic effect**

```tsx
'use client';

// CTA contact avec magnetic effect GSAP — desktop avec pointer fine uniquement.
// Mobile / reduced-motion : lien statique sans transform.
// Tracking analytics appelé au onClick (avant que le navigateur quitte la page).
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import { track } from '@/lib/analytics';

type ContactCTAProps = {
  href: string;
  ariaLabel: string;
  label: string;
  value: string;
  // Identifiant Plausible event (ex: 'click_contact_email').
  trackEvent: string;
  // Cible externe ou non — _blank si externe, undefined sinon (mailto stay in tab).
  external?: boolean;
  // Slot icône optionnel (SVG inline, lucide, etc).
  icon?: ReactNode;
};

// Distance max (px) de translation du lien vers le curseur.
const MAGNETIC_STRENGTH = 0.25;

export function ContactCTA({ href, ariaLabel, label, value, trackEvent, external, icon }: ContactCTAProps) {
  // Ref vers le <a> pour appliquer le transform GSAP.
  const linkRef = useRef<HTMLAnchorElement>(null);

  // useGSAP gère le cleanup auto au démontage (DEV-RULES §1).
  useGSAP(
    () => {
      // Check media query côté JS — magnetic uniquement desktop pointer fine + sans reduced-motion.
      const supportsMagnetic = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!supportsMagnetic || prefersReducedMotion) return;

      const el = linkRef.current;
      if (!el) return;

      // Quick setters GSAP — meilleure perf que gsap.to() à chaque mousemove.
      const setX = gsap.quickSetter(el, 'x', 'px');
      const setY = gsap.quickSetter(el, 'y', 'px');

      // Au mousemove dans la zone du lien, on déplace l'élément vers le curseur.
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * MAGNETIC_STRENGTH;
        const y = (e.clientY - (rect.top + rect.height / 2)) * MAGNETIC_STRENGTH;
        setX(x);
        setY(y);
      };

      // Au mouseleave on revient à la position initiale avec easing.
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      // Cleanup explicite (useGSAP nettoie GSAP tweens, mais pas les listeners DOM natifs).
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: linkRef },
  );

  // onClick : track AVANT la navigation, en mode synchrone (Plausible utilise sendBeacon en interne).
  const handleClick = () => {
    track(trackEvent);
  };

  return (
    <a
      ref={linkRef}
      href={href}
      aria-label={ariaLabel}
      onClick={handleClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex items-center justify-between gap-6 border-b border-border py-8 transition-colors hover:border-fg"
    >
      <span className="flex items-baseline gap-4">
        <span className="font-mono text-xs uppercase tracking-wider text-fg-muted">{label}</span>
        <span className="font-display text-3xl italic transition-colors group-hover:text-accent md:text-5xl">
          {value}
        </span>
      </span>
      {icon ? <span className="text-fg-muted transition-transform group-hover:translate-x-1">{icon}</span> : null}
    </a>
  );
}
```

- [ ] **Step 2: Build pour valider typecheck**

```bash
pnpm tsc --noEmit
```
Expected : pas d'erreur sur `ContactCTA.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact/ContactCTA.tsx
git commit -m "feat(contact): add ContactCTA client component with GSAP magnetic effect"
```

---

## Task 5 — Section Contact (server component)

**Files:**
- Create: `src/components/sections/Contact/Contact.tsx`

- [ ] **Step 1: Créer la section server**

```tsx
// Section Contact — server component, RSC par défaut (DEV-RULES §1).
// Compose le titre + intro + liste de ContactCTA (clients) pour le magnetic effect.
// Ancre #contact ciblée par la nav Header.
import { getTranslations } from 'next-intl/server';

import { ContactCTA } from './ContactCTA';
import { CONTACT_LINKS } from './contact-links';

// Icône flèche réutilisée (inline SVG, pas de lib pour éviter dep).
function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export async function Contact() {
  // Récupère les traductions du namespace 'Contact' (DEV-RULES §10 : zéro string en dur).
  const t = await getTranslations('Contact');

  // Map les links de la source unique vers le rendu — label/value/aria via t().
  // Conserver l'ordre : email d'abord (CTA principal), puis socials.
  const ctaConfig = [
    { id: 'email' as const, label: t('emailLabel'), value: t('emailValue'), aria: t('ariaEmail'), external: false },
    { id: 'linkedin' as const, label: t('linkedinLabel'), value: t('linkedinValue'), aria: t('ariaLinkedin'), external: true },
    { id: 'github' as const, label: t('githubLabel'), value: t('githubValue'), aria: t('ariaGithub'), external: true },
    {
      id: 'gecko-mind' as const,
      label: t('geckoMindLabel'),
      value: t('geckoMindValue'),
      aria: t('ariaGeckoMind'),
      external: true,
    },
  ];

  return (
    <section id="contact" className="border-t border-border bg-bg px-6 py-32 md:py-48">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-muted">{t('kicker')}</p>
        <h2 className="mt-4 font-display text-5xl italic md:text-7xl">{t('title')}</h2>
        <p className="mt-6 max-w-2xl text-lg text-fg-muted">{t('intro')}</p>

        <ul className="mt-16 flex flex-col">
          {ctaConfig.map((cta) => {
            // Lookup du link correspondant dans la source unique.
            const link = CONTACT_LINKS.find((l) => l.id === cta.id);
            if (!link) return null;
            return (
              <li key={cta.id}>
                <ContactCTA
                  href={link.href}
                  ariaLabel={cta.aria}
                  label={cta.label}
                  value={cta.value}
                  trackEvent={link.trackEvent}
                  external={cta.external}
                  icon={<ArrowIcon />}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Contact/Contact.tsx
git commit -m "feat(contact): add Contact section server component"
```

---

## Task 6 — Intégration Contact dans la home

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Remplacer le placeholder par `<Contact />`**

Remplacer l'intégralité du fichier par :

```tsx
// Page d'accueil — toutes les sections du portfolio (Phase 5 close la home).
// RSC pur (DEV-RULES §1) — pas de 'use client'. Traductions via getTranslations.
import { setRequestLocale } from 'next-intl/server';

// Sections principales — server components pour la perf.
import { About } from '@/components/sections/About/About';
import { Contact } from '@/components/sections/Contact/Contact';
import { Experience } from '@/components/sections/Experience/Experience';
import { Hero } from '@/components/sections/Hero/Hero';
import { Projects } from '@/components/sections/Projects/Projects';

// Props : params est une Promise (Next 15+ App Router).
type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  // Await params obligatoire en Next 15+.
  const { locale } = await params;

  // Active le rendu statique pour cette locale.
  setRequestLocale(locale);

  return (
    <>
      {/* Section Hero — plein écran avec fond animé, nom et tagline */}
      <Hero />
      {/* Section About — texte éditorial + portrait + marquee de stack technique */}
      <About />
      {/* Section Experience — timeline avec Gecko Mind, Reconversion, Armée de Terre */}
      <Experience />
      {/* Section Projects — galerie de projets avec scroll horizontal animé (GSAP desktop, snap mobile) */}
      <Projects />
      {/* Section Contact — magnetic links + CTAs (email, LinkedIn, GitHub, Gecko Mind) */}
      <Contact />
    </>
  );
}
```

- [ ] **Step 2: Démarrer le dev server et vérifier visuellement**

```bash
pnpm dev
```
Naviguer sur http://localhost:3000/fr puis http://localhost:3000/en, scroller jusqu'au bas. Expected : section Contact visible avec 4 CTAs, magnetic effect actif desktop.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat(home): wire Contact section, replace Phase 5 placeholder"
```

---

## Task 7 — Helper SEO (metadata + alternates + SITE_URL)

**Files:**
- Create: `src/lib/seo.ts`

- [ ] **Step 1: Créer le helper SEO**

⚠️ **Avant d'écrire** : interroger Context7 sur `next-intl` v4 + Next 16 `generateMetadata` async + alternates `languages` map pour confirmer la signature courante.

```ts
// Helpers SEO — centralise SITE_URL, alternates hreflang et builders metadata.
// Utilisé par toutes les pages qui exposent generateMetadata (home, project detail, etc).
import type { Metadata } from 'next';

import { type Locale, routing } from '@/i18n/routing';

// URL canonique du site — env var en prod Vercel, fallback localhost en dev.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Construit l'objet alternates.languages pour une page localisée.
// pathname doit être absolu côté locale (ex: '' pour home, '/projects/gecko-agent').
export function buildAlternates(pathname: string): NonNullable<Metadata['alternates']> {
  // Map locale → URL absolue (hreflang requiert URL complète).
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${pathname}`;
  }
  // x-default pointe vers la locale par défaut (recommandation Google).
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${pathname}`;
  return {
    canonical: `${SITE_URL}/${routing.defaultLocale}${pathname}`,
    languages,
  };
}

// Construit une URL OG dynamique vers /api/og avec params.
export function buildOgUrl(params: { title: string; subtitle?: string; locale: Locale }): string {
  const url = new URL('/api/og', SITE_URL);
  url.searchParams.set('title', params.title);
  if (params.subtitle) url.searchParams.set('subtitle', params.subtitle);
  url.searchParams.set('locale', params.locale);
  return url.toString();
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm tsc --noEmit
```
Expected : pas d'erreur.

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo.ts
git commit -m "feat(seo): add SITE_URL, buildAlternates and buildOgUrl helpers"
```

---

## Task 8 — Metadata home avec alternates + OG

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Ajouter `generateMetadata` async**

⚠️ Context7 : confirmer la signature `generateMetadata({ params })` async + `setRequestLocale` AVANT `getTranslations` dans `generateMetadata`.

Ajouter en haut de `src/app/[locale]/page.tsx` (avant le composant `Home`) :

```tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { buildAlternates, buildOgUrl, SITE_URL } from '@/lib/seo';
import { type Locale } from '@/i18n/routing';

// generateMetadata async — exécuté au build SSG par locale.
// Récupère titre/tagline traduits + construit alternates hreflang + OG dynamique.
export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  // Cast safe : la locale a déjà été validée par le layout parent (hasLocale).
  const typedLocale = locale as Locale;

  // setRequestLocale obligatoire avant getTranslations dans generateMetadata (next-intl v4).
  // Permet le SSG complet par locale au lieu d'un fallback runtime.
  const t = await getTranslations({ locale: typedLocale, namespace: 'Hero' });
  const tMeta = await getTranslations({ locale: typedLocale, namespace: 'About' });

  const title = `${t('name')} — ${t('tagline')}`;
  const description = tMeta('paragraph1');

  return {
    title,
    description,
    alternates: buildAlternates(''),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${typedLocale}`,
      siteName: t('name'),
      locale: typedLocale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [{ url: buildOgUrl({ title: t('name'), subtitle: t('tagline'), locale: typedLocale }), width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [buildOgUrl({ title: t('name'), subtitle: t('tagline'), locale: typedLocale })],
    },
  };
}
```

- [ ] **Step 2: Build pour valider**

```bash
pnpm build
```
Expected : build OK, pas d'erreur. Routes `/fr` et `/en` générées en SSG.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat(seo): add async generateMetadata with hreflang alternates and OG for home"
```

---

## Task 9 — JSON-LD Person sur la home

**Files:**
- Create: `src/components/seo/JsonLdPerson.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Créer le composant JSON-LD**

```tsx
// Composant SEO — injecte un schema.org Person en JSON-LD.
// Render via <script type="application/ld+json"> côté server, pas de dangerous interaction.
// Schéma : https://schema.org/Person
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
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/images/portrait-placeholder.svg`,
    jobTitle: locale === 'fr' ? 'AI Builder & Full Stack Developer' : 'AI Builder & Full Stack Developer',
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
  // dangerouslySetInnerHTML requis car Next n'autorise pas <script>{...}</script> en JSX.
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires script tag with stringified JSON
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
```

- [ ] **Step 2: Monter `<JsonLdPerson />` dans la home**

Dans `src/app/[locale]/page.tsx`, ajouter l'import et placer le composant juste avant `<Hero />` :

```tsx
import { JsonLdPerson } from '@/components/seo/JsonLdPerson';
// ... dans le return :
return (
  <>
    <JsonLdPerson locale={locale as Locale} />
    <Hero />
    {/* ... reste inchangé ... */}
  </>
);
```

- [ ] **Step 3: Build et valider via curl le HTML**

```bash
pnpm build && pnpm start
```
Dans un autre terminal :
```bash
curl -s http://localhost:3000/fr | grep -A 2 'application/ld+json'
```
Expected : balise `<script type="application/ld+json">` avec JSON Person.

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/JsonLdPerson.tsx src/app/[locale]/page.tsx
git commit -m "feat(seo): add JSON-LD Person schema on home"
```

---

## Task 10 — Metadata sur pages détail projets

**Files:**
- Modify: `src/app/[locale]/projects/[slug]/page.tsx`

- [ ] **Step 1: Lire le fichier existant pour repérer la structure**

```bash
cat src/app/[locale]/projects/[slug]/page.tsx
```

- [ ] **Step 2: Ajouter `generateMetadata`**

⚠️ Context7 : confirmer comportement `generateMetadata` quand `notFound()` est appelé côté contenu (Next 16).

Insérer en haut du fichier (après imports) :

```tsx
import type { Metadata } from 'next';

import { buildAlternates, buildOgUrl, SITE_URL } from '@/lib/seo';

// Type des params (Promise depuis Next 15+).
type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;

  // Récupère le frontmatter via le helper existant projects.ts.
  const meta = await getProjectMeta(typedLocale, slug);

  // Si pas de projet, on retourne un metadata minimal (la page elle-même fera notFound()).
  if (!meta) {
    return { title: 'Project not found' };
  }

  const ogUrl = buildOgUrl({ title: meta.title, subtitle: meta.tagline, locale: typedLocale });
  const canonicalPath = `/projects/${slug}`;

  return {
    title: `${meta.title} — Guillaume Gay`,
    description: meta.tagline,
    alternates: buildAlternates(canonicalPath),
    openGraph: {
      title: meta.title,
      description: meta.tagline,
      url: `${SITE_URL}/${typedLocale}${canonicalPath}`,
      type: 'article',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.tagline,
      images: [ogUrl],
    },
  };
}
```

Ajouter aussi les imports manquants (`getProjectMeta`, `Locale`) si pas déjà présents.

- [ ] **Step 3: Build pour valider la SSG des routes projects**

```bash
pnpm build
```
Expected : routes `/fr/projects/[slug]` et `/en/projects/[slug]` générées en SSG.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/projects/[slug]/page.tsx
git commit -m "feat(seo): add generateMetadata for project detail pages with OG and hreflang"
```

---

## Task 11 — OG image dynamique (`/api/og`)

**Files:**
- Create: `src/app/api/og/route.tsx`
- Modify: `package.json` (ajouter `@vercel/og`)

- [ ] **Step 1: Installer `@vercel/og`**

⚠️ Context7 : `resolve-library-id @vercel/og` puis `query-docs` sur `ImageResponse` + edge runtime + custom fonts en 2026.

```bash
pnpm add @vercel/og
```
Expected : ajout dans `dependencies`, lockfile mis à jour.

- [ ] **Step 2: Créer la route handler**

```tsx
// Route /api/og — génère une OG image dynamique (1200×630) avec @vercel/og.
// Edge runtime pour la perf (latence minimale, pas de cold start Node).
// Params query: ?title=...&subtitle=...&locale=fr|en
import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

// Edge runtime obligatoire pour ImageResponse (perf + bundle minimal).
export const runtime = 'edge';

// Couleurs du design system (dupliquées ici car Edge runtime ne peut pas lire les CSS vars).
const COLORS = {
  bg: '#0A0A0A',
  fg: '#F5F5F5',
  fgMuted: '#8A8A8A',
  accent: '#FF5B1F',
  accentSoft: '#FFB07A',
  border: '#1F1F1F',
};

export async function GET(request: NextRequest) {
  // Extraction des params avec fallbacks safe.
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Guillaume Gay';
  const subtitle = searchParams.get('subtitle') ?? 'AI Builder & Full Stack Developer';
  const locale = searchParams.get('locale') ?? 'fr';

  // Pied de page localisé.
  const footer = locale === 'fr' ? 'Portfolio · 2026' : 'Portfolio · 2026';

  // L'API ImageResponse rend du JSX en image PNG via Satori.
  // Limitations : pas de Tailwind utilities, juste style inline. Pas de hex avec alpha, utiliser rgba.
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        padding: '80px',
        position: 'relative',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Gradient ember en haut-droit — signature visuelle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60%',
          height: '60%',
          background: `radial-gradient(ellipse at top right, ${COLORS.accent}40 0%, transparent 60%)`,
        }}
      />

      {/* Kicker mono */}
      <div style={{ display: 'flex', color: COLORS.fgMuted, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase' }}>
        GUILLAUME GAY
      </div>

      {/* Spacer flex pour pousser le titre vers le bas */}
      <div style={{ display: 'flex', flex: 1 }} />

      {/* Titre principal */}
      <div
        style={{
          display: 'flex',
          color: COLORS.fg,
          fontSize: 96,
          lineHeight: 1.05,
          fontStyle: 'italic',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </div>

      {/* Sous-titre */}
      <div style={{ display: 'flex', color: COLORS.fgMuted, fontSize: 40, marginTop: 24, lineHeight: 1.3 }}>
        {subtitle}
      </div>

      {/* Footer ligne mono */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 60,
          color: COLORS.fgMuted,
          fontSize: 20,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        <span>{footer}</span>
        <span style={{ color: COLORS.accent }}>●</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
```

- [ ] **Step 3: Démarrer dev et tester l'image**

```bash
pnpm dev
```
Ouvrir dans le navigateur : http://localhost:3000/api/og?title=Test%20Title&subtitle=Test%20Subtitle&locale=fr
Expected : image PNG 1200×630 avec design ember.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/og/route.tsx package.json pnpm-lock.yaml
git commit -m "feat(seo): add dynamic OG image route via @vercel/og edge runtime"
```

---

## Task 12 — Sitemap (`sitemap.ts`)

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Vérifier l'API existante pour récupérer slugs projets**

```bash
grep -n "export.*function" src/lib/projects.ts
```
Confirmer présence de `getProjectSlugs(locale)`.

- [ ] **Step 2: Créer le sitemap**

⚠️ Context7 : `resolve-library-id next.js` puis `query-docs sitemap.ts MetadataRoute.Sitemap App Router` pour confirmer la signature 2026.

```ts
// Sitemap — convention Next 15+ (src/app/sitemap.ts).
// Génère sitemap.xml au build avec toutes les pages localisées (home + projects FR/EN).
// alternates.languages permet à Google d'indexer toutes les versions.
import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { getProjectSlugs } from '@/lib/projects';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Helper pour construire les alternates languages d'une page.
  const buildLanguages = (path: string) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = `${SITE_URL}/${locale}${path}`;
    }
    return languages;
  };

  // Entrées home pour chaque locale.
  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: { languages: buildLanguages('') },
  }));

  // Entrées projets — slugs lus depuis les MDX de chaque locale.
  // On suppose que les slugs FR et EN sont identiques (cf. content/projects/).
  const slugs = await getProjectSlugs(routing.defaultLocale);
  const projectEntries: MetadataRoute.Sitemap = slugs.flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/projects/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: buildLanguages(`/projects/${slug}`) },
    })),
  );

  return [...homeEntries, ...projectEntries];
}
```

- [ ] **Step 3: Build et vérifier sitemap généré**

```bash
pnpm build && pnpm start
```
Puis :
```bash
curl -s http://localhost:3000/sitemap.xml
```
Expected : XML valide avec 2 URLs home + 2×N URLs projets, chacune avec `xhtml:link rel="alternate" hreflang=...`.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): add sitemap.ts with hreflang alternates for all localized routes"
```

---

## Task 13 — Robots (`robots.ts`)

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: Créer le robots**

```ts
// Robots.txt — convention Next 15+ (src/app/robots.ts).
// Autorise toutes les routes publiques et déclare le sitemap.
import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Pas d'admin/dashboard à protéger sur ce portfolio statique.
        // /api/og est public (utilisé par les crawlers pour les previews).
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

- [ ] **Step 2: Build et vérifier**

```bash
pnpm build && pnpm start
```
```bash
curl -s http://localhost:3000/robots.txt
```
Expected : `User-agent: *`, `Allow: /`, `Disallow: /api/`, `Sitemap: http://localhost:3000/sitemap.xml`.

- [ ] **Step 3: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat(seo): add robots.ts with sitemap reference"
```

---

## Task 14 — Plausible script + integration

**Files:**
- Create: `src/components/analytics/Plausible.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Create: `.env.example`

- [ ] **Step 1: Créer le composant Plausible**

⚠️ Context7 : `query-docs` sur `next/script` v16 + Plausible self-hosted vs cloud (event endpoint).

```tsx
// Plausible analytics — script cookieless, RGPD-friendly (pas de bandeau requis).
// Activé uniquement si NEXT_PUBLIC_PLAUSIBLE_DOMAIN est défini (skip en local dev).
// Utilise next/script avec strategy 'afterInteractive' — chargé après hydratation, sans bloquer.
import Script from 'next/script';

export function Plausible() {
  // Domain Plausible (ex: portfolio.guillaumegay.fr) — undefined en local → no-op.
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <>
      {/* Script Plausible — extension "manual" pour pouvoir push window.plausible(event) custom (analytics.ts). */}
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.manual.js"
        strategy="afterInteractive"
      />
      {/* Init manuel : pageview au mount, puis Plausible suit les SPA navigations via History API. */}
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };
plausible('pageview');`}
      </Script>
    </>
  );
}
```

- [ ] **Step 2: Monter dans `[locale]/layout.tsx`**

Dans `src/app/[locale]/layout.tsx`, ajouter l'import et placer `<Plausible />` à la fin du `NextIntlClientProvider`, après `<Footer />` :

```tsx
import { Plausible } from '@/components/analytics/Plausible';
// ... dans le return :
            <Footer />
          </CursorProvider>
        </LenisProvider>
      </GsapProvider>
      <Plausible />
    </NextIntlClientProvider>
```

- [ ] **Step 3: Créer `.env.example`**

```bash
# Variables d'environnement publiques — copier en .env.local pour le dev.
# En prod (Vercel), définir via dashboard Settings → Environment Variables.

# URL canonique du site (utilisé par metadata, OG, sitemap, robots).
NEXT_PUBLIC_SITE_URL=https://guillaumegay.fr

# Domaine Plausible (ex: guillaumegay.fr ou portfolio.guillaumegay.fr).
# Laisser vide en local pour désactiver le tracking dev.
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=

# Hash de commit injecté au build (Vercel: $VERCEL_GIT_COMMIT_SHA, override dans Settings).
NEXT_PUBLIC_BUILD_HASH=dev
```

- [ ] **Step 4: Build et valider absence de script en local**

```bash
pnpm build && pnpm start
```
```bash
curl -s http://localhost:3000/fr | grep plausible
```
Expected : aucun match (pas de domain défini en local).

- [ ] **Step 5: Commit**

```bash
git add src/components/analytics/Plausible.tsx src/app/[locale]/layout.tsx .env.example
git commit -m "feat(analytics): add Plausible cookieless tracking with manual mode for custom events"
```

---

## Task 15 — Instrumenter CTAs (CV download, locale switch)

**Files:**
- Modify: `src/components/layout/CVButton.tsx`
- Modify: `src/components/layout/LocaleSwitcher.tsx`

- [ ] **Step 1: Lire les fichiers existants**

```bash
cat src/components/layout/CVButton.tsx
cat src/components/layout/LocaleSwitcher.tsx
```
Identifier où ajouter le `track()`. Si CVButton est server-only (download direct via `<a>` href PDF), il faut splitter en wrapper client pour pouvoir track. Si déjà client, simple ajout `onClick`.

- [ ] **Step 2: Instrumenter `CVButton`**

Si server : créer un wrapper client `CVButtonClient.tsx` qui réutilise les props (href + label), avec `onClick={() => track('cv_download', { locale })}`. Si déjà client : ajouter directement le `onClick`.

```tsx
// Au minimum, ajout du tracking onClick :
import { track } from '@/lib/analytics';

// ... dans le composant :
const handleClick = () => {
  track('cv_download', { locale });
};

return (
  <a href={href} download onClick={handleClick} className="...">
    {label}
  </a>
);
```

- [ ] **Step 3: Instrumenter `LocaleSwitcher`**

Ajouter `track('locale_switch', { from: currentLocale, to: targetLocale })` au moment du switch.

- [ ] **Step 4: Build pour valider**

```bash
pnpm build
```
Expected : OK.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/CVButton.tsx src/components/layout/LocaleSwitcher.tsx
git commit -m "feat(analytics): instrument CV download and locale switch with track events"
```

---

## Task 16 — CSP strict + headers Plausible

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Ajouter une CSP stricte qui autorise Plausible + OG**

⚠️ Context7 : `query-docs` sur Next 16 `headers()` async + CSP nonce vs hash strategy. La CSP doit autoriser :
- Script Plausible (`plausible.io`)
- Inline scripts JSON-LD (nécessite `'unsafe-inline'` OU passage à hash strategy — pour simplifier MVP, on garde `'unsafe-inline'` mais avec restrictions strictes ailleurs)
- Images data: (pour SVG inline) et l'OG depuis le domaine canonique
- Connect Plausible (sendBeacon)

Remplacer `next.config.ts` par :

```ts
// Configuration Next.js — plugin next-intl + headers de sécurité durcis (Phase 5).
// CSP autorise : Plausible (script + connect), JSON-LD inline, images data:, OG.
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Construction CSP — chaque directive sur sa propre ligne pour lisibilité.
// 'unsafe-inline' sur script-src est nécessaire pour JSON-LD ; mitigé par les autres restrictions.
// Si on veut passer hash strategy en v2, voir Next 16 'use cache' + crypto.subtle.digest au build.
const cspDirectives = [
  "default-src 'self'",
  // Plausible script externalisé ; 'unsafe-inline' pour JSON-LD Person + init script Plausible.
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  // Styles inline tolérés (Tailwind v4 utilities + Framer Motion).
  "style-src 'self' 'unsafe-inline'",
  // Images : self + data: pour SVG inline + OG depuis @vercel/og.
  "img-src 'self' data: blob:",
  // Fonts self-hosted via next/font.
  "font-src 'self' data:",
  // Plausible utilise sendBeacon → connect-src.
  "connect-src 'self' https://plausible.io",
  // Pas d'embeds tiers.
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // upgrade-insecure-requests force https en prod.
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
];

const nextConfig: NextConfig = {
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

- [ ] **Step 2: Build et valider headers**

```bash
pnpm build && pnpm start
```
```bash
curl -sI http://localhost:3000/fr | grep -i "content-security-policy"
```
Expected : header présent avec toutes les directives.

- [ ] **Step 3: Tester JSON-LD et OG dans le navigateur**

Ouvrir http://localhost:3000/fr dans Chrome DevTools → Network → vérifier qu'il n'y a aucune erreur CSP. Si erreur sur OG ou JSON-LD, ajuster `cspDirectives`.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat(security): add strict CSP allowing Plausible and OG image"
```

---

## Task 17 — Footer build hash + finitions

**Files:**
- Modify: `src/components/layout/Footer.tsx` (vérification uniquement)
- Modify: `.env.example` (déjà créé Task 14)

- [ ] **Step 1: Vérifier que `Footer.tsx` utilise déjà `NEXT_PUBLIC_BUILD_HASH`**

```bash
grep -n "BUILD_HASH" src/components/layout/Footer.tsx
```
Si présent : aucune modification. Si absent : ajouter le pattern :

```tsx
const buildHash = (process.env.NEXT_PUBLIC_BUILD_HASH ?? 'dev').slice(0, 7);
```

- [ ] **Step 2: Documenter dans README**

Ajouter section "Déploiement Vercel" :

```markdown
## Déploiement Vercel

1. Push sur `master` (ou ouvrir une PR pour preview deployment).
2. Sur Vercel dashboard, importer le repo `Gecko51/Portfolio`.
3. **Environment Variables** (Production) :
   - `NEXT_PUBLIC_SITE_URL` → `https://guillaumegay.fr`
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` → `guillaumegay.fr` (après création du site dans Plausible)
   - `NEXT_PUBLIC_BUILD_HASH` → `$VERCEL_GIT_COMMIT_SHA` (référence Vercel auto, override possible)
4. **Build Command** : `pnpm build` (auto-détecté).
5. **DNS Cloudflare** : pointer `guillaumegay.fr` → Vercel (CNAME ou A records).
6. Vérifier post-deploy : Lighthouse ≥ 95 sur Mobile + Desktop, OG preview LinkedIn/Slack/X.
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add Vercel deployment instructions"
```

---

## Task 18 — QA cross-browser + Lighthouse audit

**Files:**
- Create: `docs/superpowers/reports/2026-05-14-phase-5-report.md` (résultats audit)

- [ ] **Step 1: Build production local**

```bash
pnpm build && pnpm start
```

- [ ] **Step 2: Audit Lighthouse**

Sur Chrome DevTools → Lighthouse → run sur :
- http://localhost:3000/fr (Desktop + Mobile)
- http://localhost:3000/en
- http://localhost:3000/fr/projects/[un slug existant]

Cibles (DEV-RULES §11) : Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

Si Perf < 90 : noter les diagnostics (LCP, CLS, TBT, unused JS). Optimisations probables :
- Lazy load `<HeroShader />` confirmé via `next/dynamic({ ssr: false })`.
- `priority={true}` sur l'image LCP (portrait About) si pas déjà.
- Vérifier que les MDX projets ne chargent pas la home en preload.

- [ ] **Step 3: QA navigation manuelle**

Checklist :
- [ ] `/` → 307 redirect `/fr`
- [ ] `/fr` → Hero + About + Experience + Projects + Contact tous visibles
- [ ] `/en` → idem en anglais
- [ ] Nav scroll vers `#about`, `#experience`, `#projects`, `#contact` smooth
- [ ] `/fr/projects/[slug]` → 4 projets accessibles, retour FLIP fonctionnel
- [ ] CV button → téléchargement Guillaume-Gay-CV-FR.pdf
- [ ] Locale switcher : FR↔EN sans flash, page state préservé
- [ ] `prefers-reduced-motion` (DevTools → Rendering → Emulate) : shader → gradient, magnetic off
- [ ] Mobile 375px (iPhone SE émulé) : pas de scroll horizontal accidentel, layout lisible
- [ ] Validateur HTML : aucune erreur (https://validator.w3.org)
- [ ] Validateur JSON-LD : Schema OK (https://search.google.com/test/rich-results)

- [ ] **Step 4: QA cross-browser**

Tester sur Chrome (déjà), Firefox, Safari (via macOS si dispo, sinon BrowserStack). Vérifier :
- Hero shader rendu correct
- Smooth scroll Lenis fluide
- Magnetic effect sur contact (Firefox a quelques quirks GSAP)

- [ ] **Step 5: Rédiger le rapport**

Créer `docs/superpowers/reports/2026-05-14-phase-5-report.md` avec :
- Scores Lighthouse (4 routes × Desktop/Mobile)
- Bugs trouvés et fixés inline
- Bugs deferred (TODO post-MVP)
- Captures d'écran clés (optionnel)

- [ ] **Step 6: Commit (uniquement le rapport)**

```bash
git add docs/superpowers/reports/2026-05-14-phase-5-report.md
git commit -m "docs(phase-5): add Lighthouse audit and QA report"
```

---

## Task 19 — Clôture phase, build final, tag

**Files:** aucun fichier modifié dans cette task — séquence de commandes.

- [ ] **Step 1: Workflow de fin de phase (DEV-RULES §8)**

```bash
pnpm build
```
Expected : SUCCESS, pas de warning critique.

```bash
pnpm lint
```
Expected : 0 erreur, 0 warning bloquant.

```bash
pnpm tsc --noEmit
```
Expected : 0 erreur.

- [ ] **Step 2: Vérifier git status clean**

```bash
git status
```
Expected : `nothing to commit, working tree clean`. Sinon, commit / stash.

- [ ] **Step 3: Commit release**

```bash
git commit --allow-empty -m "chore(release): close phase 5 (Contact + SEO + Analytics + Deploy)"
```

- [ ] **Step 4: Tag v1.0-mvp**

```bash
git tag -a v1.0-mvp -m "Phase 5 complete — Contact + SEO + Analytics + Deploy. Portfolio v1.0 MVP shipped."
```

- [ ] **Step 5: Push commits + tag**

```bash
git push origin master
git push origin v1.0-mvp
```

- [ ] **Step 6: Vérifier le tag sur GitHub**

```bash
gh release list 2>/dev/null || git ls-remote --tags origin | grep v1.0-mvp
```
Expected : tag visible côté remote.

- [ ] **Step 7: Annoncer le déploiement Vercel comme étape externe**

Pas de commande automatisée ici. Le user doit :
1. Connecter le repo à Vercel (déjà fait ou via dashboard).
2. Configurer les env vars (cf. Task 17 README).
3. Pointer le DNS Cloudflare → Vercel.
4. Créer le site dans Plausible.io et configurer `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

Plan terminé → le worker doit rendre la main au user avec un récap des actions externes restantes.

---

## Self-Review

**1. Spec coverage** (PRD §10 Phase 5) :
- ✅ Section Contact magnetic links + CTAs → Tasks 1-6
- ✅ SEO complet metadata, OG dynamique, sitemap, robots → Tasks 7-13
- ✅ JSON-LD Person → Task 9
- ✅ Analytics Plausible → Tasks 14-15
- ✅ QA cross-browser + Lighthouse ≥ 95 → Task 18
- ✅ Deploy Vercel + DNS Cloudflare → Task 17 (doc) + Task 19 (handoff)
- ✅ Release tag v1.0-mvp → Task 19

**2. Placeholder scan** : aucun "TBD", "TODO" non-localisé, "fill in", ou code-block manquant. Toutes les commandes ont l'expected output.

**3. Type consistency** :
- `Locale` importé depuis `@/i18n/routing` (Tasks 7, 8, 10) — cohérent.
- `buildAlternates`, `buildOgUrl`, `SITE_URL` exportés Task 7, consommés Tasks 8, 10, 11, 12, 13.
- `track()` exporté Task 3, consommé Tasks 4 (via ContactCTA), 15.
- `CONTACT_LINKS` exporté Task 2, consommé Task 5.

**4. Pré-requis Context7** explicitement listés sur les tasks qui touchent une API Next 16 / @vercel/og / next-intl / Plausible : Tasks 7, 8, 10, 11, 12, 14, 16.

Plan validé.
