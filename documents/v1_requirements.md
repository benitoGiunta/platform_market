# V1 — Requirements Engineering
**Markyn (platform_market) — Juin 2026**

---

## Objectif

Étendre la V0 avec l'ensemble des écrans métier, les opérations CRUD complètes et cohérentes, la navigation permanente, les visuels analytiques (hardcodés mais prêts pour la donnée réelle), et les écrans de détail enrichis.

---

## Langue

L'application est en **français**. Le nom de l'application est **Markyn** — à afficher dans le titre de l'onglet navigateur (`<title>Markyn</title>`), sous le logo sur l'écran Home, et dans le header de la sidebar dépliée.

---

## Patterns CRUD — Référence universelle

> Ces patterns s'appliquent de manière **identique** sur tous les écrans du même type. Ne pas dévier.

### Pattern — Page Liste

| Action | Déclencheur | Comportement |
|---|---|---|
| Ajouter | Bouton "＋ Ajouter" en haut à droite | Ouvre une popup avec formulaire |
| Supprimer | Bouton "🗑 Supprimer" en haut à droite | Active le mode suppression : tableau grisé, checkboxes apparaissent sur chaque ligne. Bouton "Confirmer" déclenche une popup de confirmation. |
| Éditer | Bouton crayon inline sur chaque ligne | Les cellules de la ligne deviennent des inputs. Bouton "✓" pour sauvegarder, "✗" pour annuler. Une seule ligne éditable à la fois. |
| Naviguer | Clic sur une ligne (hors boutons) | Redirige vers la page de détail de l'élément |

### Pattern — Page Détail (infos principales)

| Action | Déclencheur | Comportement |
|---|---|---|
| Éditer | Bouton "Modifier" sur le bloc infos | Les champs du bloc deviennent des inputs directement dans la page. Bouton "Sauvegarder" et "Annuler" apparaissent. |

### Pattern — Table dans une page Détail

| Action | Déclencheur | Comportement |
|---|---|---|
| Ajouter | Dernière ligne de la table = bouton "＋ Ajouter" | Ouvre une popup avec formulaire ou liste de sélection |
| Supprimer / Délier | Rond rouge (⊖) à gauche de chaque ligne | Ouvre une popup de confirmation avant suppression ou déliaison |
| Naviguer | Clic sur une ligne (hors boutons) | Redirige vers la page de détail de l'élément cliqué |

### Suppressions en cascade (DELETE CASCADE)

Toutes les suppressions appliquent le DELETE CASCADE :
- Supprimer un vidéaste → supprime ses matériels liés + ses entrées shooting_videaste
- Supprimer un shooting → supprime ses entrées shooting_videaste
- Supprimer un matériel → supprime ses entrées materiel_videaste
- Supprimer un client → met client_id à NULL sur les shootings liés (pas de suppression du shooting)

---

## Navigation

### Sidebar permanente

- Position : gauche, verticale
- État déplié : icône + label pour chaque item
- État replié : sidebar disparaît, seul un rectangle avec chevron **>** reste visible comme signet pour la rouvrir
- Items :
  1. 🏠 Home
  2. 🎬 Vidéastes
  3. 📅 Shootings
  4. 👤 Clients
  5. 🎥 Matériel

### Boutons de navigation sur chaque page

- **Bouton Home** : toujours présent, ramène à `/`
- **Bouton Retour** : présent sur les pages détail, ramène à la liste parente

---

## Schéma de données — Modifications V1

### Principes data appliqués

| Principe | Implémentation |
|---|---|
| Timestamps universels | `created_at` et `updated_at` sur toutes les tables. `updated_at` géré automatiquement par Prisma (`@updatedAt`). Indispensable pour l'audit, le tri, et les futures analytics temporelles. |
| Enums natifs PostgreSQL | Les valeurs contraintes (`statut`, `categorie`, `domaine_metier`) sont des `enum` Prisma — enforced au niveau BDD, pas juste dans le code. Erreur impossible à l'insertion d'une valeur invalide. |
| Contraintes d'unicité | `@@unique` sur les tables de jonction — un vidéaste ne peut être lié qu'une seule fois au même matériel, idem pour shooting_videaste. Évite les doublons silencieux. |
| Index sur colonnes critiques | Index sur clés étrangères et colonnes fréquemment filtrées/triées (`date` sur shooting, `statut` sur videaste et shooting). Performances préservées à grande échelle. |
| Précision monétaire | Tous les champs monétaires en `Decimal @db.Decimal(10,2)` — précision explicite en base. Évite les erreurs d'arrondi sur les calculs de marge et bénéfice. |
| Matériel entreprise protégé | Champ `is_system Boolean @default(false)` sur `Materiel` — l'enregistrement "Matériel entreprise" est flaggé `is_system = true`. Le backend refuse sa suppression. |
| Seed idempotent | Utiliser `upsert` plutôt que `create` dans le seed — relançable sans erreur même si des données existent déjà. |
| Reset BDD propre | Utiliser `TRUNCATE ... RESTART IDENTITY CASCADE` — remet les séquences d'ID à zéro proprement, plus fiable que des DELETE en cascade. |

---

### Enums Prisma

```prisma
enum StatutVideaste {
  actif
  inactif
}

enum StatutShooting {
  planifie
  en_cours
  termine
  annule
}

enum CategorieMateriel {
  camera
  drone
  trepied
  stabilisateur
  eclairage
  audio
  autre
  entreprise
}

enum DomainMetier {
  Retail
  Horeca
  Industrie
  Services
}
```

---

### Schéma Prisma complet V1

