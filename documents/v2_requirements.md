# V2 — UX/UI moderne, données connectées, flux de travail interactif
**Markyn (platform_market) — Juin 2026**

---

## Objectif

Transformer l'expérience utilisateur de Markyn : interface moderne et immersive, données réelles connectées sur tous les indicateurs, flux de travail shooting interactif avec drag-and-drop, et cohérence visuelle complète sur tous les écrans.

---

## Langue

L'application est en **français**. Nom affiché : **Markyn**. Police du nom : **Syne** (Google Fonts).

---

## Nouvelles dépendances V2

| Librairie | Usage | Justification |
|---|---|---|
| `framer-motion` | Animations (intro home, transitions) | Stable, React-native, pas de fichier externe |
| `recharts` | Donut chart financier (shooting + client) | Stable, composable, React-native, bien documenté |
| `react-select` | Dropdowns stylés | Standard, accessible, hautement customisable |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag-and-drop curseur flux de travail | Moderne, accessible, léger, remplace react-beautiful-dnd |
| `lucide-react` | Icônes (déjà en V1 si pas encore installé) | Sobre, cohérent, 1000+ icônes |

---

## Modifications schéma de données

### Table `shooting` — modifications

**Champ `statut` — nouvel enum :**

```prisma
enum StatutShooting {
  script
  planifie
  tournage
  montage
  revision
  termine
  // en_pause est géré par is_paused, pas dans l'enum statut
}
```

**Nouveaux champs :**

```prisma
model Shooting {
  // ... champs existants ...
  statut              StatutShooting     @default(script)
  is_paused           Boolean            @default(false)
  statut_avant_pause  StatutShooting?    // null si pas en pause
  // ... reste inchangé ...
}
```

**Migration :**
- Renommer les valeurs existantes pour correspondre au nouvel enum
- `planifie` existant → `planifie` (inchangé)
- `en_cours` → `tournage`
- `termine` → `termine` (inchangé)
- `annule` → `termine` pour V2 (décision simplificatrice — un statut annulé sera géré en V3 si besoin)

> Note : la migration Prisma doit inclure un script SQL de data migration pour convertir les valeurs existantes avant de renommer l'enum.

**Table `client` — ajout :**
```prisma
model Client {
  // ... champs existants ...
  site_web  String?
}
```

### DBML mis à jour (delta V2)

```dbml
Table shooting {
  // champs existants +
  is_paused boolean [default: false]
  statut_avant_pause varchar [null, note: 'enum StatutShooting — mémorise étape avant pause']
}

Table client {
  // champs existants +
  site_web varchar [null]
}
```

---

## Composants réutilisables — Ajouts V2

Créés une seule fois, utilisés sur tous les écrans concernés.

```
frontend/src/
├── components/ui/
│   ├── ContactLink.tsx         # Lien cliquable contextuel (tel, email, web, adresse)
│   ├── DonutChart.tsx          # Donut chart financier (Recharts) — marge/coûts/bénéfice
│   ├── InfoDetailBlock.tsx     # Zone "visuel type info détail" (nom grand + grille droite)
│   ├── WorkflowBar.tsx         # Rendu pur du flux de travail — logique dans useWorkflow
│   ├── CollapsibleTable.tsx    # Table avec header cliquable et contenu collapse
│   ├── SelectInput.tsx         # Wrapper React Select stylé aux couleurs Markyn
│   └── AppShell.tsx            # Layout global (topbar + sidebar + contenu)
├── hooks/
│   ├── useWorkflow.ts          # Logique drag-and-drop + pause — mutations TanStack Query
│   └── useKpi.ts               # Hook générique KPI (shooting ou client) — données formatées
└── utils/
    └── format.ts               # formatDuration(min) → "X h YY min", formatCurrency(n) → "1 200 €"
```

### Séparation responsabilités — règles strictes

- **`WorkflowBar`** : rendu visuel uniquement — reçoit `statut`, `isPaused`, handlers en props
- **`useWorkflow(shootingId)`** : toute la logique — drag end, appel API, mutation optimiste, toggle pause
- **`DonutChart`** : rendu visuel uniquement — reçoit `margeBrute`, `couts`, `benefice` en props
- **`useKpi(type, id)`** : fetch + calcul formaté — retourne `{ margeBrute, couts, benefice, dureeHeures, ... }`

---

## Identité visuelle & Tokens de design

### Palette — définie UNE SEULE FOIS dans `tailwind.config.js`

```javascript
// tailwind.config.js
extend: {
  colors: {
    primary:  '#314044',   // bg-primary, text-primary
    accent:   '#4cc5c4',   // bg-accent, text-accent
    light:    '#e1e2e3',   // bg-light
    pause:    '#f59e0b',   // text-pause, bg-pause
    danger:   '#ef4444',   // text-danger (bénéfice négatif)
  },
  fontFamily: {
    syne: ['Syne', 'sans-serif'],
  }
}
```

**Règle absolue** : jamais de couleur Markyn hardcodée dans le JSX (`style={{ color: '#4cc5c4' }}`). Toujours utiliser les classes Tailwind (`text-accent`, `bg-primary`, etc.). Un seul endroit à modifier si la charte change.

### Tokens CSS complémentaires (dans `index.css`)

```css
:root {
  --color-primary: #314044;
  --color-accent:  #4cc5c4;
  --color-light:   #e1e2e3;
  --color-pause:   #f59e0b;
}
```

### Typographie

