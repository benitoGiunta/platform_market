import { NavLink } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

const ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: "🏠", end: true },
  { to: "/videastes", label: "Vidéastes", icon: "🎬" },
  { to: "/shootings", label: "Shootings", icon: "📅" },
  { to: "/clients", label: "Clients", icon: "👤" },
  { to: "/materiels", label: "Matériel", icon: "🎥" },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  // État replié : la sidebar disparaît, seul un signet à chevron reste visible.
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label="Ouvrir le menu"
        className="fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-md bg-kyn-dark px-2 py-4 text-white shadow-lg hover:bg-kyn-dark/90"
      >
        ›
      </button>
    );
  }

  return (
    <aside className="flex w-56 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <img src="/logo-app-no-background.png" alt="Markyn" className="h-7 w-7" />
          <span className="text-lg font-bold text-kyn-dark">Markyn</span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Replier le menu"
          className="rounded px-1 text-kyn-dark hover:bg-kyn-light"
        >
          ‹
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-kyn-accent text-white" : "text-kyn-dark hover:bg-kyn-light"
              }`
            }
          >
            <span aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
