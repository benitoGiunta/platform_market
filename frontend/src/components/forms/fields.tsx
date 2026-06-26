import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-primary">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function FormActions({
  submitting,
  onCancel,
}: {
  submitting?: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "…" : "Enregistrer"}
      </button>
    </div>
  );
}