| Usage | Classe Tailwind | Police | Taille | Poids |
|---|---|---|---|---|
| Nom app "Markyn" | `font-syne font-bold` | Syne | 24px topbar / 48px home | 700 |
| Grands noms info détail | `font-syne font-bold` | Syne | 48–64px | 700 |
| Corps texte | `font-sans` | Inter/système | 14–16px | 400/500 |
| Labels | `font-sans font-medium text-xs` | Inter | 12px | 500 |

---

## Layout global — AppShell

### Topbar (fixe, fond `#314044`)

- **Gauche** : logo `logo-app-no-background.png` — affiché uniquement quand sidebar repliée
- **Centre** : nom "**Markyn**" en Syne 700, couleur blanche
- **Droite** : bouton Home — rond, fond `#4cc5c4`, icône maison blanche (Lucide `Home`), pas de texte

### Sidebar verticale (fond `#4cc5c4`)

**État déplié :**
- Logo `logo-full-main-no-slogan-no-background.png` en haut
- Items de navigation : icône + label, texte blanc
- Item actif : fond `#314044`, texte et icône blancs, border-radius arrondi
- Icône de repli (chevron gauche) en bas

**État replié :**
- Sidebar masquée, ne prend plus de place
- Bordure verticale de 4px couleur `#4cc5c4` sur tout le côté gauche
- Au centre de cette bordure : languette (rectangle arrondi `#4cc5c4`) avec chevron droit `>` blanc
- Clic sur la languette → déplie la sidebar

**Items navigation (icônes Lucide) :**

| Item | Icône |
|---|---|
| Home | `Home` |
| Vidéastes | `Users` |
| Shootings | `Video` |
| Clients | `Building2` |
| Matériel | `Camera` |

---

## Liens cliquables contextuels — `ContactLink`

Composant `ContactLink` à utiliser **partout** où ces données apparaissent — pages liste ET pages détail.

| Type | Comportement | Attribut HTML |
|---|---|---|
| Téléphone | Ouvre l'app téléphone | `href="tel:+32..."` |
| Email | Ouvre l'app email | `href="mailto:..."` |
| Site web | Ouvre dans nouvel onglet | `href="https://..." target="_blank"` |
| Adresse postale | Ouvre Google Maps | `href="https://maps.google.com/?q=..."` |

**Règles :**
- Toujours afficher l'icône Lucide correspondante à gauche de la valeur (`Phone`, `Mail`, `Globe`, `MapPin`)
- Style : texte couleur `#4cc5c4`, underline au hover, curseur pointer
- Si la valeur est vide/null : ne pas rendre le composant (null)

---

## Dropdowns — `SelectInput`

Remplacer tous les `<select>` natifs par le composant `SelectInput` (wrapper React Select).

**Style React Select customisé :**
- Fond : blanc
- Bordure : `1px solid #314044`, border-radius 6px
- Option sélectionnée : fond `#4cc5c4`, texte blanc
- Option hover : fond `#e1e2e3`
- Placeholder : gris clair
- Flèche : couleur `#314044`

---

## Écran Home (`/`) — Animation intro

### Comportement

- **Une seule fois par session** (flag `sessionStorage.getItem('intro_seen')`)
- Si intro déjà vue dans la session → affichage direct sans animation

### Séquence d'animation (Framer Motion)

```
1. Fond blanc plein écran
2. Logo `logo-full-slogan-no-background.png` fade in + slide up (0.6s, ease-out) — centré
3. Pause 0.8s
4. Logo + slogan fade out (0.4s)
5. Contenu home (cards + sidebar + topbar) fade in (0.5s)
6. sessionStorage.setItem('intro_seen', 'true')
```

### Contenu home (après animation)

- Cards de navigation vers les 4 écrans (Vidéastes, Shootings, Clients, Matériel)
- Logo `logo-full-main-no-slogan-no-background.png` + nom "Markyn" en Syne centré
- Bouton "Réinitialiser la base" + Bouton "Charger le jeu de données"

---

## "Visuel type info détail" — `InfoDetailBlock`

Composant réutilisable sur toutes les pages détail (Vidéaste, Shooting, Client, Matériel).

### Layout

```
┌──────────────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │  Fond #314044   │  │  Grille 2 colonnes        │  │
│  │                 │  │  Label  │  Valeur          │  │
│  │  Prénom         │  │  ───────────────────────  │  │
│  │  NOM            │  │  Label  │  Valeur          │  │
│  │  (Syne 700      │  │  ───────────────────────  │  │
│  │   blanc, 48px+) │  │  Label  │  Valeur          │  │
│  │                 │  │  ───────────────────────  │  │
│  │  Badge statut   │  │  Label  │  Valeur          │  │
│  └─────────────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Zone gauche (fond `#314044`) :**
- Prénom en Syne 400 blanc 20px
- NOM en Syne 700 blanc 52px
- Badge statut en dessous

**Zone droite (fond blanc/clair) :**
- Grille 2 colonnes : label (`#314044` 12px uppercase letterspacing) | valeur (16px `#314044`)
- Séparateur fin `#e1e2e3` entre chaque ligne
- Les valeurs de type contact utilisent `ContactLink`
- Bouton "Modifier" en haut à droite de cette zone

**Props du composant :**
```typescript
interface InfoDetailBlockProps {
  name: string           // Nom affiché en grand (NOM)
  subname?: string       // Prénom ou sous-titre
  badge?: ReactNode      // Badge statut
  fields: {
    label: string
    value: string | null
    type?: 'text' | 'tel' | 'email' | 'web' | 'address'
  }[]
  onEdit: () => void
}
```

