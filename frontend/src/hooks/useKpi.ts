import { useQuery } from "@tanstack/react-query";
import { shootingsApi } from "../api/shootings.api";
import { clientsApi } from "../api/clients.api";
import { QUERY_KEYS } from "../constants/api";
import type { ShootingDetail, ClientDetail } from "../types";

// Hook KPI générique — réutilise le cache du détail (même queryKey, pas de double fetch).
// Le consommateur connaît le type concret selon `type` ("shooting" -> ShootingDetail).
export function useKpi(type: "shooting" | "client", id: number) {
  const query = useQuery<ShootingDetail | ClientDetail>({
    queryKey: type === "shooting" ? [...QUERY_KEYS.SHOOTINGS, id] : [...QUERY_KEYS.CLIENTS, id],
    queryFn: () => (type === "shooting" ? shootingsApi.getById(id) : clientsApi.getById(id)),
  });
  return { data: query.data, isLoading: query.isLoading };
}
