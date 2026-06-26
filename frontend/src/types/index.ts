export type StatutShooting =
  | "script"
  | "planifie"
  | "tournage"
  | "montage"
  | "revision"
  | "termine";

export interface Videaste {
  id: number;
  nom: string;
  prenom: string;
  email?: string | null;
  telephone?: string | null;
  statut: "actif" | "inactif";
  taux_horaire: number;
  created_at: string;
  updated_at: string;
  _count?: { shootings: number };
}

export interface Client {
  id: number;
  nom: string;
  nom_legal?: string | null;
  adresse?: string | null;
  numero_tva?: string | null;
  domaine_metier?: "Retail" | "Horeca" | "Industrie" | "Services" | null;
  date_creation?: string | null;
  email?: string | null;
  telephone?: string | null;
  site_web?: string | null;
  created_at: string;
  updated_at: string;
  _count?: { shootings: number };
}

export interface Shooting {
  id: number;
  client_id?: number | null;
  nom: string;
  lieu?: string | null;
  date: string;
  duree: number;
  statut: StatutShooting;
  is_paused: boolean;
  statut_avant_pause: StatutShooting | null;
  taux_horaire_client: number;
  created_at: string;
  updated_at: string;
}

export interface Materiel {
  id: number;
  categorie: string;
  nom: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  _count?: { videastes: number };
}

// Shooting tel que renvoyé par la liste (avec client + count vidéastes).
export interface ShootingWithRelations extends Shooting {
  client?: Client | null;
  _count?: { videastes: number };
}

export interface ShootingVideaste {
  shooting_id: number;
  videaste_id: number;
  taux_horaire_videaste: number;
}

export interface MaterielVideaste {
  materiel_id: number;
  videaste_id: number;
}

// ----- KPI (calculés côté backend) -----

export interface ShootingKpi {
  duree_heures: number;
  marge_brute: number;
  couts: number;
  benefice_net: number;
}

export interface ClientKpi {
  nb_shootings: number;
  duree_totale_heures: number;
  marge_brute_totale: number;
  couts_totaux: number;
  benefice_total: number;
}

// ----- Types des écrans détail (matchent les includes Prisma backend) -----

export interface VideasteDetail extends Videaste {
  materiels: { id: number; materiel: Materiel }[];
  shootings: {
    id: number;
    taux_horaire_videaste: number;
    shooting: Shooting & { client?: Client | null };
  }[];
}

export interface ShootingDetail extends Shooting {
  client?: Client | null;
  videastes: { id: number; taux_horaire_videaste: number; videaste: Videaste }[];
  kpi: ShootingKpi;
}

export interface ClientDetail extends Client {
  shootings: (Shooting & { videastes: { id: number; videaste: Videaste }[] })[];
  kpi: ClientKpi;
}

export interface MaterielDetail extends Materiel {
  videastes: { id: number; videaste: Videaste }[];
}