```prisma
model Videaste {
  id          Int                @id @default(autoincrement())
  nom         String
  prenom      String
  email       String?
  telephone   String?
  statut      StatutVideaste     @default(actif)
  taux_horaire Decimal           @db.Decimal(10,2)
  materiels   MaterielVideaste[]
  shootings   ShootingVideaste[]
  created_at  DateTime           @default(now())
  updated_at  DateTime           @updatedAt

  @@index([statut])
}

model Materiel {
  id          Int                @id @default(autoincrement())
  categorie   CategorieMateriel
  nom         String
  is_system   Boolean            @default(false)
  videastes   MaterielVideaste[]
  created_at  DateTime           @default(now())
  updated_at  DateTime           @updatedAt
}

model MaterielVideaste {
  id          Int      @id @default(autoincrement())
  materiel_id Int
  videaste_id Int
  materiel    Materiel @relation(fields: [materiel_id], references: [id], onDelete: Cascade)
  videaste    Videaste @relation(fields: [videaste_id], references: [id], onDelete: Cascade)
  created_at  DateTime @default(now())

  @@unique([materiel_id, videaste_id])
  @@index([videaste_id])
  @@index([materiel_id])
}

model Client {
  id             Int           @id @default(autoincrement())
  nom            String
  nom_legal      String?
  adresse        String?
  numero_tva     String?
  domaine_metier DomainMetier?
  date_creation  DateTime?
  email          String?
  telephone      String?
  shootings      Shooting[]
  created_at     DateTime      @default(now())
  updated_at     DateTime      @updatedAt
}

model Shooting {
  id                  Int                @id @default(autoincrement())
  client_id           Int?
  nom                 String
  lieu                String?
  date                DateTime
  duree               Int                // en minutes
  statut              StatutShooting     @default(planifie)
  taux_horaire_client Decimal            @db.Decimal(10,2)
  client              Client?            @relation(fields: [client_id], references: [id], onDelete: SetNull)
  videastes           ShootingVideaste[]
  created_at          DateTime           @default(now())
  updated_at          DateTime           @updatedAt

  @@index([date])
  @@index([statut])
  @@index([client_id])
}

model ShootingVideaste {
  id                   Int      @id @default(autoincrement())
  shooting_id          Int
  videaste_id          Int
  taux_horaire_videaste Decimal @db.Decimal(10,2)
  shooting             Shooting @relation(fields: [shooting_id], references: [id], onDelete: Cascade)
  videaste             Videaste @relation(fields: [videaste_id], references: [id], onDelete: Cascade)
  created_at           DateTime @default(now())

  @@unique([shooting_id, videaste_id])
  @@index([shooting_id])
  @@index([videaste_id])
}
```

---

### Note : suppression du champ `materiel_entreprise`

Le champ `materiel_entreprise` (boolean) sur `Videaste` est supprimé. Il est remplacé par la relation many-to-many avec un enregistrement `Materiel` flaggé `is_system = true` (catégorie `entreprise`, nom "Matériel entreprise").

### Enregistrement système — seed

```typescript
await prisma.materiel.upsert({
  where: { nom_is_system: { nom: 'Matériel entreprise', is_system: true } },
  update: {},
  create: {
    categorie: 'entreprise',
    nom: 'Matériel entreprise',
    is_system: true,
  },
})
```

> Note : ajouter `@@unique([nom, is_system])` sur `Materiel` dans le schéma Prisma pour permettre cet upsert.

### Reset BDD — implémentation

```sql
TRUNCATE "Videaste", "Materiel", "MaterielVideaste", "Client", "Shooting", "ShootingVideaste"
RESTART IDENTITY CASCADE;
```

> Prisma utilise le nom du model comme nom de table par défaut — vérifier les noms exacts générés avec `npx prisma studio` ou pgAdmin avant d'exécuter.

### Schéma DBML complet V1

```dbml
Table videaste {
  id integer [primary key, increment]
  nom varchar [not null]
  prenom varchar [not null]
  email varchar
  telephone varchar
  statut varchar [not null, note: 'enum: actif, inactif']
  taux_horaire decimal(10,2) [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp

  indexes {
    statut
  }
}

Table materiel {
  id integer [primary key, increment]
  categorie varchar [not null, note: 'enum: camera, drone, trepied, stabilisateur, eclairage, audio, autre, entreprise']
  nom varchar [not null]
  is_system boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table materiel_videaste {
  id integer [primary key, increment]
  materiel_id integer [ref: > materiel.id, not null]
  videaste_id integer [ref: > videaste.id, not null]
  created_at timestamp [default: `now()`]

  indexes {
    (materiel_id, videaste_id) [unique]
    materiel_id
    videaste_id
  }
}

Table client {
  id integer [primary key, increment]
  nom varchar [not null]
  nom_legal varchar
  adresse varchar
  numero_tva varchar
  domaine_metier varchar [note: 'enum: Retail, Horeca, Industrie, Services']
  date_creation date
  email varchar
  telephone varchar
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table shooting {
  id integer [primary key, increment]
  client_id integer [ref: > client.id, null]
  nom varchar [not null]
  lieu varchar
  date timestamp [not null]
  duree integer [not null, note: 'en minutes']
  statut varchar [not null, note: 'enum: planifie, en_cours, termine, annule']
  taux_horaire_client decimal(10,2) [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp

  indexes {
    date
    statut
    client_id
  }
}

Table shooting_videaste {
  id integer [primary key, increment]
  shooting_id integer [ref: > shooting.id, not null]
  videaste_id integer [ref: > videaste.id, not null]
  taux_horaire_videaste decimal(10,2) [not null]
  created_at timestamp [default: `now()`]

  indexes {
    (shooting_id, videaste_id) [unique]
    shooting_id
    videaste_id
  }
}
```

---

## Stack technique — Ajouts V1

### Backend

| Ajout | Librairie | Justification |
|---|---|---|
| Validation des inputs | `zod` | Valide tous les body de requêtes API avant d'écrire en base. Évite les données corrompues. Typage partageable avec le frontend. |
| Gestion d'erreurs centralisée | Middleware Express custom | Un seul middleware intercepte toutes les erreurs et retourne un format JSON uniforme. Pas de try/catch éparpillés. |
| Variables d'environnement typées | `config.ts` + `zod` | Valide les variables d'env au démarrage. L'app ne démarre pas si une variable est manquante — pas de crash silencieux en prod. |
| Headers de sécurité HTTP | `helmet` | Ajoute automatiquement Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, etc. Une ligne, protège contre une dizaine d'attaques courantes. |
| CORS configuré explicitement | `cors` | Autorise uniquement `http://localhost:5173` en dev. Toute autre origine est bloquée par défaut. Configurable par variable d'env pour la prod. |
| Rate limiting | `express-rate-limit` | Limite le nombre de requêtes par IP (ex: 100 req/min). Protège contre les attaques par force brute et le scraping. |
| Sanitisation des inputs | `xss` | Nettoie les strings avant écriture en base. Prévient les injections XSS stockées. Appliqué dans le middleware `validate` après Zod. |
| Logging des requêtes | `morgan` | Log HTTP structuré en dev (method, route, status, response time). Indispensable pour le debug et l'audit. |

### Frontend

