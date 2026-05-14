# Rapport Phase 5 — Contact + SEO + Analytics + CSP

**Date** : 2026-05-14
**Tag** : `v1.0-mvp`
**Branche** : `master`
**Point de départ** : `a192316` (fix routing root page)
**Point d'arrivée** : HEAD

---

## 1. Commits Phase 5 (22 commits)

```
85f2af4 fix(analytics): clarify manual.js SPA behavior, remove redundant defer prop
6cde2e6 refactor(seo): canonical per locale, og.locale on projects, cleanup OG route
5b38d23 feat(security): add strict CSP allowing Plausible and OG image
37a8f89 feat(analytics): instrument CV download and locale switch with track events
8085dae feat(analytics): add Plausible cookieless tracking with manual mode for custom events
4cf5cea fix(seo): allow /api/og crawler access for link previews
4cc05d2 fix(seo): fix Biome import ordering and import type lint errors
36710ee feat(seo): add robots.ts with sitemap reference
e65a3c9 feat(seo): add sitemap.ts with hreflang alternates for all localized routes
9243c23 feat(seo): add dynamic OG image route via next/og edge runtime
b1bfd9a feat(seo): add generateMetadata for project detail pages with OG and hreflang
1a9f067 feat(seo): add JSON-LD Person schema on home
70de4e5 feat(seo): add async generateMetadata with hreflang alternates and OG for home
775f49d feat(seo): add SITE_URL, buildAlternates and buildOgUrl helpers
ee28ead refactor(contact): use displayValue in contact-links as single source of truth
f28728b style(contact): apply Biome formatting to new Contact files
48eb559 feat(home): wire Contact section, replace Phase 5 placeholder
c490b08 feat(contact): add Contact section server component
0e5d4c8 feat(contact): add ContactCTA client component with GSAP magnetic effect
4ea6b99 feat(analytics): add Plausible track helper with SSR-safe no-op fallback
1e66abd feat(contact): add single source of truth for contact links
e517162 feat(i18n): add Contact namespace and remove placeholder
```

---

## 2. Fichiers créés / modifiés (20 fichiers, +793 / -46 lignes)

### Fichiers créés
- `src/app/api/og/route.tsx` — Route OG image dynamique (Edge Runtime, `next/og`)
- `src/app/robots.ts` — Génération robots.txt avec référence sitemap
- `src/app/sitemap.ts` — Sitemap XML avec hreflang alternates (fr/en)
- `src/components/analytics/Plausible.tsx` — Script Plausible cookieless (manual mode)
- `src/components/layout/CVButtonClient.tsx` — Bouton CV avec tracking `cv_download`
- `src/components/sections/Contact/Contact.tsx` — Section Contact server component
- `src/components/sections/Contact/ContactCTA.tsx` — CTA Contact client (GSAP magnetic)
- `src/components/sections/Contact/contact-links.ts` — Source unique liens contact (email, LinkedIn, GitHub)
- `src/components/seo/JsonLdPerson.tsx` — JSON-LD schema Person pour SEO Google
- `src/lib/analytics.ts` — Helper `track()` Plausible avec no-op SSR-safe
- `src/lib/seo.ts` — Helpers `buildAlternates()`, `buildOgUrl()`, constante `SITE_URL`

### Fichiers modifiés
- `next.config.ts` — Ajout CSP strict + HSTS + frame-ancestors + headers sécurité
- `src/app/[locale]/layout.tsx` — Ajout `<Plausible>` et `<JsonLdPerson>`
- `src/app/[locale]/page.tsx` — `generateMetadata` async avec hreflang + OG ; wiring Contact section
- `src/app/[locale]/projects/[slug]/page.tsx` — `generateMetadata` avec OG par projet + og.locale
- `src/components/layout/CVButton.tsx` — Migration vers `CVButtonClient`
- `src/components/layout/LocaleSwitcher.tsx` — Tracking `locale_switch` via `track()`
- `src/messages/en.json` — Namespace Contact (EN)
- `src/messages/fr.json` — Namespace Contact (FR)

---

## 3. Validations automatisables

> Résultats à remplir après exécution des commandes (Task 19).

### `pnpm tsc --noEmit`
- Statut : ✅ 0 erreur
- Erreurs : aucune

### `pnpm lint`
- Statut : ✅ 0 erreur, 0 warning
- Résultat : `Checked 76 files in 23ms. No fixes applied.`

### `pnpm build`
- Statut : ✅ SUCCESS
- Compilé en : 3.4s (Turbopack)
- TypeScript check build : 3.1s
- Pages générées : 16/16
- Durée génération pages SSG : ~1400ms
- Routes générées :
  - `/ ` → Static (redirect middleware)
  - `/_not-found` → Static
  - `/fr` → SSG (generateStaticParams)
  - `/en` → SSG (generateStaticParams)
  - `/[locale]/projects/[slug]` → Dynamic (server-rendered on demand)
  - `/api/og` → Dynamic (Edge Runtime — désactive SSG sur cette route)
  - `/robots.txt` → Static
  - `/sitemap.xml` → Static
- First Load JS : non exposé par Turbopack build output (disponible après `next build` classique webpack)

---

## 4. À faire par le user en navigateur (QA manuelle post-deploy)

