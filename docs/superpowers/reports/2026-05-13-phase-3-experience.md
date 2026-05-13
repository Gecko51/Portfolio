## Rapport Phase 3 — Experience Timeline

### Implémenté
- Type ExperienceItem partagé (period, role, organization, description, stack?, variant 'main'|'compact')
- Composant ui/Tag (pill réutilisable, sera consommé par Phase 4 Projects aussi)
- TimelineItem (variante main) : pastille accent, period mono, role + org en display italic, description, stack tags
- TimelineMilitary (variante compact) : opacity 80, typo plus petite, pastille muted ; encart soft skills bg-bg-elevated avec 4 entrées en grid 2 cols
- TimelineProgress : ligne 1px sticky, fill animé via Framer useTransform scaleY 0→1
- Timeline (wrapper client) : Framer useScroll target ref offset start-end → end-start, reveal GSAP ScrollTrigger par [data-timeline-item], garde reduced-motion, scope useGSAP pour cleanup auto
- Experience : 3 items (Gecko Mind, Reconversion 2024, Armée 21 ans), soft skills (4 entrées : management, formation, pilotage, décision)
- i18n étendu : namespace Experience FR/EN (kicker, title, 3 × {period, role, org, description}, softSkillsKicker, 4 soft skills)
- Placeholder Home.placeholderExperience supprimé proprement des deux JSON

### Non implémenté (et pourquoi)
- Pin physique de la section — interprétation : progress line est sticky (top-24, height calc(100vh-12rem)), pas la section entière (DEV-RULES §10 anti-scroll-jacking + meilleure compat Lenis smooth scroll)
- Détail des 7 postes militaires successifs — agrégé dans une phrase "7 postes successifs en responsabilité croissante" pour rester discret (PRD §3 Module 4 : "militaire présenté discrètement")
- Magnetic CTA sur les liens externes (GitHub Gecko Agent, etc.) — pas de liens externes dans Experience pour l'instant, reporté à Phase 5 Contact

### Problèmes rencontrés (et résolutions)
- Dev server sur port 3000 était une instance stale d'une session précédente. Le serveur actuel (port 3001) rend correctement le composant Experience avec tous les contenus i18n attendus.
- Les smoke tests via curl ont été effectués sur le port 3001 (serveur dev actif du projet).

### Recommandations Phase 4
- Phase 4 va introduire le scroll horizontal projects — pin GSAP cette fois nécessaire. Vérifier que ScrollTrigger.scrollerProxy peut être utilisé pour Lenis. Tester aussi le scroll snap mobile en fallback.
- Le composant Tag est prêt à être réutilisé pour les stack tags projets.
- Pattern useGSAP + for...of + cleanup explicite à reproduire pour Projects.

### Vérifications

| Métrique | Résultat |
|----------|----------|
| pnpm typecheck | PASS |
| pnpm lint | PASS (Biome : 51 files, no fixes) |
| pnpm build | PASS (Next.js 16.2.6 Turbopack) |
| Bundle JS total gzippé (tous chunks) | ~528 kB |
| HTTP /fr | 200 |
| HTTP /en | 200 |
| HTML FR contient "De l'artillerie à l'IA" (title) | ✓ |
| HTML EN contient "From artillery to AI" (title) | ✓ |
| HTML contient "Gecko Mind" | ✓ (2 occurrences) |
| HTML FR contient "Reconversion tech" | ✓ |
| HTML EN contient "Tech transition" | ✓ |
| HTML FR contient "Sous-officier" | ✓ |
| HTML EN contient "Senior NCO" | ✓ |
| HTML FR contient "Management d'équipe" | ✓ |
| HTML EN contient "Managing teams" | ✓ |
| HTML contient "Anthropic API" (stack tag) | ✓ |
| Total commits Phase 3 | 7 commits |

### Tag

`git tag v0.3-experience` créé sur le commit final.
