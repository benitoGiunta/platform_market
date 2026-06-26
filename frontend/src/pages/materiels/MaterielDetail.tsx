import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMaterielDetail } from "../../hooks/useMaterielDetail";
import { useVideastes } from "../../hooks/useVideastes";
import { BackButton } from "../../components/BackButton";
import { QueryBoundary } from "../../components/ui/QueryBoundary";
import { DetailTable, type DetailColumn } from "../../components/ui/DetailTable";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Info } from "../../components/ui/Info";
import { StatutVideasteBadge } from "../../components/ui/Badge";
import { MaterielForm } from "../../components/forms/MaterielForm";
import { CATEGORIE_MATERIEL } from "../../constants/enums";
import type { MaterielDetail as TMaterielDetail } from "../../types";

type VidRow = TMaterielDetail["videastes"][number];

export default function MaterielDetail() {
  const { id } = useParams();
  const mid = Number(id);
  const { detail, update, linkVideaste, unlinkVideaste } = useMaterielDetail(mid);
  const allVideastes = useVideastes().list;

  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selVid, setSelVid] = useState("");
  const [confirm, setConfirm] = useState<{ id: number; label: string } | null>(null);

  return (
    <div>
      <BackButton to="/materiels" />
      <QueryBoundary query={detail}>
        {(m) => {
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
              key: "statut",
              header: "Statut",
              align: "center",
              render: (r) => <StatutVideasteBadge statut={r.videaste.statut} />,
            },
            {
              key: "taux",
              header: "Taux horaire",
              align: "right",
              render: (r) => `${r.videaste.taux_horaire} €/h`,
            },
          ];

          const linked = new Set(m.videastes.map((x) => x.videaste.id));
          const vidOptions = (allVideastes.data ?? []).filter((x) => !linked.has(x.id));

          return (
            <>
              {/* Bloc infos */}
              <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-primary">{m.nom}</h1>
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
                  <MaterielForm
                    defaultValues={{
                      categorie: m.categorie as never,
                      nom: m.nom,
                    }}
                    submitting={update.isPending}
                    onCancel={() => setEditing(false)}
                    onSubmit={(data) => update.mutate(data, { onSuccess: () => setEditing(false) })}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <Info
                      label="Catégorie"
                      value={
                        CATEGORIE_MATERIEL[m.categorie as keyof typeof CATEGORIE_MATERIEL] ??
                        m.categorie
                      }
                    />
                    <Info label="Nom" value={m.nom} />
                  </div>
                )}
              </section>

              {/* Vidéastes */}
              <h2 className="mb-3 text-xl font-bold text-primary">Vidéastes</h2>
              <DetailTable
                columns={cols}
                rows={m.videastes}
                getId={(r) => r.id}
                onUnlink={(r) =>
                  setConfirm({ id: r.videaste.id, label: `${r.videaste.nom} ${r.videaste.prenom}` })
                }
                addLabel="Lier un vidéaste"
                onAdd={() => setAddOpen(true)}
                emptyLabel="Aucun vidéaste lié"
              />

              {/* Modal lier vidéaste */}
              <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Lier un vidéaste">
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
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!selVid || linkVideaste.isPending}
                    onClick={() =>
                      linkVideaste.mutate(Number(selVid), {
                        onSuccess: () => {
                          setAddOpen(false);
                          setSelVid("");
                        },
                      })
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
                title="Confirmer la déliaison"
                message={`Délier « ${confirm?.label} » de ce matériel ?`}
                confirmLabel="Délier"
                loading={unlinkVideaste.isPending}
              />
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
