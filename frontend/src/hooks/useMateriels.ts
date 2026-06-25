import { useCrud } from "./useCrud";
import { API, QUERY_KEYS } from "../constants/api";
import type { Materiel } from "../types";

export const useMateriels = () => useCrud<Materiel>(API.MATERIELS, QUERY_KEYS.MATERIELS);
