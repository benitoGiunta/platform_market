import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { API, QUERY_KEYS } from "../constants/api";
import type { StatutShooting, ShootingDetail } from "../types";

// Toute la logique du flux de travail : changement de statut (drag) + pause.
export function useWorkflow(shootingId: number) {
  const qc = useQueryClient();
  const queryKey = [...QUERY_KEYS.SHOOTINGS, shootingId];
  const invalidate = () => qc.invalidateQueries();

  const changeStatut = useMutation({
    mutationFn: (statut: StatutShooting) =>
      apiClient.put(`${API.SHOOTINGS}/${shootingId}`, { statut }),
    // Mise à jour optimiste : la boule se déplace immédiatement.
    onMutate: async (statut) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<ShootingDetail>(queryKey);
      if (prev) qc.setQueryData<ShootingDetail>(queryKey, { ...prev, statut });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
    },
    onSettled: invalidate,
  });

  const togglePause = useMutation({
    mutationFn: (next: boolean) =>
      apiClient.put(`${API.SHOOTINGS}/${shootingId}`, { is_paused: next }),
    onSettled: invalidate,
  });

  return {
    onStatutChange: (statut: StatutShooting) => changeStatut.mutate(statut),
    onTogglePause: (currentlyPaused: boolean) => togglePause.mutate(!currentlyPaused),
    isPending: changeStatut.isPending || togglePause.isPending,
  };
}
