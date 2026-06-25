import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMateriels } from "../../hooks/useMateriels";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { QueryBoundary } from "../../components/ui/QueryBoundary";
import { ListToolbar } from "../../components/ui/ListToolbar";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { MaterielForm } from "../../components/forms/MaterielForm";
import { CATEGORIE_MATERIEL } from "../../constants/enums";
import type { Materiel } from "../../types";

const categorieOptions = Object.entries(CATEGORIE_MATERIEL).map(([value, label]) => ({
  value,
  label,
}));

export default function MaterielsList() {
  const navigate = useNavigate();
  const { list, create, update, remove } = useMateriels();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns: Column<Materiel>[] = [
    {
      key: "categorie",
      header: "Catégorie",
      editable: true,
      editType: "select",
      options: categorieOptions,
      editValue: (m) => m.categorie,
      render: (m) =>
        CATEGORIE_MATERIEL[m.categorie as keyof typeof CATEGORIE_MATERIEL] ?? m.categorie,
    },
    { key: "nom", header: "Nom", editable: true },
    {
      key: "nombre_videastes",
      header: "Nb vidéastes",
      align: "center",
      render: (m) => m._count?.videastes ?? 0,
    },
  ];

  const handleEdit = (id: number, v: Record<string, string>) =>
    update.mutate({ id, data: { categorie: v.categorie, nom: v.nom } });

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
        title="Matériel"
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
        emptyLabel="Aucun matériel enregistré"
      >
        {(data) => (
          <DataTable
            columns={columns}
            rows={data}
            getId={(r) => r.id}
            onRowClick={(r) => navigate(`/materiels/${r.id}`)}
            onEdit={handleEdit}
            editLoading={update.isPending}
            deleteMode={deleteMode}
            selectedIds={selected}
            onToggleSelect={toggleSelect}
          />
        )}
      </QueryBoundary>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un matériel">
        <MaterielForm
          submitting={create.isPending}
          onCancel={() => setAddOpen(false)}
          onSubmit={(data) => create.mutate(data, { onSuccess: () => setAddOpen(false) })}
        />
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`Supprimer ${selected.length} matériel(s) ? Cette action est irréversible.`}
        loading={remove.isPending}
      />
    </div>
  );
}
