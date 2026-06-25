export interface VideasteListItem {
  id: number;
  nom: string;
  prenom: string;
  statut: string;
  taux_horaire: string;
  materiel_entreprise: boolean;
  nombre_shootings: number;
}

export interface Materiel {
  id: number;
  categorie: string;
  nom: string;
}

export interface ShootingItem {
  id: number;
  nom: string;
  lieu: string;
  date: string; // ISO
  duree: number;
  statut: string;
  taux_horaire_client: string;
  taux_horaire_videaste: string;
  client: { id: number; nom: string };
}

export interface VideasteDetail {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: string;
  taux_horaire: string;
  materiel_entreprise: boolean;
  materiels: Materiel[];
  shootings: ShootingItem[];
}
