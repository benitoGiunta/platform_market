// Codes d'erreur centralisés.
export const ERRORS = {
  NOT_FOUND: { code: "NOT_FOUND", message: "Ressource introuvable", status: 404 },
  FORBIDDEN: { code: "FORBIDDEN", message: "Accès refusé", status: 403 },
  CONFLICT: { code: "CONFLICT", message: "Conflit de données", status: 409 },
  SYSTEM_ITEM: { code: "SYSTEM_ITEM", message: "Élément système protégé", status: 403 },
  VALIDATION: { code: "VALIDATION", message: "Données invalides", status: 400 },
  RATE_LIMIT: { code: "RATE_LIMIT", message: "Trop de requêtes", status: 429 },
  SERVER_ERROR: { code: "SERVER_ERROR", message: "Erreur serveur", status: 500 },
} as const;
