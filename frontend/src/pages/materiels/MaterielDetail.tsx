import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMaterielDetail } from "../../hooks/useMaterielDetail";
import { useVideastes } from "../../hooks/useVideastes";
import { useToast } from "../../hooks/useToast";
import { BackButton } from "../../components/BackButton";
import { DetailTable, type DetailColumn } from "../../components/ui/DetailTable";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { InfoDetailBlock } from "../../components/ui/InfoDetailBlock";
import { SelectInput } from "../../components/ui/SelectInput";
import { Badge, StatutVideasteBadge } from "../../components/ui/Badge";
import { SkeletonInfoBlock, SkeletonTable } from "../../components/ui/Skeletons";
import { MaterielForm } from "../../components/forms/MaterielForm";
import { CATEGORIE_MATERIEL } from "../../constants/enums";
import type { MaterielDetail as TMaterielDetail } from "../../types";

type VidRow = TMaterielDetail["videastes"][number];
const catLabel = (c: string) => CATEGORIE_MATERIEL[c as keyof typeof CATEGORIE_MATERIEL] ?? c;

export default function MaterielDetail() {
  const { id } = useParams();
  const mid = Number(id);
  const toast = useToast();
  const { detail, update, linkVideaste, unlinkVideaste } = useMaterielDetail(mid);
  const allVideastes = useVideastes().list;

  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selVid, setSelVid] = useState("");
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

  if (detail.isError) {
    return (
      <div>
        <BackButton to="/materiels" />
        <p className="text-danger">Erreur de chargement.</p>
      </div>
    );
  }

  const m = detail.data;

  return (
    <div>
      <BackButton to="/materiels" />
      {!m ? (
        <>
          <SkeletonInfoBlock />
          <div className="mt-8">
            <SkeletonTable />
          </div>
        </>
      ) : (
        <>
          {editing ? (
            <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
              <MaterielForm
                defaultValues={{ categorie: m.categorie as never, nom: m.nom }}
                submitting={update.isPending}
                onCancel={() => setEditing(false)}
                onSubmit={(data) =>
                  update.mutate(data, {
                    onSuccess: () => {
                      setEditing(false);
                      toast("success", "Matériel modifié");
                    },
                  })
                }
              />
            </section>
          ) : (
            <InfoDetailBlock
              name={m.nom}
              badge={<Badge label={catLabel(m.categorie)} tone="gray" />}
              fields={[
                { label: "Catégorie", value: catLabel(m.categorie) },
                { label: "Vidéastes liés", value: String(m.videastes.length) },
              ]}
              onEdit={() => setEditing(true)}
            />
          )}

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

          <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Lier un vidéaste">
            <SelectInput
              value={selVid}
              onChange={setSelVid}
              placeholder="— Choisir un vidéaste —"
              options={(allVideastes.data ?? [])
                .filter((x) => !m.videastes.some((v) => v.videaste.id === x.id))
                .map((x) => ({ value: String(x.id), label: `${x.nom} ${x.prenom}` }))}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={!selVid || linkVideaste.isPending}
                onClick={() =>
                  linkVideaste.mutate(Number(selVid), {
                    onSuccess: () => {
                      setAddOpen(false);
                      setSelVid("");
                      toast("success", "Vidéaste lié");
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
              unlinkVideaste.mutate(confirm.id, {
                onSuccess: () => {
                  setConfirm(null);
                  toast("success", "Vidéaste délié");
                },
              })
            }
            title="Confirmer la déliaison"
            message={`Délier « ${confirm?.label} » de ce matériel ?`}
            confirmLabel="Délier"
            loading={unlinkVideaste.isPending}
          />
        </>
      )}
    </div>
  );
}
