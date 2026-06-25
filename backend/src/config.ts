import "dotenv/config";
import { z } from "zod";

// Validation des variables d'environnement au démarrage.
// L'application refuse de démarrer si une variable requise est absente/invalide.
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL requis"),
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  SEED_SECRET: z.string().min(1, "SEED_SECRET requis"),
  NODE_ENV: z.string().default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variables d'environnement invalides :");
  console.error(parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"));
  process.exit(1);
}

export const config = parsed.data;
