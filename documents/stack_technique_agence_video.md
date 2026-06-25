# Stack Technique — Markyn (platform_market)
**bstorm Data — Document de travail — Juin 2026**

---

## Contexte

**Markyn** (nom de repo : `platform_market`) — application de gestion de flux métier pour une agence de communication vidéo. Modules couverts : plannings vidéastes, gestion des lieux/clients, scripts IA, gestion des rushes, montage, panel IA (images + vidéo), publication Meta.

---

## 1. Frontend

| Framework | Langage | Points forts | Points faibles | Adapté |
|---|---|---|---|---|
| **React + TypeScript** | JS/TS | Ecosystème vaste, drag-and-drop, panneaux IA, upload vidéo | Courbe d'apprentissage si nouveau | ✅ **Recommandé** |
| Vue.js | JS/TS | Plus simple que React, bonne doc | Ecosystème plus petit | ✅ Alternative |
| Next.js | JS/TS | SSR/SSG, full-stack possible | Complexité inutile si app interne | Oui si app publique |
| Angular | TS | Très structuré, bon pour grandes équipes | Verbeux, overkill | ❌ |
| Svelte | JS | Ultra-léger, performant | Ecosystème limité | ❌ |

> **Verdict :** React + TypeScript + Tailwind CSS. Le plus riche pour composants complexes (calendriers drag-and-drop, upload vidéo, éditeurs de scripts avec IA intégrée).

---

## 2. Backend

| Framework | Langage | Points forts | Points faibles | Adapté |
|---|---|---|---|---|
| **Node.js + Express** | JS/TS | Cohérence full-stack avec React, large écosystème npm, bon pour APIs REST et websockets | Moins performant pour traitement vidéo CPU-bound | ✅ **Recommandé (usage général)** |
| **FastAPI** | Python | Excellent pour IA/ML, typage Pydantic, async natif | Rupture de stack (deux langages) | ✅ **Recommandé (si IA lourde)** |
| NestJS | TS | Architecture structurée, modules/guards/pipes | Complexité accrue | Oui si équipe > 3 devs |
| Django + DRF | Python | Complet, ORM puissant | Trop monolithique, moins adapté REST moderne | ❌ |
| Go (Fiber/Gin) | Go | Performance maximale | Langage à apprendre, écosystème IA limité | ❌ |

> **Verdict :** Node.js + Express/Fastify pour la logique métier. FastAPI optionnel en microservice dédié si traitement IA/vidéo côté serveur est intensif.

---

## 3. Base de données

| Solution | Type | Points forts | Points faibles | Adapté |
|---|---|---|---|---|
| **PostgreSQL** | SQL Relationnel | Relations complexes, JSONB, déjà maîtrisé, excellent pour reporting | Moins adapté pour métadonnées vidéo massives non-structurées | ✅ **Recommandé** |
| MySQL / MariaDB | SQL Relationnel | Simple, répandu | Moins de fonctionnalités avancées que PG | ✅ Alternative |
| MongoDB | NoSQL Document | Flexibilité des schémas | Pas idéal pour relations complexes | Partiel (métadonnées) |
| Supabase | PostgreSQL managé | Auth + BDD + Storage tout-en-un, rapide à démarrer | Vendor lock-in | ✅ Pour prototype |
| PlanetScale | MySQL Serverless | Scalabilité automatique, branching | Payant, MySQL uniquement | ❌ |

> **Verdict :** PostgreSQL — relations métier complexes (projets, lieux, personnes, rushes, publications). Supabase si on veut accélérer le prototype (auth + storage inclus).

---

## 4. Stockage fichiers vidéo

> ⚠️ Les vidéos ne doivent **jamais** être stockées en base de données. Un object storage est indispensable.

