import { Prisma } from "@prisma/client";

// Calcul financier d'un shooting — fonction pure, factorisée.
// Appelée par shootings.service (détail) ET clients.service (agrégation).
// Ne jamais dupliquer ce calcul ailleurs.
export function calculateShootingKpi(shooting: {
  duree: number;
  taux_horaire_client: Prisma.Decimal;
  videastes: { taux_horaire_videaste: Prisma.Decimal }[];
}) {
  const duree_heures = shooting.duree / 60.0;
  const marge_brute = duree_heures * Number(shooting.taux_horaire_client);
  const couts = shooting.videastes.reduce(
    (acc, sv) => acc + duree_heures * Number(sv.taux_horaire_videaste),
    0,
  );
  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    duree_heures: round(duree_heures),
    marge_brute: round(marge_brute),
    couts: round(couts),
    benefice_net: round(marge_brute - couts),
  };
}
