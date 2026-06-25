import { apiClient } from "./client";
import { API } from "../constants/api";
import type { ShootingDetail } from "../types";

export const shootingsApi = {
  getById: (id: number) => apiClient.get<ShootingDetail>(`${API.SHOOTINGS}/${id}`),
  linkVideaste: (id: number, body: { videaste_id: number; taux_horaire_videaste: number }) =>
    apiClient.post(`${API.SHOOTINGS}/${id}/videastes`, body),
  unlinkVideaste: (id: number, videasteId: number) =>
    apiClient.delete(`${API.SHOOTINGS}/${id}/videastes/${videasteId}`),
};
