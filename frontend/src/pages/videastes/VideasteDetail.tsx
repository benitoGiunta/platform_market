import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useVideasteDetail } from "../../hooks/useVideasteDetail";
import { useMateriels } from "../../hooks/useMateriels";
import { useShootings } from "../../hooks/useShootings";
import { useToast } from "../../hooks/useToast";
import { BackButton } from "../../components/BackButton";
import { DetailTable, type DetailColumn } from "../../components/ui/DetailTable";
import { CollapsibleTable } from "../../components/ui/CollapsibleTable";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { InfoDetailBlock } from "../../components/ui/InfoDetailBlock";
import { SelectInput } from "../../components/ui/SelectInput";
import { StatutVideasteBadge, StatutShootingBadge } from "../../components/ui/Badge";
import { SkeletonInfoBlock, SkeletonTable } from "../../components/ui/Skeletons";
import { VideasteForm } from "../../components/forms/VideasteForm";
import { CATEGORIE_MATERIEL } from "../../constants/enums";
import { formatDate } from "../../utils/format";
import type { VideasteDetail as TVideasteDetail } from "../../types";

type MatRow = TVideasteDetail["materiels"][number];
type ShootRow = TVideasteDetail["shootings"][number];
const catLabel = (c: string) => CATEGORIE_MATERIEL[c as keyof typeof CATEGORIE_MATERIEL] ?? c;