| Ajout | Librairie | Justification |
|---|---|---|
| Gestion d'état serveur | `TanStack Query (React Query)` | Gère le cache, les états loading/error, l'invalidation automatique après mutation. Évite de réécrire la logique fetch sur chaque composant. |
| Formulaires | `React Hook Form` + `zod` | Gestion des formulaires performante avec validation côté client. Zod est partagé avec le backend — une seule source de vérité pour les schémas. |

### Outils de qualité (configurés dès le départ)

| Outil | Config | Rôle |
|---|---|---|
| ESLint | `.eslintrc` avec règles TypeScript | Détecte les erreurs et mauvaises pratiques à l'écriture |
| Prettier | `.prettierrc` | Formatage automatique uniforme — pas de débat de style |

---

## Sécurité — Règles et implémentation

### Backend — Configuration Express au démarrage

L'ordre des middlewares dans `index.ts` est impératif :

```typescript
app.use(helmet())                          // 1. Headers sécurité — en premier
app.use(cors({ origin: config.CORS_ORIGIN }))  // 2. CORS explicite
app.use(express.json({ limit: '10kb' }))   // 3. Limiter la taille des body
app.use(morgan('dev'))                     // 4. Logging HTTP
app.use(rateLimiter)                       // 5. Rate limiting
// ... routes
app.use(errorHandler)                      // Dernier : gestion d'erreurs
```

### Rate limiting — Configuration

```typescript
// backend/src/middlewares/rateLimiter.ts
import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,   // fenêtre de 1 minute
  max: 100,              // max 100 requêtes par IP par fenêtre
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Trop de requêtes, réessayez dans une minute.' } },
  standardHeaders: true,
  legacyHeaders: false,
})
```

### Protection des routes seed/reset

Les routes `POST /api/seed` et `DELETE /api/seed` sont destructrices. Elles sont protégées par un middleware qui vérifie un header secret :

```typescript
// backend/src/middlewares/seedGuard.ts
export const seedGuard = (req, res, next) => {
  const key = req.headers['x-seed-key']
  if (key !== config.SEED_SECRET) {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Accès refusé.' } })
  }
  next()
}
```

La variable `SEED_SECRET` est ajoutée au `.env.example` :
```
SEED_SECRET=une_cle_secrete_longue_et_aleatoire
```

Le frontend envoie ce header dans les appels aux boutons Home (reset / seed).

### Règles Prisma — pas de SQL brut non paramétré

Règle absolue : **ne jamais utiliser `$queryRaw` avec une string construite par concaténation.**

```typescript
// ❌ INTERDIT — injection SQL possible
const result = await prisma.$queryRaw(`SELECT * FROM videaste WHERE nom = '${nom}'`)

// ✅ CORRECT — paramètre bindé
const result = await prisma.$queryRaw`SELECT * FROM videaste WHERE nom = ${nom}`

// ✅ PRÉFÉRÉ — passer par l'ORM Prisma
const result = await prisma.videaste.findMany({ where: { nom } })
```

### Règles de logging — données sensibles

Le logger `morgan` ne doit jamais exposer de données sensibles. Règles :

- Ne pas logger les body de requêtes (contiennent emails, taux horaires, téléphones)
- Logger uniquement : méthode HTTP, route, status code, temps de réponse
- En cas d'erreur : logger le `code` d'erreur, jamais le détail des données utilisateur

```typescript
// Format morgan acceptable en dev
morgan('[:method] :url :status :response-time ms')
```

### Règles frontend — stockage des données

- **Ne jamais stocker de données métier sensibles dans `localStorage` ou `sessionStorage`** — tout reste dans le state React (TanStack Query gère le cache en mémoire)
- **Les variables `VITE_*` sont exposées dans le bundle JS** — ne jamais y mettre de clé secrète (API keys, seed secret, etc.)
- La variable `VITE_API_URL` est la seule variable d'env frontend — elle ne contient aucun secret

### Variables d'environnement — `.env.example` mis à jour

```
# Base de données
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/platform_market

# Backend
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Sécurité
SEED_SECRET=une_cle_secrete_longue_et_aleatoire

# Frontend
VITE_API_URL=http://localhost:3001
VITE_SEED_KEY=une_cle_secrete_longue_et_aleatoire
```

> `SEED_SECRET` (backend) et `VITE_SEED_KEY` (frontend) doivent avoir la même valeur.

---

## Architecture backend — Séparation des responsabilités & Factorisation

### Principe DRY — Ne pas réécrire les mêmes opérations x4

Les 4 entités (vidéaste, shooting, client, matériel) partagent les mêmes opérations CRUD de base. Elles sont factorisées dans un `BaseService` générique étendu par chaque service métier.

### Structure des dossiers

```
backend/src/
├── routes/
│   ├── videastes.routes.ts
│   ├── shootings.routes.ts
│   ├── clients.routes.ts
│   ├── materiels.routes.ts
│   └── seed.routes.ts
├── controllers/
│   ├── videastes.controller.ts
│   ├── shootings.controller.ts
│   ├── clients.controller.ts
│   └── materiels.controller.ts
├── services/
│   ├── base.service.ts          # ← CRUD générique Prisma — étendu par tous les services
│   ├── videastes.service.ts     # extends BaseService — surcharge uniquement le spécifique
│   ├── shootings.service.ts
│   ├── clients.service.ts
│   └── materiels.service.ts
├── schemas/
│   ├── videaste.schema.ts
│   ├── shooting.schema.ts
│   ├── client.schema.ts
│   └── materiel.schema.ts
├── middlewares/
│   ├── errorHandler.ts
│   ├── validate.ts
│   ├── rateLimiter.ts
│   └── seedGuard.ts
├── lib/
│   ├── prisma.ts               # ← Instance Prisma singleton — importée partout
│   └── reply.ts                # ← Helpers ok() / fail() — jamais construire { success } à la main
├── utils/
│   └── asyncHandler.ts         # ← Wrapper async pour controllers — plus jamais de try/catch
├── constants/
│   └── errors.ts               # ← Codes d'erreur centralisés (NOT_FOUND, FORBIDDEN, etc.)
├── config.ts
└── index.ts
```

---

### `BaseService` — CRUD générique

Toutes les opérations CRUD communes sont écrites **une seule fois** dans `BaseService`. Chaque service métier l'étend et n'implémente que ce qui lui est spécifique (includes Prisma, logique métier propre).

