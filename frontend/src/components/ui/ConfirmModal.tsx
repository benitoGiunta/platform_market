import { Modal } from "./Modal";

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmer la suppression",
  message,
  confirmLabel = "Supprimer",
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-primary">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
