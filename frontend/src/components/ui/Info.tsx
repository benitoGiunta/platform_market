import type { ReactNode } from "react";

// Ligne label / valeur pour les blocs infos des pages détail.
export function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium text-primary">{value}</div>
    </div>
  );
}
