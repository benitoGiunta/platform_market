import { prisma } from "../lib/prisma.js";
import { BaseService } from "./base.service.js";

class ShootingsService extends BaseService {
  constructor() {
    super(prisma.shooting);
  }

  // Liste + client + nombre de vidéastes (triés par date décroissante).
  findAll() {
    return prisma.shooting.findMany({
      orderBy: { date: "desc" },
      include: { client: true, _count: { select: { videastes: true } } },
    });
  }

  // Détail + client + vidéastes liés.
  findById(id: number) {
    return prisma.shooting.findUnique({
      where: { id },
      include: {
        client: true,
        videastes: { include: { videaste: true } },
      },
    });
  }

  linkVideaste(shootingId: number, videasteId: number, tauxHoraireVideaste: number) {
    return prisma.shootingVideaste.create({
      data: {
        shooting_id: shootingId,
        videaste_id: videasteId,
        taux_horaire_videaste: tauxHoraireVideaste,
      },
    });
  }

  unlinkVideaste(shootingId: number, videasteId: number) {
    return prisma.shootingVideaste.delete({
      where: { shooting_id_videaste_id: { shooting_id: shootingId, videaste_id: videasteId } },
    });
  }
}

export const shootingsService = new ShootingsService();
