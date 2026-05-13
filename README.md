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
- [ ] **Phase 2 — Hero & About** (`v0.2-hero-about`)
- [ ] **Phase 3 — Experience timeline** (`v0.3-experience`)
- [ ] **Phase 4 — Projects gallery** (`v0.4-projects`)
- [ ] **Phase 5 — Contact + Polish + Deploy** (`v1.0-mvp`)

## Documentation

- `PRD.md` — vision produit et user stories
- `DEV-RULES.md` — règles de code et de workflow
- `STRUCTURE.md` — arborescence cible
- `CLAUDE.md` — guidance pour Claude Code
- `docs/superpowers/plans/` — plans d'implémentation par phase

## Deploy

Vercel (prod sur `main`, preview sur `dev` et PRs). DNS Cloudflare.