---

## Flux de travail shooting — `WorkflowBar`

### Étapes

```
Script → Planifié → Tournage → Montage → Révision → Terminé
```

### Icônes par étape (Lucide React)

| Étape | Icône |
|---|---|
| Script | `FileText` |
| Planifié | `Calendar` |
| Tournage | `Video` |
| Montage | `Scissors` |
| Révision | `Eye` |
| Terminé | `CheckCircle` |

### États visuels par étape

| État | Icône | Label | Fond icône |
|---|---|---|---|
| Terminée | Couleur `#314044` | `#314044` | Cercle `#e1e2e3` |
| En cours | Couleur `#4cc5c4` | `#4cc5c4` bold | Cercle `#4cc5c4` opacité 20% |
| Future | Couleur `#e1e2e3` | `#e1e2e3` | Cercle `#e1e2e3` |
| En pause (toutes jusqu'à en cours) | Couleur `#f59e0b` | `#f59e0b` | Cercle `#f59e0b` opacité 20% |

### Layout WorkflowBar

```
[Icône]  [Icône]  [Icône]  [Icône]  [Icône]  [Icône]
Script  Planifié  Tournage  Montage  Révision  Terminé
  │        │         │        │         │        │
──┼────────┼─────────┼────────┼─────────┼────────┼──
  ╿        ╿         ╿        ╿         ╿        ╿
              ●  (curseur drag-and-drop)
           ⏸  (bouton pause — discret, Syne 300, gris)
```

**Ligne horizontale :**
- Fine ligne `#e1e2e3`
- Petits crampons verticaux (`|`) sous chaque étape
- Boule `#4cc5c4` draggable horizontalement — se snappe sous l'étape la plus proche au release

**Comportement drag-and-drop (@dnd-kit) — géré par `useWorkflow` :**
- Drag horizontal uniquement (contrainte axe X)
- Snap sur la position de l'étape la plus proche au release
- Au release : mutation `PUT /api/shootings/:id` avec `{ statut: nouvelleEtape }` — pas de confirmation
- Mise à jour optimiste du visuel (TanStack Query `onMutate`)
- `WorkflowBar` reçoit `onStatutChange(statut)` et `onTogglePause()` en props — pas de logique interne

**Hook `useWorkflow(shootingId)` — source unique de logique :**
```typescript
// frontend/src/hooks/useWorkflow.ts
export function useWorkflow(shootingId: number) {
  // mutation changement statut
  // mutation toggle pause (mémorise statut_avant_pause)
  // état local optimiste
  return { statut, isPaused, onStatutChange, onTogglePause }
}
```

**Bouton pause :**
- Texte `⏸ pause` en Syne 300, 12px, gris clair (`#9ca3af`)
- Centré sous la boule draggable
- Au clic :
  - Si `is_paused = false` : API `PUT /api/shootings/:id` avec `{ is_paused: true, statut_avant_pause: statut_actuel }`
  - Si `is_paused = true` : API `PUT /api/shootings/:id` avec `{ is_paused: false, statut: statut_avant_pause, statut_avant_pause: null }`
  - Texte devient `▶ reprendre` quand en pause

**Affichage "EN PAUSE" :**
- Tag discret `EN PAUSE` en orange `#f59e0b`, Syne 300 italic, affiché à droite du nom du shooting dans le bloc infos

---

## Donut chart financier — `DonutChart`

Composant Recharts réutilisé sur détail shooting ET détail client.

### Structure visuelle

```
        Marge brute
        1 200 €
       ╭─────────╮
      ╱  Coûts    ╲
     │   400 €  ● │
      ╲  Bénéf.  ╱
       ╰─ 800 € ─╯
```

- **Arc extérieur complet** = Marge brute (label + montant en haut à droite ou au centre selon espace)
- **Portion 1** = Coûts — couleur `#314044`
- **Portion 2** = Bénéfice net — couleur `#4cc5c4`
- **Centre du donut** : montant bénéfice net en grand + label "bénéfice" en petit
- Tooltip au hover : label + montant + pourcentage
- Si bénéfice négatif : portion coûts prend tout le donut, couleur rouge `#ef4444`

### Props

```typescript
interface DonutChartProps {
  margeBrute: number    // = duree/60 * taux_horaire_client
  couts: number         // = Σ(duree/60 * taux_horaire_videaste)
  benefice: number      // = margeBrute - couts
  currency?: string     // défaut '€'
}
```

---

## Données connectées — Calculs réels

### Utilitaire backend — `calculateShootingKpi` (factorisé)

Fonction pure définie **une seule fois** dans `backend/src/utils/kpi.ts`, appelée par les deux services (shooting ET client). Ne jamais dupliquer ce calcul.

```typescript
// backend/src/utils/kpi.ts
export function calculateShootingKpi(shooting: {
  duree: number
  taux_horaire_client: Prisma.Decimal
  videastes: { taux_horaire_videaste: Prisma.Decimal }[]
}) {
  const duree_heures = shooting.duree / 60.0
  const marge_brute  = duree_heures * Number(shooting.taux_horaire_client)
  const couts        = shooting.videastes.reduce(
    (acc, sv) => acc + duree_heures * Number(sv.taux_horaire_videaste), 0
  )
  return {
    duree_heures: Math.round(duree_heures * 100) / 100,
    marge_brute:  Math.round(marge_brute  * 100) / 100,
    couts:        Math.round(couts        * 100) / 100,
    benefice_net: Math.round((marge_brute - couts) * 100) / 100,
  }
}
```

Utilisée dans `shootings.service.ts` pour le détail d'un shooting, et dans `clients.service.ts` via `shootings.map(calculateShootingKpi)` pour agréger les KPI client.

### Utilitaire frontend — `format.ts` (factorisé)

```typescript
// frontend/src/utils/format.ts
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} h ${String(m).padStart(2, '0')} min` : `${h} h`
}

