# Phase 2 — Hero & About — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer la première impression visuelle du portfolio — Hero cinématique (typo display + shader R3F ember + scroll indicator) + curseur custom desktop + section About narrative (reveal scroll + stack marquee + photo portrait), jusqu'au tag `v0.2-hero-about`.

**Architecture:** Hero composé d'un wrapper RSC qui rend trois sous-composants client : `HeroText` (split chars + GSAP reveal), `HeroShader` (R3F canvas lazy-loaded avec fallback CSS gradient si `prefers-reduced-motion` ou WebGL fail), `ScrollIndicator`. Curseur custom monté via `CursorProvider` dans le layout, désactivé sur mobile/coarse pointer. About en wrapper RSC + `AboutText` client (GSAP ScrollTrigger reveal mot par mot) + `StackMarquee` (CSS animation infinite, pas de JS) + `Portrait` server avec `next/image`.

**Tech Stack:** Next.js 16.2.6 · React 19 · Tailwind v4 · GSAP 3 + ScrollTrigger + (split-type pour le split text, open source plutôt que SplitText payant) · @react-three/fiber 9 + three 0.180+ + @react-three/drei · Framer Motion 12 (déjà installé).

**Specs source :** `PRD.md` §3 Module 2 (Hero) + Module 3 (About), `DEV-RULES.md` (notamment §1 Conventions Framer/GSAP, §10 prefers-reduced-motion, §1 R3F isolation), `STRUCTURE.md` (colocation `sections/Hero/`, `sections/About/`, `providers/CursorProvider`, `ui/Cursor`).

**Convention DEV-RULES rappelée :** Context7 obligatoire avant d'écrire du code utilisant R3F 9 / three.js / drei / GSAP SplitText alternatives. Commentaires en français.

---

## Décisions par défaut (à valider en review user après livraison)

1. **SplitText :** utilisation de `split-type` (open source, ~2 kB) plutôt que `gsap/SplitText` pour éviter toute incertitude de licence Club GSAP. API similaire (`new SplitType(target, { types: 'chars' })`), résultat équivalent.
2. **Shaders :** définis en strings TypeScript inline dans `src/components/shaders/ember.ts` (pas de loader GLSL externe, évite la complication Turbopack). Le commentaire `/* glsl */` permet le syntax highlighting dans VS Code via l'extension "WebGL GLSL Editor".
3. **Photo portrait :** placeholder local `/public/images/portrait-placeholder.svg` (rectangle gris avec initiales GG) — à remplacer par la vraie photo en Phase 5.
4. **Stack marquee :** 3 catégories du CV (AI/Claude, Web, Automation) — animation CSS `@keyframes` infinite (perf + simplicité), pas de JS.
5. **Curseur custom :** RAF + spring lerp manuelle (~0.15) pour le follower, pas de Framer/GSAP. Désactivé si `(pointer: coarse)` ou `prefers-reduced-motion`.
6. **Concept shader :** quad full-screen, fragment avec fbm 2D noise + dégradé ember vertical (sombre bas → accent haut) + vignettage doux. `uTime` animé via `useFrame` R3F (~0.05 multiplier pour rester subtle).

---

## File Structure

**Hooks utilitaires (`src/hooks/`)**
- `useReducedMotion.ts` — hook React qui retourne `boolean` reflétant `prefers-reduced-motion: reduce`.
- `useMediaQuery.ts` — hook générique pour matcher une media query (utilisé pour `(pointer: fine)` desktop detection).

**Providers (`src/components/providers/`)**
- `CursorProvider.tsx` — monte le `<Cursor />` côté client si desktop + reduced-motion off ; gère les event listeners hover sur `[data-cursor-magnetic]`.

**UI (`src/components/ui/`)**
- `Cursor.tsx` — DOM du curseur (deux divs : dot 8px + ring 32px) ; RAF interne pour suivre le mouseY/X avec lerp.

**Sections Hero (`src/components/sections/Hero/`)**
- `Hero.tsx` — server wrapper, traduit les textes via `getTranslations`, rend `HeroBackground` + `HeroText` + `ScrollIndicator`.
- `HeroBackground.tsx` — client wrapper, choisit entre `HeroShader` (R3F) et `HeroFallback` (CSS gradient) selon WebGL support + reduced-motion.
- `HeroShader.tsx` — client, R3F `<Canvas>` lazy-loaded via `next/dynamic` (`ssr: false`), monte `<EmberMesh />`.
- `EmberMesh.tsx` — composant `<mesh>` R3F avec `<planeGeometry>` full-screen + `<shaderMaterial>` qui consomme `emberVert` + `emberFrag` ; `useFrame` met à jour `uTime`.
- `HeroFallback.tsx` — div absolute avec radial-gradient CSS imitant grossièrement l'ember.
- `HeroText.tsx` — client, split-type sur le nom + tagline, reveal char-by-char via GSAP timeline au mount.
- `ScrollIndicator.tsx` — client, petit chevron + label "scroll" avec animation pulse Framer Motion ; disparait après le premier scroll user.

**Shaders (`src/components/shaders/`)**
- `ember.ts` — exports `emberVert` (string) et `emberFrag` (string).

**Sections About (`src/components/sections/About/`)**
- `About.tsx` — server wrapper, layout grid 2 colonnes desktop, traduit les textes.
- `AboutText.tsx` — client, GSAP ScrollTrigger qui révèle mot par mot quand 30% viewport atteint.
- `StackMarquee.tsx` — client (ou même server CSS-only), 3 lignes scrolling avec catégories AI/Web/Automation.
- `Portrait.tsx` — server, `<Image>` next/image avec placeholder local.

