import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShootingDetail } from "../../hooks/useShootingDetail";
import { useWorkflow } from "../../hooks/useWorkflow";
import { useVideastes } from "../../hooks/useVideastes";
import { useToast } from "../../hooks/useToast";
import { BackButton } from "../../components/BackButton";
import { DetailTable, type DetailColumn } from "../../components/ui/DetailTable";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { InfoDetailBlock } from "../../components/ui/InfoDetailBlock";
import { WorkflowBar } from "../../components/ui/WorkflowBar";
import { DonutChart } from "../../components/ui/DonutChart";
import { KpiCard } from "../../components/ui/KpiCard";
import { ErrorBoundary } from "../../components/ui/ErrorBoundary";
import { SelectInput } from "../../components/ui/SelectInput";
import { StatutShootingBadge } from "../../components/ui/Badge";
import { SkeletonInfoBlock, SkeletonTable, SkeletonWorkflow } from "../../components/ui/Skeletons";
import { ShootingForm } from "../../components/forms/ShootingForm";
import { formatDate, formatDuration } from "../../utils/format";
import type { ShootingDetail as TShootingDetail } from "../../types";

type VidRow = TShootingDetail["videastes"][number];

export default function ShootingDetail() {
  const { id } = useParams();
  const sid = Number(id);
  const toast = useToast();
  const { detail, update, linkVideaste, unlinkVideaste } = useShootingDetail(sid);
  const workflow = useWorkflow(sid);
  const allVideastes = useVideastes().list;

  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selVid, setSelVid] = useState("");
  const [taux, setTaux] = useState("");
  const [confirm, setConfirm] = useState<{ id: number; label: string } | null>(null);

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

  if (detail.isError) {
    return (
      <div>
        <BackButton to="/shootings" />
        <p className="text-danger">Erreur de chargement.</p>
      </div>
    );
  }

  const s = detail.data;

  return (
    <div>
      <BackButton to="/shootings" />
      {!s ? (
        <>
          <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <SkeletonWorkflow />
          </section>
          <SkeletonInfoBlock />
          <div className="mt-8">
            <SkeletonTable />
          </div>
        </>
      ) : (
        <>
          {/* Bloc 1 — Workflow interactif */}
          <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <ErrorBoundary>
              <WorkflowBar
                statut={s.statut}
                isPaused={s.is_paused}
                onStatutChange={workflow.onStatutChange}
                onTogglePause={workflow.onTogglePause}
              />
            </ErrorBoundary>
          </section>

          {/* Bloc 2 — Infos */}
          {editing ? (
            <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
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
                onSubmit={(data) =>
                  update.mutate(data, {
                    onSuccess: () => {
                      setEditing(false);
                      toast("success", "Shooting modifié");
                    },
                  })
                }
              />
            </section>
          ) : (
            <InfoDetailBlock
              name={s.nom}
              badge={
                <div className="flex items-center gap-3">
                  <StatutShootingBadge statut={s.statut} />
                  {s.is_paused ? (
                    <span className="font-syne text-xs font-light italic text-pause">EN PAUSE</span>
                  ) : null}
                </div>
              }
              fields={[
                {
                  label: "Client",
                  value: s.client?.nom ?? null,
                  node: s.client ? (
                    <Link to={`/clients/${s.client.id}`} className="text-accent hover:underline">
                      {s.client.nom}
                    </Link>
                  ) : undefined,
                },
                { label: "Lieu", value: s.lieu ?? null },
                { label: "Date", value: formatDate(s.date) },
                { label: "Durée", value: formatDuration(s.duree) },
                { label: "Taux horaire client", value: `${s.taux_horaire_client} €/h` },
              ]}
              onEdit={() => setEditing(true)}
            />
          )}

          {/* Bloc 3 — Vidéastes */}
          <h2 className="mb-3 text-xl font-bold text-primary">Vidéastes</h2>
          <div className="mb-8">
            <DetailTable
              columns={cols}
              rows={s.videastes}
              getId={(r) => r.id}
              onUnlink={(r) =>
                setConfirm({ id: r.videaste.id, label: `${r.videaste.nom} ${r.videaste.prenom}` })
              }
              unlinkTitle="Retirer du shooting"
              addLabel="Ajouter un vidéaste"
              onAdd={() => setAddOpen(true)}
              emptyLabel="Aucun vidéaste sur ce shooting"
            />
          </div>

          {/* Bloc 4 — KPI réels */}
          <h2 className="mb-3 text-xl font-bold text-primary">Indicateurs</h2>
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
            <ErrorBoundary>
              <DonutChart
                margeBrute={s.kpi.marge_brute}
                couts={s.kpi.couts}
                benefice={s.kpi.benefice_net}
              />
            </ErrorBoundary>
            <KpiCard label="Durée du shooting" value={formatDuration(s.duree)} />
          </div>

          {/* Modal ajout vidéaste */}
          <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un vidéaste">
            <SelectInput
              value={selVid}
              onChange={setSelVid}
              placeholder="— Choisir un vidéaste —"
              options={(allVideastes.data ?? [])
                .filter((x) => !s.videastes.some((sv) => sv.videaste.id === x.id))
                .map((x) => ({ value: String(x.id), label: `${x.nom} ${x.prenom}` }))}
            />
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
                        toast("success", "Vidéaste ajouté");
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
              unlinkVideaste.mutate(confirm.id, {
                onSuccess: () => {
                  setConfirm(null);
                  toast("success", "Vidéaste retiré");
                },
              })
            }
            title="Confirmer le retrait"
            message={`Retirer « ${confirm?.label} » de ce shooting ?`}
            confirmLabel="Retirer"
            loading={unlinkVideaste.isPending}
          />
        </>
      )}
    </div>
  );
}
