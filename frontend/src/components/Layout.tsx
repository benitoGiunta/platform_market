import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Sidebar } from "./ui/Sidebar";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-gray-200 bg-white px-6 py-3">
          <Link
            to="/"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            🏠 Home
          </Link>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
