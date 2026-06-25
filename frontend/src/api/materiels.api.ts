import { apiClient } from "./client";
import { API } from "../constants/api";
import type { MaterielDetail } from "../types";

export const materielsApi = {
  getById: (id: number) => apiClient.get<MaterielDetail>(`${API.MATERIELS}/${id}`),
  linkVideaste: (id: number, videaste_id: number) =>
    apiClient.post(`${API.MATERIELS}/${id}/videastes`, { videaste_id }),
  unlinkVideaste: (id: number, videasteId: number) =>
    apiClient.delete(`${API.MATERIELS}/${id}/videastes/${videasteId}`),
};