```typescript
// backend/src/services/base.service.ts
export class BaseService<T> {
  constructor(private model: any) {}

  findAll()           { return this.model.findMany() }
  findById(id: number){ return this.model.findUnique({ where: { id } }) }
  create(data: any)   { return this.model.create({ data }) }
  update(id: number, data: any) { return this.model.update({ where: { id }, data }) }
  delete(id: number)  { return this.model.delete({ where: { id } }) }
}

// backend/src/services/videastes.service.ts
export class VideastesService extends BaseService<Videaste> {
  constructor() { super(prisma.videaste) }

  // Surcharge uniquement ce qui est spécifique :
  findAll() {
    return prisma.videaste.findMany({
      include: { _count: { select: { shootings: true } } }
    })
  }

  findById(id: number) {
    return prisma.videaste.findUnique({
      where: { id },
      include: { materiels: true, shootings: { orderBy: { date: 'desc' } } }
    })
  }
  // create / update / delete héritées de BaseService sans modification
}
```

---

### `reply.ts` — Helpers de réponse API

Jamais construire `{ success: true, data: ... }` manuellement dans un controller.

```typescript
// backend/src/lib/reply.ts
export const ok   = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data })

export const fail = (res: Response, code: string, message: string, status = 400) =>
  res.status(status).json({ success: false, error: { code, message } })
```

Usage dans un controller :
```typescript
// ✅ Une ligne, toujours le même format
return ok(res, videastes)
return fail(res, 'NOT_FOUND', 'Vidéaste introuvable', 404)
```

---

### `asyncHandler` — Wrapper controllers

Élimine le boilerplate try/catch dans chaque controller. Les erreurs sont automatiquement passées au middleware `errorHandler`.

```typescript
// backend/src/utils/asyncHandler.ts
export const asyncHandler = (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

// Usage dans les routes :
router.get('/', asyncHandler(videastesController.findAll))
router.post('/', validate(videasteSchema), asyncHandler(videastesController.create))
```

---

### `errors.ts` — Codes d'erreur centralisés

```typescript
// backend/src/constants/errors.ts
export const ERRORS = {
  NOT_FOUND:    { code: 'NOT_FOUND',    message: 'Ressource introuvable', status: 404 },
  FORBIDDEN:    { code: 'FORBIDDEN',    message: 'Accès refusé',          status: 403 },
  CONFLICT:     { code: 'CONFLICT',     message: 'Conflit de données',     status: 409 },
  SYSTEM_ITEM:  { code: 'SYSTEM_ITEM',  message: 'Élément système protégé', status: 403 },
  RATE_LIMIT:   { code: 'RATE_LIMIT',   message: 'Trop de requêtes',       status: 429 },
  SERVER_ERROR: { code: 'SERVER_ERROR', message: 'Erreur serveur',         status: 500 },
} as const
```

---

### `prisma.ts` — Instance singleton

```typescript
// backend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Tous les services importent `prisma` depuis ce fichier — jamais `new PrismaClient()` dans un service.

---

### Format de réponse API standardisé

```typescript
// Succès
{ success: true, data: <payload> }

// Erreur
{ success: false, error: { code: string, message: string } }
```

---

## Architecture frontend — Composants réutilisables & Factorisation

### Structure des dossiers

```
frontend/src/
├── components/
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── KpiCard.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── DataTable.tsx
│   │   └── Sidebar.tsx
│   └── forms/
│       ├── VideasteForm.tsx
│       ├── ShootingForm.tsx
│       ├── ClientForm.tsx
│       └── MaterielForm.tsx
├── pages/
│   ├── Home.tsx
│   ├── videastes/
│   │   ├── VideastesList.tsx
│   │   └── VideasteDetail.tsx
│   ├── shootings/
│   │   ├── ShootingsList.tsx
│   │   └── ShootingDetail.tsx
│   ├── clients/
│   │   ├── ClientsList.tsx
│   │   └── ClientDetail.tsx
│   └── materiels/
│       ├── MaterielsList.tsx
│       └── MaterielDetail.tsx
├── hooks/
│   ├── useCrud.ts               # ← Hook générique CRUD TanStack Query — étendu par tous les hooks
│   ├── useVideastes.ts          # utilise useCrud — surcharge uniquement le spécifique
│   ├── useShootings.ts
│   ├── useClients.ts
│   └── useMateriels.ts
├── api/
│   ├── client.ts                # ← Fonction fetch centrale avec headers et base URL
│   ├── videastes.api.ts
│   ├── shootings.api.ts
│   ├── clients.api.ts
│   └── materiels.api.ts
├── types/
│   └── index.ts                 # ← Types TypeScript de toutes les entités — source unique
├── constants/
│   ├── api.ts                   # ← Routes API et clés de cache centralisées
│   └── enums.ts                 # ← Enums frontend (statuts, catégories) — miroir des enums Prisma
└── lib/
    └── queryClient.ts
