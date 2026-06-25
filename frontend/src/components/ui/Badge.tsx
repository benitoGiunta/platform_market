import { STATUT_VIDEASTE, STATUT_SHOOTING } from "../../constants/enums";

type Tone = "accent" | "dark" | "amber" | "gray";

const TONE: Record<Tone, string> = {
  accent: "bg-kyn-accent text-white",
  dark: "bg-kyn-dark text-white",
  amber: "bg-amber-400 text-kyn-dark",
  gray: "bg-gray-300 text-gray-700",
};

export function Badge({ label, tone = "gray" }: { label: string; tone?: Tone }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE[tone]}`}>
      {label}
    </span>
  );
}

const VIDEASTE_TONE: Record<keyof typeof STATUT_VIDEASTE, Tone> = {
  actif: "accent",
  inactif: "gray",
};

export function StatutVideasteBadge({ statut }: { statut: keyof typeof STATUT_VIDEASTE }) {
  return <Badge label={STATUT_VIDEASTE[statut]} tone={VIDEASTE_TONE[statut]} />;
}

const SHOOTING_TONE: Record<keyof typeof STATUT_SHOOTING, Tone> = {
  planifie: "accent",
  en_cours: "amber",
  termine: "dark",
  annule: "gray",
};

export function StatutShootingBadge({ statut }: { statut: keyof typeof STATUT_SHOOTING }) {
  return <Badge label={STATUT_SHOOTING[statut]} tone={SHOOTING_TONE[statut]} />;
}
