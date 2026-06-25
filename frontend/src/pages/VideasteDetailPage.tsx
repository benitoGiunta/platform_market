import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchVideaste } from "../api";
import type { VideasteDetail } from "../types";
import Header from "../components/Header";
import { StatutVideasteBadge, StatutShootingBadge } from "../components/Badges";
import { formatDate } from "../utils";

export default function VideasteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [videaste, setVideaste] = useState<VideasteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchVideaste(id)
      .then(setVideaste)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-kyn-accent hover:underline mb-6"
        >
          ← Retour
        </Link>

        {loading && <p>Chargement…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && videaste && (
          <>
            {/* Bloc infos vidéaste */}
            <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-kyn-dark">
                  {videaste.nom} {videaste.prenom}
                </h1>
                <StatutVideasteBadge statut={videaste.statut} />
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium">{videaste.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Téléphone</dt>
                  <dd className="font-medium">{videaste.telephone}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Taux horaire</dt>
                  <dd className="font-medium">{videaste.taux_horaire} €/h</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Matériel</dt>
                  <dd className="font-medium">
                    {videaste.materiel_entreprise ? (
                      "Matériel entreprise"
                    ) : videaste.materiels.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {videaste.materiels.map((m) => (
                          <li key={m.id}>
                            {m.categorie} — {m.nom}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Bloc shootings */}
            <h2 className="text-xl font-bold mb-4 text-kyn-dark">Shootings</h2>
            {videaste.shootings.length === 0 ? (
              <p className="text-gray-500 italic">Aucun shooting enregistré</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-kyn-dark text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nom shooting</th>
                      <th className="px-4 py-3 font-semibold">Client</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Lieu</th>
                      <th className="px-4 py-3 font-semibold text-right">Durée</th>
                      <th className="px-4 py-3 font-semibold text-center">Statut</th>
                      <th className="px-4 py-3 font-semibold text-right">Taux horaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {videaste.shootings.map((s) => (
                      <tr key={s.id}>
                        <td className="px-4 py-3 font-medium">{s.nom}</td>
                        <td className="px-4 py-3">{s.client.nom}</td>
                        <td className="px-4 py-3">{formatDate(s.date)}</td>
                        <td className="px-4 py-3">{s.lieu}</td>
                        <td className="px-4 py-3 text-right">{s.duree} min</td>
                        <td className="px-4 py-3 text-center">
                          <StatutShootingBadge statut={s.statut} />
                        </td>
                        <td className="px-4 py-3 text-right">{s.taux_horaire_client} €/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
