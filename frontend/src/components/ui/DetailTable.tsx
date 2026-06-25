import type { ReactNode } from "react";

export interface DetailColumn<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
}

const alignClass = (a?: "left" | "center" | "right") =>
  a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

export function DetailTable<T>({
  columns,
  rows,
  getId,
  onRowClick,
  onUnlink,
  unlinkTitle = "Délier",
  addLabel,
  onAdd,
  emptyLabel = "Aucun élément",
}: {
  columns: DetailColumn<T>[];
  rows: T[];
  getId: (row: T) => number | string;
  onRowClick?: (row: T) => void;
  onUnlink?: (row: T) => void;
  unlinkTitle?: string;
  addLabel?: string;
  onAdd?: () => void;
  emptyLabel?: string;
}) {
  const colSpan = columns.length + (onUnlink ? 1 : 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-kyn-dark text-white">
          <tr>
            {onUnlink ? <th className="w-10 px-4 py-3"></th> : null}
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 font-semibold ${alignClass(c.align)}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="px-4 py-6 text-center italic text-gray-500">
                {emptyLabel}
              </td>
            </tr>
          ) : null}

          {rows.map((row) => (
            <tr
              key={getId(row)}
              className={onRowClick ? "cursor-pointer hover:bg-kyn-light/60" : ""}
              onClick={() => onRowClick?.(row)}
            >
              {onUnlink ? (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    aria-label={unlinkTitle}
                    title={unlinkTitle}
                    onClick={() => onUnlink(row)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    ⊖
                  </button>
                </td>
              ) : null}
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 ${alignClass(c.align)}`}>
                  {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}

          {onAdd ? (
            <tr>
              <td colSpan={colSpan} className="px-4 py-3">
                <button
                  type="button"
                  onClick={onAdd}
                  className="text-sm font-medium text-kyn-accent hover:underline"
                >
                  ＋ {addLabel ?? "Ajouter"}
                </button>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
