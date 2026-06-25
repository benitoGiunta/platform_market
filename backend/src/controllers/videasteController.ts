import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

// GET /api/videastes
// Liste tous les vidéastes (triés par nom) avec le nombre de shootings liés.
export async function listVideastes(_req: Request, res: Response) {
  const videastes = await prisma.videaste.findMany({
    orderBy: { nom: "asc" },
    include: {
      _count: { select: { shootings: true } },
    },
  });

  const result = videastes.map((v) => ({
    id: v.id,
    nom: v.nom,
    prenom: v.prenom,
    statut: v.statut,
    taux_horaire: v.taux_horaire,
    materiel_entreprise: v.materiel_entreprise,
    nombre_shootings: v._count.shootings,
  }));

  res.json(result);
}

// GET /api/videastes/:id
// Détail d'un vidéaste avec son matériel et ses shootings (triés par date décroissante).
export async function getVideaste(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Identifiant invalide" });
  }

  const videaste = await prisma.videaste.findUnique({
    where: { id },
    include: {
      materiels: true,
      shootings: {
        include: {
          shooting: { include: { client: true } },
        },
      },
    },
  });

  if (!videaste) {
    return res.status(404).json({ error: "Vidéaste introuvable" });
  }

  const shootings = videaste.shootings
    .map((sv) => ({
      id: sv.shooting.id,
      nom: sv.shooting.nom,
      lieu: sv.shooting.lieu,
      date: sv.shooting.date,
      duree: sv.shooting.duree,
      statut: sv.shooting.statut,
      taux_horaire_client: sv.shooting.taux_horaire_client,
      taux_horaire_videaste: sv.taux_horaire_videaste,
      client: { id: sv.shooting.client.id, nom: sv.shooting.client.nom },
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  res.json({
    id: videaste.id,
    nom: videaste.nom,
    prenom: videaste.prenom,
    email: videaste.email,
    telephone: videaste.telephone,
    statut: videaste.statut,
    taux_horaire: videaste.taux_horaire,
    materiel_entreprise: videaste.materiel_entreprise,
    materiels: videaste.materiels.map((m) => ({
      id: m.id,
      categorie: m.categorie,
      nom: m.nom,
    })),
    shootings,
  });
}