export function formatCurrency(amount: number, currency = '€'): string {
  return `${new Intl.NumberFormat('fr-BE').format(amount)} ${currency}`
}
```

Ces fonctions sont importées depuis `utils/format.ts` partout où la durée ou un montant est affiché — jamais calculé inline dans un composant.

### Détail Shooting — réponse API enrichie

`GET /api/shootings/:id` retourne :

```typescript
{
  ...shooting,
  kpi: calculateShootingKpi(shooting)  // calculé par l'utilitaire
}
```

### Détail Client — réponse API enrichie

`GET /api/clients/:id` retourne :

```typescript
{
  ...client,
  kpi: {
    nb_shootings:        shootings.length,
    duree_totale_heures: shootings.reduce((a, s) => a + s.duree, 0) / 60.0,
    marge_brute_totale:  shootings.reduce((a, s) => a + calculateShootingKpi(s).marge_brute, 0),
    couts_totaux:        shootings.reduce((a, s) => a + calculateShootingKpi(s).couts, 0),
    benefice_total:      shootings.reduce((a, s) => a + calculateShootingKpi(s).benefice_net, 0),
  }
}
```

---

## Pages — Modifications détaillées

---

### Écran Détail Vidéaste (`/videastes/:id`)

**Zone infos :** `InfoDetailBlock` avec :
- Gauche : prénom + NOM en grand + badge statut
- Droite : Email (`ContactLink`), Téléphone (`ContactLink`), Taux horaire, Statut

**Ordre des blocs :**
1. `InfoDetailBlock` (infos vidéaste)
2. Table Shootings — **avant** table Matériel
3. Table Matériel — **en mode collapse** par défaut
   - Header visible : "Matériel" + nombre d'items + chevron `▼`
   - Clic header → déplie/replie le contenu
   - Composant `CollapsibleTable`

---

### Écran Détail Shooting (`/shootings/:id`)

**Ordre des blocs :**
1. `WorkflowBar` (flux de travail interactif, pleine largeur)
2. `InfoDetailBlock` — champs : Nom, Client (cliquable), Lieu, Date, Durée, Statut, Taux horaire client
   - Badge "EN PAUSE" orange si `is_paused = true`
3. Table Vidéastes du shooting
4. `DonutChart` + carte durée — données réelles via `kpi`

**Carte durée :**
- Simple card sobre : icône `Clock` + valeur `X h YY min` + label "Durée du shooting"

---

### Écran Détail Client (`/clients/:id`)

**Zone infos :** `InfoDetailBlock` avec :
- Gauche : NOM en grand (nom légal en dessous, plus petit)
- Droite : Email (`ContactLink`), Téléphone (`ContactLink`), Site web (`ContactLink`), Adresse (`ContactLink`), N° TVA, Domaine métier, Date création

**Ordre des blocs :**
1. `InfoDetailBlock`
2. Table Shootings
3. `DonutChart` + card nb shootings + card durée totale — données réelles via `kpi`

---

### Écran Détail Matériel (`/materiels/:id`)

**Zone infos :** `InfoDetailBlock` avec :
- Gauche : NOM en grand + catégorie en badge
- Droite : Catégorie, Nombre de vidéastes liés

---

### Pages Liste — Liens cliquables

Sur toutes les pages liste, les colonnes email, téléphone, adresse, site web utilisent `ContactLink`.

---

## UX/UI — Principes et détails complémentaires

### Transitions de navigation (Framer Motion)

Toutes les transitions entre pages utilisent un fade léger (0.2s) via le composant `AppShell`. Pas d'animation lourde — juste assez pour que la navigation paraisse fluide.

```tsx
// Wrapper page dans AppShell
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

### États de chargement — Skeletons

Chaque bloc qui charge des données affiche un skeleton (pas un spinner) — la structure de la page reste stable, seul le contenu est masqué. Évite le layout shift.

| Composant | Skeleton |
|---|---|
| `InfoDetailBlock` | Rectangle gris gauche + lignes grises droite |
| `DonutChart` | Cercle gris |
| `WorkflowBar` | Ligne grise avec 6 cercles |
| Tables | 3–5 lignes grises |

Utiliser des classes Tailwind `animate-pulse bg-light rounded` — pas de librairie supplémentaire.

### Micro-interactions

| Élément | Micro-interaction |
|---|---|
| Bouton Home rond | Scale 0.95 au clic (`active:scale-95`) |
| Items sidebar | Slide léger au hover (`transition-all duration-150`) |
| Boule workflow drag | Shadow portée au drag, scale 1.1 (`whileDrag` Framer Motion) |
| Lignes de table | Fond `#e1e2e3` au hover (`hover:bg-light`) |
| Badges statut | Pas d'animation — statique pour lisibilité |
| `ContactLink` | Underline slide au hover (CSS `transition`) |

### Feedback utilisateur — mutations

Après chaque opération CRUD, un feedback discret confirme l'action :
- **Succès** : toast vert discret en bas à droite, 2s, disparaît seul
- **Erreur** : toast rouge, message court, bouton fermer
- Composant `Toast` minimaliste — pas de librairie externe, 20 lignes max

