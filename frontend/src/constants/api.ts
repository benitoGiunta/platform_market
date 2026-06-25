export const API = {
  VIDEASTES: "/api/videastes",
  SHOOTINGS: "/api/shootings",
  CLIENTS: "/api/clients",
  MATERIELS: "/api/materiels",
  SEED: "/api/seed",
} as const;

export const QUERY_KEYS = {
  VIDEASTES: ["videastes"],
  SHOOTINGS: ["shootings"],
  CLIENTS: ["clients"],
  MATERIELS: ["materiels"],
} as const;

// Clé seed exposée côté frontend (acceptable : boutons dev-only).
export const SEED_KEY = import.meta.env.VITE_SEED_KEY ?? "";
