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
  statut: "planifie" | "en_cours" | "termine" | "annule";
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
