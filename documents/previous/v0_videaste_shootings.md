# V0 — Liste Vidéastes & Shootings
**platform_market — Juin 2026**

---

## Objectif

Scope minimal de bout en bout. Deux écrans : liste des vidéastes et détail d'un vidéaste avec ses shootings. L'objectif est de valider le cycle complet : interface → API → base de données.

---

## Langue

L'application est en **français**.

---

## Identité visuelle

| Élément | Valeur |
|---|---|
| Couleur principale sombre | `#314044` |
| Couleur d'accentuation | `#4cc5c4` |
| Couleur claire | `#e1e2e3` |
| Style général | Sobre, minimaliste, fonctionnel — pas de fioritures |
| Logos | Fichiers disponibles dans `frontend/public/` — voir tableau ci-dessous |

**Fichiers logos et usage :**

| Fichier | Usage |
|---|---|
| `logo-app-no-background.png` | Favicon / petit logo de l'app |
| `logo-full-main-no-slogan-no-background.png` | Logo principal (header) |
| `logo-full-slogan-no-background.png` | Page home si besoin |

Règles d'application des couleurs :
- Fond général : `#e1e2e3`
- Texte principal : `#314044`
- Boutons actifs, badges actif, liens : `#4cc5c4`
- Badges inactif : gris

---

## Navigation

- **Bouton Retour** : présent sur l'écran détail, ramène à `/`
- **Bouton Home** : présent sur tous les écrans, ramène à `/`
- Pas de menu latéral, pas de routing complexe pour cette V0

---

## Écrans

### Écran 1 — Liste des vidéastes (`/`)

Tableau avec les colonnes suivantes :

| Colonne | Détail |
|---|---|
| Nom | Nom du vidéaste |
| Prénom | Prénom du vidéaste |
| Nombre de shootings | Nombre total de shootings liés (calculé) |
| Taux horaire | Taux horaire du vidéaste (€/h) |
| Statut | Badge coloré : Actif (`#4cc5c4`) / Inactif (gris) |

**Comportements :**
- Clic sur une ligne → navigation vers `/videaste/:id`
- Pas de filtre, pas de pagination pour cette V0
- Tri par défaut : alphabétique sur le nom

---

### Écran 2 — Détail d'un vidéaste (`/videaste/:id`)

**Bloc infos vidéaste :**

| Champ | Détail |
|---|---|
| Nom complet | Nom + prénom |
| Email | Adresse email |
| Téléphone | Numéro de téléphone |
| Statut | Badge Actif / Inactif |
| Taux horaire | Montant en €/h |
| Matériel | Si `materiel_entreprise = true` : afficher "Matériel entreprise". Sinon : liste des équipements (catégorie — nom) |

**Bloc shootings (tableau) :**
Trié par date **décroissante**.

| Colonne | Détail |
|---|---|
| Nom shooting | Nom du shooting |
| Client | Nom du client lié |
| Date | Format DD/MM/YYYY |
| Lieu | Lieu du shooting |
| Durée | En minutes |
| Statut | Badge : planifié / en cours / terminé / annulé |
| Taux horaire | Taux horaire facturé au client (€/h) |

**Comportements :**
- Bouton **Retour** en haut à gauche → retour à `/`
- Bouton **Home** en haut à droite → retour à `/`
- Si aucun shooting : afficher "Aucun shooting enregistré"

---

## Schéma de base de données

### DBML

```dbml
Table videaste {
  id integer [primary key, increment]
  nom varchar
  prenom varchar
  email varchar
  telephone varchar
  statut varchar [note: 'actif, inactif']
  taux_horaire decimal
  materiel_entreprise boolean
}

Table materiel {
  id integer [primary key, increment]
  videaste_id integer [ref: > videaste.id]
  categorie varchar [note: 'caméra, drone, trépied, stabilisateur, éclairage, audio, autre']
  nom varchar
}

Table client {
  id integer [primary key, increment]
  nom varchar
}

Table shooting {
  id integer [primary key, increment]
  client_id integer [ref: > client.id]
  nom varchar
  lieu varchar
  date date
  duree integer [note: 'en minutes']
  statut varchar [note: 'planifié, en cours, terminé, annulé']
  taux_horaire_client decimal
}

Table shooting_videaste {
  id integer [primary key, increment]
  shooting_id integer [ref: > shooting.id]
  videaste_id integer [ref: > videaste.id]
  taux_horaire_videaste decimal
}
```