**Pages / Layouts (modifs)**
- `src/app/[locale]/page.tsx` — remplace les deux placeholders Hero + About par les vrais composants.
- `src/app/[locale]/layout.tsx` — ajoute `<CursorProvider />` à l'intérieur du `LenisProvider`.

**i18n**
- `src/messages/fr.json` + `en.json` — ajouter les clés `Hero.name`, `Hero.tagline`, `Hero.scrollHint`, `About.paragraph1..3`, `Stack.aiClaude`, `Stack.web`, `Stack.automation`, etc.

**Public**
- `public/images/portrait-placeholder.svg` — placeholder visuel.

**Config**
- `next.config.ts` — ajouter `images.remotePatterns` si nécessaire (probablement pas pour un SVG local).

---

## Note méthodologique sur les tests

DEV-RULES §1 dit "Pas de tests E2E au MVP". Aucun framework de test n'est installé. Pour Phase 2 : pas de TDD. Validation = `pnpm build` + `pnpm typecheck` + `pnpm lint` + QA navigateur (smoke tests curl + spot check de classes/animations).

Les hooks (`useReducedMotion`, `useMediaQuery`) sont assez simples pour être validés visuellement (toggle DevTools → reload → effet visible).

---

## Task 1 : Installer R3F + Three.js + drei + split-type

**Files:**
- Modify: `package.json`

- [ ] **Step 1 : Installer les packages WebGL et split-type**

```bash
pnpm add @react-three/fiber@^9 three@^0.180 @react-three/drei@^10 split-type@^0.3
pnpm add -D @types/three
```

> Note : la liste de versions ci-dessus correspond à l'état attendu au moment du plan. Si Context7 indique des versions plus récentes compatibles avec React 19 / Next 16, suivre Context7. Vérifier que `@react-three/fiber` est bien compatible React 19 (R3F v9+ requis).

- [ ] **Step 2 : Vérifier que rien ne casse**

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Tous doivent passer (les nouveaux packages ne sont pas encore importés).

- [ ] **Step 3 : Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat(deps): add @react-three/fiber, three, drei, split-type"
```

---

## Task 2 : Hook useReducedMotion

**Files:**
- Create: `src/hooks/useReducedMotion.ts`

DEV-RULES §10 : prefers-reduced-motion respecté partout. Ce hook centralise la détection.

- [ ] **Step 1 : Créer `src/hooks/useReducedMotion.ts`**

```typescript
'use client';

// Hook qui retourne true si l'utilisateur a activé prefers-reduced-motion.
// Réactif aux changements de préférence (matchMedia change listener).
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  // Démarre à false côté SSR pour éviter un hydration mismatch.
  // La valeur réelle est lue côté client au premier effect.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    // Compat : addEventListener est le standard moderne ; addListener restait pour Safari < 14.
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Tous PASS. Le hook n'est pas encore consommé (utilisations dans Tasks 4, 5, 8).

- [ ] **Step 3 : Commit**

```bash
git add src/hooks/useReducedMotion.ts
git commit -m "feat(hooks): add useReducedMotion hook"
```

---

## Task 3 : Hook useMediaQuery

**Files:**
- Create: `src/hooks/useMediaQuery.ts`

Hook générique. Utilisé Phase 2 pour détecter `(pointer: fine)` (desktop avec souris, exclut tactile).

- [ ] **Step 1 : Créer `src/hooks/useMediaQuery.ts`**

```typescript
'use client';

// Hook qui matche une media query CSS et reste réactif.
// Exemples : useMediaQuery('(pointer: fine)') → true sur desktop avec souris.
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  // false par défaut côté SSR.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/hooks/useMediaQuery.ts
git commit -m "feat(hooks): add useMediaQuery hook"
```

---

## Task 4 : Composant Cursor (DOM + RAF lerp)

**Files:**
- Create: `src/components/ui/Cursor.tsx`

Le curseur custom = deux divs (dot + outline ring). Le dot suit le pointeur instantanément, le ring suit avec lerp. PRD §8 : dot 12px + outline magnetic.

- [ ] **Step 1 : Créer `src/components/ui/Cursor.tsx`**

