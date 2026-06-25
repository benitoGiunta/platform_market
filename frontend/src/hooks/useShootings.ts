import { useCrud } from "./useCrud";
import { API, QUERY_KEYS } from "../constants/api";
import type { ShootingWithRelations } from "../types";

export const useShootings = () =>
  useCrud<ShootingWithRelations>(API.SHOOTINGS, QUERY_KEYS.SHOOTINGS);