> Visualisation : coller ce code sur [dbdiagram.io](https://dbdiagram.io)

---

## Stack technique V0

| Couche | Technologie |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Node.js + Express |
| Base de données | PostgreSQL 16 (installation locale, pas Docker) |
| ORM | Prisma |

---

## Structure du projet

```
platform_market/
├── frontend/
│   ├── public/
│   │   ├── logo-full-no-slogan-no-background.png
│   │   ├── logo-full-slogan-no-background.png
│   │   ├── logo-app-no-background.png
│   │   ├── logo-app-white-background.png
│   │   ├── logo-full-no-slogan-white-background.svg
│   │   └── logo-full-slogan-white-background.svg
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Variables d'environnement

Fichier `.env.example` à générer à la racine :

```
# Base de données
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/platform_market

# Backend
PORT=3001

# Frontend
VITE_API_URL=http://localhost:3001
```

Le fichier `.env` (avec les vraies valeurs) est exclu du repo via `.gitignore`.

---

## Configuration .gitignore

```
# Environnement
.env
.env.local
.env.*.local

# Dépendances
node_modules/
frontend/node_modules/
backend/node_modules/

# Build
frontend/dist/
backend/dist/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

---

## APIs backend à implémenter

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/videastes` | Liste tous les vidéastes avec le count de shootings |
| GET | `/api/videastes/:id` | Détail d'un vidéaste avec matériel et shootings triés par date décroissante |

---

## Données de test (seed)

Script à générer dans `backend/prisma/seed.ts` :

- **5 vidéastes** : 3 actifs avec matériel perso (plusieurs équipements), 2 inactifs avec matériel entreprise
- **3 clients** : noms fictifs
- **10 shootings** : dates variées (passées et futures), statuts variés, liés aux clients
- **Relations shooting_videaste** : chaque shooting a au moins 1 vidéaste, certains en ont 2

---

## Phases de développement & checklists

> **Traçabilité** : cocher chaque item au fur et à mesure. Ne passer à la phase suivante que quand tous les items sont cochés et le critère "Done" validé.

---

### Phase 1 — Structure & Configuration

**Objectif :** projet initialisé, BDD connectée, fichiers de config en place.

- [ ] Structure de dossiers créée (`frontend/`, `backend/`, `prisma/`)
- [ ] `package.json` initialisé pour frontend et backend
- [ ] Prisma installé et `schema.prisma` créé avec le schéma complet
- [ ] Fichier `.env.example` créé à la racine
- [ ] Fichier `.env` créé localement avec les vraies valeurs (non commité)
- [ ] `.gitignore` configuré et vérifié
- [ ] `README.md` mis à jour avec les instructions de lancement

**Commandes de validation :**
```bash
cd backend
npx prisma validate
```

**Critère Done :** `Prisma schema validated successfully` sans erreur.

---

### Phase 2 — Backend & Base de données

**Objectif :** migration appliquée, données de test en base, API fonctionnelle.

- [ ] Migration Prisma appliquée (`npx prisma migrate dev`)
- [ ] Tables visibles dans pgAdmin
- [ ] Script de seed créé (`backend/prisma/seed.ts`)
- [ ] Seed exécuté avec succès (`npx prisma db seed`)
- [ ] Données visibles dans pgAdmin
- [ ] Route `GET /api/videastes` implémentée et testée
- [ ] Route `GET /api/videastes/:id` implémentée et testée
- [ ] Backend démarre sans erreur (`npm run dev`)

**Commandes de validation :**
```bash
cd backend
npm run dev
# Dans un autre terminal :
curl http://localhost:3001/api/videastes
curl http://localhost:3001/api/videastes/1
```

**Critère Done :** les deux routes retournent du JSON avec les bonnes données.

---

### Phase 3 — Frontend

**Objectif :** les deux écrans sont affichés et naviguables.

- [ ] React + TypeScript + Tailwind CSS configurés
- [ ] Routing configuré (`/` et `/videaste/:id`)
- [ ] Écran 1 — Liste des vidéastes affiché avec les bonnes colonnes
- [ ] Écran 1 — Badge statut coloré (actif/inactif)
- [ ] Écran 1 — Clic sur une ligne navigue vers le détail
- [ ] Écran 2 — Bloc infos vidéaste affiché
- [ ] Écran 2 — Matériel affiché (liste perso ou "Matériel entreprise")
- [ ] Écran 2 — Tableau shootings trié par date décroissante
- [ ] Écran 2 — Message "Aucun shooting enregistré" si liste vide
- [ ] Bouton Retour fonctionnel sur écran 2
- [ ] Bouton Home fonctionnel sur tous les écrans
- [ ] Couleurs et logo KYN appliqués
- [ ] Frontend démarre sans erreur (`npm run dev`)

**Commandes de validation :**
```bash
cd frontend
npm run dev
# Ouvrir http://localhost:5173
```

**Critère Done :** les deux écrans s'affichent, la navigation fonctionne, les données du seed sont visibles.

---

### Phase 4 — Validation finale & Git

**Objectif :** tout fonctionne de bout en bout, code sauvegardé sur GitHub.

- [ ] Backend et frontend tournent simultanément sans erreur
- [ ] Les 5 vidéastes apparaissent dans la liste
- [ ] Clic sur chaque vidéaste affiche le bon détail
- [ ] Les shootings sont bien triés par date décroissante
- [ ] `.env` absent du repo (vérifié via `git status`)
- [ ] `node_modules` absent du repo (vérifié via `git status`)
- [ ] Commit final avec message clair
- [ ] Push sur GitHub

**Commandes de validation :**
```bash
git status
git add .
git commit -m "V0 - liste vidéastes et détail shootings"
git push origin main
```

**Critère Done :** le repo GitHub est à jour, `.env` et `node_modules` n'apparaissent pas dans les fichiers commités.

---

*Document de référence V0 — platform_market*
