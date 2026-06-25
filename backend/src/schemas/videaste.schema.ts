import { z } from "zod";

export const videasteCreateSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().optional().or(z.literal("")),
  statut: z.enum(["actif", "inactif"]).default("actif"),
  taux_horaire: z.coerce.number().nonnegative("Taux horaire invalide"),
});

export const videasteUpdateSchema = videasteCreateSchema.partial();

// Liaison matériel -> vidéaste : POST /api/videastes/:id/materiels
export const videasteMaterielLinkSchema = z.object({
  materiel_id: z.coerce.number().int().positive(),
});
