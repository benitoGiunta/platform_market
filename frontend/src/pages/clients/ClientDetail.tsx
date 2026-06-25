import { useParams } from "react-router-dom";
import { BackButton } from "../../components/BackButton";

// Placeholder — détail complet (KPI) en Phase 8.
export default function ClientDetail() {
  const { id } = useParams();
  return (
    <div>
      <BackButton to="/clients" />
      <h1 className="text-2xl font-bold text-kyn-dark">Client #{id}</h1>
      <p className="mt-2 text-gray-500">Détail à venir (Phase 8).</p>
    </div>
  );
}
