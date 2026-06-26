import { prisma } from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { calculateShootingKpi } from "../utils/kpi.js";

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

  // Détail + shootings (avec vidéastes) + KPI agrégé sur tous les shootings.
  async findById(id: number) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        shootings: {
          include: { videastes: { include: { videaste: true } } },
          orderBy: { date: "desc" },
        },
      },
    });
    if (!client) return null;

    const round = (n: number) => Math.round(n * 100) / 100;
    const per = client.shootings.map((s) => calculateShootingKpi(s));
    const kpi = {
      nb_shootings: client.shootings.length,
      duree_totale_heures: round(client.shootings.reduce((a, s) => a + s.duree, 0) / 60),
      marge_brute_totale: round(per.reduce((a, k) => a + k.marge_brute, 0)),
      couts_totaux: round(per.reduce((a, k) => a + k.couts, 0)),
      benefice_total: round(per.reduce((a, k) => a + k.benefice_net, 0)),
    };
    return { ...client, kpi };
  }
}

export const clientsService = new ClientsService();
