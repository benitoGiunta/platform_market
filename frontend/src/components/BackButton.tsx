import { Link } from "react-router-dom";

// Bouton Retour des pages détail — ramène à la liste parente.
export function BackButton({ to, label = "Retour" }: { to: string; label?: string }) {
  return (
    <Link
      to={to}
      className="mb-6 inline-flex items-center text-sm font-medium text-accent hover:underline"
    >
      ← {label}
    </Link>
  );
}
