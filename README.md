# Portfolio Guillaume Gay

Portfolio one-page premium — Next.js 16 + TypeScript strict + Tailwind v4 + Framer Motion + GSAP + Lenis + R3F + next-intl.

> Note: le PRD initial visait Next 15. La stack a été upgradée vers Next 16 (latest stable au moment de l'init), avec Turbopack stable. Aucun impact fonctionnel.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Framer Motion 12 · GSAP 3 · Lenis · React Three Fiber (Phase 2+) · next-intl 4 · MDX (Phase 4) · Biome · pnpm · Vercel.

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
- [x] **Phase 2 — Hero & About** (`v0.2-hero-about`)
- [x] **Phase 3 — Experience timeline** (`v0.3-experience`)
- [x] **Phase 4 — Projects gallery** (`v0.4-projects`)
- [x] **Phase 5 — Contact + SEO + Analytics + CSP** (`v1.0-mvp`)

## Documentation

- `PRD.md` — vision produit et user stories
- `DEV-RULES.md` — règles de code et de workflow
- `STRUCTURE.md` — arborescence cible
- `CLAUDE.md` — guidance pour Claude Code
- `docs/superpowers/plans/` — plans d'implémentation par phase

## Déploiement Vercel

### 1. Importer le repo sur Vercel

1. Aller sur [vercel.com/new](https://vercel.com/new) → **Import Git Repository**.
2. Sélectionner le repo GitHub (ou GitLab/Bitbucket) du portfolio.
3. Framework détecté automatiquement : **Next.js** — laisser les réglages par défaut.
4. **Build Command** : `pnpm build` (remplace `npm run build` si nécessaire dans les settings Vercel).
5. **Install Command** : `pnpm install`.
6. **Output Directory** : `.next` (défaut Next.js — ne pas changer).

### 2. Variables d'environnement production

Dans Vercel → **Settings → Environment Variables**, ajouter (scope : Production) :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://guillaumegay.fr` (ton domaine final) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `guillaumegay.fr` (même domaine sans `https://`) |
| `NEXT_PUBLIC_BUILD_HASH` | `$VERCEL_GIT_COMMIT_SHA` (Vercel injecte automatiquement cette variable système — la copier telle quelle comme valeur) |

> Les variables `NEXT_PUBLIC_*` sont exposées au client browser. Ne jamais y mettre de secrets.

### 3. DNS Cloudflare → Vercel

**Option A — Domaine non-apex (ex: `www.guillaumegay.fr`)**
- Ajouter un enregistrement **CNAME** : `www` → `cname.vercel-dns.com`
- Proxy Cloudflare : **désactivé** (nuage gris) pour laisser Vercel gérer les certificats SSL.

**Option B — Zone apex (`guillaumegay.fr` sans www)**
- Ajouter deux enregistrements **A** pointant vers les IPs Vercel :
  - `76.76.21.21`
  - `76.76.21.22`
- Ou utiliser un enregistrement **AAAA** si disponible (IPv6).
- Proxy Cloudflare : **désactivé** (nuage gris) sur ces enregistrements.

> Après connexion du domaine dans Vercel → **Settings → Domains**, Vercel provisionnera automatiquement le certificat Let's Encrypt.

### 4. Plausible Analytics

1. Créer un compte sur [plausible.io](https://plausible.io) et ajouter le site.
2. **Domain** dans Plausible : utiliser exactement la même valeur que `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (ex: `guillaumegay.fr`).
3. Le script est déjà intégré dans `src/components/analytics/Plausible.tsx` — aucun code supplémentaire requis.
4. Les événements custom (`cv_download`, `locale_switch`) apparaîtront dans Plausible → **Goals**.

### 5. Vérification post-déploiement

Une fois le site live, effectuer ces vérifications dans le navigateur :

- **Lighthouse** (DevTools → Lighthouse) sur `/fr` et `/en` — cible ≥ 90 sur Perf / A11y / Best Practices / SEO.
- **OG preview** : utiliser [opengraph.xyz](https://www.opengraph.xyz) sur `https://[domain]/fr` pour vérifier les previews LinkedIn / Slack / X.
- **Rich Results** (JSON-LD) : [search.google.com/test/rich-results](https://search.google.com/test/rich-results).
- **Validateur HTML** : [validator.w3.org](https://validator.w3.org).
- **Sitemap** : vérifier `https://[domain]/sitemap.xml` accessible et valide.
- **robots.txt** : vérifier `https://[domain]/robots.txt` accessible.

## Deploy

Vercel (prod sur `master`). DNS Cloudflare.
