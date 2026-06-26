// Miroir des enums Prisma — source unique pour dropdowns et badges.
export const STATUT_VIDEASTE = { actif: "Actif", inactif: "Inactif" } as const;

export const STATUT_SHOOTING = {
  script: "Script",
  planifie: "Planifié",
  tournage: "Tournage",
  montage: "Montage",
  revision: "Révision",
  termine: "Terminé",
} as const;

export const CATEGORIE_MATERIEL = {
  camera: "Caméra",
  drone: "Drone",
  trepied: "Trépied",
  stabilisateur: "Stabilisateur",
  eclairage: "Éclairage",
  audio: "Audio",
  autre: "Autre",
  entreprise: "Entreprise",
} as const;

export const DOMAINE_METIER = {
  Retail: "Retail",
  Horeca: "Horeca",
  Industrie: "Industrie",
  Services: "Services",
} as const;
