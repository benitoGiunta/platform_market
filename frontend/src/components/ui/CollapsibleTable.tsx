import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Table avec header cliquable qui déplie/replie son contenu.
export function CollapsibleTable({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-semibold text-primary transition hover:bg-light"
      >
        <span>
          {title}
          {count != null ? ` (${count})` : ""}
        </span>
        <ChevronDown size={18} className={`transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open ? <div className="border-t border-gray-100">{children}</div> : null}
    </div>
  );
}
