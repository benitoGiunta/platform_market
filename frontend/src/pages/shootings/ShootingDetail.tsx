import { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShootingDetail } from "../../hooks/useShootingDetail";
import { useVideastes } from "../../hooks/useVideastes";
import { BackButton } from "../../components/BackButton";
import { QueryBoundary } from "../../components/ui/QueryBoundary";
import { DetailTable, type DetailColumn } from "../../components/ui/DetailTable";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Info } from "../../components/ui/Info";
import { KpiCard } from "../../components/ui/KpiCard";
import { StatutShootingBadge } from "../../components/ui/Badge";
import { ShootingForm } from "../../components/forms/ShootingForm";
import { formatDate } from "../../utils";
import type { ShootingDetail as TShootingDetail } from "../../types";

type VidRow = TShootingDetail["videastes"][number];

// Workflow visuel — hardcodé V1. TODO V2: connecter au champ `statut`.
const STEPS = ["Script", "Planifié", "Tournage", "Montage"];
const CURRENT_STEP = 1; // Planifié

// KPI hardcodés V1. TODO V2: remplacer par calcul réel.
const KPI_DUREE = "4h"; // duree / 60
const KPI_MARGE = "800 €"; // (duree/60) * taux_horaire_client
const KPI_BENEFICE = "500 €"; // marge - Σ(duree/60 * taux_horaire_videaste)

function WorkflowBar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {STEPS.map((s, i) => (
        <Fragment key={s}>
          <div
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              i < CURRENT_STEP
                ? "bg-primary text-white"
                : i === CURRENT_STEP
                  ? "bg-accent text-white"
                  : "bg-light text-gray-500"
            }`}
          >
            {s}
          </div>
          {i < STEPS.length - 1 ? <div className="h-0.5 w-8 bg-gray-300" /> : null}
        </Fragment>
      ))}
    </div>
  );
}

export default function ShootingDetail() {
  const { id } = useParams();
  const sid = Number(id);
  const { detail, update, linkVideaste, unlinkVideaste } = useShootingDetail(sid);
  const allVideastes = useVideastes().list;

  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selVid, setSelVid] = useState("");
  const [taux, setTaux] = useState("");
  const [confirm, setConfirm] = useState<{ id: number; label: string } | null>(null);

  return (
    <div>
      <BackButton to="/shootings" />
      <QueryBoundary query={detail}>
        {(s) => {
          const cols: DetailColumn<VidRow>[] = [
            {
              key: "nom",
              header: "Nom",
              render: (r) => (
                <Link
                  to={`/videastes/${r.videaste.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-accent hover:underline"
                >
                  {r.videaste.nom} {r.videaste.prenom}
                </Link>
              ),
            },
            {
              key: "taux",
              header: "Taux horaire vidéaste",
              align: "right",
              render: (r) => `${r.taux_horaire_videaste} €/h`,
            },
          ];

          const linked = new Set(s.videastes.map((x) => x.videaste.id));
          const vidOptions = (allVideastes.data ?? []).filter((x) => !linked.has(x.id));

          return (
            <>
              {/* Bloc 1 — Workflow */}
              <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <WorkflowBar />
              </section>

              {/* Bloc 2 — Infos */}
              <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-primary">{s.nom}</h1>
                  {!editing ? (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-primary hover:bg-gray-50"
                    >
                      Modifier
                    </button>
                  ) : null}
                </div>
                {editing ? (
                  <ShootingForm
                    defaultValues={{
                      nom: s.nom,
                      client_id: s.client_id != null ? String(s.client_id) : "",
                      lieu: s.lieu ?? "",
                      date: s.date.slice(0, 10),
                      duree: s.duree,
                      statut: s.statut,
                      taux_horaire_client: Number(s.taux_horaire_client),
                    }}
                    submitting={update.isPending}
                    onCancel={() => setEditing(false)}
                    onSubmit={(data) => update.mutate(data, { onSuccess: () => setEditing(false) })}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <Info
                      label="Client"
                      value={
                        s.client ? (
                          <Link
                            to={`/clients/${s.client.id}`}
                            className="text-accent hover:underline"
                          >
                            {s.client.nom}
                          </Link>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <Info label="Lieu" value={s.lieu || "—"} />
                    <Info label="Date" value={formatDate(s.date)} />
                    <Info label="Durée" value={`${s.duree} min`} />
                    <Info label="Statut" value={<StatutShootingBadge statut={s.statut} />} />
                    <Info label="Taux horaire client" value={`${s.taux_horaire_client} €/h`} />
                  </div>
                )}
              </section>

              {/* Table vidéastes */}
              <h2 className="mb-3 text-xl font-bold text-primary">Vidéastes</h2>
              <div className="mb-8">
                <DetailTable
                  columns={cols}
                  rows={s.videastes}
                  getId={(r) => r.id}
                  onUnlink={(r) =>
                    setConfirm({
                      id: r.videaste.id,
                      label: `${r.videaste.nom} ${r.videaste.prenom}`,
                    })
                  }
                  unlinkTitle="Retirer du shooting"
                  addLabel="Ajouter un vidéaste"
                  onAdd={() => setAddOpen(true)}
                  emptyLabel="Aucun vidéaste sur ce shooting"
                />
              </div>

              {/* Bloc 3 — KPI */}
              <h2 className="mb-3 text-xl font-bold text-primary">Indicateurs</h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                <KpiCard label="Durée du shooting" value={KPI_DUREE} />
                <KpiCard label="Marge brute" value={KPI_MARGE} />
                <KpiCard label="Bénéfice net" value={KPI_BENEFICE} />
              </div>

              {/* Modal ajout vidéaste */}
              <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un vidéaste">
                <select
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  value={selVid}
                  onChange={(e) => setSelVid(e.target.value)}
                >
                  <option value="">— Choisir un vidéaste —</option>
                  {vidOptions.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.nom} {x.prenom}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Taux horaire vidéaste (€/h)"
                  className="mt-3 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  value={taux}
                  onChange={(e) => setTaux(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!selVid || taux === "" || linkVideaste.isPending}
                    onClick={() =>
                      linkVideaste.mutate(
                        { videaste_id: Number(selVid), taux_horaire_videaste: Number(taux) },
                        {
                          onSuccess: () => {
                            setAddOpen(false);
                            setSelVid("");
                            setTaux("");
                          },
                        },
                      )
                    }
                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    Ajouter
                  </button>
                </div>
              </Modal>

              <ConfirmModal
                open={confirm !== null}
                onClose={() => setConfirm(null)}
                onConfirm={() =>
                  confirm &&
                  unlinkVideaste.mutate(confirm.id, { onSuccess: () => setConfirm(null) })
                }
                title="Confirmer le retrait"
                message={`Retirer « ${confirm?.label} » de ce shooting ?`}
                confirmLabel="Retirer"
                loading={unlinkVideaste.isPending}
              />
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