```

---

### `useCrud` — Hook générique TanStack Query

Les 4 hooks d'entité partagent les mêmes patterns de query/mutation. Factorisé une seule fois.

```typescript
// frontend/src/hooks/useCrud.ts
export function useCrud<T>(endpoint: string, queryKey: string[]) {
  const queryClient = useQueryClient()

  const list = useQuery({
    queryKey,
    queryFn: () => apiClient.get<T[]>(endpoint),
  })

  const create = useMutation({
    mutationFn: (data: unknown) => apiClient.post(endpoint, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      apiClient.put(`${endpoint}/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  const remove = useMutation({
    mutationFn: (id: number) => apiClient.delete(`${endpoint}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { list, create, update, remove }
}

// frontend/src/hooks/useVideastes.ts
export function useVideastes() {
  return useCrud<Videaste>(API.VIDEASTES, QUERY_KEYS.VIDEASTES)
  // Surcharge uniquement si besoin de queries spécifiques (détail, liaisons)
}
```

---

### `api/client.ts` — Fetch central

Un seul endroit qui gère la base URL, les headers, le format `{ success, data, error }` et les erreurs réseau.

```typescript
// frontend/src/api/client.ts
const BASE_URL = import.meta.env.VITE_API_URL

async function request<T>(method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message ?? 'Erreur inconnue')
  return json.data
}

export const apiClient = {
  get:    <T>(path: string, headers?: Record<string, string>)               => request<T>('GET', path, undefined, headers),
  post:   <T>(path: string, body: unknown, headers?: Record<string, string>) => request<T>('POST', path, body, headers),
  put:    <T>(path: string, body: unknown, headers?: Record<string, string>) => request<T>('PUT', path, body, headers),
  delete: <T>(path: string, headers?: Record<string, string>)               => request<T>('DELETE', path, undefined, headers),
}
```

> Les appels aux routes seed passent `{ 'x-seed-key': import.meta.env.VITE_SEED_KEY }` dans `extraHeaders`. Ajouter `VITE_SEED_KEY` au `.env.example` — c'est acceptable côté frontend car ces boutons ne sont accessibles qu'en dev local.
```

---

### `constants/api.ts` — Routes et clés de cache centralisées

```typescript
// frontend/src/constants/api.ts
export const API = {
  VIDEASTES:  '/api/videastes',
  SHOOTINGS:  '/api/shootings',
  CLIENTS:    '/api/clients',
  MATERIELS:  '/api/materiels',
  SEED:       '/api/seed',
} as const

export const QUERY_KEYS = {
  VIDEASTES:  ['videastes'],
  SHOOTINGS:  ['shootings'],
  CLIENTS:    ['clients'],
  MATERIELS:  ['materiels'],
} as const
```

---

### `constants/enums.ts` — Enums frontend

Miroir des enums Prisma — source unique côté frontend pour les dropdowns et badges.

```typescript
// frontend/src/constants/enums.ts
export const STATUT_VIDEASTE = { actif: 'Actif', inactif: 'Inactif' } as const
export const STATUT_SHOOTING = { planifie: 'Planifié', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé' } as const
export const CATEGORIE_MATERIEL = { camera: 'Caméra', drone: 'Drone', trepied: 'Trépied', stabilisateur: 'Stabilisateur', eclairage: 'Éclairage', audio: 'Audio', autre: 'Autre', entreprise: 'Entreprise' } as const
export const DOMAINE_METIER = { Retail: 'Retail', Horeca: 'Horeca', Industrie: 'Industrie', Services: 'Services' } as const
```

---

### `types/index.ts` — Types TypeScript — source unique

Définis une seule fois, importés partout (hooks, composants, formulaires, api functions).

```typescript
// frontend/src/types/index.ts
export interface Videaste {
  id: number
  nom: string
  prenom: string
  email?: string
  telephone?: string
  statut: 'actif' | 'inactif'
  taux_horaire: number
  created_at: string
  updated_at: string
  _count?: { shootings: number }
}

export interface Client {
  id: number
  nom: string
  nom_legal?: string
  adresse?: string
  numero_tva?: string
  domaine_metier?: 'Retail' | 'Horeca' | 'Industrie' | 'Services'
  date_creation?: string
  email?: string
  telephone?: string
  created_at: string
  updated_at: string
}

export interface Shooting {
  id: number
  client_id?: number
  nom: string
  lieu?: string
  date: string
  duree: number
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule'
  taux_horaire_client: number
  created_at: string
  updated_at: string
}

export interface Materiel {
  id: number
  categorie: string
  nom: string
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface ShootingVideaste {
  shooting_id: number
  videaste_id: number
  taux_horaire_videaste: number
}

export interface MaterielVideaste {
  materiel_id: number
  videaste_id: number
}
```

---

### Gestion des états UI — Règle universelle

Chaque écran qui charge des données gère explicitement **3 états** :

| État | Affichage |
|---|---|
| Loading | Skeleton ou spinner centré |
| Error | Message d'erreur + bouton "Réessayer" |
| Empty | Message explicite ("Aucun vidéaste enregistré") |

---

## APIs backend — Ajouts V1

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/videastes` | Liste vidéastes + count shootings |
| POST | `/api/videastes` | Créer un vidéaste |
| PUT | `/api/videastes/:id` | Modifier un vidéaste |
| DELETE | `/api/videastes/:id` | Supprimer un vidéaste (cascade) |
| GET | `/api/videastes/:id` | Détail vidéaste + matériels + shootings |
| POST | `/api/videastes/:id/materiels` | Lier un matériel à un vidéaste |
| DELETE | `/api/videastes/:id/materiels/:materielId` | Délier un matériel d'un vidéaste |
| GET | `/api/shootings` | Liste tous les shootings |
| POST | `/api/shootings` | Créer un shooting |
| PUT | `/api/shootings/:id` | Modifier un shooting |
| DELETE | `/api/shootings/:id` | Supprimer un shooting (cascade) |
| GET | `/api/shootings/:id` | Détail shooting + vidéastes + client |
| POST | `/api/shootings/:id/videastes` | Lier un vidéaste à un shooting |
| DELETE | `/api/shootings/:id/videastes/:videasteId` | Délier un vidéaste d'un shooting |
| GET | `/api/clients` | Liste tous les clients |
| POST | `/api/clients` | Créer un client |
| PUT | `/api/clients/:id` | Modifier un client |
| DELETE | `/api/clients/:id` | Supprimer un client (client_id → NULL sur shootings) |
| GET | `/api/clients/:id` | Détail client + shootings |
| GET | `/api/materiels` | Liste tous les matériels |
| POST | `/api/materiels` | Créer un matériel |
| PUT | `/api/materiels/:id` | Modifier un matériel |
| DELETE | `/api/materiels/:id` | Supprimer un matériel (cascade) |
| GET | `/api/materiels/:id` | Détail matériel + vidéastes liés |
| POST | `/api/seed` | Réinitialise et reseed la BDD |
| DELETE | `/api/seed` | Vide toutes les tables et remet les IDs à zéro |

---

## Écrans

---

### Écran Home (`/`)

**Contenu :**
- Logo KYN centré + nom de l'application **Markyn** affiché sous le logo
- Grille de boutons/cards de redirection vers chaque écran liste : Vidéastes, Shootings, Clients, Matériel
- **Bouton "Réinitialiser la base"** : vide toutes les tables + remet les séquences d'ID à zéro. Exécution immédiate sans confirmation.
- **Bouton "Charger le jeu de données de test"** : exécute le script de seed prédéfini (toujours le même dataset). Exécution immédiate sans confirmation.

---

### Écran Vidéastes (`/videastes`)

**Liste principale :**

| Colonne | Détail |
|---|---|
| Nom | Nom du vidéaste |
| Prénom | Prénom du vidéaste |
| Nombre de shootings | Count calculé |
| Taux horaire | €/h |
| Statut | Badge Actif (`#4cc5c4`) / Inactif (gris) |

**Opérations :** pattern Liste standard (ajouter popup, supprimer avec sélection, édition inline).

**Formulaire popup Ajouter/Éditer :**
- Nom, Prénom, Email, Téléphone, Statut (dropdown : actif/inactif), Taux horaire

**Navigation :** clic ligne → `/videastes/:id`

---

### Écran Détail Vidéaste (`/videastes/:id`)

**Bloc infos vidéaste :**
- Nom, Prénom, Email, Téléphone, Statut, Taux horaire
- Édition directe dans la page (pattern Détail)

**Bloc Matériel (table) :**

| Colonne | Détail |
|---|---|
| ⊖ | Rond rouge — délier le matériel (popup confirmation) |
| Catégorie | Catégorie du matériel |
| Nom | Nom du matériel |

- Dernière ligne : bouton "＋ Ajouter un matériel" → popup avec liste dropdown de tous les matériels existants
- Clic sur une ligne → `/materiels/:id`

**Bloc Shootings (table) :**

| Colonne | Détail |
|---|---|
| ⊖ | Rond rouge — délier le vidéaste du shooting (popup confirmation) |
| Nom shooting | Nom du shooting |
| Client | Étiquette cliquable → `/clients/:id` |
| Date | DD/MM/YYYY |
| Lieu | Lieu |
| Statut | Badge statut |
| Taux horaire | €/h |

- Trié par date décroissante
- Dernière ligne : bouton "＋ Ajouter un shooting" → popup avec liste dropdown de tous les shootings existants
- Clic sur une ligne (hors client) → `/shootings/:id`

---

### Écran Shootings (`/shootings`)

**Liste principale :**

| Colonne | Détail |
|---|---|
| Nom | Nom du shooting |
| Client | Nom du client |
| Date | DD/MM/YYYY |
| Lieu | Lieu |
| Durée | En minutes |
| Statut | Badge |
| Taux horaire | €/h |

**Opérations :** pattern Liste standard.

**Formulaire popup Ajouter/Éditer :**
- Nom, Client (dropdown), Lieu, Date, Durée (minutes), Statut (dropdown), Taux horaire client

**Navigation :** clic ligne → `/shootings/:id`

---

### Écran Détail Shooting (`/shootings/:id`)

**Bloc 1 — Workflow visuel (hardcodé)**

Barre horizontale séquentielle avec 4 étapes :

```
[ Script ] ──► [ Planifié ] ──► [ Tournage ] ──► [ Montage ]
```

- Étape en cours : couleur accentuation `#4cc5c4`
- Étapes passées : couleur principale `#314044`
- Étapes futures : gris `#e1e2e3`
- Pour cette V1 : étape en cours hardcodée = **Planifié** (même pour tous les shootings)
- Prévu pour être connecté au champ `statut` du shooting en V2

**Bloc 2 — Infos du shooting**

- Nom, Client (cliquable → `/clients/:id`), Lieu, Date, Durée, Statut, Taux horaire client
- Édition directe dans la page (pattern Détail)

**Table Vidéastes du shooting :**

| Colonne | Détail |
|---|---|
| ⊖ | Rond rouge — retirer le vidéaste du shooting (popup confirmation) |
| Nom | Nom + Prénom du vidéaste (cliquable → `/videastes/:id`) |
| Taux horaire vidéaste | €/h pour ce shooting |

- Dernière ligne : bouton "＋ Ajouter un vidéaste" → popup avec dropdown des vidéastes existants + champ taux horaire vidéaste

**Bloc 3 — KPI analytique (hardcodé V1, prêt pour données réelles)**

3 cartes KPI côte à côte (composant `KpiCard` réutilisable) :

| KPI | Valeur V1 | Calcul futur |
|---|---|---|
| Durée du shooting | Hardcodé : `4h` | `duree / 60` |
| Marge brute | Hardcodé : `800 €` | `(duree/60) * taux_horaire_client` |
| Bénéfice net | Hardcodé : `500 €` | `(duree/60 * taux_horaire_client) - Σ(duree/60 * taux_horaire_videaste)` |

> Structurer avec des constantes nommées et commentées `// TODO V2: remplacer par appel API` pour faciliter le branchement ultérieur.

---

### Écran Clients (`/clients`)

**Liste principale :**

| Colonne | Détail |
|---|---|
| Nom | Nom du client |
| Nom légal | Nom légal société |
| Domaine métier | Catégorie |
| Email | Email |
| Téléphone | Téléphone |
| Nombre de shootings | Count calculé |

**Opérations :** pattern Liste standard.

**Formulaire popup Ajouter/Éditer :**
- Nom, Nom légal, Adresse, Numéro TVA, Domaine métier (dropdown : Retail / Horeca / Industrie / Services), Date de création, Email, Téléphone

**Navigation :** clic ligne → `/clients/:id`

---

### Écran Détail Client (`/clients/:id`)

**Bloc infos client :**
- Nom, Nom légal, Adresse, Numéro TVA, Domaine métier, Date de création, Email, Téléphone
- Édition directe dans la page (pattern Détail)

**Bloc Shootings (table) :**

| Colonne | Détail |
|---|---|
| ⊖ | Rond rouge — met client_id à NULL sur le shooting (popup confirmation) |
| Nom shooting | Cliquable → `/shootings/:id` |
| Vidéastes | Noms des vidéastes (cliquables → `/videastes/:id`) |
| Date | DD/MM/YYYY |
| Lieu | Lieu |
| Statut | Badge |
| Taux horaire | €/h |

- Trié par date décroissante
- Dernière ligne : bouton "＋ Créer un shooting" → popup formulaire création shooting (client pré-rempli)

**Bloc KPI analytique (hardcodé V1, prêt pour données réelles) :**

3 cartes KPI côte à côte (composant `KpiCard` réutilisable) :

| KPI | Valeur V1 | Calcul futur |
|---|---|---|
| Nombre de shootings & durée totale | Hardcodé : `8 shootings — 32h` | `COUNT(shootings)` + `SUM(duree)/60` |
| Marge brute totale | Hardcodé : `6 400 €` | `SUM((duree/60) * taux_horaire_client)` |
| Bénéfice total | Hardcodé : `4 000 €` | `SUM((duree/60 * taux_horaire_client) - Σ(duree/60 * taux_horaire_videaste))` |

> Même principe : constantes commentées `// TODO V2: remplacer par appel API`.

---

### Écran Matériel (`/materiels`)

**Liste principale :**

| Colonne | Détail |
|---|---|
| Catégorie | Catégorie du matériel |
| Nom | Nom du matériel |
| Nombre de vidéastes | Count de vidéastes liés |

**Opérations :** pattern Liste standard.

**Formulaire popup Ajouter/Éditer :**
- Catégorie (dropdown : caméra / drone / trépied / stabilisateur / éclairage / audio / autre / entreprise), Nom

**Navigation :** clic ligne → `/materiels/:id`

---

### Écran Détail Matériel (`/materiels/:id`)

**Bloc infos matériel :**
- Catégorie, Nom
- Édition directe dans la page (pattern Détail)

**Bloc Vidéastes (table) :**

| Colonne | Détail |
|---|---|
| ⊖ | Rond rouge — délier le vidéaste de ce matériel (popup confirmation) |
| Nom | Nom + Prénom du vidéaste (cliquable → `/videastes/:id`) |
| Statut | Badge actif/inactif |
| Taux horaire | €/h |

- Dernière ligne : bouton "＋ Lier un vidéaste" → popup avec dropdown des vidéastes existants

---

## Phases de développement & checklists

---

### Phase 1 — Migration schéma & données

- [ ] Définir les enums Prisma (`StatutVideaste`, `StatutShooting`, `CategorieMateriel`, `DomainMetier`)
- [ ] Modifier `schema.prisma` : ajout champs client, refonte matériel (many-to-many), suppression `materiel_entreprise` sur vidéaste
- [ ] Ajouter `created_at` / `updated_at` sur toutes les tables
- [ ] Ajouter `@@unique([nom, is_system])` sur `Materiel` pour permettre l'upsert idempotent du seed
- [ ] Ajouter `@@unique` sur `MaterielVideaste` et `ShootingVideaste`
- [ ] Ajouter `@@index` sur colonnes critiques (`date`, `statut`, clés étrangères)
- [ ] Vérifier que tous les champs monétaires sont en `Decimal @db.Decimal(10,2)`
- [ ] Générer et appliquer la migration (`npx prisma migrate dev --name v1_schema`)
- [ ] Réécrire le script de seed en `upsert` (idempotent)
- [ ] Insérer l'enregistrement "Matériel entreprise" (`is_system: true`) via upsert
- [ ] Implémenter le reset via `TRUNCATE ... RESTART IDENTITY CASCADE`
- [ ] Exécuter le seed et vérifier les tables dans pgAdmin
- [ ] Vérifier les index créés dans pgAdmin (onglet Indexes sur chaque table)
- [ ] Commit : `feat: schema V1 — migrations, enums, indexes, seed idempotent`

**Critère Done :** migration appliquée, seed idempotent (relançable 2 fois sans erreur), index visibles dans pgAdmin, types monétaires en `decimal(10,2)`.

---

### Phase 2 — Configuration qualité, sécurité & factorisation

- [ ] Configurer ESLint (`eslint.config.js`) avec règles TypeScript strict
- [ ] Configurer Prettier (`.prettierrc`)
- [ ] Installer et configurer `zod` (backend + frontend)
- [ ] Créer `backend/src/config.ts` — validation des variables d'env au démarrage
- [ ] Installer et configurer `helmet`, `cors`, `express-rate-limit`, `morgan`, `xss`
- [ ] Créer `backend/src/lib/prisma.ts` — instance Prisma singleton
- [ ] Créer `backend/src/lib/reply.ts` — helpers `ok()` / `fail()`
- [ ] Créer `backend/src/utils/asyncHandler.ts` — wrapper controllers sans try/catch
- [ ] Créer `backend/src/constants/errors.ts` — codes d'erreur centralisés
- [ ] Créer `backend/src/services/base.service.ts` — CRUD générique Prisma
- [ ] Créer `backend/src/middlewares/errorHandler.ts`
- [ ] Créer `backend/src/middlewares/validate.ts` — Zod + sanitisation XSS
- [ ] Créer `backend/src/middlewares/rateLimiter.ts`
- [ ] Créer `backend/src/middlewares/seedGuard.ts`
- [ ] Configurer l'ordre des middlewares dans `index.ts`
- [ ] Créer les schémas Zod dans `backend/src/schemas/`
- [ ] Installer TanStack Query + configurer `frontend/src/lib/queryClient.ts`
- [ ] Installer React Hook Form côté frontend
- [ ] Créer `frontend/src/api/client.ts` — fetch central avec gestion format `{ success, data, error }`
- [ ] Créer `frontend/src/constants/api.ts` — routes API et clés de cache
- [ ] Créer `frontend/src/constants/enums.ts` — enums miroir des enums Prisma
- [ ] Créer `frontend/src/types/index.ts` — types TypeScript de toutes les entités
- [ ] Créer `frontend/src/hooks/useCrud.ts` — hook générique TanStack Query
- [ ] Créer la structure de dossiers complète
- [ ] Créer les barrel exports `index.ts` sur chaque dossier
- [ ] Mettre à jour `.env.example` avec `CORS_ORIGIN`, `SEED_SECRET` et `VITE_SEED_KEY`
- [ ] Commit : `chore: config qualite, securite, architecture`

**Critère Done :** backend démarre, helmet/cors/rate-limit actifs, `BaseService` et `useCrud` compilent sans erreur, ESLint et Prettier sans erreur.

---

### Phase 3 — Backend API

- [ ] Créer les 4 services en étendant `BaseService` (videastes, shootings, clients, matériels)
- [ ] Vérifier que chaque service ne surcharge que ce qui est spécifique à son entité
- [ ] Créer les controllers en utilisant `asyncHandler` + helpers `ok()` / `fail()`
- [ ] Créer les routes CRUD complètes pour les 4 entités
- [ ] Routes de liaison/déliaison (matériel↔vidéaste, vidéaste↔shooting)
- [ ] Route `DELETE /api/seed` (reset BDD) protégée par `seedGuard`
- [ ] Route `POST /api/seed` (reseed) protégée par `seedGuard`
- [ ] Validation Zod sur tous les body via middleware `validate`
- [ ] Suppression cascade correctement configurée
- [ ] Toutes les réponses via `ok()` / `fail()` — aucune construction manuelle de `{ success }`
- [ ] Aucun `new PrismaClient()` en dehors de `lib/prisma.ts`
- [ ] Aucun try/catch dans les controllers — tout géré par `asyncHandler`
- [ ] Test de toutes les routes
- [ ] Commit : `feat: backend API CRUD complet`

**Critère Done :** toutes les routes répondent, format uniforme vérifié, aucun try/catch visible dans les controllers.

---

### Phase 4 — Composants UI réutilisables

- [ ] `Badge` — statut avec couleurs (`#4cc5c4` actif, gris inactif, couleurs par statut shooting)
- [ ] `KpiCard` — carte KPI avec label, valeur, unité
- [ ] `Modal` — popup générique avec overlay et fermeture
- [ ] `ConfirmModal` — popup de confirmation suppression avec message paramétrable
- [ ] `DataTable` — tableau générique avec support édition inline et mode suppression
- [ ] Commit : `feat: composants UI réutilisables`

**Critère Done :** composants compilent sans erreur, isolés, importables depuis n'importe quelle page.

---

### Phase 5 — Sidebar & Navigation

- [ ] Composant `Sidebar` permanent avec les 5 items (icône + label)
- [ ] État déplié / replié (chevron signet, sidebar disparaît en replié)
- [ ] Item actif mis en évidence (`#4cc5c4`)
- [ ] Routing mis à jour (`/` → Home, `/videastes`, `/shootings`, `/clients`, `/materiels`)
- [ ] Bouton Home et Retour présents sur toutes les pages
- [ ] Commit : `feat: sidebar et routing`

**Critère Done :** navigation fonctionnelle entre tous les écrans, état actif visible dans la sidebar.

---

### Phase 6 — Écran Home

- [ ] Cards de redirection vers les 4 écrans liste
- [ ] Logo Markyn + nom sous le logo
- [ ] Bouton "Réinitialiser la base" connecté à `DELETE /api/seed` (avec header `x-seed-key`)
- [ ] Bouton "Charger le jeu de données" connecté à `POST /api/seed` (avec header `x-seed-key`)
- [ ] États loading/error gérés sur les boutons
- [ ] Commit : `feat: ecran home`

**Critère Done :** les deux boutons fonctionnent, la BDD se vide et se repeuple.

---

### Phase 7 — Écrans Liste

Pour chaque écran liste (Vidéastes, Shootings, Clients, Matériel) :
- [ ] Hook d'entité construit sur `useCrud` avec les bonnes clés de cache depuis `constants/api.ts`
- [ ] Fonctions API dans `api/*.api.ts` utilisant `apiClient` depuis `api/client.ts`
- [ ] Tableau avec les bonnes colonnes (composant `DataTable`)
- [ ] États loading / error / empty gérés
- [ ] Bouton Ajouter → `Modal` + formulaire React Hook Form + validation Zod → mutation TanStack Query → invalidation cache automatique
- [ ] Bouton Supprimer → mode sélection → `ConfirmModal` → mutation DELETE → invalidation cache
- [ ] Bouton éditer inline → inputs sur la ligne → mutation PUT → invalidation cache
- [ ] Enums des dropdowns depuis `constants/enums.ts` — aucune valeur hardcodée inline
- [ ] Types depuis `types/index.ts` — aucun type dupliqué
- [ ] Clic ligne → navigation détail
- [ ] Commit : `feat: ecrans liste CRUD`

**Critère Done :** les 4 écrans liste fonctionnels, CRUD complet, `useCrud` réutilisé sans duplication, cache invalidé après chaque mutation.

---

### Phase 8 — Écrans Détail

Pour chaque écran détail :
- [ ] États loading / error gérés
- [ ] Bloc infos avec édition directe dans la page + validation Zod
- [ ] Tables avec `⊖` (délier/supprimer) + `ConfirmModal`
- [ ] Dernière ligne bouton ajouter → `Modal`
- [ ] Liens cliquables vers pages détail liées
- [ ] Détail shooting : composant workflow visuel 4 étapes hardcodé
- [ ] Détail shooting : 3 `KpiCard` avec constantes commentées `// TODO V2`
- [ ] Détail client : 3 `KpiCard` avec constantes commentées `// TODO V2`
- [ ] Commit : `feat: ecrans detail CRUD`

**Critère Done :** tous les écrans détail fonctionnels, navigation et CRUD opérationnels.

---

### Phase 9 — Validation finale & Préparation merge

- [ ] Test complet du flux : créer client → créer shooting → lier vidéaste → voir détail
- [ ] Test reset BDD (`TRUNCATE ... RESTART IDENTITY CASCADE`) : IDs repartent bien de 1
- [ ] Test seed idempotent : relancer 2 fois le seed sans erreur
- [ ] Test contrainte unicité : tenter de lier deux fois le même vidéaste au même shooting → erreur attendue
- [ ] Test protection `is_system` : tenter de supprimer "Matériel entreprise" → refus attendu
- [ ] Test suppression cascade : supprimer un vidéaste → vérifier suppression dans `shooting_videaste` et `materiel_videaste`
- [ ] Test champs monétaires : vérifier que les calculs de marge/bénéfice n'ont pas d'erreur d'arrondi
- [ ] Test sécurité CORS : appel API depuis une origine non autorisée → bloqué
- [ ] Test rate limiting : dépasser 100 requêtes/min → réponse 429 attendue
- [ ] Test routes seed sans header `x-seed-key` → réponse 403 attendue
- [ ] Test injection XSS : soumettre `<script>alert('xss')</script>` dans un champ texte → valeur nettoyée en base
- [ ] Vérifier que les logs morgan n'exposent pas de données sensibles
- [ ] Vérifier que `.env` n'est pas dans le repo (`git status`)
- [ ] Vérifier qu'aucune clé secrète n'est dans les variables `VITE_*`
- [ ] ESLint et Prettier passent sans erreur
- [ ] `node_modules` absent du repo
- [ ] Mettre à jour le `README.md` : description de Markyn, stack, commandes de lancement, variables d'env requises
- [ ] Commit final : `feat: V1 complete — Markyn CRUD complet`
- [ ] Push de la branch `feature/v1` sur GitHub

**À la fin de cette phase, Claude Code fournit la commande de merge à exécuter manuellement :**

```bash
git checkout main
git merge feature/v1
git push origin main
```

> Claude Code ne merge pas lui-même. Il indique la commande, tu l'exécutes quand tu es prêt.

**Critère Done :** tous les tests passent, branch `feature/v1` pushée sur GitHub, commande de merge fournie.

---

*Document de référence V1 — Markyn (platform_market) — Juin 2026*
