import { useCrud } from "./useCrud";
import { API, QUERY_KEYS } from "../constants/api";
import type { Client } from "../types";

export const useClients = () => useCrud<Client>(API.CLIENTS, QUERY_KEYS.CLIENTS);