### Accessibilité minimale

- `aria-label` sur le bouton Home rond (pas de texte visible)
- `aria-label` sur le bouton pause du workflow
- `role="navigation"` sur la sidebar
- Focus visible sur tous les éléments interactifs (outline `#4cc5c4`)
- `title` sur les `ContactLink` (tooltip natif au hover)

### Responsive — règles minimales V2

L'app est pensée desktop (usage interne agence). En V2 :
- Largeur minimum supportée : 1024px
- `WorkflowBar` : scroll horizontal sur écrans < 900px plutôt que compression
- `InfoDetailBlock` : passe en colonne unique sous 768px
- Pas de mobile-first — ajouté en version ultérieure si besoin

---

### Types TypeScript — ajouts V2

À ajouter dans `frontend/src/types/index.ts` (source unique) :

```typescript
export type StatutShooting = 'script' | 'planifie' | 'tournage' | 'montage' | 'revision' | 'termine'

export interface ShootingKpi {
  duree_heures:  number
  marge_brute:   number
  couts:         number
  benefice_net:  number
}

export interface ClientKpi {
  nb_shootings:        number
  duree_totale_heures: number
  marge_brute_totale:  number
  couts_totaux:        number
  benefice_total:      number
}

// Extension de Shooting existant
export interface ShootingDetail extends Shooting {
  is_paused:          boolean
  statut_avant_pause: StatutShooting | null
  kpi:                ShootingKpi
}

export interface ClientDetail extends Client {
  site_web?: string
  kpi:       ClientKpi
}
```

### Constantes workflow — extensibles

Les étapes du workflow sont définies **une seule fois** dans `frontend/src/constants/workflow.ts`. Si on ajoute une étape en V3, on modifie uniquement ce fichier.

```typescript
// frontend/src/constants/workflow.ts
import { FileText, Calendar, Video, Scissors, Eye, CheckCircle } from 'lucide-react'
import type { StatutShooting } from '../types'

export const WORKFLOW_STEPS: {
  statut:  StatutShooting
  label:   string
  icon:    React.ComponentType
}[] = [
  { statut: 'script',    label: 'Script',    icon: FileText    },
  { statut: 'planifie',  label: 'Planifié',  icon: Calendar    },
  { statut: 'tournage',  label: 'Tournage',  icon: Video       },
  { statut: 'montage',   label: 'Montage',   icon: Scissors    },
  { statut: 'revision',  label: 'Révision',  icon: Eye         },
  { statut: 'termine',   label: 'Terminé',   icon: CheckCircle },
]
```

`WorkflowBar` itère sur `WORKFLOW_STEPS` — jamais de tableau hardcodé dans le composant.

### Error Boundary — gestion des erreurs rendering

Ajouter un `ErrorBoundary` React autour des composants critiques (DonutChart, WorkflowBar) pour éviter qu'une erreur de rendu fasse crasher toute la page.

```typescript
// frontend/src/components/ui/ErrorBoundary.tsx
// Composant class React standard — affiche un fallback sobre si le rendu enfant échoue
```

Usage :
```tsx
<ErrorBoundary fallback={<p>Erreur d'affichage</p>}>
  <DonutChart ... />
</ErrorBoundary>
```

### Règles d'évolution future

| Évolution probable | Préparation en V2 |
|---|---|
| Ajouter une étape au workflow | Modifier uniquement `WORKFLOW_STEPS` dans `constants/workflow.ts` |
| Changer la charte graphique | Modifier uniquement `tailwind.config.js` |
| Ajouter un nouveau KPI | Étendre `calculateShootingKpi` dans `utils/kpi.ts` + type `ShootingKpi` |
| Ajouter un nouveau type de lien contact | Ajouter un case dans `ContactLink` |
| Changer la librairie de charts | Remplacer uniquement `DonutChart.tsx` — les props restent identiques |
| Ajouter un nouveau champ client | Migration Prisma + `ClientDetail` type + `InfoDetailBlock` fields |

---

| Méthode | Route | Modification |
|---|---|---|
| GET | `/api/shootings/:id` | Ajouter calcul `kpi` dans la réponse |
| GET | `/api/clients/:id` | Ajouter calcul `kpi` dans la réponse |
| PUT | `/api/shootings/:id` | Gérer `is_paused` + `statut_avant_pause` en transaction atomique |
| GET | `/api/shootings` | Inclure `is_paused` dans la liste |
| GET | `/api/clients` | Inclure `site_web` dans la liste |
| POST | `/api/clients` | Accepter `site_web` |
| PUT | `/api/clients/:id` | Accepter `site_web` |

### Transaction pause (atomique)

```typescript
// Mise en pause
await prisma.$transaction([
  prisma.shooting.update({
    where: { id },
    data: {
      is_paused: true,
      statut_avant_pause: shooting.statut
    }
  })
])

// Reprise
await prisma.$transaction([
  prisma.shooting.update({
    where: { id },
    data: {
      is_paused: false,
      statut: shooting.statut_avant_pause,
      statut_avant_pause: null
    }
  })
])
```

---

## Migration BDD V2

```prisma
// Nouveau enum StatutShooting
enum StatutShooting {
  script
  planifie
  tournage
  montage
  revision
  termine
}

// Ajouts sur Shooting
model Shooting {
  // ...
  is_paused           Boolean        @default(false)
  statut_avant_pause  StatutShooting?
}

// Ajout sur Client
model Client {
  // ...
  site_web  String?
}
```

