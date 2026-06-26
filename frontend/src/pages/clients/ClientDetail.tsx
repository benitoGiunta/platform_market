import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useClientDetail } from "../../hooks/useClientDetail";
import { useToast } from "../../hooks/useToast";
import { BackButton } from "../../components/BackButton";
import { DetailTable, type DetailColumn } from "../../components/ui/DetailTable";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { InfoDetailBlock } from "../../components/ui/InfoDetailBlock";
import { DonutChart } from "../../components/ui/DonutChart";
import { KpiCard } from "../../components/ui/KpiCard";
import { ErrorBoundary } from "../../components/ui/ErrorBoundary";
import { StatutShootingBadge } from "../../components/ui/Badge";
import { SkeletonInfoBlock, SkeletonTable } from "../../components/ui/Skeletons";
import { ClientForm } from "../../components/forms/ClientForm";
import { ShootingForm } from "../../components/forms/ShootingForm";
import { DOMAINE_METIER } from "../../constants/enums";
import { formatDate, formatDuration } from "../../utils/format";
import type { ClientDetail as TClientDetail } from "../../types";

type ShootRow = TClientDetail["shootings"][number];

export default function ClientDetail() {
  const { id } = useParams();
  const cid = Number(id);
  const navigate = useNavigate();
  const toast = useToast();
  const { detail, update, createShooting, detachShooting } = useClientDetail(cid);

  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ id: number; label: string } | null>(null);

  const cols: DetailColumn<ShootRow>[] = [
    {
      key: "nom",
      header: "Nom shooting",
      render: (s) => (
        <Link
          to={`/shootings/${s.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-accent hover:underline"
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
                  className="text-accent hover:underline"
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

  if (detail.isError) {
    return (
      <div>
        <BackButton to="/clients" />
        <p className="text-danger">Erreur de chargement.</p>
      </div>
    );
  }

  const c = detail.data;

  return (
    <div>
      <BackButton to="/clients" />
      {!c ? (
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
                  site_web: c.site_web ?? "",
                }}
                submitting={update.isPending}
                onCancel={() => setEditing(false)}
                onSubmit={(data) =>
                  update.mutate(data, {
                    onSuccess: () => {
                      setEditing(false);
                      toast("success", "Client modifié");
                    },
                  })
                }
              />
            </section>
          ) : (
            <InfoDetailBlock
              name={c.nom}
              subname={c.nom_legal ?? undefined}
              fields={[
                { label: "Email", value: c.email ?? null, type: "email" },
                { label: "Téléphone", value: c.telephone ?? null, type: "tel" },
                { label: "Site web", value: c.site_web ?? null, type: "web" },
                { label: "Adresse", value: c.adresse ?? null, type: "address" },
                { label: "Numéro TVA", value: c.numero_tva ?? null },
                {
                  label: "Domaine métier",
                  value: c.domaine_metier ? DOMAINE_METIER[c.domaine_metier] : null,
                },
                {
                  label: "Date de création",
                  value: c.date_creation ? formatDate(c.date_creation) : null,
                },
              ]}
              onEdit={() => setEditing(true)}
            />
          )}

          <h2 className="mb-3 text-xl font-bold text-primary">Shootings</h2>
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

          <h2 className="mb-3 text-xl font-bold text-primary">Indicateurs</h2>
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
            <ErrorBoundary>
              <DonutChart
                margeBrute={c.kpi.marge_brute_totale}
                couts={c.kpi.couts_totaux}
                benefice={c.kpi.benefice_total}
              />
            </ErrorBoundary>
            <KpiCard label="Nombre de shootings" value={c.kpi.nb_shootings} />
            <KpiCard
              label="Durée totale"
              value={formatDuration(Math.round(c.kpi.duree_totale_heures * 60))}
            />
          </div>

          <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Créer un shooting">
            <ShootingForm
              defaultValues={{ client_id: String(c.id) }}
              submitting={createShooting.isPending}
              onCancel={() => setAddOpen(false)}
              onSubmit={(data) =>
                createShooting.mutate(data, {
                  onSuccess: () => {
                    setAddOpen(false);
                    toast("success", "Shooting créé");
                  },
                })
              }
            />
            {createShooting.isError ? (
              <p className="mt-3 text-sm text-danger">{(createShooting.error as Error).message}</p>
            ) : null}
          </Modal>

          <ConfirmModal
            open={confirm !== null}
            onClose={() => setConfirm(null)}
            onConfirm={() =>
              confirm &&
              detachShooting.mutate(confirm.id, {
                onSuccess: () => {
                  setConfirm(null);
                  toast("success", "Shooting détaché");
                },
              })
            }
            title="Confirmer le détachement"
            message={`Détacher « ${confirm?.label} » de ce client ? Le shooting ne sera pas supprimé.`}
            confirmLabel="Détacher"
            loading={detachShooting.isPending}
          />
        </>
      )}
    </div>
  );
}
