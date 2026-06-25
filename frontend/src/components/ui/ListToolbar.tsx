export function ListToolbar({
  title,
  onAdd,
  deleteMode,
  onToggleDelete,
  onConfirmDelete,
  selectedCount,
}: {
  title: string;
  onAdd: () => void;
  deleteMode: boolean;
  onToggleDelete: () => void;
  onConfirmDelete: () => void;
  selectedCount: number;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-kyn-dark">{title}</h1>
      <div className="flex gap-2">
        {deleteMode ? (
          <>
            <button
              type="button"
              onClick={onConfirmDelete}
              disabled={selectedCount === 0}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Confirmer ({selectedCount})
            </button>
            <button
              type="button"
              onClick={onToggleDelete}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-kyn-dark hover:bg-gray-50"
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onAdd}
              className="rounded-md bg-kyn-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              ＋ Ajouter
            </button>
            <button
              type="button"
              onClick={onToggleDelete}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-kyn-dark hover:bg-gray-50"
            >
              🗑 Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
