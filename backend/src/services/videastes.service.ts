import { prisma } from "../lib/prisma.js";
import { BaseService } from "./base.service.js";

class VideastesService extends BaseService {
  constructor() {
    super(prisma.videaste);
  }

  // Liste + nombre de shootings.
  findAll() {
    return prisma.videaste.findMany({
      orderBy: { nom: "asc" },
      include: { _count: { select: { shootings: true } } },
    });
  }

  // Détail + matériels liés + shootings (triés par date décroissante).
  findById(id: number) {
    return prisma.videaste.findUnique({
      where: { id },
      include: {
        materiels: { include: { materiel: true } },
        shootings: {
          include: { shooting: { include: { client: true } } },
          orderBy: { shooting: { date: "desc" } },
        },
      },
    });
  }

  linkMateriel(videasteId: number, materielId: number) {
    return prisma.materielVideaste.create({
      data: { videaste_id: videasteId, materiel_id: materielId },
    });
  }

  unlinkMateriel(videasteId: number, materielId: number) {
    return prisma.materielVideaste.delete({
      where: { materiel_id_videaste_id: { materiel_id: materielId, videaste_id: videasteId } },
    });
  }
}

export const videastesService = new VideastesService();
