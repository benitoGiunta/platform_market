import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

// Gère les 3 états universels d'un écran qui charge des données.
export function QueryBoundary<T>({
  query,
  isEmpty,
  emptyLabel = "Aucun élément enregistré",
  children,
}: {
  query: UseQueryResult<T>;
  isEmpty?: (data: T) => boolean;
  emptyLabel?: string;
  children: (data: T) => ReactNode;
}) {
  if (query.isLoading) {
    return <div className="py-12 text-center text-gray-500">Chargement…</div>;
  }

  if (query.isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">{(query.error as Error).message}</p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-3 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-primary hover:bg-gray-50"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const data = query.data as T;
  if (isEmpty && isEmpty(data)) {
    return <div className="py-12 text-center italic text-gray-500">{emptyLabel}</div>;
  }

  return <>{children(data)}</>;
}