```tsx
'use client';

// Cursor — curseur custom desktop.
// Deux éléments superposés : dot (suit instantanément) et ring (suit avec lerp + magnetic).
// Le composant écoute mousemove en RAF pour éviter le re-render React à chaque pixel.
import { useEffect, useRef } from 'react';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Position cible (sourie réelle) et position courante du ring (lerpée).
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let magnetTarget: DOMRect | null = null;
    let raf = 0;

    const onMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      // Si un élément magnetic est sous le curseur, capturer son rect pour attirer le ring.
      const el = (event.target as Element).closest('[data-cursor-magnetic]');
      magnetTarget = el ? el.getBoundingClientRect() : null;
    };

    const tick = () => {
      // Magnetic : si l'utilisateur survole un élément taggué, le ring se centre vers le rect.
      let ringX = target.x;
      let ringY = target.y;
      if (magnetTarget) {
        ringX = magnetTarget.left + magnetTarget.width / 2;
        ringY = magnetTarget.top + magnetTarget.height / 2;
      }

      // Lerp 0.15 — assez snappy pour rester réactif sans saccade.
      ring.x += (ringX - ring.x) * 0.15;
      ring.y += (ringY - ring.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x - 6}px, ${target.y - 6}px, 0)`;
      }
      if (ringRef.current) {
        const scale = magnetTarget ? 1.4 : 1;
        ringRef.current.style.transform = `translate3d(${ring.x - 18}px, ${ring.y - 18}px, 0) scale(${scale})`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Le curseur custom est purement décoratif → aria-hidden + pointer-events:none. */}
      {/* On masque le curseur système via CSS global appliqué par CursorProvider. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100] h-3 w-3 rounded-full bg-fg mix-blend-difference"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100] h-9 w-9 rounded-full border border-fg/40 mix-blend-difference transition-transform duration-200"
      />
    </>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

> Note : Tailwind v4 peut traiter `z-[100]` et `h-9` correctement. Si l'arbitrary value `z-[100]` n'est pas autorisé en JIT v4, remplacer par `z-50` (déjà supérieur au header).

- [ ] **Step 3 : Commit**

```bash
git add src/components/ui/Cursor.tsx
git commit -m "feat(ui): add custom Cursor component with RAF lerp and magnetic"
```

---

## Task 5 : CursorProvider + mount conditionnel

**Files:**
- Create: `src/components/providers/CursorProvider.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1 : Créer `src/components/providers/CursorProvider.tsx`**

```tsx
'use client';

// CursorProvider — monte le curseur custom uniquement sur desktop avec souris,
// si l'utilisateur n'a pas activé prefers-reduced-motion.
// Masque le curseur système via une classe CSS globale appliquée au document.
import { useEffect, type ReactNode } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import { Cursor } from '@/components/ui/Cursor';

type CursorProviderProps = {
  children: ReactNode;
};

export function CursorProvider({ children }: CursorProviderProps) {
  // Active uniquement si pointer fine (souris) ET pas de prefers-reduced-motion.
  const isFinePointer = useMediaQuery('(pointer: fine)');
  const prefersReducedMotion = useReducedMotion();
  const enabled = isFinePointer && !prefersReducedMotion;

  useEffect(() => {
    // Masque le curseur système quand le custom est actif.
    document.documentElement.style.cursor = enabled ? 'none' : '';
    return () => {
      document.documentElement.style.cursor = '';
    };
  }, [enabled]);

  return (
    <>
      {children}
      {enabled && <Cursor />}
    </>
  );
}
```

- [ ] **Step 2 : Modifier `src/app/[locale]/layout.tsx`**

Ajouter l'import et insérer `<CursorProvider>` à l'intérieur du `LenisProvider` (autour des sections, pas autour du Header pour que celui-ci ait toujours le curseur système au moins partiel — en pratique le curseur custom est global mais le Header reste interactif).

```tsx
// Imports — ajouter :
import { CursorProvider } from '@/components/providers/CursorProvider';

// Structure du body :
<body>
  <NextIntlClientProvider>
    <GsapProvider>
      <LenisProvider>
        <CursorProvider>
          <Header actions={<><CVButton /><LocaleSwitcher /></>} />
          <main id="main">{children}</main>
          <Footer />
        </CursorProvider>
      </LenisProvider>
    </GsapProvider>
  </NextIntlClientProvider>
</body>
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Plus smoke test : `pnpm dev` en background, `curl http://localhost:3000/fr` → 200, kill server.

- [ ] **Step 4 : Commit**

```bash
git add src/components/providers/CursorProvider.tsx src/app/[locale]/layout.tsx
git commit -m "feat(providers): add CursorProvider with desktop + reduced-motion guard"
```

---

## Task 6 : Étendre les messages i18n (Hero + About + Stack)

**Files:**
- Modify: `src/messages/fr.json`
- Modify: `src/messages/en.json`

Phase 1 avait juste Nav/Footer/Home. On enrichit avec les vraies clés Hero, About, Stack.

- [ ] **Step 1 : Étendre `src/messages/fr.json`**

Ajouter les sections `Hero`, `About`, `Stack` au JSON. Le bloc `Home` voit ses placeholders Hero et About supprimés (les sections rendent leur propre contenu maintenant), mais on garde experience/projects/contact pour Phases 3-5. Contenu final :

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
    "placeholderExperience": "Experience — à venir Phase 3",
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
    "placeholderExperience": "Experience — coming Phase 3",
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
  }
}
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Le type `IntlMessages` est dérivé de `fr.json` (cf. `src/types/i18n.ts`) — devrait suivre automatiquement.

- [ ] **Step 4 : Commit**

```bash
git add src/messages/
git commit -m "feat(i18n): extend messages with Hero, About, Stack keys"
```

---

## Task 7 : Shaders ember (vert + frag inline)

**Files:**
- Create: `src/components/shaders/ember.ts`

- [ ] **Step 1 : Créer `src/components/shaders/ember.ts`**

```typescript
// Shaders du fond Hero — quad full-screen, fbm noise 2D + dégradé ember vertical + vignettage.
// Inline strings : évite la configuration loader GLSL et reste portable Turbopack/Webpack.
// Le commentaire /* glsl */ active le syntax highlighting de l'extension VS Code "WebGL GLSL Editor".

export const emberVert = /* glsl */ `
  // Vertex shader minimal — passe l'UV au fragment.
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const emberFrag = /* glsl */ `
  // Fragment shader — fbm noise animé, gradient ember (#0A0A0A → #FF5B1F * 0.6), vignettage.
  precision highp float;

  uniform float uTime;
  varying vec2 vUv;

  // Hash 2D — pseudo-random à partir d'un vec2.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Noise 2D bilineaire interpolé.
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // FBM 5 octaves — turbulence douce.
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      sum += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return sum;
  }

  void main() {
    vec2 uv = vUv;

    // Noise animé — drift vertical lent pour éviter l'effet "screen-saver".
    float n = fbm(uv * 3.0 + vec2(0.0, uTime * 0.05));

    // Couleurs tokens projet : bg #0A0A0A et accent #FF5B1F.
    vec3 bgColor = vec3(0.039, 0.039, 0.039);
    vec3 emberColor = vec3(1.0, 0.357, 0.122);

    // Gradient vertical : sombre en bas, légèrement ember en haut.
    float gradient = pow(uv.y, 1.8);
    vec3 color = mix(bgColor, emberColor * 0.6, gradient * 0.5);

    // Modulation noise dans la moitié haute, atténuée par le gradient.
    color += emberColor * n * gradient * 0.3;

    // Vignettage doux — assombrit les coins, met le focus au centre/haut.
    float vignette = 1.0 - length(uv - 0.5) * 0.8;
    color *= clamp(vignette, 0.3, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/shaders/ember.ts
git commit -m "feat(shaders): add ember fbm fragment shader (inline strings)"
```

---

## Task 8 : EmberMesh (mesh R3F + shaderMaterial)

**Files:**
- Create: `src/components/sections/Hero/EmberMesh.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Hero/EmberMesh.tsx`**

```tsx
'use client';

// EmberMesh — composant R3F qui rend le quad full-screen + shaderMaterial avec uTime animé.
// Utilisé à l'intérieur de <Canvas> dans HeroShader.tsx.
// Cf. PRD §3 Module 2 (Hero shader) et DEV-RULES §1 (R3F isolation).
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { ShaderMaterial } from 'three';

import { emberFrag, emberVert } from '@/components/shaders/ember';

export function EmberMesh() {
  const materialRef = useRef<ShaderMaterial>(null);

  // Uniforms — uTime sera muté in-place par useFrame, useMemo évite la recréation à chaque render.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  // Met à jour uTime à chaque frame R3F.
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh>
      {/* Quad qui couvre tout le viewport — orthographic camera fournie par <Canvas orthographic>. */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={emberVert}
        fragmentShader={emberFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint
```

> Notes sur types R3F :
> - `<mesh>`, `<planeGeometry>`, `<shaderMaterial>` sont des éléments JSX étendus par R3F. TypeScript peut nécessiter `import type {} from '@react-three/fiber'` au top du fichier pour activer les types JSX. Si tsc se plaint, ajouter cet import.
> - `ShaderMaterial` est importé de `three`.

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Hero/EmberMesh.tsx
git commit -m "feat(hero): add EmberMesh R3F component with animated shader"
```

---

## Task 9 : HeroShader (Canvas wrapper) et HeroFallback (gradient CSS)

**Files:**
- Create: `src/components/sections/Hero/HeroShader.tsx`
- Create: `src/components/sections/Hero/HeroFallback.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Hero/HeroFallback.tsx`**

```tsx
// HeroFallback — gradient CSS statique imitant l'ember.
// Server component pur, rendu :
//   - quand prefers-reduced-motion est actif (DEV-RULES §10)
//   - en SSR initial avant que HeroShader (lazy + ssr:false) ne se monte
//   - si WebGL échoue (très rare, mais le composant reste valide)
export function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255, 91, 31, 0.35), transparent 70%), linear-gradient(to top, #0a0a0a 0%, #141414 100%)',
      }}
    />
  );
}
```

- [ ] **Step 2 : Créer `src/components/sections/Hero/HeroShader.tsx`**

```tsx
'use client';

// HeroShader — wrapper R3F Canvas, full-screen absolu derrière le contenu Hero.
// Lazy-loaded via next/dynamic depuis HeroBackground (ssr: false) pour éviter le poids R3F au SSR.
import { Canvas } from '@react-three/fiber';

import { EmberMesh } from './EmberMesh';

export function HeroShader() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {/* Camera orthographic : le quad [-1,1]x[-1,1] couvre exactement le viewport. */}
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: false }}
      >
        <EmberMesh />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/sections/Hero/HeroShader.tsx src/components/sections/Hero/HeroFallback.tsx
git commit -m "feat(hero): add HeroShader R3F canvas and HeroFallback gradient"
```

---

## Task 10 : HeroBackground (router shader vs fallback)

**Files:**
- Create: `src/components/sections/Hero/HeroBackground.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Hero/HeroBackground.tsx`**

```tsx
'use client';

// HeroBackground — choisit entre HeroShader (R3F) et HeroFallback (CSS) selon prefers-reduced-motion.
// Le shader est lazy-loaded via next/dynamic pour ne pas peser au SSR ni sur les navigateurs sans WebGL.
import dynamic from 'next/dynamic';

import { useReducedMotion } from '@/hooks/useReducedMotion';

import { HeroFallback } from './HeroFallback';

// Lazy load du shader R3F — ssr:false car WebGL = browser only.
// loading: fallback rendu pendant le téléchargement du chunk shader.
const HeroShader = dynamic(
  () => import('./HeroShader').then((mod) => ({ default: mod.HeroShader })),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  },
);

export function HeroBackground() {
  const reducedMotion = useReducedMotion();

  // Si l'user demande reduced-motion → on sert le gradient statique.
  // Sinon → on charge le shader (avec HeroFallback pendant le chunk download).
  if (reducedMotion) {
    return <HeroFallback />;
  }

  return <HeroShader />;
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Hero/HeroBackground.tsx
git commit -m "feat(hero): add HeroBackground router (shader vs fallback)"
```

---

## Task 11 : HeroText avec split-type + GSAP reveal

**Files:**
- Create: `src/components/sections/Hero/HeroText.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Hero/HeroText.tsx`**

```tsx
'use client';

// HeroText — nom XL en typo display + tagline, reveal char-by-char au mount via GSAP + split-type.
// Si prefers-reduced-motion : pas d'animation, le texte est visible direct.
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import SplitType from 'split-type';

import { useReducedMotion } from '@/hooks/useReducedMotion';

type HeroTextProps = {
  name: string;
  tagline: string;
};

export function HeroText({ name, tagline }: HeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      // useGSAP : cleanup automatique des animations à l'unmount.
      // En reduced-motion : on s'arrête tôt, le texte reste visible sans split.
      if (reducedMotion) return;

      const nameEl = containerRef.current?.querySelector('[data-split="name"]');
      const taglineEl = containerRef.current?.querySelector('[data-split="tagline"]');
      if (!nameEl || !taglineEl) return;

      // Split en chars pour le nom, en mots pour la tagline.
      const nameSplit = new SplitType(nameEl as HTMLElement, { types: 'chars' });
      const taglineSplit = new SplitType(taglineEl as HTMLElement, { types: 'words' });

      // Animation timeline : nom puis tagline, easing custom.
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(nameSplit.chars, {
        y: '100%',
        opacity: 0,
        duration: 1,
        stagger: 0.02,
      });
      tl.from(
        taglineSplit.words,
        {
          y: '50%',
          opacity: 0,
          duration: 0.8,
          stagger: 0.04,
        },
        '-=0.5',
      );

      // Cleanup explicite des splits — useGSAP gère le tween, pas le DOM split.
      return () => {
        nameSplit.revert();
        taglineSplit.revert();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center gap-6 text-center">
      <h1
        data-split="name"
        className="font-display text-[clamp(3.5rem,12vw,12rem)] leading-[0.9] tracking-tight italic"
      >
        {name}
      </h1>
      <p data-split="tagline" className="font-mono text-sm md:text-base uppercase tracking-[0.2em] text-fg-muted">
        {tagline}
      </p>
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
git add src/components/sections/Hero/HeroText.tsx
git commit -m "feat(hero): add HeroText with split-type and GSAP reveal"
```

---

## Task 12 : ScrollIndicator

**Files:**
- Create: `src/components/sections/Hero/ScrollIndicator.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Hero/ScrollIndicator.tsx`**

```tsx
'use client';

// ScrollIndicator — petit chevron animé en bas du Hero. Disparaît après le premier scroll user.
// PRD §3 Module 2.
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

type ScrollIndicatorProps = {
  label: string;
};

export function ScrollIndicator({ label }: ScrollIndicatorProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);

  // Disparaît après 80px de scroll — premier coup de molette / swipe.
  useMotionValueEvent(scrollY, 'change', (current) => {
    setVisible(current < 80);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-muted"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{label}</span>
          {/* Chevron pulse — Tailwind animate-bounce trop bouncy, on fait du custom keyframes. */}
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-3 w-px bg-fg-muted"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/sections/Hero/ScrollIndicator.tsx
git commit -m "feat(hero): add ScrollIndicator with fade-out on first scroll"
```

---

## Task 13 : Hero composé + wire dans page.tsx

**Files:**
- Create: `src/components/sections/Hero/Hero.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1 : Créer `src/components/sections/Hero/Hero.tsx`**

```tsx
// Hero — wrapper RSC : traduit les textes côté serveur, compose les sous-composants client.
// Plein écran, position relative pour que le background absolute -z-10 reste contenu.
import { getTranslations } from 'next-intl/server';

import { HeroBackground } from './HeroBackground';
import { HeroText } from './HeroText';
import { ScrollIndicator } from './ScrollIndicator';

export async function Hero() {
  const t = await getTranslations('Hero');

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      <HeroBackground />
      <HeroText name={t('name')} tagline={t('tagline')} />
      <ScrollIndicator label={t('scrollHint')} />
    </section>
  );
}
```

- [ ] **Step 2 : Modifier `src/app/[locale]/page.tsx`**

Remplacer la section placeholder Hero par `<Hero />`. Conserver les autres placeholders. About arrive en Task 17.

```tsx
// Home — Hero (Phase 2) + About (Phase 2 plus loin) + placeholders Phases 3-5.
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/Hero/Hero';

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <>
      <Hero />
      <section id="about" className="min-h-screen flex items-center justify-center">
        <p className="text-fg-muted">About — à venir Task 17</p>
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

- [ ] **Step 3 : Verify + smoke test**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Smoke test :
```bash
# pnpm dev en background, attendre Ready in
# curl http://localhost:3000/fr | grep -i "guillaume gay\|ai builder"
# Devrait matcher (texte du Hero présent dans le HTML)
```

> Note : le shader R3F étant `ssr: false`, le HTML SSR contient HeroFallback. Le shader se monte côté client après hydration.

- [ ] **Step 4 : Commit**

```bash
git add src/components/sections/Hero/Hero.tsx src/app/[locale]/page.tsx
git commit -m "feat(hero): compose Hero section and wire into home page"
```

---

## Task 14 : Portrait + placeholder SVG

**Files:**
- Create: `public/images/portrait-placeholder.svg`
- Create: `src/components/sections/About/Portrait.tsx`

- [ ] **Step 1 : Créer `public/images/portrait-placeholder.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1f1f1f"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#grad)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-style="italic" font-size="80" fill="#8a8a8a"
        opacity="0.4">GG</text>
  <text x="50%" y="62%" text-anchor="middle" dominant-baseline="middle"
        font-family="monospace" font-size="11" fill="#8a8a8a"
        opacity="0.6" letter-spacing="3">PORTRAIT — A VENIR</text>
</svg>
```

- [ ] **Step 2 : Créer `src/components/sections/About/Portrait.tsx`**

```tsx
// Portrait — photo de Guillaume Gay. Placeholder SVG pour Phase 2, vraie photo en Phase 5.
// Server component : next/image avec dimensions explicites pour CLS=0.
import Image from 'next/image';

type PortraitProps = {
  alt: string;
};

export function Portrait({ alt }: PortraitProps) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded">
      <Image
        src="/images/portrait-placeholder.svg"
        alt={alt}
        fill
        className="object-cover"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={false}
      />
    </div>
  );
}
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

> Note : `next/image` avec un SVG local nécessite `dangerouslyAllowSVG: true` dans `next.config.ts > images` SI on charge depuis un domaine externe, mais pour `/public/*` c'est servi en static direct → pas de config nécessaire.

> Cependant : Next.js Image avec SVG local + `fill` peut nécessiter `unoptimized: true` car Next refuse d'optimiser les SVG par défaut. Si build/dev warns ou échoue, ajouter `unoptimized` à l'`<Image>` ou utiliser un `<img>` natif HTML pour le placeholder (à remplacer par next/image quand la vraie photo JPEG sera là).

- [ ] **Step 4 : Commit**

```bash
git add public/images/portrait-placeholder.svg src/components/sections/About/Portrait.tsx
git commit -m "feat(about): add portrait placeholder SVG and Portrait component"
```

---

## Task 15 : AboutText avec GSAP scroll reveal

**Files:**
- Create: `src/components/sections/About/AboutText.tsx`

- [ ] **Step 1 : Créer `src/components/sections/About/AboutText.tsx`**

```tsx
'use client';

// AboutText — 3 paragraphes éditoriaux + kicker, reveal mot par mot au scroll.
// GSAP ScrollTrigger : déclenché quand 30% du viewport atteint, scrub off (animation simple, one-shot).
// PRD §3 Module 3.
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import SplitType from 'split-type';

import { useReducedMotion } from '@/hooks/useReducedMotion';

type AboutTextProps = {
  kicker: string;
  paragraphs: readonly string[];
};

export function AboutText({ kicker, paragraphs }: AboutTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      if (!containerRef.current) return;

      // Split chaque paragraphe en mots.
      const paragraphEls = containerRef.current.querySelectorAll('[data-split="paragraph"]');
      const splits: SplitType[] = [];

      paragraphEls.forEach((el) => {
        const split = new SplitType(el as HTMLElement, { types: 'words' });
        splits.push(split);

        gsap.from(split.words, {
          opacity: 0.15,
          y: 8,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.015,
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });
      });

      return () => {
        splits.forEach((s) => s.revert());
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{kicker}</p>
      {paragraphs.map((paragraph, idx) => (
        <p
          // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are stable static content
          key={idx}
          data-split="paragraph"
          className="font-display text-2xl md:text-3xl leading-[1.4] tracking-tight"
        >
          {paragraph}
        </p>
      ))}
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
git add src/components/sections/About/AboutText.tsx
git commit -m "feat(about): add AboutText with scroll-triggered word reveal"
```

---

## Task 16 : StackMarquee (CSS infinite)

**Files:**
- Create: `src/components/sections/About/StackMarquee.tsx`
- Modify: `src/app/globals.css` (ajouter keyframes marquee)

- [ ] **Step 1 : Ajouter les keyframes marquee dans `src/app/globals.css`**

Append à la fin du fichier (après les rules existantes) :

```css

/* Animation marquee — défilement horizontal infini pour StackMarquee. */
/* Utilise transform translateX pour rester GPU-accelerated, pas de jank scroll. */
@keyframes marquee-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee-left 30s linear infinite;
  will-change: transform;
}

/* Respect prefers-reduced-motion : freeze l'animation. */
@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
```

- [ ] **Step 2 : Créer `src/components/sections/About/StackMarquee.tsx`**

```tsx
// StackMarquee — 3 lignes (AI/Web/Automation) défilant horizontalement en boucle infinie.
// Server component : pas de JS d'animation, tout est en CSS @keyframes.
// Pattern : on duplique le contenu pour avoir une translation continue sans saut visible.
type StackMarqueeProps = {
  rows: ReadonlyArray<{
    label: string;
    items: string;
  }>;
};

export function StackMarquee({ rows }: StackMarqueeProps) {
  return (
    <div className="flex flex-col gap-3 border-y border-border py-6 overflow-hidden">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-6 text-fg-muted">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {row.label}
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee flex gap-6 whitespace-nowrap text-sm font-mono">
              {/* Le contenu est dupliqué pour que la translation -50% boucle sans saut. */}
              <span>{row.items}</span>
              <span aria-hidden="true">·</span>
              <span aria-hidden="true">{row.items}</span>
              <span aria-hidden="true">·</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3 : Verify**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/sections/About/StackMarquee.tsx src/app/globals.css
git commit -m "feat(about): add StackMarquee with CSS-only infinite animation"
```

---

## Task 17 : About composé + wire dans page.tsx

**Files:**
- Create: `src/components/sections/About/About.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1 : Créer `src/components/sections/About/About.tsx`**

```tsx
// About — wrapper RSC : grid 2 colonnes desktop (texte + portrait), marquee plein-largeur sous.
// Cf. PRD §3 Module 3.
import { getTranslations } from 'next-intl/server';

import { AboutText } from './AboutText';
import { Portrait } from './Portrait';
import { StackMarquee } from './StackMarquee';

export async function About() {
  const t = await getTranslations('About');
  const tStack = await getTranslations('Stack');

  const paragraphs = [t('paragraph1'), t('paragraph2'), t('paragraph3')] as const;

  const stackRows = [
    { label: tStack('categoryAI'), items: tStack('itemsAI') },
    { label: tStack('categoryWeb'), items: tStack('itemsWeb') },
    { label: tStack('categoryAutomation'), items: tStack('itemsAutomation') },
  ] as const;

  return (
    <section id="about" className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-6xl flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-start">
          <AboutText kicker={t('kicker')} paragraphs={paragraphs} />
          <Portrait alt={t('portraitAlt')} />
        </div>
        <StackMarquee rows={stackRows} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2 : Modifier `src/app/[locale]/page.tsx`** — remplacer le placeholder About par `<About />`.

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { About } from '@/components/sections/About/About';
import { Hero } from '@/components/sections/Hero/Hero';

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <>
      <Hero />
      <About />
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

- [ ] **Step 3 : Verify + smoke test**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Smoke test :
```bash
# pnpm dev background
# curl http://localhost:3000/fr | grep -E "Solopreneur tech|Gecko Mind|categoryAI"
# Devrait matcher
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/sections/About/About.tsx src/app/[locale]/page.tsx
git commit -m "feat(about): compose About section with Portrait, AboutText, StackMarquee"
```

---

## Task 18 : QA finale + tag v0.2-hero-about

**Files:**
- Create: `docs/superpowers/reports/2026-05-13-phase-2-hero-about.md`

DEV-RULES §8 : workflow de fin de phase.

- [ ] **Step 1 : Verify all checks**

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Tous PASS. Le build output doit montrer la taille du bundle de la home — viser < 250 kB first load (un peu plus que la Phase 1 cible 200 kB acceptable car R3F est ajouté ; sera optimisé en Phase 5 via code-split + tree-shaking).

- [ ] **Step 2 : Smoke test extensif via background dev server**

```bash
# pnpm dev en background, attendre Ready in
curl -I http://localhost:3000/fr   # 200
curl -I http://localhost:3000/en   # 200
curl http://localhost:3000/fr | grep -c "Guillaume Gay"             # >= 1 (Hero name)
curl http://localhost:3000/fr | grep -i "AI Builder"                # match (tagline)
curl http://localhost:3000/fr | grep -i "Solopreneur tech"          # match (About paragraph 1 FR)
curl http://localhost:3000/en | grep -i "Tech solopreneur"          # match (About paragraph 1 EN)
curl http://localhost:3000/fr | grep -i "Claude Code"               # match (Stack item AI)
curl http://localhost:3000/fr | grep -i "PORTRAIT — A VENIR"        # match (placeholder)
# Kill dev server
```

- [ ] **Step 3 : QA checklist navigateur** (à exécuter manuellement par l'utilisateur, à documenter dans le rapport) :
- [ ] Hero affiche le nom XL en serif italique + tagline en mono uppercase
- [ ] Au mount : nom + tagline ont une animation reveal char/word visible (sauf si DevTools `prefers-reduced-motion: reduce`)
- [ ] Fond Hero : shader R3F visible (subtle noise + ember haut), pas un gradient plat
- [ ] ScrollIndicator visible en bas du Hero, disparaît au premier scroll
- [ ] Curseur custom desktop : dot + ring suivent la souris ; ring magnetise sur les éléments `[data-cursor-magnetic]` (Phase 2 n'en a pas encore — vérifier que le ring suit en mode normal)
- [ ] About : reveal mot par mot quand on scroll dedans
- [ ] StackMarquee : 3 lignes défilent en continu
- [ ] Portrait placeholder visible à droite du texte (desktop) ou en dessous (mobile)
- [ ] FR ↔ EN switch fonctionne (LocaleSwitcher) — contenu traduit
- [ ] DevTools Rendering → Emulate prefers-reduced-motion → animations désactivées, gradient CSS Hero au lieu du shader
- [ ] DevTools Console : zéro erreur, max 1-2 warnings éventuels de drei/three (déprécations non bloquantes)
- [ ] Mobile (375px) : curseur custom OFF, marquee défile, layout responsive OK

- [ ] **Step 4 : Bundle size check**

Lire le résultat de `pnpm build` et noter la "First Load JS" pour la route `/fr` (ou `/[locale]`). Cibles :
- < 300 kB acceptable Phase 2 (R3F + three pèsent ~150-200 kB seuls)
- ≥ 400 kB → flagger comme dette technique pour Phase 5 optimisation

Vérifier que `HeroShader` est bien dans un chunk séparé (lazy via `next/dynamic`). Dans le build output, on devrait voir un chunk distinct chargé conditionnellement.

- [ ] **Step 5 : Créer le rapport de phase**

Écrire `docs/superpowers/reports/2026-05-13-phase-2-hero-about.md` avec ce template :

```markdown
## Rapport Phase 2 — Hero & About

### Implémenté
- Hooks utilitaires : useReducedMotion, useMediaQuery (réactifs aux changements via matchMedia.addEventListener)
- Curseur custom desktop : Cursor.tsx (RAF + lerp 0.15 + magnetic via [data-cursor-magnetic]), CursorProvider.tsx (gate pointer:fine + prefers-reduced-motion off)
- Hero : Hero.tsx server, HeroBackground client router shader/fallback, HeroShader R3F lazy via next/dynamic, EmberMesh R3F avec uTime animé useFrame, HeroFallback gradient CSS (radial+linear), HeroText avec split-type + GSAP timeline reveal, ScrollIndicator avec Framer Motion fade-out 80px
- Shaders ember : emberVert minimal + emberFrag (fbm 2D noise + gradient ember + vignette), inline strings TS
- About : About.tsx server, AboutText client (GSAP ScrollTrigger reveal mot par mot, start top 70%), StackMarquee CSS-only (@keyframes translateX, freeze en reduced-motion), Portrait avec next/image SVG placeholder
- i18n étendu : 11 nouvelles clés Hero/About/Stack en FR et EN

### Non implémenté (et pourquoi)
- Vraie photo portrait — placeholder SVG, à remplacer en Phase 5 quand photo dispo
- Migra display font — toujours Instrument Serif fallback (Phase 1 décision conservée)
- SplitText GSAP — remplacé par split-type (open source, ~2 kB) pour éviter incertitude licence Club
- Magnetic links concrets — l'API [data-cursor-magnetic] est en place mais aucun élément ne l'utilise encore (sera consommée par les CTAs Phase 5)

### Problèmes rencontrés (et résolutions)
- [À compléter pendant l'exécution]

### Recommandations Phase 3
- Bundle JS first load à surveiller (R3F + three pèsent lourd) — pourrait justifier preloading/prefetch stratégique
- Le pattern `useGSAP` + cleanup explicite des splits revert() à reproduire pour les futures animations
- Timeline Experience (Phase 3) utilisera ScrollTrigger pin — vérifier que Lenis sync reste smooth
- Si Lighthouse Performance < 90, profiler le shader (réduire dpr ou nombre d'octaves fbm)

### Vérifications

| Métrique | Résultat |
|----------|----------|
| `pnpm typecheck` | PASS / FAIL |
| `pnpm lint` | PASS / FAIL |
| `pnpm build` | PASS / FAIL |
| Bundle first load `/[locale]` | XX kB |
| HTTP /fr | 200 |
| HTTP /en | 200 |
| HTML contient "Guillaume Gay" | ✓ |
| HTML contient "AI Builder" | ✓ |
| HTML FR contient "Solopreneur tech" | ✓ |
| HTML EN contient "Tech solopreneur" | ✓ |
| HTML contient "Claude Code" (Stack) | ✓ |
| Total commits Phase 2 | X commits |

### Tag

`git tag v0.2-hero-about` créé sur le commit final.
```

- [ ] **Step 6 : Release commit + tag**

```bash
git add -A
git diff --cached --quiet || git commit -m "chore(release): close phase 2 — hero and about"
git tag v0.2-hero-about
git log --oneline -10
git tag --list
```

- [ ] **Step 7 : Commit du rapport (si pas déjà inclus)**

```bash
git add docs/superpowers/reports/
git status
git diff --cached --quiet || git commit -m "docs: add Phase 2 hero & about report"
```

---

## Self-Review

**Spec coverage (vs PRD §3 Module 2 + Module 3) :**
- ✅ Hero plein écran + typo display + WebGL fragment shader + reveal split text → Tasks 7-13
- ✅ Fallback gradient CSS si prefers-reduced-motion → Task 9 + 10
- ✅ Scroll indicator + disparition au premier scroll → Task 12
- ✅ Section About texte éditorial + reveal mot par mot → Task 15
- ✅ Bloc Stack mini-marquee infinite → Task 16
- ✅ Photo portrait optimisée → Task 14 (placeholder)
- ✅ Curseur custom desktop (dot + magnetic outline) → Tasks 4-5

**Spec coverage (vs DEV-RULES) :**
- ✅ R3F isolé dans HeroShader, lazy-loaded ssr:false, fallback statique présent → Tasks 9-10
- ✅ useGSAP + cleanup auto via @gsap/react → Tasks 11, 15
- ✅ prefers-reduced-motion respecté partout (hooks, shader → fallback, splits désactivés, marquee freeze) → Tasks 2, 5, 10, 11, 15, 16
- ✅ Curseur custom OFF mobile + reduced-motion → Task 5
- ✅ Magnetic effect OFF mobile (data-attribute consumé uniquement si Cursor monté) → Task 4

**Placeholder scan :**
- "[À compléter pendant l'exécution]" dans le template du rapport — placeholder *de template*, attendu, l'exécutant le remplace.
- Pas de "TBD"/"implement later" dans le code.

**Type consistency :**
- `paragraphs` typé `readonly string[]` à la fois dans AboutText props et dans About.tsx où le tuple `as const` est construit — compatible.
- `stackRows` typé `ReadonlyArray<{label,items}>` cohérent entre StackMarquee props et About construction.
- Uniforms R3F : `{ uTime: { value: number } }` cohérent entre EmberMesh.tsx (write `materialRef.current.uniforms.uTime.value`) et le shader (read `uniform float uTime`).
- Hooks retour : `useReducedMotion(): boolean` et `useMediaQuery(query: string): boolean` cohérents avec leurs consommateurs (CursorProvider, HeroBackground, HeroText, AboutText).

**Risques connus à signaler à l'exécutant :**
1. **R3F + React 19 compat** — @react-three/fiber v9 requis (v8 ne supporte pas React 19). Vérifier le numéro de version au moment de l'install.
2. **next/image avec SVG** — peut nécessiter `unoptimized` ou un fallback `<img>`. Documenté dans Task 14.
3. **Turbopack et import de three** — `three` est volumineux, vérifier qu'il n'est pas dans le bundle critical path (devrait être derrière `next/dynamic` via HeroShader).
4. **R3F types JSX** — TypeScript peut exiger `import type {} from '@react-three/fiber'` pour activer les types `<mesh>`, `<planeGeometry>`, etc. Si tsc se plaint, ajouter l'import.
5. **`gsap.ticker` déjà branché par Phase 1 LenisProvider** — ne pas re-brancher ailleurs.

---

## Execution Handoff

Plan complet sauvegardé dans `docs/superpowers/plans/2026-05-13-phase-2-hero-about.md`. Deux options d'exécution :

**1. Subagent-Driven (recommandé)** — Je dispatche un subagent frais par tâche, review entre chaque.

**2. Inline Execution** — J'exécute les tâches dans cette session via executing-plans.

**Quelle approche ?**
