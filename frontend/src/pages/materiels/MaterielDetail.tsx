import { useParams } from "react-router-dom";
import { BackButton } from "../../components/BackButton";

// Placeholder — détail complet en Phase 8.
export default function MaterielDetail() {
  const { id } = useParams();
  return (
    <div>
      <BackButton to="/materiels" />
      <h1 className="text-2xl font-bold text-kyn-dark">Matériel #{id}</h1>
      <p className="mt-2 text-gray-500">Détail à venir (Phase 8).</p>
    </div>
  );
}
