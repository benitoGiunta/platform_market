import { Link } from "react-router-dom";

// Placeholder — enrichi en Phase 6 (logo Markyn + boutons seed/reset).
const CARDS = [
  { to: "/videastes", label: "Vidéastes", icon: "🎬" },
  { to: "/shootings", label: "Shootings", icon: "📅" },
  { to: "/clients", label: "Clients", icon: "👤" },
  { to: "/materiels", label: "Matériel", icon: "🎥" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="mb-2 text-3xl font-bold text-kyn-dark">Markyn</h1>
      <p className="mb-8 text-gray-500">Gestion de flux métier — agence vidéo</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-6 hover:border-kyn-accent hover:shadow"
          >
            <span className="text-3xl">{c.icon}</span>
            <span className="font-medium text-kyn-dark">{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
