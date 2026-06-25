import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { shootingsApi } from "../api/shootings.api";
import { API, QUERY_KEYS } from "../constants/api";

export function useShootingDetail(id: number) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries();

  const detail = useQuery({
    queryKey: [...QUERY_KEYS.SHOOTINGS, id],
    queryFn: () => shootingsApi.getById(id),
  });

  const update = useMutation({
    mutationFn: (data: unknown) => apiClient.put(`${API.SHOOTINGS}/${id}`, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: () => apiClient.delete(`${API.SHOOTINGS}/${id}`),
    onSuccess: invalidate,
  });

  const linkVideaste = useMutation({
    mutationFn: (body: { videaste_id: number; taux_horaire_videaste: number }) =>
      shootingsApi.linkVideaste(id, body),
    onSuccess: invalidate,
  });

  const unlinkVideaste = useMutation({
    mutationFn: (videasteId: number) => shootingsApi.unlinkVideaste(id, videasteId),
    onSuccess: invalidate,
  });

  return { detail, update, remove, linkVideaste, unlinkVideaste };
}
