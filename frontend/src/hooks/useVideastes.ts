import { useCrud } from "./useCrud";
import { API, QUERY_KEYS } from "../constants/api";
import type { Videaste } from "../types";

export const useVideastes = () => useCrud<Videaste>(API.VIDEASTES, QUERY_KEYS.VIDEASTES);
