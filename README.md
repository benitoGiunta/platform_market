# Markyn (platform_market)

**Markyn** est une application de gestion de flux métier pour une agence de communication vidéo : vidéastes, shootings, clients et matériel, avec des opérations CRUD complètes et cohérentes.

## Fonctionnalités (V1)

- **Navigation permanente** : sidebar repliable (Home, Vidéastes, Shootings, Clients, Matériel) + bouton Home / Retour.
- **CRUD complet** sur les 4 entités (ajout en popup, suppression par sélection, édition inline dans les listes, édition in-place dans les détails).
- **Écrans détail enrichis** : blocs liés (matériel ↔ vidéaste, vidéaste ↔ shooting, client ↔ shooting) avec liaison/déliaison, liens croisés cliquables.
- **Détail shooting** : workflow visuel 4 étapes + 3 cartes KPI (hardcodées V1, prêtes pour le calcul réel).
- **Détail client** : 3 cartes KPI (hardcodées V1).
- **Home** : logo + boutons « Réinitialiser la base » et « Charger le jeu de données de test ».
- **Sécurité** : Helmet, CORS explicite, rate limiting, validation Zod + sanitisation XSS, routes seed protégées par header secret, enums et contraintes au niveau base.

## Nouveautés V2

- **UX/UI moderne** : layout `AppShell` (topbar `#314044` + sidebar `#4cc5c4`), police **Syne**, transitions de page (Framer Motion), animation d'intro (une fois par session), skeletons de chargement, toasts de feedback.
- **Workflow shooting interactif** : 6 étapes (Script → Planifié → Tournage → Montage → Révision → Terminé), curseur **drag-and-drop** (@dnd-kit) + mise en **pause/reprise** (transaction atomique côté backend).
- **KPI financiers réels** : marge brute, coûts, bénéfice net calculés côté backend (`utils/kpi.ts`) et affichés en **donut chart** (Recharts) sur les détails shooting et client.
- **Liens de contact cliquables** (`ContactLink`) : téléphone, email, site web, adresse (→ Google Maps).
- **Design tokens centralisés** dans `tailwind.config.js` (`primary/accent/light/pause/danger`) — aucune couleur hardcodée dans le JSX.

> Données de démo : utiliser les boutons **« Charger le jeu de données »** / **« Réinitialiser la base »** sur l'écran d'accueil.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS (Vite), TanStack Query, React Hook Form + Zod, Framer Motion, Recharts, React Select, @dnd-kit, Lucide |
| Backend | Node.js + Express + TypeScript (Helmet, CORS, express-rate-limit, morgan, xss) |
| Base de données | PostgreSQL 16 (local) |
| ORM | Prisma |
| Qualité | ESLint + Prettier |

## Prérequis

- Node.js 22+
- PostgreSQL 16 avec une base `platform_market` créée
- pgAdmin (optionnel)

## Variables d'environnement

Toutes les variables sont documentées dans [`.env.example`](.env.example). Les fichiers `.env` réels sont exclus du dépôt via `.gitignore`.

**`backend/.env`**
```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/platform_market
PORT=3001
CORS_ORIGIN=http://localhost:5173
SEED_SECRET=une_cle_secrete_longue_et_aleatoire
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:3001
VITE_SEED_KEY=une_cle_secrete_longue_et_aleatoire
```

> `SEED_SECRET` (backend) et `VITE_SEED_KEY` (frontend) doivent avoir **la même valeur** : elle protège les routes seed/reset, accessibles uniquement en dev local.

## Lancement

### Backend (terminal 1)

```bash
cd backend
npm install
npx prisma migrate dev      # applique les migrations
npx prisma db seed          # charge le jeu de données de test (idempotent)
npm run dev                 # http://localhost:3001
```

### Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Ouvrir ensuite **http://localhost:5173**.

## Scripts utiles

| Commande (dans `backend/` ou `frontend/`) | Rôle |
|---|---|
| `npm run dev` | Démarre le serveur de dev |
| `npm run typecheck` | Vérifie les types TypeScript |
| `npm run lint` | ESLint |
| `npm run format` | Formate avec Prettier |
| `npx prisma studio` (backend) | Explore la base dans le navigateur |

## APIs principales

| Méthode | Route | Description |
|---|---|---|
| GET / POST | `/api/videastes` | Liste (+ count shootings) / création |
| GET / PUT / DELETE | `/api/videastes/:id` | Détail / modification / suppression (cascade) |
| POST / DELETE | `/api/videastes/:id/materiels[/:materielId]` | Lier / délier un matériel |
| GET / POST | `/api/shootings` | Liste / création |
| GET / PUT / DELETE | `/api/shootings/:id` | Détail / modification / suppression (cascade) |
| POST / DELETE | `/api/shootings/:id/videastes[/:videasteId]` | Lier / délier un vidéaste |
| GET / POST | `/api/clients` | Liste / création |
| GET / PUT / DELETE | `/api/clients/:id` | Détail / modification / suppression (shootings détachés) |
| GET / POST | `/api/materiels` | Liste / création |
| GET / PUT / DELETE | `/api/materiels/:id` | Détail / modification / suppression |
| POST / DELETE | `/api/materiels/:id/videastes[/:videasteId]` | Lier / délier un vidéaste |
| POST / DELETE | `/api/seed` | Recharge / vide la base (header `x-seed-key` requis) |

Format de réponse uniforme : `{ success: true, data }` ou `{ success: false, error: { code, message } }`.
