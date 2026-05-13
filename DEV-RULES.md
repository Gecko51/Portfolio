# Portfolio Guillaume Gay — DEV-RULES

Règles de développement à appliquer strictement pour tout commit sur ce repo.
Stack ciblée : Next.js 15 (App Router) + TypeScript strict + Tailwind v4 + Framer Motion + GSAP + Lenis + R3F + next-intl + MDX, déployé sur Vercel.

---

## 1. Règles de Code

### TypeScript

- Mode **strict** activé. Aussi : `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `noImplicitOverride`.
- **Jamais** de `any`. **Jamais** de `as unknown as T`. Si un type est inconnu, modéliser explicitement via Zod ou un type discriminé.
- Préférer `interface` pour les objets publics, `type` pour les unions/intersections/utilitaires.
- Pas d'enum runtime (verbose, mal tree-shaké). Utiliser des unions littérales `as const` :
  ```ts
  // Good
  const LOCALES = ['fr', 'en'] as const;
  type Locale = typeof LOCALES[number];
  ```
- Pas de `non-null assertion` (`!`) sauf cas justifié documenté en commentaire au-dessus de la ligne.
- Tous les composants React typent leurs `props` via une interface dédiée nommée `ComponentNameProps`.

### React / Next.js

- **Server Components par défaut.** Marquer `'use client'` uniquement si nécessaire (state, effects, DOM listeners, libs animation/canvas).
- Isoler la partie interactive dans un sous-composant client suffixé ou colocalisé (`<HeroTextClient>` à côté de `<Hero>` server).
- Pas de `useEffect` pour fetch des données → utiliser RSC + cache Next 15 (`cache()`, `revalidateTag`).
- Pas de `'use client'` au niveau d'une page entière sauf raison forte.
- Layouts > pages pour les providers globaux (Lenis, GSAP, Cursor).
- Toujours définir `generateMetadata` async pour les pages indexables.
- Utiliser `next/image` et `next/font` systématiquement. Pas d'`<img>` brut. Pas de balise `<link rel="font">` manuelle.

### Code style général

- **Commentaires** — Chaque composant, hook custom et fonction non triviale a un commentaire de tête (1-3 lignes) qui explique son rôle. Les commentaires servent de contexte pour l'IA (Claude Code) et le mainteneur futur.
- **Nommage** — Descriptif. Pas de `data`, `info`, `helper` sans qualificatif. `getProjectsForLocale(locale)` > `getData()`.
- **Taille** — Une fonction = une responsabilité. Max ~40 lignes. Un composant > 150 lignes → le découper.
- **Imports** — Ordre : built-ins → externes → `@/*` → relatifs. Biome gère ça automatiquement.
- **Error handling** — Catch explicite ou `try/catch` autour des appels susceptibles d'échouer (fs MDX read, fetch externe). Jamais de catch vide.

### Conventions Framer Motion / GSAP

- **Framer Motion** pour : transitions de pages, micro-interactions, layout animations, variants stateful.
- **GSAP** pour : scroll-triggered animations, pin, scroll horizontal, timeline complexe, SplitText.
- Centraliser les easings dans `src/lib/animations.ts` :
  ```ts
  // src/lib/animations.ts
  export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
  export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;
  ```
- Tous les `ScrollTrigger` doivent être créés dans un `useGSAP()` (depuis `@gsap/react`) avec cleanup automatique.
- Toujours respecter `prefers-reduced-motion` via `useReducedMotion()` (Framer) ou `gsap.matchMedia()`.

### R3F / Shaders

- Le canvas R3F est strictement isolé dans `<HeroShader>` lazy-loaded via `next/dynamic` avec `ssr: false`.
- Fallback static (gradient CSS) toujours présent en cas d'échec WebGL ou `prefers-reduced-motion`.
- Shaders GLSL dans `src/components/shaders/*.glsl`, importés via raw-loader.
- Pas de modèle 3D lourd. Le hero shader est un quad fullscreen avec fragment custom.

---

## 2. Règles UI/UX

### Mobile-first

- Designer pour **375px** d'abord, adapter vers desktop. Breakpoints Tailwind par défaut : `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`.
- Toutes les sections sont responsives sans exception.
- **Mobile spécifique** :
  - Curseur custom désactivé.
  - Scroll horizontal projects → fallback scroll vertical natif avec snap.
  - Shader hero : réduire la résolution ou switcher en gradient CSS sur device low-power.
  - Magnetic effect désactivé.

### Design system

- **Tokens** dans `src/styles/tokens.css`, exposés via CSS variables et consommés par Tailwind v4 `@theme`.
- **Spacing** : multiples de 4px (échelle Tailwind native).
- **Border radius** : `--radius` token unique (8px) + variants (`--radius-sm`, `--radius-lg`).
- **Composants UI** : commencer par shadcn/ui CLI (`pnpm dlx shadcn@latest add button`) puis customiser selon design. Ne pas réinventer une `<Button>` from scratch.

### États

Toute interface a 4 états gérés :
- **Loading** — skeleton ou spinner (peu utilisé ici car statique).
- **Empty** — message + CTA (ex: si aucun projet featured).
- **Error** — boundary Next 15 + message sobre.
- **Success / Default** — état nominal.

### Feedback utilisateur

- Toute action interactive (hover, click) produit un retour visuel < 100ms.
- Focus visible obligatoire (outline ring custom, pas le bleu navigateur).
- Magnetic links : transition `transform` ease-out 300ms.

### Accessibilité

- Contraste **≥ 4.5:1** pour le texte (vérifier les `--fg-muted` sur `--bg`).
- Tout élément interactif est focusable au clavier.
- `aria-label` sur les boutons icon-only.
- `aria-hidden="true"` sur le curseur custom et les décoratifs.
- `prefers-reduced-motion` respecté — animations simplifiées ou supprimées.
- Skip link en haut de page (`Aller au contenu`).

---

## 3. Règles de Structure

- **Colocation** — Une feature/section vit dans son dossier (`sections/Hero/`). Sous-composants à côté.
- **Séparation** — Logique métier (`src/lib/`) séparée des composants. Pas d'appel filesystem dans un composant.
- **Types partagés** dans `src/types/`. Types locaux (1 seul fichier les consomme) colocalisés.
- **Pas d'import circulaire.** Si Biome lint en détecte un, refactor immédiat.
- **Aliases obligatoires** — Toujours `@/components/...` au lieu de `../../components/...`.
- **Convention nommage fichiers** :
  - Composants React → PascalCase (`HeroShader.tsx`).
  - Utilitaires/hooks → kebab-case ou camelCase (`reduced-motion.ts`, `useMediaQuery.ts`).
  - Routes Next → kebab-case (slugs MDX).

---

## 4. Règles de Données

### Contenu MDX

- Tout projet a une frontmatter validée par Zod (`src/lib/projects.schema.ts`).
- Lecture des MDX via `src/lib/projects.ts` exclusivement. Jamais d'`fs.readFile` direct dans un composant.
- Le slug du fichier = le slug de la route. Les renommages cassent les URLs → ajouter une redirect dans `next.config.mjs` si besoin.
- Frontmatter obligatoire :
  ```yaml
  slug, title, tagline, year, role, stack[], cover, gallery[], links{}, order, featured
  ```

### i18n

- Tous les textes UI passent par `useTranslations` / `getTranslations`. **Aucun texte en dur** dans les composants.
- Les clés de messages suivent la structure des sections : `Hero.tagline`, `About.body.paragraph1`.
- Validation des messages au build via le type généré next-intl (`Messages` type).

### Pas de BDD

- Pas d'appel API externe en MVP. Tout est statique.
- Si form contact ajouté plus tard : route handler `/api/contact` avec rate-limit (`@upstash/ratelimit` ou similaire) + validation Zod côté serveur.

### Secrets

- **Aucun secret côté client.** Vars `NEXT_PUBLIC_*` sont publiques par définition.
- Si une key tierce est ajoutée (ex: Resend pour form contact), elle vit dans `.env.local` et n'est utilisée que dans les route handlers ou Server Actions.
- `.env.local` est gitignoré. `.env.example` à jour avec toutes les vars (sans valeurs).

---

## 5. Règles de Documentation Externe

### Context7 MCP

Le projet est développé avec Claude Code. Avant de coder une API d'une de ces libs, **toujours requêter Context7** :

- Next.js 15 (App Router, Server Actions, generateMetadata)
- React 19 (useOptimistic, useFormStatus, transitions)
- Framer Motion 12 (motion.div, AnimatePresence, useScroll, useReducedMotion)
- GSAP + ScrollTrigger + SplitText + @gsap/react
- Lenis (instance, integration GSAP)
- React Three Fiber + drei + three.js
- next-intl 4 (App Router setup, navigation typées)
- Tailwind v4 (@theme, @import, design tokens)
- @vercel/og (OG image generation)

**Règle absolue** : ne jamais inventer une API de mémoire. Si Claude Code ne connaît pas une API précisément, lancer `resolve-library-id` puis `query-docs` Context7 avant d'écrire du code.

### Documentation interne

- **README.md** — Maintenu à jour à chaque fin de phase. Sections : Stack, Setup, Scripts, Avancement par phase, Deploy.
- **.env.example** — Chaque nouvelle env var ajoutée → documenter dans `.env.example` avec un commentaire `# rôle de la var`.
- **CHANGELOG.md** — Optionnel mais recommandé. Une ligne par tag Git avec les highlights.

---

## 6. Règles Git

Universelles, non négociables :

- Un commit par tâche atomique.
- Format message : `type(scope): description`
- Types : `feat` | `fix` | `refactor` | `docs` | `chore` | `test` | `style` | `perf`
- Scopes recommandés : `hero`, `about`, `experience`, `projects`, `contact`, `i18n`, `seo`, `deps`, `ci`.
- Tag à chaque fin de phase : `git tag v0.X-[label]` (ex: `git tag v0.2-hero-about`).
- Push tags : `git push --tags`.
- Ne jamais commit : `.env.local`, `.env.production.local`, `node_modules`, `.next`, `.vercel`, `out`, `.DS_Store`, `Thumbs.db`, `*.log`.
- Branches :
  - `main` — production (déployé Vercel sur le domaine prod).
  - `dev` — branche d'intégration (preview Vercel).
  - `feat/[slug]` — features (preview Vercel par PR).
- Hook recommandé : `lefthook` ou `husky` pour lancer `biome check` en pre-commit.

---

## 7. Règles de Sécurité

- **Inputs** — Aucun input utilisateur en MVP (pas de form). Si ajout futur : Zod côté serveur + rate-limit.
- **Headers** — Configurer dans `next.config.mjs > headers()` :
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy` strict (à affiner selon Plausible + fonts + Vercel).
- **Dépendances** — `pnpm audit` à chaque ajout de package. `pnpm outdated` mensuel.
- **Logs** — Pas de logs en prod via `console.log`. Si besoin de monitoring → Vercel Logs natifs ou Axiom/Logflare.
- **Pas d'écriture filesystem** runtime sauf dans la phase build (RSC).

---

## 8. Workflow de Fin de Phase

À la fin de chaque phase, exécuter dans l'ordre :

1. **`pnpm build`** — Confirmer build clean, pas de warning critique.
2. **`pnpm lint`** (Biome) — Zéro erreur, zéro warning.
3. **`pnpm tsc --noEmit`** — Type check passant.
4. **QA manuelle** — Tester les pages clés en Chrome + Safari + mobile (responsive devtools).
5. **Lighthouse** local (Chrome DevTools) — Score ≥ 90 perf/a11y/SEO/best-practices.
6. **README** — Mettre à jour la section "Avancement" : ✅ Phase X — features livrées.
7. **`.env.example`** — Mettre à jour si nouvelles vars ajoutées.
8. **Commit final** — Message clair `chore(release): close phase X — [label]`.
9. **Tag** — `git tag v0.X-[label] && git push --tags`.
10. **Preview Vercel** — Vérifier que le deploy preview de `dev` ou `main` passe.

### Rapport de phase attendu

```markdown
## Rapport Phase X — [Label]

### Implémenté
- [Feature A] — description courte
- [Feature B] — description courte

### Non implémenté (et pourquoi)
- [Feature C] — raison (complexité, dépendance manquante, hors scope MVP)

### Problèmes rencontrés
- [Problème] → [Solution appliquée]

### Recommandations Phase suivante
- [Point d'attention ou pré-requis]

### Lighthouse
- Performance : 9X
- Accessibility : 9X
- Best practices : 9X
- SEO : 9X
```

---

## 9. Workflow de Debug

Processus systématique en 6 étapes — à appliquer pour tout bug non trivial :

1. **Observer** — Reproduire le bug. Lire les fichiers concernés sans rien modifier. Capturer logs console + network.
2. **Diagnostiquer** — Identifier la cause racine, pas le symptôme. Pour un bug d'animation : isoler GSAP vs Framer vs Lenis vs CSS.
3. **Hypothèses** — Lister 2-3 hypothèses classées par probabilité. Court explicatif pour chaque.
4. **Valider** — Demander confirmation au dev avant correction si le fix touche plus d'un fichier.
5. **Corriger** — Fix minimal. Pas de refactor opportuniste pendant un fix.
6. **Expliquer** — Commit message + commentaire au-dessus du fix expliquant le pourquoi (pas le quoi).

### Garde-fous debug

- Ne jamais modifier plus d'un fichier à la fois sans le signaler.
- Si le fix implique de toucher au shader GLSL ou à la pipeline R3F → **STOP** et alerter (zone à risque visuel).
- Vérifier les logs Vercel (Functions + Edge) avant de conclure côté prod.
- Consulter Context7 sur l'API impliquée si le bug semble venir d'une lib externe.
- Ne pas supprimer de code "parce que ça marche sans" → comprendre d'abord pourquoi il était là.

---

## 10. Règles spécifiques au projet

### Performance budget (à tenir)

| Métrique | Cible | Mesure |
|----------|-------|--------|
| LCP | < 2.5s | Lighthouse + Vercel Speed Insights |
| CLS | 0 | Lighthouse |
| INP | < 200ms | Vercel Speed Insights |
| Bundle JS first load (home) | < 200kb gzipped | `pnpm build` output |
| Lighthouse Performance | ≥ 90 | CI Lighthouse |

### Règles d'animation

- **`prefers-reduced-motion`** respecté partout. Si un user l'active, le hero shader devient un gradient statique, les ScrollTriggers se désactivent, les transitions de page deviennent des fade simples 150ms.
- **Pas de scroll-jacking abusif.** Le scroll horizontal projects pin pendant max 1 viewport height (`+=100%`).
- **Pas d'autoplay vidéo** sans contrôle utilisateur.
- **GSAP context** systématique pour cleanup propre des animations au unmount.

### Internationalisation

- **Zéro string en dur dans le JSX.** Tout passe par next-intl.
- **Routes localisées** : utiliser `Link` et `useRouter` depuis `@/i18n/navigation`, jamais `next/link` ou `next/navigation` directement.
- **Slugs MDX traduits** : `gecko-agent` peut devenir `gecko-agent` en EN (identique) ou un slug différent si besoin SEO. Si différent, gérer un mapping dans `src/lib/projects.ts`.

### Charte visuelle

- Le portfolio a sa **propre identité** distincte de Gecko Mind. Ne pas réutiliser le gradient Solar Yellow → Burnt Orange tel quel ; utiliser à la place l'accent ember `#FF5B1F` parcimonieusement.
- Typo display = serif italique éditoriale (Migra ou Fraunces). Aucune autre serif autorisée.
- Pas de coins très arrondis (max 12px). Le style est tech-éditorial, pas friendly-rounded.

### Mention Claude Code

- Footer doit créditer "Built with Claude Code" avec lien vers Anthropic. Cohérent avec le positionnement AI Builder.
