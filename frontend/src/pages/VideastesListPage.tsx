import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVideastes } from "../api";
import type { VideasteListItem } from "../types";
import Header from "../components/Header";
import { StatutVideasteBadge } from "../components/Badges";

export default function VideastesListPage() {
  const navigate = useNavigate();
  const [videastes, setVideastes] = useState<VideasteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideastes()
      .then(setVideastes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6 text-kyn-dark">Vidéastes</h1>

        {loading && <p>Chargement…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-kyn-dark text-white text-sm">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nom</th>
                  <th className="px-4 py-3 font-semibold">Prénom</th>
                  <th className="px-4 py-3 font-semibold text-center">Nombre de shootings</th>
                  <th className="px-4 py-3 font-semibold text-right">Taux horaire</th>
                  <th className="px-4 py-3 font-semibold text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {videastes.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => navigate(`/videaste/${v.id}`)}
                    className="cursor-pointer hover:bg-kyn-light/60 transition"
                  >
                    <td className="px-4 py-3 font-medium">{v.nom}</td>
                    <td className="px-4 py-3">{v.prenom}</td>
                    <td className="px-4 py-3 text-center">{v.nombre_shootings}</td>
                    <td className="px-4 py-3 text-right">{v.taux_horaire} €/h</td>
                    <td className="px-4 py-3 text-center">
                      <StatutVideasteBadge statut={v.statut} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