Migration Prisma :
```bash
npx prisma migrate dev --name v2_workflow_pause_client_siteweb
```

Seed à mettre à jour :
- Ajouter `site_web` sur les clients de test
- Ajouter `is_paused: false` par défaut sur les shootings existants
- Répartir les shootings sur les 6 nouveaux statuts

---

## Phases de développement & checklists

> **Enrichissement (analyse du code V1 — juin 2026)** : chaque phase ci-dessous est précédée d'un bloc **Fichiers impactés** (chemins exacts, création/évolution/suppression) et **Git** (message de commit). Décision de migration retenue : **reset + reseed** (comme V1) — voir Phase 0.

---

### Phase 0 — Dépendances & préparation branche

**Git :** `git checkout -b feature/v2` (avant toute modif) ; committer ce doc enrichi : `git add documents/v2_requirements.md` puis `git commit -m "docs: enrichissement plan V2"`.

**Packages à installer (frontend uniquement — backend = 0 nouvelle dépendance) :**
```powershell
cd C:\dev\kyn\platform_market\frontend
npm install framer-motion recharts react-select @dnd-kit/core @dnd-kit/modifiers lucide-react
```

> - `@dnd-kit/modifiers` (`restrictToHorizontalAxis`) remplace `@dnd-kit/sortable` du tableau de deps : un curseur unique qui se snappe sur 6 positions n'a pas besoin de `sortable`.
> - `lucide-react` n'était **pas** installé en V1 (la V1 utilise des emojis).
> - **Migration enum (décision)** : stratégie **reset + reseed**. L'item « script SQL de data migration » de la Phase 1 devient **N/A** — la base dev est réinitialisée puis repeuplée par le seed V2. Le garde-fou IA de Prisma exigera `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` (déjà rencontré en V1).

**Critère Done :** branche `feature/v2` active, doc enrichi commité, 6 packages installés sans erreur.

---

### Phase 1 — Migration schéma V2

**Fichiers impactés :**
- `backend/prisma/schema.prisma` — *(évolution)* enum `StatutShooting` → 6 valeurs ; `Shooting.is_paused` + `Shooting.statut_avant_pause` ; `Client.site_web`
- `backend/prisma/migrations/<timestamp>_v2_workflow_pause_client_siteweb/` — *(création)* via `prisma migrate dev`
- `backend/src/lib/seed.ts` — *(évolution)* statuts remappés (`en_cours`→`tournage`, `annule`→`termine`, répartition sur 6) + `site_web` clients + `is_paused`

**Git :** `git add .` puis `git commit -m "feat: schema V2 — workflow 6 etapes, pause, site_web client"`

