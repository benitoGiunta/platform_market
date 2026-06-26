import { useState, type ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  // Affichage personnalisé d'une cellule (sinon row[key]).
  render?: (row: T) => ReactNode;
  // Édition inline.
  editable?: boolean;
  editType?: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  // Valeur brute utilisée comme valeur initiale d'édition (sinon row[key]).
  editValue?: (row: T) => string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getId: (row: T) => number;
  onRowClick?: (row: T) => void;
  // Édition inline : si fourni, une colonne d'actions (crayon / ✓ ✗) apparaît.
  onEdit?: (id: number, values: Record<string, string>) => void;
  editLoading?: boolean;
  // Mode suppression : cases à cocher + tableau grisé.
  deleteMode?: boolean;
  selectedIds?: number[];
  onToggleSelect?: (id: number) => void;
}

const alignClass = (a?: "left" | "center" | "right") =>
  a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

export function DataTable<T>({
  columns,
  rows,
  getId,
  onRowClick,
  onEdit,
  editLoading = false,
  deleteMode = false,
  selectedIds = [],
  onToggleSelect,
}: DataTableProps<T>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const startEdit = (row: T) => {
    const initial: Record<string, string> = {};
    for (const col of columns) {
      if (col.editable) {
        initial[col.key] = col.editValue
          ? col.editValue(row)
          : String((row as Record<string, unknown>)[col.key] ?? "");
      }
    }
    setDraft(initial);
    setEditingId(getId(row));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = (id: number) => {
    onEdit?.(id, draft);
    setEditingId(null);
    setDraft({});
  };

  return (
    <div
      className={`overflow-x-auto rounded-lg border border-gray-200 bg-white ${deleteMode ? "opacity-70" : ""}`}
    >
      <table className="w-full text-left text-sm">
        <thead className="bg-primary text-white">
          <tr>
            {deleteMode ? <th className="w-10 px-4 py-3"></th> : null}
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 font-semibold ${alignClass(col.align)}`}>
                {col.header}
              </th>
            ))}
            {onEdit ? <th className="w-24 px-4 py-3 text-right font-semibold">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => {
            const id = getId(row);
            const isEditing = editingId === id;
            const isSelected = selectedIds.includes(id);
            return (
              <tr
                key={id}
                className={
                  !deleteMode && !isEditing && onRowClick ? "cursor-pointer hover:bg-light/60" : ""
                }
                onClick={() => {
                  if (deleteMode || isEditing) return;
                  onRowClick?.(row);
                }}
              >
                {deleteMode ? (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(id)}
                    />
                  </td>
                ) : null}

                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${alignClass(col.align)}`}>
                    {isEditing && col.editable ? (
                      col.editType === "select" ? (
                        <select
                          className="w-full rounded border border-gray-300 px-2 py-1"
                          value={draft[col.key] ?? ""}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setDraft({ ...draft, [col.key]: e.target.value })}
                        >
                          {col.options?.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.editType === "number" ? "number" : "text"}
                          className="w-full rounded border border-gray-300 px-2 py-1"
                          value={draft[col.key] ?? ""}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setDraft({ ...draft, [col.key]: e.target.value })}
                        />
                      )
                    ) : col.render ? (
                      col.render(row)
                    ) : (
                      String((row as Record<string, unknown>)[col.key] ?? "")
                    )}
                  </td>
                ))}

                {onEdit ? (
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label="Sauvegarder"
                          disabled={editLoading}
                          onClick={() => saveEdit(id)}
                          className="rounded bg-accent px-2 py-1 text-white disabled:opacity-50"
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          aria-label="Annuler"
                          onClick={cancelEdit}
                          className="rounded bg-gray-300 px-2 py-1 text-gray-700"
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-label="Éditer"
                        disabled={deleteMode}
                        onClick={() => startEdit(row)}
                        className="rounded px-2 py-1 text-primary hover:bg-gray-100 disabled:opacity-40"
                      >
                        ✎
                      </button>
                    )}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
