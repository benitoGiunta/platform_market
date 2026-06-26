import { z } from "zod";

export const clientCreateSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  nom_legal: z.string().optional().or(z.literal("")),
  adresse: z.string().optional().or(z.literal("")),
  numero_tva: z.string().optional().or(z.literal("")),
  domaine_metier: z.enum(["Retail", "Horeca", "Industrie", "Services"]).nullable().optional(),
  date_creation: z.coerce.date().nullable().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().optional().or(z.literal("")),
  site_web: z.string().optional().or(z.literal("")),
});

export const clientUpdateSchema = clientCreateSchema.partial();