- [ ] Mettre à jour l'enum `StatutShooting` (ajouter `script`, `revision` ; renommer `en_cours` → `tournage`, `annule` → `termine`)
- [ ] Inclure un script SQL de data migration dans la migration Prisma (convertir les valeurs existantes avant rename de l'enum)
- [ ] Ajouter `is_paused` et `statut_avant_pause` sur `Shooting`
- [ ] Ajouter `site_web` sur `Client`
- [ ] Générer et appliquer la migration (`npx prisma migrate dev --name v2_workflow_pause_client_siteweb`)
- [ ] Mettre à jour le seed : nouveaux statuts, `site_web`, `is_paused`
- [ ] Vérifier dans pgAdmin
- [ ] Commit : `feat: schema V2 — workflow 6 etapes, pause, site_web client`

**Critère Done :** migration appliquée, seed exécuté sans erreur.

---

### Phase 2 — Backend API V2

**Fichiers impactés :**
- `backend/src/utils/kpi.ts` — *(création)* `calculateShootingKpi()` pur, factorisé (appelé par shootings ET clients)
- `backend/src/services/shootings.service.ts` — *(évolution)* `findById` → `{ ...shooting, kpi }` ; `update` gère `is_paused`/`statut_avant_pause` en **transaction atomique**
- `backend/src/services/clients.service.ts` — *(évolution)* `findById` → `{ ...client, kpi }` agrégé via `calculateShootingKpi`
- `backend/src/schemas/shooting.schema.ts` — *(évolution)* enum 6 valeurs + `is_paused`/`statut_avant_pause`
- `backend/src/schemas/client.schema.ts` — *(évolution)* `site_web`

**Effet de bord :** `ShootingsService.update` doit distinguer « pause/reprise » (lit l'état courant, transaction) de la MAJ normale. Les controllers restent inchangés (thin, passent `req.body`).

**Git :** `git add .` puis `git commit -m "feat: backend V2 — KPI reels, pause transaction, site_web"`

- [ ] `GET /api/shootings/:id` — calcul KPI réel (`duree_heures`, `marge_brute`, `couts`, `benefice_net`)
- [ ] `GET /api/clients/:id` — calcul KPI réel agrégé sur tous les shootings du client
- [ ] `PUT /api/shootings/:id` — gérer `is_paused` et `statut_avant_pause` en transaction atomique
- [ ] Ajouter `site_web` dans les routes client (GET liste, GET détail, POST, PUT)
- [ ] Valider les nouveaux champs dans les schémas Zod
- [ ] Tests des routes modifiées
- [ ] Commit : `feat: backend V2 — KPI reels, pause transaction, site_web`

**Critère Done :** KPI retournés correctement, transaction pause atomique vérifiée.

---

### Phase 3 — Nouvelles dépendances & tokens

**Fichiers impactés :**
- `frontend/package.json` — *(évolution)* dépendances (déjà installées en Phase 0)
- `frontend/tailwind.config.js` — *(évolution)* tokens `primary/accent/light/pause/danger` + `fontFamily.syne` (remplace `kyn.*`)
- `frontend/src/index.css` — *(évolution)* variables `:root` + font Syne/Inter + focus accent
- `frontend/index.html` — *(évolution)* `<link>` Google Fonts (Syne + Inter)
- **Renommage global `kyn-*` → tokens** — *(évolution, 62 occurrences / 18 fichiers)* : tous `components/ui/*`, `components/Layout.tsx`, `components/BackButton.tsx`, `components/forms/fields.tsx`, 4 pages détail, `Home.tsx`

**Effet de bord :** un `kyn-*` oublié = classe Tailwind silencieusement inexistante (aucune erreur de build) → contrôle obligatoire `grep -r "kyn-" frontend/src` = 0.

**Git :** `git add .` puis `git commit -m "chore: dependances V2 et tokens design"`

- [ ] Installer `framer-motion`, `recharts`, `react-select`, `@dnd-kit/core`, `@dnd-kit/sortable`
- [ ] Installer/vérifier `lucide-react`
- [ ] Configurer la police Syne dans `index.html` (Google Fonts)
- [ ] Définir les tokens CSS dans `index.css` ou `tailwind.config.js`
- [ ] Commit : `chore: dependances V2 et tokens design`

**Critère Done :** toutes les librairies importables sans erreur.

---

### Phase 4 — Composants UI réutilisables V2

**Fichiers impactés (création sauf mention) :**
- `frontend/src/constants/workflow.ts`, `frontend/src/utils/format.ts`
- `frontend/src/types/index.ts` *(évolution)* — `StatutShooting`, `ShootingKpi`, `ClientKpi`, MAJ `Shooting`/`Client`/`ShootingDetail`/`ClientDetail`
- `frontend/src/components/ui/` : `ContactLink`, `SelectInput`, `InfoDetailBlock`, `DonutChart`, `CollapsibleTable`, `WorkflowBar`, `AppShell`, `ErrorBoundary`, `Toast`, `Skeletons`
- `frontend/src/hooks/` : `useWorkflow`, `useKpi`, `useToast`
- `frontend/src/utils.ts` *(suppression)* — `formatDate` déplacé dans `utils/format.ts` (MAJ des 4 imports `../../utils`)

**Effet de bord :** `WorkflowBar` = rendu pur (props), `useWorkflow` = toute la logique drag/pause ; `DonutChart` = rendu pur, `useKpi` = données formatées.

**Git :** `git add .` puis `git commit -m "feat: composants UI V2"`

- [ ] `constants/workflow.ts` — `WORKFLOW_STEPS` array (source unique des étapes)
- [ ] Types V2 dans `types/index.ts` — `StatutShooting`, `ShootingKpi`, `ClientKpi`, `ShootingDetail`, `ClientDetail`
- [ ] `ErrorBoundary` — composant class React pour DonutChart et WorkflowBar
- [ ] `utils/kpi.ts` — `calculateShootingKpi` (backend)
- [ ] `ContactLink` — liens contextuels (tel, email, web, adresse)
- [ ] `SelectInput` — wrapper React Select stylé Markyn
- [ ] `InfoDetailBlock` — zone info détail (nom grand + grille)
- [ ] `DonutChart` — donut Recharts, rendu pur (props seulement)
- [ ] `CollapsibleTable` — table avec header collapse
- [ ] `useWorkflow(shootingId)` — logique drag-and-drop + pause
- [ ] `WorkflowBar` — rendu pur, reçoit handlers de `useWorkflow`
- [ ] `useKpi(type, id)` — hook générique KPI formatés
- [ ] `AppShell` — layout global topbar + sidebar
- [ ] `Toast` — composant feedback succès/erreur (discret, 2s, bas droite)
- [ ] Skeletons définis pour `InfoDetailBlock`, `DonutChart`, `WorkflowBar`, tables
- [ ] `aria-label` sur bouton Home, bouton pause workflow, sidebar
- [ ] Vérifier qu'aucun composant ne contient de couleur Markyn hardcodée — uniquement classes Tailwind
- [ ] Commit : `feat: composants UI V2`

**Critère Done :** composants compilent, `useWorkflow` et `useKpi` testables, aucun `#314044` ou `#4cc5c4` dans le JSX.

---

### Phase 5 — Layout global & Navigation

**Fichiers impactés :**
- `frontend/src/components/ui/AppShell.tsx` *(création)* + `frontend/src/components/ui/Sidebar.tsx` *(évolution → lucide, fond accent, languette repliée 4px)*
- `frontend/src/components/Layout.tsx` *(suppression — remplacé par AppShell)*
- `frontend/src/App.tsx` *(évolution)* — route layout `Layout` → `AppShell`
- `frontend/src/main.tsx` *(évolution)* — wrap `ToastProvider` (+ ErrorBoundary global éventuel)
- `frontend/src/components/forms/*` (4) + `frontend/src/components/ui/DataTable.tsx` *(évolution)* — `<select>` natif → `SelectInput` (8 fichiers au total avec les modals de liaison des pages détail)

**Git :** `git add .` puis `git commit -m "feat: layout global V2 — topbar, sidebar, navigation"`

- [ ] Topbar : fond `#314044`, logo app (si sidebar repliée), "Markyn" Syne centré, bouton home rond
- [ ] Sidebar : fond `#4cc5c4`, items avec icônes Lucide, item actif fond `#314044`
- [ ] Sidebar repliée : bordure 4px `#4cc5c4` + languette centrée avec chevron
- [ ] Logo dans topbar visible uniquement quand sidebar repliée
- [ ] `SelectInput` remplace tous les `<select>` natifs dans les formulaires
- [ ] Commit : `feat: layout global V2 — topbar, sidebar, navigation`

**Critère Done :** navigation fluide, sidebar dépliée/repliée fonctionnelle, logo et nom corrects.

---

### Phase 6 — Écran Home — Animation intro

**Fichiers impactés :**
- `frontend/src/pages/Home.tsx` *(évolution)* — séquence Framer Motion + flag `sessionStorage('intro_seen')` ; conserve cards + boutons seed/reset (`useSeed`)

**Git :** `git add .` puis `git commit -m "feat: home animation intro"`

- [ ] Séquence Framer Motion : fond blanc → logo+slogan fade in slide up → pause → fade out → contenu
- [ ] Flag `sessionStorage` — animation une seule fois par session
- [ ] Contenu home : cards navigation + logo Markyn Syne + boutons seed/reset
- [ ] Commit : `feat: home animation intro`

**Critère Done :** animation jouée une fois, contenu affiché correctement après.

---

### Phase 7 — Pages Détail

**Fichiers impactés (tous évolution) :**
- `frontend/src/pages/videastes/VideasteDetail.tsx` — `InfoDetailBlock` + ordre (shootings **avant** matériel) + `CollapsibleTable` matériel + `ContactLink`
- `frontend/src/pages/shootings/ShootingDetail.tsx` — `WorkflowBar`+`useWorkflow` + `InfoDetailBlock` + `DonutChart` + carte durée (kpi réel) + badge EN PAUSE ; **supprime** les constantes KPI hardcodées + l'ancienne WorkflowBar inline
- `frontend/src/pages/clients/ClientDetail.tsx` — `InfoDetailBlock` (+`site_web` via `ContactLink`) + `DonutChart` + cartes (kpi réel) ; supprime KPI hardcodés
- `frontend/src/pages/materiels/MaterielDetail.tsx` — `InfoDetailBlock`
- `frontend/src/pages/*/<Entity>List.tsx` (4) — `ContactLink` sur colonnes email/tel/web/adresse ; `ShootingsList` statut 6 ; `ClientsList` colonne `site_web`

**Effet de bord :** les pages détail doivent gérer `kpi` absent pendant le chargement → skeleton.

**Git :** `git add .` puis `git commit -m "feat: pages detail V2 — InfoDetailBlock, DonutChart, WorkflowBar"`

- [ ] Détail Vidéaste : `InfoDetailBlock` + ordre blocs (shootings avant matériel) + `CollapsibleTable` matériel
- [ ] Détail Shooting : `WorkflowBar` + `InfoDetailBlock` + `DonutChart` + carte durée — données réelles
- [ ] Détail Client : `InfoDetailBlock` (avec `site_web`) + `DonutChart` + KPI réels
- [ ] Détail Matériel : `InfoDetailBlock`
- [ ] `ContactLink` sur tous les champs pertinents (email, tel, web, adresse) — liste ET détail
- [ ] Badge "EN PAUSE" orange sur détail shooting si `is_paused = true`
- [ ] Commit : `feat: pages detail V2 — InfoDetailBlock, DonutChart, WorkflowBar`

**Critère Done :** toutes les pages détail affichent les données réelles, workflow interactif fonctionnel.

---

### Phase 8 — Validation finale & Préparation merge

**Fichiers impactés :**
- `README.md` *(évolution)* — dépendances V2 + instructions de lancement
- Contrôles transverses : `npm run typecheck` / `lint` / `format:check` (back & front), `grep -r "kyn-" frontend/src` = 0, preview navigateur

**Git :** `git add .` puis `git commit -m "feat: V2 complete — UX moderne, donnees reelles, workflow interactif"` ; `git push -u origin feature/v2` ; **ne pas merger** (fournir les commandes manuelles).

- [ ] Test transitions navigation — fade entre pages fluide
- [ ] Test skeletons — affichés pendant le chargement, remplacés par les données
- [ ] Test Toast — succès et erreur CRUD affichent le bon message
- [ ] Test micro-interactions — hover table, drag shadow, bouton home scale
- [ ] Test accessibilité minimale — aria-labels présents, focus visible
- [ ] Test drag-and-drop workflow — statut mis à jour en BDD au release
- [ ] Test pause / reprise — transaction atomique, statut mémorisé et restauré
- [ ] Test `ContactLink` — tel ouvre app téléphone, email ouvre app email, adresse ouvre Maps, web ouvre onglet
- [ ] Test DonutChart — données correctes sur shooting et client
- [ ] Test sidebar repliée/dépliée — logo topbar visible/masqué correctement
- [ ] Test `CollapsibleTable` matériel — collapse/expand fonctionnel
- [ ] Test `SelectInput` — tous les dropdowns stylés et fonctionnels
- [ ] ESLint et Prettier sans erreur
- [ ] README mis à jour : nouvelles dépendances V2, instructions
- [ ] Commit final : `feat: V2 complete — UX moderne, donnees reelles, workflow interactif`
- [ ] Push branch `feature/v2`

**Claude Code fournit la commande de merge, ne merge pas lui-même :**
```bash
git checkout main
git merge feature/v2
git push origin main
```

**Critère Done :** tous les tests passent, branch `feature/v2` pushée, commande de merge fournie.

---

*Document de référence V2 — Markyn (platform_market) — Juin 2026*
