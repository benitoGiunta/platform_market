import { z } from "zod";

export const materielCreateSchema = z.object({
  categorie: z.enum([
    "camera",
    "drone",
    "trepied",
    "stabilisateur",
    "eclairage",
    "audio",
    "autre",
    "entreprise",
  ]),
  nom: z.string().min(1, "Nom requis"),
});

export const materielUpdateSchema = materielCreateSchema.partial();

// Liaison vidéaste -> matériel : POST /api/materiels/:id/videastes
export const materielVideasteLinkSchema = z.object({
  videaste_id: z.coerce.number().int().positive(),
});
