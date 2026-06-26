import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { calculateShootingKpi } from "../utils/kpi.js";
import { notFound } from "../lib/AppError.js";

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

  // Détail + client + vidéastes liés + KPI financier réel.
  async findById(id: number) {
    const shooting = await prisma.shooting.findUnique({
      where: { id },
      include: {
        client: true,
        videastes: { include: { videaste: true } },
      },
    });
    if (!shooting) return null;
    return { ...shooting, kpi: calculateShootingKpi(shooting) };
  }

  // MAJ — gère pause/reprise en transaction atomique (serveur autoritaire).
  async update(id: number, data: Record<string, unknown>) {
    if (data.is_paused === true) {
      return prisma.$transaction(async (tx) => {
        const current = await tx.shooting.findUnique({ where: { id } });
        if (!current) throw notFound("Shooting introuvable");
        return tx.shooting.update({
          where: { id },
          data: { is_paused: true, statut_avant_pause: current.statut },
        });
      });
    }

    if (data.is_paused === false) {
      return prisma.$transaction(async (tx) => {
        const current = await tx.shooting.findUnique({ where: { id } });
        if (!current) throw notFound("Shooting introuvable");
        return tx.shooting.update({
          where: { id },
          data: {
            is_paused: false,
            statut: current.statut_avant_pause ?? current.statut,
            statut_avant_pause: null,
          },
        });
      });
    }

    return prisma.shooting.update({
      where: { id },
      data: data as Prisma.ShootingUpdateInput,
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
