import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Video,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/videastes", label: "Vidéastes", icon: Users },
  { to: "/shootings", label: "Shootings", icon: Video },
  { to: "/clients", label: "Clients", icon: Building2 },
  { to: "/materiels", label: "Matériel", icon: Camera },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  // Replié : bordure verticale 4px accent + languette centrée avec chevron.
  if (collapsed) {
    return (
      <div className="relative w-1 shrink-0 bg-accent">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Ouvrir le menu"
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-md bg-accent px-1.5 py-4 text-white shadow-lg hover:bg-accent/90"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <aside role="navigation" className="flex w-56 shrink-0 flex-col bg-accent">
      <div className="p-4">
        <img
          src="/logo-full-main-no-slogan-no-background.png"
          alt="Markyn"
          className="h-9 w-auto"
        />
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white transition-all duration-150 ${
                  isActive ? "bg-primary" : "hover:translate-x-1 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={onToggle}
        aria-label="Replier le menu"
        className="mt-auto flex items-center gap-2 p-4 text-sm text-white/90 transition hover:text-white"
      >
        <ChevronLeft size={18} />
        <span>Replier</span>
      </button>
    </aside>
  );
}
