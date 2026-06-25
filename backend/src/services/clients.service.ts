import { prisma } from "../lib/prisma.js";
import { BaseService } from "./base.service.js";

class ClientsService extends BaseService {
  constructor() {
    super(prisma.client);
  }

  // Liste + nombre de shootings.
  findAll() {
    return prisma.client.findMany({
      orderBy: { nom: "asc" },
      include: { _count: { select: { shootings: true } } },
    });
  }

  // Détail + shootings (avec vidéastes), triés par date décroissante.
  findById(id: number) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        shootings: {
          include: { videastes: { include: { videaste: true } } },
          orderBy: { date: "desc" },
        },
      },
    });
  }
}

export const clientsService = new ClientsService();
