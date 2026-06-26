import { z } from "zod";

const STATUTS = ["script", "planifie", "tournage", "montage", "revision", "termine"] as const;

export const shootingCreateSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  client_id: z.coerce.number().int().positive().nullable().optional(),
  lieu: z.string().optional().or(z.literal("")),
  date: z.coerce.date(),
  duree: z.coerce.number().int().nonnegative("Durée invalide"),
  statut: z.enum(STATUTS).default("script"),
  is_paused: z.boolean().optional(),
  statut_avant_pause: z.enum(STATUTS).nullable().optional(),
  taux_horaire_client: z.coerce.number().nonnegative("Taux horaire invalide"),
});

export const shootingUpdateSchema = shootingCreateSchema.partial();

// Liaison vidéaste -> shooting : POST /api/shootings/:id/videastes
export const shootingVideasteLinkSchema = z.object({
  videaste_id: z.coerce.number().int().positive(),
  taux_horaire_videaste: z.coerce.number().nonnegative(),
});
