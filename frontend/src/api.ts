import type { VideasteDetail, VideasteListItem } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function fetchVideastes(): Promise<VideasteListItem[]> {
  const res = await fetch(`${API_URL}/api/videastes`);
  if (!res.ok) throw new Error("Erreur lors du chargement des vidéastes");
  return res.json();
}

export async function fetchVideaste(id: string | number): Promise<VideasteDetail> {
  const res = await fetch(`${API_URL}/api/videastes/${id}`);
  if (res.status === 404) throw new Error("Vidéaste introuvable");
  if (!res.ok) throw new Error("Erreur lors du chargement du vidéaste");
  return res.json();
}
