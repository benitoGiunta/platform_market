// Formatage centralisé — importé partout où durée / montant / date est affiché.

// "2026-07-15T00:00:00.000Z" -> "15/07/2026" (sans décalage de fuseau).
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

// 150 -> "2 h 30 min" ; 120 -> "2 h"
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${h} h`;
}

// 1200 -> "1 200 €"
export function formatCurrency(amount: number, currency = "€"): string {
  return `${new Intl.NumberFormat("fr-BE").format(amount)} ${currency}`;
}
