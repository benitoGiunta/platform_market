import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { videastesApi } from "../api/videastes.api";
import { shootingsApi } from "../api/shootings.api";
import { API, QUERY_KEYS } from "../constants/api";

export function useVideasteDetail(id: number) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries();

  const detail = useQuery({
    queryKey: [...QUERY_KEYS.VIDEASTES, id],
    queryFn: () => videastesApi.getById(id),
  });

  const update = useMutation({
    mutationFn: (data: unknown) => apiClient.put(`${API.VIDEASTES}/${id}`, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: () => apiClient.delete(`${API.VIDEASTES}/${id}`),
    onSuccess: invalidate,
  });

  const linkMateriel = useMutation({
    mutationFn: (materielId: number) => videastesApi.linkMateriel(id, materielId),
    onSuccess: invalidate,
  });

  const unlinkMateriel = useMutation({
    mutationFn: (materielId: number) => videastesApi.unlinkMateriel(id, materielId),
    onSuccess: invalidate,
  });

  // Lier le vidéaste à un shooting existant (via la route shooting↔vidéaste).
  const linkShooting = useMutation({
    mutationFn: ({ shootingId, taux }: { shootingId: number; taux: number }) =>
      shootingsApi.linkVideaste(shootingId, { videaste_id: id, taux_horaire_videaste: taux }),
    onSuccess: invalidate,
  });

  const unlinkShooting = useMutation({
    mutationFn: (shootingId: number) => shootingsApi.unlinkVideaste(shootingId, id),
    onSuccess: invalidate,
  });

  return { detail, update, remove, linkMateriel, unlinkMateriel, linkShooting, unlinkShooting };
}
