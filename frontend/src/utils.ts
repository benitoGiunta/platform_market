// Formate une date ISO (ex: "2026-07-15T00:00:00.000Z") en DD/MM/YYYY,
// sans décalage de fuseau horaire (on lit directement la partie date).
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}
