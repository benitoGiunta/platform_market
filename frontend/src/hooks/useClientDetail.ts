import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { clientsApi } from "../api/clients.api";
import { API, QUERY_KEYS } from "../constants/api";

export function useClientDetail(id: number) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries();

  const detail = useQuery({
    queryKey: [...QUERY_KEYS.CLIENTS, id],
    queryFn: () => clientsApi.getById(id),
  });

  const update = useMutation({
    mutationFn: (data: unknown) => apiClient.put(`${API.CLIENTS}/${id}`, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: () => apiClient.delete(`${API.CLIENTS}/${id}`),
    onSuccess: invalidate,
  });

  // Créer un shooting rattaché à ce client.
  const createShooting = useMutation({
    mutationFn: (data: unknown) => apiClient.post(API.SHOOTINGS, data),
    onSuccess: invalidate,
  });

  // Détacher un shooting (client_id → null) via mise à jour du shooting.
  const detachShooting = useMutation({
    mutationFn: (shootingId: number) =>
      apiClient.put(`${API.SHOOTINGS}/${shootingId}`, { client_id: null }),
    onSuccess: invalidate,
  });

  return { detail, update, remove, createShooting, detachShooting };
}
