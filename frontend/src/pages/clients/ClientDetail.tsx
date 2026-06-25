import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useClientDetail } from "../../hooks/useClientDetail";
import { BackButton } from "../../components/BackButton";
import { QueryBoundary } from "../../components/ui/QueryBoundary";
import { DetailTable, type DetailColumn } from "../../components/ui/DetailTable";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Info } from "../../components/ui/Info";
import { KpiCard } from "../../components/ui/KpiCard";
import { StatutShootingBadge } from "../../components/ui/Badge";
import { ClientForm } from "../../components/forms/ClientForm";
import { ShootingForm } from "../../components/forms/ShootingForm";
import { DOMAINE_METIER } from "../../constants/enums";
import { formatDate } from "../../utils";
import type { ClientDetail as TClientDetail } from "../../types";

type ShootRow = TClientDetail["shootings"][number];

// KPI hardcodés V1. TODO V2: remplacer par calcul réel.
const KPI_SHOOTINGS = "8 shootings — 32h"; // COUNT + SUM(duree)/60
const KPI_MARGE = "6 400 €"; // SUM((duree/60) * taux_horaire_client)
const KPI_BENEFICE = "4 000 €"; // SUM(marge - Σ taux vidéastes)

export default function ClientDetail() {
  const { id } = useParams();
  const cid = Number(id);
  const navigate = useNavigate();
  const { detail, update, createShooting, detachShooting } = useClientDetail(cid);

  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ id: number; label: string } | null>(null);

  return (
    <div>
      <BackButton to="/clients" />
      <QueryBoundary query={detail}>
        {(c) => {
          const cols: DetailColumn<ShootRow>[] = [
            {
              key: "nom",
              header: "Nom shooting",
              render: (s) => (
                <Link
                  to={`/shootings/${s.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-kyn-accent hover:underline"
                >
                  {s.nom}
                </Link>
              ),
            },
            {
              key: "videastes",
              header: "Vidéastes",
              render: (s) =>
                s.videastes.length === 0
                  ? "—"
                  : s.videastes.map((v, i) => (
                      <span key={v.id}>
                        {i > 0 ? ", " : ""}
                        <Link
                          to={`/videastes/${v.videaste.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-kyn-accent hover:underline"
                        >
                          {v.videaste.nom} {v.videaste.prenom}
                        </Link>
                      </span>
                    )),
            },
            { key: "date", header: "Date", render: (s) => formatDate(s.date) },
            { key: "lieu", header: "Lieu", render: (s) => s.lieu ?? "—" },
            {
              key: "statut",
              header: "Statut",
              align: "center",
              render: (s) => <StatutShootingBadge statut={s.statut} />,
            },
            {
              key: "taux",
              header: "Taux horaire",
              align: "right",
              render: (s) => `${s.taux_horaire_client} €/h`,
            },
          ];

          return (
            <>
              {/* Bloc infos */}
              <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-kyn-dark">{c.nom}</h1>
                  {!editing ? (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-kyn-dark hover:bg-gray-50"
                    >
                      Modifier
                    </button>
                  ) : null}
                </div>
                {editing ? (
                  <ClientForm
                    defaultValues={{
                      nom: c.nom,
                      nom_legal: c.nom_legal ?? "",
                      adresse: c.adresse ?? "",
                      numero_tva: c.numero_tva ?? "",
                      domaine_metier: c.domaine_metier ?? "",
                      date_creation: c.date_creation ? c.date_creation.slice(0, 10) : "",
                      email: c.email ?? "",
                      telephone: c.telephone ?? "",
                    }}
                    submitting={update.isPending}
                    onCancel={() => setEditing(false)}
                    onSubmit={(data) => update.mutate(data, { onSuccess: () => setEditing(false) })}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <Info label="Nom légal" value={c.nom_legal || "—"} />
                    <Info label="Adresse" value={c.adresse || "—"} />
                    <Info label="Numéro TVA" value={c.numero_tva || "—"} />
                    <Info
                      label="Domaine métier"
                      value={c.domaine_metier ? DOMAINE_METIER[c.domaine_metier] : "—"}
                    />
                    <Info
                      label="Date de création"
                      value={c.date_creation ? formatDate(c.date_creation) : "—"}
                    />
                    <Info label="Email" value={c.email || "—"} />
                    <Info label="Téléphone" value={c.telephone || "—"} />
                  </div>
                )}
              </section>

              {/* Shootings */}
              <h2 className="mb-3 text-xl font-bold text-kyn-dark">Shootings</h2>
              <div className="mb-8">
                <DetailTable
                  columns={cols}
                  rows={c.shootings}
                  getId={(s) => s.id}
                  onRowClick={(s) => navigate(`/shootings/${s.id}`)}
                  onUnlink={(s) => setConfirm({ id: s.id, label: s.nom })}
                  unlinkTitle="Détacher du client"
                  addLabel="Créer un shooting"
                  onAdd={() => setAddOpen(true)}
                  emptyLabel="Aucun shooting pour ce client"
                />
              </div>

              {/* KPI */}
              <h2 className="mb-3 text-xl font-bold text-kyn-dark">Indicateurs</h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                <KpiCard label="Shootings & durée totale" value={KPI_SHOOTINGS} />
                <KpiCard label="Marge brute totale" value={KPI_MARGE} />
                <KpiCard label="Bénéfice total" value={KPI_BENEFICE} />
              </div>

              {/* Modal création shooting (client pré-rempli) */}
              <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Créer un shooting">
                <ShootingForm
                  defaultValues={{ client_id: String(c.id) }}
                  submitting={createShooting.isPending}
                  onCancel={() => setAddOpen(false)}
                  onSubmit={(data) =>
                    createShooting.mutate(data, { onSuccess: () => setAddOpen(false) })
                  }
                />
                {createShooting.isError ? (
                  <p className="mt-3 text-sm text-red-600">
                    {(createShooting.error as Error).message}
                  </p>
                ) : null}
              </Modal>

              <ConfirmModal
                open={confirm !== null}
                onClose={() => setConfirm(null)}
                onConfirm={() =>
                  confirm &&
                  detachShooting.mutate(confirm.id, { onSuccess: () => setConfirm(null) })
                }
                title="Confirmer le détachement"
                message={`Détacher « ${confirm?.label} » de ce client ? Le shooting ne sera pas supprimé.`}
                confirmLabel="Détacher"
                loading={detachShooting.isPending}
              />
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
