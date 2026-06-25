import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Hook CRUD générique TanStack Query — étendu par chaque hook d'entité.
export function useCrud<T>(endpoint: string, queryKey: readonly string[]) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [...queryKey] });

  const list = useQuery({
    queryKey: [...queryKey],
    queryFn: () => apiClient.get<T[]>(endpoint),
  });

  const create = useMutation({
    mutationFn: (data: unknown) => apiClient.post(endpoint, data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      apiClient.put(`${endpoint}/${id}`, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiClient.delete(`${endpoint}/${id}`),
    onSuccess: invalidate,
  });

  return { list, create, update, remove };
}