### Lighthouse (via DevTools → Lighthouse ou PageSpeed Insights)
> Cible : Performance / Accessibility / Best Practices / SEO ≥ 90

- [ ] Lighthouse Desktop `/fr`
- [ ] Lighthouse Mobile `/fr`
- [ ] Lighthouse Desktop `/en`
- [ ] Lighthouse Mobile `/en`
- [ ] Lighthouse Desktop sur un projet (ex: `/fr/projects/[slug existant]`)

### Tests de rendu et accessibilité
- [ ] Test `prefers-reduced-motion` : DevTools → Rendering → Emulate CSS media feature → `prefers-reduced-motion: reduce` → vérifier que les animations sont désactivées (gradient statique en Hero, transitions fade 150ms)
- [ ] Test mobile 375px : DevTools → Device toolbar → iPhone SE ou 375px custom → vérifier layout, Contact section, navigation
- [ ] Cross-browser : Firefox (Gecko engine), Safari / WebKit si disponible

### SEO et données structurées
- [ ] Validateur JSON-LD (Person schema) : [search.google.com/test/rich-results](https://search.google.com/test/rich-results) sur `https://[domain]/fr`
- [ ] Validateur HTML : [validator.w3.org](https://validator.w3.org) sur `https://[domain]/fr`
- [ ] Vérifier `https://[domain]/sitemap.xml` — format XML valide, toutes les routes présentes avec hreflang
- [ ] Vérifier `https://[domain]/robots.txt` — `Disallow` vide, lien sitemap présent

### Open Graph / Social preview
- [ ] OG preview LinkedIn/Slack/X via [opengraph.xyz](https://www.opengraph.xyz) sur `https://[domain]/fr`
- [ ] OG image dynamique : tester `/api/og?title=Test&locale=fr` directement dans le navigateur
- [ ] Vérifier og:locale correct sur les pages projet (`fr_FR` vs `en_US`)

---

## 5. Étapes externes Phase 5 → v1.0-mvp mise en ligne

### A. Plausible Analytics
1. Créer un compte sur [plausible.io](https://plausible.io)
2. Ajouter un nouveau site — Domain : `guillaumegay.fr` (ou ton domaine final)
3. Définir `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=guillaumegay.fr` dans les env vars Vercel (voir étape C)
4. Créer les Goals custom dans Plausible : `cv_download` et `locale_switch`

### B. Connecter Vercel au repo
1. [vercel.com/new](https://vercel.com/new) → Import Git Repository
2. Sélectionner le repo du portfolio
3. Framework : **Next.js** (auto-détecté)
4. Build Command : `pnpm build`
5. Install Command : `pnpm install`

### C. Configurer les env vars Vercel (Settings → Environment Variables)

| Variable | Valeur | Scope |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://guillaumegay.fr` | Production |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `guillaumegay.fr` | Production |
| `NEXT_PUBLIC_BUILD_HASH` | `$VERCEL_GIT_COMMIT_SHA` | Production |

### D. DNS Cloudflare → Vercel
- Désactiver le proxy Cloudflare (nuage gris) sur les enregistrements pointant vers Vercel
- **CNAME** `www` → `cname.vercel-dns.com` (pour sous-domaine www)
- **A records** pour zone apex : `76.76.21.21` et `76.76.21.22` (IPs Vercel)
- Connecter le domaine dans Vercel → Settings → Domains

### E. Vérifier post-deploy
- [ ] Site accessible sur `https://[domain]/fr` et `https://[domain]/en`
- [ ] Redirections `/` → `/fr` ou `/en` fonctionnelles (selon Accept-Language)
- [ ] HTTPS actif (certificat Let's Encrypt auto-provisionné par Vercel)
- [ ] Plausible reçoit les visites (dashboard plausible.io → Real-time)
- [ ] Effectuer la QA Lighthouse complète (section 4 ci-dessus)

---

## 6. Résumé des fonctionnalités Phase 5

| Fonctionnalité | Fichiers clés | Statut |
|---|---|---|
| Section Contact (email, LinkedIn, GitHub) | `Contact.tsx`, `ContactCTA.tsx`, `contact-links.ts` | ✅ |
| Magnetic effect bouton CTA | `ContactCTA.tsx` (GSAP + Framer) | ✅ |
| i18n Contact FR/EN | `fr.json`, `en.json` | ✅ |
| `generateMetadata` home (hreflang, OG) | `[locale]/page.tsx`, `seo.ts` | ✅ |
| `generateMetadata` projets (OG par projet) | `[slug]/page.tsx` | ✅ |
| JSON-LD Person schema | `JsonLdPerson.tsx` | ✅ |
| OG image dynamique `/api/og` | `api/og/route.tsx` | ✅ |
| Sitemap.xml avec alternates | `sitemap.ts` | ✅ |
| robots.txt | `robots.ts` | ✅ |
| Plausible cookieless (manual mode) | `Plausible.tsx`, `analytics.ts` | ✅ |
| Tracking `cv_download` et `locale_switch` | `CVButtonClient.tsx`, `LocaleSwitcher.tsx` | ✅ |
| CSP strict + HSTS + frame-ancestors | `next.config.ts` | ✅ |