| Solution | Prix | Points forts | Points faibles | Adapté |
|---|---|---|---|---|
| **Cloudflare R2** | Payant, économique | Compatible S3, **zéro egress fees** — idéal pour gros volumes vidéo | Moins d'intégrations natives AWS | ✅ **Recommandé** |
| AWS S3 | Payant à l'usage | Standard de facto, fiabilité maximale, écosystème immense | Egress fees coûteux pour vidéo | ✅ Alternative |
| Backblaze B2 | Très économique | Compatible S3 API, moins cher que S3 | Moins de fonctionnalités | ✅ Budget serré |
| Minio (self-hosted) | Gratuit (infra) | Contrôle total, compatible S3 | Maintenance infra à charge | Partiel (on-premise) |
| Google Cloud Storage | Payant | Bon pour stack GCP/Firebase | Moins pertinent hors écosystème Google | ❌ |

> **Verdict :** Cloudflare R2 — zéro egress fees, compatible S3 (migration facile), idéal pour distribuer des rushes volumineuses aux monteurs.

---

## 5. Intégrations IA

### 5.1 Génération et gestion de scripts

| Solution | Avantages | Inconvénients | Adapté |
|---|---|---|---|
| **API Anthropic (Claude Sonnet)** | Accès déjà disponible, excellent en créativité et rédaction structurée, parfait pour scripts vidéo | Payant à l'usage (tokens) | ✅ **Recommandé** |
| OpenAI GPT-4o | Très performant, multimodal | Moins cohérent pour scripts longs | ✅ Alternative |
| Mistral API | Modèles européens, bon rapport qualité/prix | Moins performant en créativité pure | Partiel |

> **Verdict :** API Anthropic Claude Sonnet 4.6 — meilleure cohérence pour brainstorming et génération de scripts créatifs. Intégrable directement dans l'interface.

### 5.2 Génération d'images

| Solution | Modèles | Avantages | Inconvénients | Adapté |
|---|---|---|---|---|
| **Replicate API** | Flux.1, SDXL, SD3 | Accès unifié à des dizaines de modèles via une seule API, pay-per-use | Latence variable | ✅ **Recommandé** |
| OpenAI DALL-E 3 | DALL-E 3 | Qualité élevée, intégration simple | Moins de contrôle fin, plus cher | ✅ Alternative |
| Stability AI API | SD 3.5 | Contrôle maximal | API moins simple | Oui |
| Midjourney | Propriétaire | Qualité visuelle excellente | Pas d'API ouverte accessible | ❌ |

> **Verdict :** Replicate API — accès unifié à Flux.1 et autres modèles via une seule intégration. Idéal pour visuels de couverture, miniatures, storyboards.

### 5.3 Montage vidéo IA

| Solution | Capacités | Avantages | Inconvénients | Adapté |
|---|---|---|---|---|
| **RunwayML API** | Gen-3 : text-to-video, video editing, inpainting | Leader du marché, API disponible, effets visuels avancés | Coût élevé, latence importante | ✅ **Recommandé** |
| Kling AI API | Text-to-video, image-to-video | Très bonne qualité mouvement | Moins de contrôle fin | ✅ Alternative |
| Pika API | Text-to-video, video editing | Simple, bon pour courts formats | Moins de fonctionnalités pro | Partiel |
| Remotion | Montage programmatique React | Open source, rendu vidéo depuis code React, parfait pour vidéos template | Pas de montage IA proprement dit | Complémentaire |
| FFmpeg (local) | Traitement bas niveau | Gratuit, open source, puissant pour transcodage/découpage | Pas d'IA, nécessite serveur CPU | Complémentaire |

> **Verdict :** RunwayML pour le montage IA avancé + FFmpeg pour la gestion des rushes (découpage, transcodage). Remotion si on génère des vidéos template depuis du code.

---

## 6. Publication & Réseaux sociaux

