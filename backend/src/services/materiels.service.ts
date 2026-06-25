import { prisma } from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { notFound, systemItem } from "../lib/AppError.js";

class MaterielsService extends BaseService {
  constructor() {
    super(prisma.materiel);
  }

  // Liste + nombre de vidéastes liés.
  findAll() {
    return prisma.materiel.findMany({
      orderBy: { nom: "asc" },
      include: { _count: { select: { videastes: true } } },
    });
  }

  // Détail + vidéastes liés.
  findById(id: number) {
    return prisma.materiel.findUnique({
      where: { id },
      include: { videastes: { include: { videaste: true } } },
    });
  }

  // Refuse la suppression du matériel système (is_system).
  async delete(id: number) {
    const materiel = await prisma.materiel.findUnique({ where: { id } });
    if (!materiel) throw notFound("Matériel introuvable");
    if (materiel.is_system) throw systemItem("Le matériel entreprise ne peut pas être supprimé");
    return prisma.materiel.delete({ where: { id } });
  }

  linkVideaste(materielId: number, videasteId: number) {
    return prisma.materielVideaste.create({
      data: { materiel_id: materielId, videaste_id: videasteId },
    });
  }

  unlinkVideaste(materielId: number, videasteId: number) {
    return prisma.materielVideaste.delete({
      where: { materiel_id_videaste_id: { materiel_id: materielId, videaste_id: videasteId } },
    });
  }
}

export const materielsService = new MaterielsService();
