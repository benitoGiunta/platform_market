# Contexte Projet — platform_market
**À coller en début de conversation pour onboarder Claude**

---

## Qui je suis

Je développe une application web. Je travaille en français.

---

## Le projet

**platform_market** est une application de gestion de flux métier pour une agence de communication vidéo. L'agence filme pour ses clients, retouche les vidéos et les publie sur Meta.

### Modules prévus (vision complète)
1. Gestion des plannings des vidéastes
2. Gestion des lieux / clients
3. Gestion des scripts avec IA intégrée (brainstorming, génération, stockage, partage)
4. Gestion des rushes et redistribution aux monteurs
5. Gestion du montage (réception éléments, vidéos montées)
6. Panel IA (génération images + montage vidéo IA)
7. Panel de publication connecté à Meta (via Metricool API ou Meta Graph API)

### Approche
Développement itératif par versions. On commence par un scope minimal (V0), on valide le cycle complet de bout en bout, puis on augmente le scope version par version.

---

## Stack technique validée

| Couche | Technologie |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Node.js + Express |
| Base de données | PostgreSQL 16 (local, pas Docker) |
| ORM | Prisma |
| Stockage vidéo | Cloudflare R2 (à venir) |
| Auth | Auth.js + RBAC (à venir) |
| IA Scripts | API Anthropic Claude Sonnet (à venir) |
| IA Images | Replicate API / Flux.1 (à venir) |
| IA Montage | RunwayML + FFmpeg (à venir) |
| Publication | Metricool API (à venir) |

---

## Environnement de développement

- **OS** : Windows
- **Dossier projet** : `C:\dev\kyn\platform_market`
- **Repo GitHub** : `https://github.com/benitoGiunta/platform_market`
- **Node.js** : v22.19.0
- **Git** : 2.54.0
- **PostgreSQL** : 16 (installé en local, pgAdmin disponible)
- **Claude Code** : installé (v2.1.185), utilisé via l'app desktop Claude
- **Base de données** : `platform_market` créée sur PostgreSQL local

---

## Identité visuelle (KYN)

| Élément | Valeur |
|---|---|
| Couleur principale sombre | `#314044` |
| Couleur d'accentuation | `#4cc5c4` |
| Couleur claire | `#e1e2e3` |
| Style | Sobre, minimaliste, fonctionnel |
| Logos | `logo-app-no-background.png` (favicon/petit logo), `logo-full-main-no-slogan-no-background.png` (header), `logo-full-slogan-no-background.png` (home) — dans `frontend/public/` |

---

## État actuel du projet

### V0 — En cours de développement
**Scope** : deux écrans uniquement
- Écran 1 (`/`) : liste des vidéastes (nom, prénom, nb shootings, taux horaire, statut)
- Écran 2 (`/videaste/:id`) : détail d'un vidéaste + tableau de ses shootings trié par date décroissante

**Schéma BDD V0 :**
- `videaste` (id, nom, prenom, email, telephone, statut, taux_horaire, materiel_entreprise)
- `materiel` (id, videaste_id, categorie, nom) — seulement si matériel perso
- `client` (id, nom)
- `shooting` (id, client_id, nom, lieu, date, duree, statut, taux_horaire_client)
- `shooting_videaste` (id, shooting_id, videaste_id, taux_horaire_videaste) — many-to-many

**APIs V0 :**
- `GET /api/videastes` — liste avec count shootings
- `GET /api/videastes/:id` — détail + matériel + shootings triés date desc

**Phases V0 :**
- [ ] Phase 1 — Structure & Configuration
- [ ] Phase 2 — Backend & Base de données
- [ ] Phase 3 — Frontend
- [ ] Phase 4 — Validation finale & Git

### Fichiers de référence
| Fichier | Contenu |
|---|---|
| `stack_technique_agence_video.md` | Stack technique complète avec options comparées |
| `v0_videaste_shootings.md` | Requirements V0 complets + checklists par phase |
| `prompt_claudecode_v0.md` | Prompt prêt à coller dans Claude Code |
| `prompt_contexte_projet.md` | Ce fichier — onboarding Claude |

---

## Comment on travaille ensemble

- **Ici (Claude.ai)** : brainstorming, architecture, requirements, specs, arbitrages techniques
- **Claude Code (app desktop)** : développement du code, pointé sur `C:\dev\kyn\platform_market`
- Les documents de référence sont produits ici et donnés à Claude Code comme brief
- On travaille phase par phase, on valide avant de passer à la suite
- Tous les documents sont en `.md` pour pouvoir itérer facilement

---

## Conventions de travail

- L'application est en **français**
- Les fichiers `.env` ne sont jamais commités (`.gitignore` configuré)
- Chaque version a son fichier `vX_nom.md` de requirements
- Le fichier `stack_technique_agence_video.md` contient une section **Versions** qui recense toutes les versions

---

*Dernière mise à jour : Juin 2026*
