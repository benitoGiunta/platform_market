import { Routes, Route } from "react-router-dom";
import VideastesListPage from "./pages/VideastesListPage";
import VideasteDetailPage from "./pages/VideasteDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VideastesListPage />} />
      <Route path="/videaste/:id" element={<VideasteDetailPage />} />
    </Routes>
  );
}
