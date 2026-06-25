import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { API, SEED_KEY } from "../constants/api";

const seedHeaders = { "x-seed-key": SEED_KEY };

// Mutations seed/reset — protégées par le header x-seed-key.
// Invalide tout le cache au succès pour rafraîchir les listes.
export function useSeed() {
  const queryClient = useQueryClient();
  const invalidateAll = () => queryClient.invalidateQueries();

  const load = useMutation({
    mutationFn: () => apiClient.post(API.SEED, {}, seedHeaders),
    onSuccess: invalidateAll,
  });

  const reset = useMutation({
    mutationFn: () => apiClient.delete(API.SEED, seedHeaders),
    onSuccess: invalidateAll,
  });

  return { load, reset };
}
