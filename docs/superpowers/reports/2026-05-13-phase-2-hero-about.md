## Rapport Phase 2 — Hero & About

### Implémenté
- Hooks utilitaires : useReducedMotion, useMediaQuery (matchMedia avec change listener, SSR-safe)
- Curseur custom : Cursor.tsx (RAF + lerp 0.15 + magnetic via [data-cursor-magnetic]), CursorProvider gate isFinePointer && !reducedMotion, masque curseur système via cursor:none sur <html>
- Hero : HeroBackground client router shader/fallback ; HeroShader R3F lazy via next/dynamic (ssr:false) ; EmberMesh R3F avec uTime animé useFrame ; HeroFallback radial+linear gradient CSS ; HeroText useGSAP + split-type chars/words + timeline reveal expo.out ; ScrollIndicator Framer Motion AnimatePresence + fade-out 80px scroll ; Hero composé server avec getTranslations
- Shaders ember : emberVert + emberFrag fbm 2D noise + gradient ember vertical + vignette, inline TS strings
- About : AboutText useGSAP + split-type words + ScrollTrigger start "top 70%" toggle play, garde reduced-motion ; StackMarquee CSS @keyframes translateX -50% infinite, freeze en reduced-motion ; Portrait next/image unoptimized SVG placeholder
- i18n étendu : 11 nouvelles clés Hero (name/tagline/scrollHint), About (kicker + 3 paragraphes + portraitAlt), Stack (3 catégories + 3 items) en FR et EN

### Non implémenté (et pourquoi)
- Vraie photo portrait — placeholder SVG (rect gradient + initiales GG), à remplacer en Phase 5 quand photo dispo
- Migra display font — toujours Instrument Serif fallback (Phase 1 décision conservée)
- SplitText GSAP — remplacé par split-type (open source, ~2 kB) pour éviter incertitude licence Club
- Magnetic links concrets — l'API [data-cursor-magnetic] est en place mais aucun élément ne l'utilise encore en Phase 2

### Problèmes rencontrés (et résolutions)
- R3F JSX types — `import type {} from '@react-three/fiber'` ajouté en tête d'EmberMesh.tsx pour activer l'augmentation des intrinsics JSX (<mesh>, <planeGeometry>, <shaderMaterial>)
- Uniforms typing — TypeScript voit `uniforms[key]` comme potentiellement undefined → utilisation d'optional chain `materialRef.current?.uniforms.uTime` dans useFrame
- split-type chars/words sont `HTMLElement[] | null` — null guards ajoutés avant les appels GSAP
- Biome lint complexity/noForEach — conversion forEach → for...of dans AboutText
- Biome lint useSingleVarDeclarator / Number.POSITIVE_INFINITY — remplacement de `Infinity` global par `Number.POSITIVE_INFINITY` dans ScrollIndicator
- next/image SVG — `unoptimized` prop sur Portrait suffit, pas de modif next.config.ts nécessaire

### Recommandations Phase 3
- Bundle JS first load : 305 kB gzip après Phase 2. Sous le seuil de 400 kB acceptable (Phase 2 inclut R3F/Three comme lazy chunk séparé de 220 kB gz, non inclus dans le first load). Si la Phase 3 alourdit le bundle synchrone, prefetch stratégique du chunk shader sur le hover du Hero ou prefetch:none par défaut.
- Timeline Experience (Phase 3) introduira pin + scroll horizontal — vérifier que Lenis + GSAP ScrollTrigger restent smooth après ajout de pin.
- Portrait réel à intégrer si livré (remplacer le SVG, retirer `unoptimized`).
- Penser à ajouter `data-cursor-magnetic` sur les CTAs de Phase 3/5 (LinkedIn, email, etc.) pour exploiter l'API magnetic du curseur.

### Vérifications

| Métrique | Résultat |
|----------|----------|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS |
| `pnpm build` | PASS |
| Bundle first load `/[locale]` (gzip) | 305 kB (970 kB raw) |
| Bundle R3F/Three lazy chunk (gzip) | 220 kB (836 kB raw) — séparé via next/dynamic |
| HTTP /fr | 200 |
| HTTP /en | 200 |
| HTTP /images/portrait-placeholder.svg | 200 |
| HTML contient "Guillaume Gay" (Hero h1) | ✓ (1 occurrence) |
| HTML contient "AI Builder" (tagline) | ✓ |
| HTML FR contient "Solopreneur tech" (paragraph1) | ✓ |
| HTML EN contient "Tech solopreneur" (paragraph1) | ✓ |
| HTML contient "Claude Code" (Stack itemsAI) | ✓ |
| HTML contient class "animate-marquee" | ✓ (3 occurrences) |
| Total commits Phase 2 | 17 commits |

### Tag

`git tag v0.2-hero-about` créé sur le commit final.
