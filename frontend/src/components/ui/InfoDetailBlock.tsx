import type { ReactNode } from "react";
import { ContactLink, type ContactType } from "./ContactLink";

export interface InfoField {
  label: string;
  value: string | null;
  type?: "text" | ContactType;
  // Rendu personnalisé (ex. lien interne) — prioritaire sur value/type.
  node?: ReactNode;
}

// Visuel "info détail" : grand nom (Syne) à gauche sur fond primary, grille label/valeur à droite.
export function InfoDetailBlock({
  name,
  subname,
  badge,
  fields,
  onEdit,
}: {
  name: string;
  subname?: string;
  badge?: ReactNode;
  fields: InfoField[];
  onEdit: () => void;
}) {
  return (
    <section className="mb-8 grid grid-cols-1 overflow-hidden rounded-lg border border-gray-200 bg-white md:grid-cols-[260px_1fr]">
      <div className="flex flex-col justify-center gap-3 bg-primary p-6 text-white">
        {subname ? <span className="font-syne text-lg text-white/80">{subname}</span> : null}
        <span className="font-syne text-4xl font-bold leading-tight">{name}</span>
        {badge ? <div>{badge}</div> : null}
      </div>

      <div className="relative p-6">
        <button
          type="button"
          onClick={onEdit}
          className="absolute right-4 top-4 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-primary hover:bg-gray-50"
        >
          Modifier
        </button>
        <dl className="mt-2 divide-y divide-light">
          {fields.map((f) => (
            <div key={f.label} className="grid grid-cols-[140px_1fr] gap-4 py-2.5">
              <dt className="text-xs font-medium uppercase tracking-wide text-primary/60">
                {f.label}
              </dt>
              <dd className="text-sm text-primary">
                {f.node != null ? (
                  f.node
                ) : f.value == null || f.value === "" ? (
                  "—"
                ) : f.type && f.type !== "text" ? (
                  <ContactLink type={f.type} value={f.value} />
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
