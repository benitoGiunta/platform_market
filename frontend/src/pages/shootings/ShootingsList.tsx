import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShootings } from "../../hooks/useShootings";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { QueryBoundary } from "../../components/ui/QueryBoundary";
import { ListToolbar } from "../../components/ui/ListToolbar";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { StatutShootingBadge } from "../../components/ui/Badge";
import { ShootingForm } from "../../components/forms/ShootingForm";
import { STATUT_SHOOTING } from "../../constants/enums";
import { formatDate } from "../../utils";
import type { ShootingWithRelations } from "../../types";

const statutOptions = Object.entries(STATUT_SHOOTING).map(([value, label]) => ({ value, label }));

export default function ShootingsList() {
  const navigate = useNavigate();
  const { list, create, update, remove } = useShootings();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns: Column<ShootingWithRelations>[] = [
    { key: "nom", header: "Nom", editable: true },
    { key: "client", header: "Client", render: (s) => s.client?.nom ?? "—" },
    {
      key: "date",
      header: "Date",
      editable: true,
      editValue: (s) => s.date.slice(0, 10),
      render: (s) => formatDate(s.date),
    },
    { key: "lieu", header: "Lieu", editable: true, render: (s) => s.lieu ?? "—" },
    {
      key: "duree",
      header: "Durée",
      align: "right",
      editable: true,
      editType: "number",
      editValue: (s) => String(s.duree),
      render: (s) => `${s.duree} min`,
    },
    {
      key: "statut",
      header: "Statut",
      align: "center",
      editable: true,
      editType: "select",
      options: statutOptions,
      render: (s) => <StatutShootingBadge statut={s.statut} />,
    },
    {
      key: "taux_horaire_client",
      header: "Taux horaire",
      align: "right",
      editable: true,
      editType: "number",
      editValue: (s) => String(s.taux_horaire_client),
      render: (s) => `${s.taux_horaire_client} €/h`,
    },
  ];

  const handleEdit = (id: number, v: Record<string, string>) =>
    update.mutate({
      id,
      data: {
        nom: v.nom,
        date: v.date,
        lieu: v.lieu,
        duree: Number(v.duree),
        statut: v.statut,
        taux_horaire_client: Number(v.taux_horaire_client),
      },
    });

  const toggleSelect = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const confirmDelete = async () => {
    await Promise.all(selected.map((id) => remove.mutateAsync(id)));
    setSelected([]);
    setDeleteMode(false);
    setConfirmOpen(false);
  };

  return (
    <div>
      <ListToolbar
        title="Shootings"
        onAdd={() => setAddOpen(true)}
        deleteMode={deleteMode}
        onToggleDelete={() => {
          setDeleteMode((d) => !d);
          setSelected([]);
        }}
        onConfirmDelete={() => setConfirmOpen(true)}
        selectedCount={selected.length}
      />

      <QueryBoundary
        query={list}
        isEmpty={(d) => d.length === 0}
        emptyLabel="Aucun shooting enregistré"
      >
        {(data) => (
          <DataTable
            columns={columns}
            rows={data}
            getId={(r) => r.id}
            onRowClick={(r) => navigate(`/shootings/${r.id}`)}
            onEdit={handleEdit}
            editLoading={update.isPending}
            deleteMode={deleteMode}
            selectedIds={selected}
            onToggleSelect={toggleSelect}
          />
        )}
      </QueryBoundary>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un shooting">
        <ShootingForm
          submitting={create.isPending}
          onCancel={() => setAddOpen(false)}
          onSubmit={(data) => create.mutate(data, { onSuccess: () => setAddOpen(false) })}
        />
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`Supprimer ${selected.length} shooting(s) ? Cette action est irréversible.`}
        loading={remove.isPending}
      />
    </div>
  );
}