| Option | Approche | Avantages | Inconvénients | Adapté |
|---|---|---|---|---|
| **Metricool API** | Via outil tiers | Scheduling simplifié, analytics inclus, multi-plateformes (TikTok, LinkedIn...) | Dépendance tiers payant | ✅ **Recommandé (rapidité)** |
| Meta Graph API (direct) | Connexion directe | Contrôle total, pas de tiers, supporte Reels et Stories | Review process Meta, OAuth à implémenter, quotas API | ✅ Long terme |
| Buffer API | Via outil tiers | Simple, bien documenté, multi-plateformes | Moins d'analytics que Metricool | ✅ Alternative |
| Make / Zapier | No-code | Configuration rapide, pas de dev | Pas d'intégration native dans l'app | ❌ Tests seulement |

> **Verdict :** Metricool API pour démarrer rapidement. Migrer vers Meta Graph API direct si besoin de contrôle total ou réduction de coûts à terme.

---

## 7. Authentification & Gestion des accès

| Solution | Type | Avantages | Inconvénients | Adapté |
|---|---|---|---|---|
| **Auth.js (NextAuth)** | Bibliothèque JS | Gratuit, open source, OAuth + JWT, intégré React/Next | Configuration manuelle | ✅ **Recommandé** |
| Supabase Auth | Managé | Auth + BDD + Storage tout-en-un, RLS PostgreSQL natif | Vendor lock-in | ✅ Si stack Supabase |
| Auth0 | SaaS | Enterprise-grade, UI login prête | Cher pour beaucoup d'utilisateurs | Partiel |
| Clerk | SaaS moderne | Intégration React ultra-simple, MFA inclus | Payant après quota gratuit | Oui |
| JWT custom | DIY | Contrôle total | Sécurité entièrement à charge | ❌ |

> **Verdict :** Auth.js (stack Node custom) ou Supabase Auth (si stack Supabase). Rôles à modéliser : admin, chef de projet, filmeur, monteur, client.

---

## 8. Stack recommandée — Synthèse

| Couche | Technologie retenue | Justification |
|---|---|---|
| Frontend | React + TypeScript + Tailwind CSS | Composants complexes, drag-and-drop, panneaux IA |
| Backend | Node.js + Express / Fastify | Cohérence JS full-stack, API REST, websockets |
| Base de données | PostgreSQL | Relations métier complexes — déjà maîtrisé |
| Stockage vidéo | Cloudflare R2 (ou AWS S3) | Zéro egress fees pour vidéos volumineuses |
| Auth | Auth.js + RBAC custom | Multi-rôles (filmeur, monteur, chef de projet, client) |
| IA Scripts | API Anthropic Claude Sonnet | Brainstorming + génération scripts |
| IA Images | Replicate API (Flux.1) | Génération visuels, miniatures, storyboards |
| IA Montage | RunwayML + FFmpeg | Montage automatisé + traitement rushes |
| Publication | Metricool API | Scheduling multi-plateforme, analytics inclus |

---

## 9. Workflow de développement avec Claude

| Outil Claude | Usage optimal | Pour ce projet |
|---|---|---|
| **Claude Code Web (claude.ai/code)** | Développement agent autonome connecté à GitHub, sans installation locale | ✅✅ **Phase développement — Option A (déjà disponible sur ton compte Max)** |
| **Claude Code Terminal** | Même chose mais depuis le terminal local, via `npm install -g @anthropic-ai/claude-code` | ✅✅ **Phase développement — Option B (si préférence locale)** |
| Claude.ai (ici) | Architecture, brainstorming, requirements, specs | ✅ Phase de conception |
| Claude in VS Code | Assistance inline, refactoring ciblé, debug ponctuel | ✅ En complément |
| Cowork | Automatisation fichiers bureautiques | ❌ Pas adapté ici |

### Option A — Claude Code Web (recommandé pour toi)
- Accessible sur **claude.ai/code** — déjà disponible sur ton plan Max
- Se connecte directement à un **repo GitHub** via le bouton "Sélectionner un dépôt"
- Claude agit en agent autonome sur le repo : lit, écrit, crée des fichiers, propose des commits
- Aucune installation requise
- Modèle : Opus 4.8 en mode Élevé

