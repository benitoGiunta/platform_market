import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "../../hooks/useClients";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { QueryBoundary } from "../../components/ui/QueryBoundary";
import { ListToolbar } from "../../components/ui/ListToolbar";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { ClientForm } from "../../components/forms/ClientForm";
import { DOMAINE_METIER } from "../../constants/enums";
import type { Client } from "../../types";

const domaineOptions = Object.entries(DOMAINE_METIER).map(([value, label]) => ({ value, label }));

export default function ClientsList() {
  const navigate = useNavigate();
  const { list, create, update, remove } = useClients();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns: Column<Client>[] = [
    { key: "nom", header: "Nom", editable: true },
    { key: "nom_legal", header: "Nom légal", editable: true, render: (c) => c.nom_legal ?? "—" },
    {
      key: "domaine_metier",
      header: "Domaine",
      editable: true,
      editType: "select",
      options: domaineOptions,
      editValue: (c) => c.domaine_metier ?? "",
      render: (c) => c.domaine_metier ?? "—",
    },
    { key: "email", header: "Email", editable: true, render: (c) => c.email ?? "—" },
    { key: "telephone", header: "Téléphone", editable: true, render: (c) => c.telephone ?? "—" },
    {
      key: "nombre_shootings",
      header: "Nb shootings",
      align: "center",
      render: (c) => c._count?.shootings ?? 0,
    },
  ];

  const handleEdit = (id: number, v: Record<string, string>) =>
    update.mutate({
      id,
      data: {
        nom: v.nom,
        nom_legal: v.nom_legal,
        domaine_metier: v.domaine_metier || null,
        email: v.email,
        telephone: v.telephone,
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
        title="Clients"
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
        emptyLabel="Aucun client enregistré"
      >
        {(data) => (
          <DataTable
            columns={columns}
            rows={data}
            getId={(r) => r.id}
            onRowClick={(r) => navigate(`/clients/${r.id}`)}
            onEdit={handleEdit}
            editLoading={update.isPending}
            deleteMode={deleteMode}
            selectedIds={selected}
            onToggleSelect={toggleSelect}
          />
        )}
      </QueryBoundary>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un client">
        <ClientForm
          submitting={create.isPending}
          onCancel={() => setAddOpen(false)}
          onSubmit={(data) => create.mutate(data, { onSuccess: () => setAddOpen(false) })}
        />
        {create.isError ? (
          <p className="mt-3 text-sm text-red-600">{(create.error as Error).message}</p>
        ) : null}
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message={`Supprimer ${selected.length} client(s) ? Les shootings liés seront détachés.`}
        loading={remove.isPending}
      />
    </div>
  );
}
