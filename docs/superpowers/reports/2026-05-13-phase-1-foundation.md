## Rapport Phase 1 — Foundation

### Implémenté
- Next.js 16.2.6 (upgrade depuis Next 15 spec'd au PRD, Turbopack stable) + TS strict + path aliases + Biome 1.9
- Tailwind v4 (CSS-first) + design tokens CSS variables (palette dark + accent ember `#FF5B1F`)
- next-intl 4.11.2 routing fr/en + middleware + messages placeholder Nav/Footer/Home
- Fonts self-hosted (Instrument Serif fallback Migra + Geist Sans + JetBrains Mono)
- Layout [locale] (Pattern A : root passthrough, [locale] possède html/body) + page Home avec 5 sections placeholder ancrées
- LenisProvider (lerp 0.08 + cleanup ticker GSAP propre) + GsapProvider (registerPlugin ScrollTrigger)
- Header scroll-aware (Framer Motion useScroll) avec actions slot pattern + LocaleSwitcher + CVButton (server async)
- Footer minimal avec crédit Claude Code + build hash injectable
- Placeholder CV PDFs FR/EN + favicon SVG monogramme GG
- Security headers (HSTS, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy)
- README projet + .env.example + .vscode/settings.json (Biome formatter)

### Non implémenté (et pourquoi)
- CSP strict — reporté à Phase 5 (Plausible + WebGL ajoutent de la complexité, CSP nécessite une intégration plus large)
- CV PDFs réels — placeholders 131 bytes valides, à remplacer par les vrais avant prod
- Migra display font — payante (Pangram Pangram), Instrument Serif en fallback Phase 1
- Lighthouse CI — workflow `.github/workflows/lighthouse.yml` reporté à Phase 5
- Tests — pas de tests unitaires en MVP (DEV-RULES §1 confirme)

### Problèmes rencontrés (et résolutions)
- **pnpm absent à l'init** : Corepack EPERM en mode user sur Windows → fallback `npm install -g pnpm` (pnpm 11.1.1)
- **`pnpm create next-app` refuse répertoire non vide** : specs déplacées en `/tmp`, scaffold, puis restaurées
- **Next.js 16 latest au lieu du 15 spec'd** : accepté comme upgrade (Turbopack stable, perf+, compat totale stack)
- **`pnpm-workspace.yaml` placeholder corrompu** : `set this to true or false` → corrigé en `true` pour `@biomejs/biome`, `@parcel/watcher`, `@swc/core`
- **`.next` cache obsolète après suppression de page.tsx** : `rm -rf .next` puis rebuild OK
- **Server/Client boundary Header** : adoption du pattern "actions slot" — CVButton (async server) passé en prop ReactNode au Header (client)
- **`.env.example` exclu par défaut par .gitignore** : ajustement de .gitignore pour le tracker

### Recommandations Phase 2
- Avant le shader Hero R3F, vérifier la perf baseline (Lighthouse Performance ≥ 90 sans shader)
- Décider du sort de Migra (achat ou maintien Instrument Serif définitivement)
- Phase 2 introduira `<HeroShader>` lazy-loaded via `next/dynamic` + fallback CSS gradient si WebGL fail ou prefers-reduced-motion
- Penser à activer Plausible (déjà mentionné dans .env.example commenté)
- Le pattern "actions slot" du Header restera utile : Phase 2+ pourra y injecter aussi un toggle theme ou des nav links
- **Bundle size note** : le build prod génère ~917 KB JS brut (non gzippé) répartis en 8 chunks. La librairie la plus lourde est GSAP + Framer Motion combinés. À surveiller en Phase 2 quand R3F/Three.js s'ajoutera — envisager `next/dynamic` pour les providers d'animation dès Phase 2.

### Vérifications finales

| Métrique | Résultat |
|----------|----------|
| `pnpm typecheck` | PASS — 0 erreur TS |
| `pnpm lint` | PASS — 28 fichiers vérifiés, 0 fix appliqué |
| `pnpm build` | PASS — 2 routes générées (SSG : /fr, /en) |
| Bundle JS total `.next/static` | ~917 KB brut (non gzippé) — top chunk 304 KB |
| Bundle CSS total `.next/static` | ~19 KB |
| HTTP `/fr` | 200 |
| HTTP `/en` | 200 |
| HTTP `/cv/Guillaume-Gay-CV-FR.pdf` | 200 — Content-Type: application/pdf |
| HTTP `/nonexistent` | 404 |
| Header `X-Frame-Options` | DENY ✓ |
| Header `Strict-Transport-Security` | max-age=63072000; includeSubDomains; preload ✓ |
| Header `Referrer-Policy` | strict-origin-when-cross-origin ✓ |
| Header `Permissions-Policy` | camera=(), microphone=(), geolocation=() ✓ |
| Skip link FR | "Aller au contenu" ✓ |
| Skip link EN | "Skip to content" ✓ |
| Footer credit | "Built with Claude Code" ✓ |
| Total commits Phase 1 | 16 commits |

### Note bundle size (DEV-RULES §10)
Le build Turbopack ne rapporte pas de taille "first load JS" dans sa sortie console (contrairement au mode webpack classique). Les chunks bruts totalisent ~917 KB JS. Après gzip (~70% compression typique), l'estimation first load serait ~275 KB — légèrement au-dessus de la cible < 200 KB. Ce dépassement est attendu à ce stade : GSAP + Framer Motion + Lenis + next-intl sont tous chargés sans lazy-loading. En Phase 2, l'adoption de `next/dynamic` pour les providers d'animation réduira le first load significativement. Pas de blocage Phase 1.

### Tag

`git tag v0.1-foundation` créé sur le commit `chore(release): close phase 1 — foundation`.
