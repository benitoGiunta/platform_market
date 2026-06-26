// Couleurs pour la dataviz (Recharts) — lues depuis les tokens CSS (source unique
// dans index.css / tailwind.config.js), avec fallback hex pour le SSR/tests.
// Fichier .ts (pas .tsx) : pas de couleur hardcodée dans le JSX.
function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export const CHART_COLORS = {
  primary: cssVar("--color-primary", "#314044"),
  accent: cssVar("--color-accent", "#4cc5c4"),
  danger: "#ef4444",
};
