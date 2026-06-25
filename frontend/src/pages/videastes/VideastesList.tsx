import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVideastes } from "../../hooks/useVideastes";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { QueryBoundary } from "../../components/ui/QueryBoundary";
import { ListToolbar } from "../../components/ui/ListToolbar";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { StatutVideasteBadge } from "../../components/ui/Badge";
import { VideasteForm } from "../../components/forms/VideasteForm";
import { STATUT_VIDEASTE } from "../../constants/enums";
import type { Videaste } from "../../types";

const statutOptions = Object.entries(STATUT_VIDEASTE).map(([value, label]) => ({ value, label }));

export default function VideastesList() {
  const navigate = useNavigate();
  const { list, create, update, remove } = useVideastes();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns: Column<Videaste>[] = [
    { key: "nom", header: "Nom", editable: true },
    { key: "prenom", header: "Prénom", editable: true },
    {
      key: "nombre_shootings",
      header: "Nb shootings",
      align: "center",
      render: (v) => v._count?.shootings ?? 0,
    },
    {
      key: "taux_horaire",
      header: "Taux horaire",
      align: "right",
      editable: true,
      editType: "number",
      editValue: (v) => String(v.taux_horaire),
      render: (v) => `${v.taux_horaire} €/h`,
    },
    {
      key: "statut",
      header: "Statut",
      align: "center",
      editable: true,
      editType: "select",
      options: statutOptions,
      render: (v) => <StatutVideasteBadge statut={v.statut} />,
    },
  ];

  const handleEdit = (id: number, values: Record<string, string>) =>
    update.mutate({
      id,
      data: {
        nom: values.nom,
        prenom: values.prenom,
        taux_horaire: Number(values.taux_horaire),
        statut: values.statut,
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
        title="Vidéastes"
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
        emptyLabel="Aucun vidéaste enregistré"
      >
        {(data) => (
          <DataTable
            columns={columns}
            rows={data}
            getId={(r) => r.id}
            onRowClick={(r) => navigate(`/videastes/${r.id}`)}
            onEdit={handleEdit}
            editLoading={update.isPending}
            deleteMode={deleteMode}
            selectedIds={selected}
            onToggleSelect={toggleSelect}
          />
        )}
      </QueryBoundary>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un vidéaste">
        <VideasteForm
          submitting={create.isPending}
          onCancel={() => setAddOpen(false)}
          onSubmit={(data) => create.mutate(data, { onSuccess: () => setAddOpen(false) })}
        />
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`Supprimer ${selected.length} vidéaste(s) ? Cette action est irréversible.`}
        loading={remove.isPending}
      />
    </div>
  );
}
