import { Link } from "react-router-dom";
import { useSeed } from "../hooks/useSeed";

const CARDS = [
  { to: "/videastes", label: "Vidéastes", icon: "🎬" },
  { to: "/shootings", label: "Shootings", icon: "📅" },
  { to: "/clients", label: "Clients", icon: "👤" },
  { to: "/materiels", label: "Matériel", icon: "🎥" },
];

export default function Home() {
  const { load, reset } = useSeed();
  const error = load.error ?? reset.error;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Logo + nom */}
      <div className="mb-10 flex flex-col items-center">
        <img
          src="/logo-full-slogan-no-background.png"
          alt="Markyn"
          className="h-28 w-auto object-contain"
        />
        <h1 className="mt-3 text-3xl font-bold text-primary">Markyn</h1>
      </div>

      {/* Cards de redirection */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-6 hover:border-accent hover:shadow"
          >
            <span className="text-3xl">{c.icon}</span>
            <span className="font-medium text-primary">{c.label}</span>
          </Link>
        ))}
      </div>

      {/* Actions BDD */}
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => load.mutate()}
          disabled={load.isPending}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {load.isPending ? "Chargement…" : "Charger le jeu de données de test"}
        </button>
        <button
          type="button"
          onClick={() => reset.mutate()}
          disabled={reset.isPending}
          className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-primary hover:bg-gray-50 disabled:opacity-50"
        >
          {reset.isPending ? "Réinitialisation…" : "Réinitialiser la base"}
        </button>
      </div>

      {/* États */}
      <div className="mt-4 text-center text-sm">
        {error ? <p className="text-red-600">{(error as Error).message}</p> : null}
        {load.isSuccess ? <p className="text-green-600">Jeu de données chargé ✓</p> : null}
        {reset.isSuccess ? <p className="text-green-600">Base réinitialisée ✓</p> : null}
      </div>
    </div>
  );
}
