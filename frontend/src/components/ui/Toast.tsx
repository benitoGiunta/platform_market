/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";
interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

const ToastContext = createContext<(type: ToastType, message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = ++counter.current;
      setItems((l) => [...l, { id, type, message }]);
      if (type === "success") setTimeout(() => remove(id), 2000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white shadow-lg ${
              t.type === "success" ? "bg-accent" : "bg-danger"
            }`}
          >
            {t.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span>{t.message}</span>
            {t.type === "error" ? (
              <button type="button" onClick={() => remove(t.id)} aria-label="Fermer">
                <X size={14} />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
