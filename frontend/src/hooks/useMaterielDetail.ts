import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { materielsApi } from "../api/materiels.api";
import { API, QUERY_KEYS } from "../constants/api";

export function useMaterielDetail(id: number) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries();

  const detail = useQuery({
    queryKey: [...QUERY_KEYS.MATERIELS, id],
    queryFn: () => materielsApi.getById(id),
  });

  const update = useMutation({
    mutationFn: (data: unknown) => apiClient.put(`${API.MATERIELS}/${id}`, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: () => apiClient.delete(`${API.MATERIELS}/${id}`),
    onSuccess: invalidate,
  });

  const linkVideaste = useMutation({
    mutationFn: (videasteId: number) => materielsApi.linkVideaste(id, videasteId),
    onSuccess: invalidate,
  });

  const unlinkVideaste = useMutation({
    mutationFn: (videasteId: number) => materielsApi.unlinkVideaste(id, videasteId),
    onSuccess: invalidate,
  });

  return { detail, update, remove, linkVideaste, unlinkVideaste };
}
