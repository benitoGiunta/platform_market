// Badge de statut d'un vidéaste : Actif (#4cc5c4) / Inactif (gris).
export function StatutVideasteBadge({ statut }: { statut: string }) {
  const actif = statut.toLowerCase() === "actif";
  return (
    <span
      className={
        "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold " +
        (actif ? "bg-kyn-accent text-white" : "bg-gray-300 text-gray-700")
      }
    >
      {actif ? "Actif" : "Inactif"}
    </span>
  );
}

// Badge de statut d'un shooting : planifié / en cours / terminé / annulé.
const SHOOTING_STYLES: Record<string, string> = {
  planifié: "bg-kyn-accent text-white",
  "en cours": "bg-amber-400 text-kyn-dark",
  terminé: "bg-kyn-dark text-white",
  annulé: "bg-gray-300 text-gray-700",
};

export function StatutShootingBadge({ statut }: { statut: string }) {
  const style = SHOOTING_STYLES[statut.toLowerCase()] ?? "bg-gray-300 text-gray-700";
  return (
    <span className={"inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold " + style}>
      {statut}
    </span>
  );
}