### Option B — Claude Code Terminal
- Installer Node.js en local puis `npm install -g @anthropic-ai/claude-code`
- Lancer `claude` dans le dossier du projet
- Même comportement agent, mais tout se passe sur ta machine locale

### Comment tester en local dans les deux cas

Peu importe l'option choisie, **tout le code est dans le repo GitHub**. Le flux de test est toujours le même :

```
Claude Code (web ou terminal) → modifie le repo GitHub
         ↓
Tu fais un git pull en local
         ↓
npm install (si nouvelles dépendances)
         ↓
npm run dev → application accessible sur localhost:3000
         ↓
Tu testes dans ton navigateur
```

La structure du repo contiendra typiquement :
- `/frontend` — application React (lancée avec `npm run dev`)
- `/backend` — serveur Node.js (lancé avec `npm run dev` ou `node server.js`)
- `/prisma` ou `/migrations` — schéma et migrations PostgreSQL
- `.env.example` — variables d'environnement à configurer en local (clés API, BDD, etc.)

**Workflow recommandé :**
1. **Phase 1 — Conception (Claude.ai)** : architecture, modèle de données, requirements, wireframes textuels, user stories
2. **Phase 2 — Développement (Claude Code Web)** : init projet sur GitHub, feature by feature, commits automatiques
3. **Phase 3 — Tests (local)** : `git pull` → `npm run dev` → test navigateur
4. **Phase 4 — Révisions (Claude in VS Code)** : debug ciblé, suggestions inline

---

## 10. Prérequis avant de démarrer

### Prérequis communs (obligatoires)

| Statut | Prérequis | Action requise |
|---|---|---|
| ☐ | Compte GitHub | Créer un repo `agence-video-app` (public ou privé) |
| ☐ | Git en local | Pour faire les `git pull` et tester en local |
| ☐ | Node.js + npm en local | v20+ LTS — pour lancer l'app en local (`npm run dev`) |
| ☐ | PostgreSQL local / Docker | `docker run --name pgdev -e POSTGRES_PASSWORD=pwd -p 5432:5432 postgres` |
| ☐ | Compte Cloudflare | Activer R2, créer buckets "rushes" et "assets" |
| ☐ | Clé API Anthropic | console.anthropic.com — plan API requis |
| ☐ | Compte Replicate | replicate.com — clé API pour Flux.1 |
| ☐ | Compte RunwayML | runwayml.com — plan API pour montage IA |
| ☐ | Compte Meta Developer | developers.facebook.com — app Meta + Instagram Graph API |
| ☐ | Compte Metricool | metricool.com — plan Business pour accès API |

### Option A — Claude Code Web (pas d'installation Claude)

| Statut | Prérequis | Action requise |
|---|---|---|
| ✅ | Compte Claude Max | Déjà disponible — accéder à claude.ai/code |
| ☐ | Repo GitHub connecté | Cliquer "Sélectionner un dépôt" dans l'interface |

### Option B — Claude Code Terminal (installation locale)

| Statut | Prérequis | Action requise |
|---|---|---|
| ☐ | Claude Code installé | `npm install -g @anthropic-ai/claude-code` |
| ☐ | Auth Claude Code | `claude` dans le terminal → suivre l'authentification |

---

---

## Versions

| Version | Fichier requirements | Prompt Claude Code | Mots-clés |
|---|---|---|---|
| V0 | `v0_videaste_shootings.md` | `prompt_claudecode_v0.md` | Liste vidéastes, détail shootings, CRUD de base |
| V1 | `v1_requirements.md` | `prompt_claudecode_v1.md` | CRUD complet, sidebar, écrans clients/matériel, KPI hardcodés |

---

*Document préparé avec Claude.ai — bstorm Data — Juin 2026*
