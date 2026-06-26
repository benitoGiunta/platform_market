import { FileText, Calendar, Video, Scissors, Eye, CheckCircle } from "lucide-react";
import type { ComponentType } from "react";
import type { StatutShooting } from "../types";

// Source unique des étapes du workflow. Ajouter une étape en V3 = modifier ici uniquement.
export const WORKFLOW_STEPS: {
  statut: StatutShooting;
  label: string;
  icon: ComponentType<{ size?: number | string; className?: string }>;
}[] = [
  { statut: "script", label: "Script", icon: FileText },
  { statut: "planifie", label: "Planifié", icon: Calendar },
  { statut: "tournage", label: "Tournage", icon: Video },
  { statut: "montage", label: "Montage", icon: Scissors },
  { statut: "revision", label: "Révision", icon: Eye },
  { statut: "termine", label: "Terminé", icon: CheckCircle },
];

export const STEP_INDEX: Record<StatutShooting, number> = WORKFLOW_STEPS.reduce(
  (acc, step, i) => ({ ...acc, [step.statut]: i }),
  {} as Record<StatutShooting, number>,
);
