import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/ui/AppShell";
import Home from "./pages/Home";
import VideastesList from "./pages/videastes/VideastesList";
import VideasteDetail from "./pages/videastes/VideasteDetail";
import ShootingsList from "./pages/shootings/ShootingsList";
import ShootingDetail from "./pages/shootings/ShootingDetail";
import ClientsList from "./pages/clients/ClientsList";
import ClientDetail from "./pages/clients/ClientDetail";
import MaterielsList from "./pages/materiels/MaterielsList";
import MaterielDetail from "./pages/materiels/MaterielDetail";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/videastes" element={<VideastesList />} />
        <Route path="/videastes/:id" element={<VideasteDetail />} />
        <Route path="/shootings" element={<ShootingsList />} />
        <Route path="/shootings/:id" element={<ShootingDetail />} />
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/materiels" element={<MaterielsList />} />
        <Route path="/materiels/:id" element={<MaterielDetail />} />
      </Route>
    </Routes>
  );
}
