import { apiClient } from "./client";
import { API } from "../constants/api";
import type { ClientDetail } from "../types";

export const clientsApi = {
  getById: (id: number) => apiClient.get<ClientDetail>(`${API.CLIENTS}/${id}`),
};