export default function VideasteDetail() {
  const { id } = useParams();
  const vid = Number(id);
  const navigate = useNavigate();
  const toast = useToast();
  const { detail, update, linkMateriel, unlinkMateriel, linkShooting, unlinkShooting } =
    useVideasteDetail(vid);
  const allMateriels = useMateriels().list;
  const allShootings = useShootings().list;

  const [editing, setEditing] = useState(false);
  const [addMatOpen, setAddMatOpen] = useState(false);
  const [addShootOpen, setAddShootOpen] = useState(false);
  const [selMat, setSelMat] = useState("");
  const [selShoot, setSelShoot] = useState("");
  const [confirm, setConfirm] = useState<{
    kind: "mat" | "shoot";
    id: number;
    label: string;
  } | null>(null);

  const onConfirm = () => {
    if (!confirm) return;
    const opts = {
      onSuccess: () => {
        setConfirm(null);
        toast("success", "Délié");
      },
    };
    if (confirm.kind === "mat") unlinkMateriel.mutate(confirm.id, opts);
    else unlinkShooting.mutate(confirm.id, opts);
  };

  const matCols: DetailColumn<MatRow>[] = [
    { key: "categorie", header: "Catégorie", render: (m) => catLabel(m.materiel.categorie) },
    { key: "nom", header: "Nom", render: (m) => m.materiel.nom },
  ];

  const shootCols: DetailColumn<ShootRow>[] = [
    { key: "nom", header: "Nom shooting", render: (r) => r.shooting.nom },
    {
      key: "client",
      header: "Client",
      render: (r) =>
        r.shooting.client ? (
          <Link
            to={`/clients/${r.shooting.client.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-accent hover:underline"
          >
            {r.shooting.client.nom}
          </Link>
        ) : (
          "—"
        ),
    },
    { key: "date", header: "Date", render: (r) => formatDate(r.shooting.date) },
    { key: "lieu", header: "Lieu", render: (r) => r.shooting.lieu ?? "—" },
    {
      key: "statut",
      header: "Statut",
      align: "center",
      render: (r) => <StatutShootingBadge statut={r.shooting.statut} />,
    },
    {
      key: "taux",
      header: "Taux horaire",
      align: "right",
      render: (r) => `${r.taux_horaire_videaste} €/h`,
    },
  ];

  if (detail.isError) {
    return (
      <div>
        <BackButton to="/videastes" />
        <p className="text-danger">Erreur de chargement.</p>
      </div>
    );
  }

  const v = detail.data;

  return (
    <div>
      <BackButton to="/videastes" />
      {!v ? (
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
              <VideasteForm
                defaultValues={{
                  nom: v.nom,
                  prenom: v.prenom,
                  email: v.email ?? "",
                  telephone: v.telephone ?? "",
                  statut: v.statut,
                  taux_horaire: Number(v.taux_horaire),
                }}
                submitting={update.isPending}
                onCancel={() => setEditing(false)}
                onSubmit={(data) =>
                  update.mutate(data, {
                    onSuccess: () => {
                      setEditing(false);
                      toast("success", "Vidéaste modifié");
                    },
                  })
                }
              />
            </section>
          ) : (
            <InfoDetailBlock
              name={v.nom}
              subname={v.prenom}
              badge={<StatutVideasteBadge statut={v.statut} />}
              fields={[
                { label: "Email", value: v.email ?? null, type: "email" },
                { label: "Téléphone", value: v.telephone ?? null, type: "tel" },
                { label: "Taux horaire", value: `${v.taux_horaire} €/h` },
              ]}
              onEdit={() => setEditing(true)}
            />
          )}

          {/* Shootings AVANT matériel */}
          <h2 className="mb-3 text-xl font-bold text-primary">Shootings</h2>
          <div className="mb-8">
            <DetailTable
              columns={shootCols}
              rows={v.shootings}
              getId={(s) => s.id}
              onRowClick={(s) => navigate(`/shootings/${s.shooting.id}`)}
              onUnlink={(s) =>
                setConfirm({ kind: "shoot", id: s.shooting.id, label: s.shooting.nom })
              }
              unlinkTitle="Délier du shooting"
              addLabel="Ajouter un shooting"
              onAdd={() => setAddShootOpen(true)}
              emptyLabel="Aucun shooting enregistré"
            />
          </div>

          {/* Matériel en collapse */}
          <div className="mb-8">
            <CollapsibleTable title="Matériel" count={v.materiels.length}>
              <DetailTable
                columns={matCols}
                rows={v.materiels}
                getId={(m) => m.id}
                onRowClick={(m) => navigate(`/materiels/${m.materiel.id}`)}
                onUnlink={(m) =>
                  setConfirm({ kind: "mat", id: m.materiel.id, label: m.materiel.nom })
                }
                addLabel="Ajouter un matériel"
                onAdd={() => setAddMatOpen(true)}
                emptyLabel="Aucun matériel lié"
              />
            </CollapsibleTable>
          </div>

          <Modal open={addMatOpen} onClose={() => setAddMatOpen(false)} title="Lier un matériel">
            <SelectInput
              value={selMat}
              onChange={setSelMat}
              placeholder="— Choisir un matériel —"
              options={(allMateriels.data ?? [])
                .filter((mm) => !v.materiels.some((x) => x.materiel.id === mm.id))
                .map((mm) => ({
                  value: String(mm.id),
                  label: `${catLabel(mm.categorie)} — ${mm.nom}`,
                }))}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={!selMat || linkMateriel.isPending}
                onClick={() =>
                  linkMateriel.mutate(Number(selMat), {
                    onSuccess: () => {
                      setAddMatOpen(false);
                      setSelMat("");
                      toast("success", "Matériel lié");
                    },
                  })
                }
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>
          </Modal>

          <Modal
            open={addShootOpen}
            onClose={() => setAddShootOpen(false)}
            title="Lier un shooting"
          >
            <SelectInput
              value={selShoot}
              onChange={setSelShoot}
              placeholder="— Choisir un shooting —"
              options={(allShootings.data ?? [])
                .filter((s) => !v.shootings.some((x) => x.shooting.id === s.id))
                .map((s) => ({ value: String(s.id), label: `${s.nom} (${formatDate(s.date)})` }))}
            />
            <p className="mt-2 text-xs text-gray-500">
              Taux horaire appliqué : {v.taux_horaire} €/h (taux du vidéaste)
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={!selShoot || linkShooting.isPending}
                onClick={() =>
                  linkShooting.mutate(
                    { shootingId: Number(selShoot), taux: Number(v.taux_horaire) },
                    {
                      onSuccess: () => {
                        setAddShootOpen(false);
                        setSelShoot("");
                        toast("success", "Shooting lié");
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
            onConfirm={onConfirm}
            title="Confirmer la déliaison"
            message={`Délier « ${confirm?.label} » de ce vidéaste ?`}
            confirmLabel="Délier"
            loading={unlinkMateriel.isPending || unlinkShooting.isPending}
          />
        </>
      )}
    </div>
  );
}
