import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Sidebar } from "./Sidebar";

// Layout global : topbar (primary) + sidebar (accent) + contenu animé (fade).
export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-light">
      <header className="sticky top-0 z-30 bg-primary">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex w-32 items-center">
            {collapsed ? (
              <img src="/logo-app-no-background.png" alt="Markyn" className="h-8 w-auto" />
            ) : null}
          </div>
          <span className="font-syne text-2xl font-bold text-white">Markyn</span>
          <div className="flex w-32 justify-end">
            <Link
              to="/"
              aria-label="Accueil"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition active:scale-95"
            >
              <Home size={18} />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <main className="min-w-0 flex-1 p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
