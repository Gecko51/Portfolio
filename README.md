# Portfolio Guillaume Gay

Portfolio one-page premium — Next.js 16 + TypeScript strict + Tailwind v4 + Framer Motion + GSAP + Lenis + R3F + next-intl.

> Note: le PRD initial visait Next 15. La stack a été upgradée vers Next 16 (latest stable au moment de l'init), avec Turbopack stable. Aucun impact fonctionnel.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Framer Motion 12 · GSAP 3 · Lenis · React Three Fiber (Phase 2+) · next-intl 4 · MDX (Phase 4) · Biome · pnpm · Netlify.

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

## Déploiement Netlify

Stratégie : déployer d'abord sur un sous-domaine `*.netlify.app` pour valider, brancher le domaine custom ensuite.

### 1. Importer le repo sur Netlify

1. Aller sur [app.netlify.com/start](https://app.netlify.com/start) → **Import an existing project**.
2. Connecter GitHub et sélectionner le repo `Gecko51/Portfolio`.
3. Build settings — **laisser les valeurs par défaut**, le fichier `netlify.toml` du repo configure tout :
   - Build command : `pnpm build`
   - Publish directory : `.next`
   - Node version : 20
   - Plugin `@netlify/plugin-nextjs` activé automatiquement
4. Cliquer **Deploy**. Netlify détecte `pnpm-lock.yaml` et utilise pnpm.

### 2. Variables d'environnement production

Dans Netlify → **Site settings → Environment variables → Add a variable** :

| Clé | Valeur | Note |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://[your-site].netlify.app` puis plus tard `https://guillaumegay.fr` | Doit refléter l'URL réelle servie — sinon OG images / sitemap / canonical seront cassés |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `guillaumegay.fr` (ou laisser vide pour désactiver le tracking en preview) | Sans `https://` |
| `NEXT_PUBLIC_BUILD_HASH` | Laisser vide — le `netlify.toml` mappe déjà `$COMMIT_REF` | Override possible si besoin |

> Les variables `NEXT_PUBLIC_*` sont inlinées au build et exposées au client. Ne jamais y mettre de secrets.
> Après changement d'env var, redéployer (Site overview → **Trigger deploy**) pour qu'elles soient effectives.

### 3. Brancher le domaine custom (étape ultérieure)

Quand le site déployé sur `*.netlify.app` est validé :

1. Netlify → **Domain management → Add custom domain** → entrer `guillaumegay.fr`.
2. Netlify propose deux setups DNS — choisir selon ton infra :

   **Option A — Netlify DNS (le plus simple)**
   - Changer les nameservers du registrar vers les 4 NS Netlify.
   - SSL Let's Encrypt provisionné automatiquement.

   **Option B — Cloudflare devant Netlify**
   - Cloudflare → ajouter un CNAME `www` → `[your-site].netlify.app`.
   - Pour la zone apex : CNAME flattening Cloudflare → `[your-site].netlify.app`.
   - **Désactiver le proxy Cloudflare** (nuage gris) pendant la validation du certificat Netlify, puis le réactiver si tu veux le cache/WAF Cloudflare devant.
   - Désactiver l'auto-SSL Cloudflare côté Netlify (Settings → Domain → SSL → "External DNS").

3. Mettre à jour `NEXT_PUBLIC_SITE_URL` → `https://guillaumegay.fr` et redéployer.

### 4. Plausible Analytics

1. Créer un compte sur [plausible.io](https://plausible.io) et ajouter le site.
2. **Domain** dans Plausible : exactement la même valeur que `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
3. Créer les Goals custom : `cv_download` et `locale_switch` (Plausible → Goals → Add goal → Custom event).
4. Le script est déjà intégré dans `src/components/analytics/Plausible.tsx`.

### 5. Vérification post-déploiement

Sur l'URL live (`*.netlify.app` ou domaine custom) :

- **Lighthouse** (DevTools → Lighthouse) sur `/fr` et `/en` — cible ≥ 90 sur Perf / A11y / Best Practices / SEO.
- **OG preview** : [opengraph.xyz](https://www.opengraph.xyz) sur `https://[domain]/fr` pour LinkedIn / Slack / X.
- **Rich Results** (JSON-LD) : [search.google.com/test/rich-results](https://search.google.com/test/rich-results).
- **Validateur HTML** : [validator.w3.org](https://validator.w3.org).
- **Sitemap** : `https://[domain]/sitemap.xml` accessible et valide (URLs absolues du site live).
- **Robots** : `https://[domain]/robots.txt` accessible, `Allow: /api/og` présent.
- **CSP** : `curl -sI https://[domain]/fr | grep content-security-policy` → header présent.

### 6. Points d'attention Netlify spécifiques

- **Route `/api/og`** : edge runtime, fonctionne sur Netlify via le plugin Next.js (Netlify Edge Functions sous le capot).
- **Middleware next-intl** : géré par le plugin (Netlify Edge Functions). Vérifier que `GET /` redirige bien vers `/fr` ou `/en` après deploy.
- **Headers de sécurité** : définis dans `next.config.ts` (CSP, HSTS, etc.) — propagés par le plugin Next.js, vérifiables au curl post-deploy.
- **Cache deploy** : si un changement de config (env var, netlify.toml) ne prend pas effet, faire **Trigger deploy → Clear cache and deploy site**.

## Deploy

Netlify (prod sur `master`). DNS Netlify ou Cloudflare devant selon l'étape (voir section 3).
