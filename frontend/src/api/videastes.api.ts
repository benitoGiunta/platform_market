import { apiClient } from "./client";
import { API } from "../constants/api";
import type { VideasteDetail } from "../types";

export const videastesApi = {
  getById: (id: number) => apiClient.get<VideasteDetail>(`${API.VIDEASTES}/${id}`),
  linkMateriel: (id: number, materiel_id: number) =>
    apiClient.post(`${API.VIDEASTES}/${id}/materiels`, { materiel_id }),
  unlinkMateriel: (id: number, materielId: number) =>
    apiClient.delete(`${API.VIDEASTES}/${id}/materiels/${materielId}`),
};
