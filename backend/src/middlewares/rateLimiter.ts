import rateLimit from "express-rate-limit";

// Limite à 100 requêtes / minute / IP. Protège contre brute-force et scraping.
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: { code: "RATE_LIMIT", message: "Trop de requêtes, réessayez dans une minute." },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
