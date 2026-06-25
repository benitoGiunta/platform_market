# platform_market

Application de gestion de flux métier pour une agence de communication vidéo.

**V0 — Liste Vidéastes & Shootings.** Deux écrans : liste des vidéastes (`/`) et détail d'un vidéaste avec ses shootings (`/videaste/:id`).

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS (Vite) |
| Backend | Node.js + Express + TypeScript |
| Base de données | PostgreSQL 16 (local) |
| ORM | Prisma |

## Prérequis

- Node.js 22+
- PostgreSQL 16 avec une base `platform_market` créée
- pgAdmin (optionnel)

## Configuration

Les variables d'environnement sont documentées dans [`.env.example`](.env.example).

- **`backend/.env`** — `DATABASE_URL` (avec ton mot de passe Postgres) + `PORT`
- **`frontend/.env`** — `VITE_API_URL`

Ces fichiers sont exclus du dépôt via `.gitignore`.

## Lancement

### Backend

```bash
cd backend
npm install
npx prisma migrate dev      # crée les tables
npx prisma db seed          # insère les données de test
npm run dev                 # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## APIs

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/videastes` | Liste des vidéastes + nombre de shootings |
| GET | `/api/videastes/:id` | Détail d'un vidéaste avec matériel et shootings (triés par date décroissante) |
