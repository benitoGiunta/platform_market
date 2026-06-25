const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Réponse API standardisée : { success, data } ou { success:false, error }.
interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as ApiEnvelope<T>;
  if (!json.success) {
    throw new Error(json.error?.message ?? "Erreur inconnue");
  }
  return json.data as T;
}

export const apiClient = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>("GET", path, undefined, headers),
  post: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>("POST", path, body, headers),
  put: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>("PUT", path, body, headers),
  delete: <T>(path: string, headers?: Record<string, string>) =>
    request<T>("DELETE", path, undefined, headers),
};
