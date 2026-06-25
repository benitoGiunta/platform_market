import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { fail } from "../lib/reply.js";

// Middleware de gestion d'erreurs centralisé — toujours en dernier dans index.ts.
// Ne logge jamais de données utilisateur : uniquement un code/nom d'erreur.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return fail(res, "VALIDATION", "Données invalides", 400);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return fail(res, "CONFLICT", "Conflit de données (doublon)", 409);
    }
    if (err.code === "P2025") {
      return fail(res, "NOT_FOUND", "Ressource introuvable", 404);
    }
    console.error(`[error] prisma:${err.code}`);
    return fail(res, "SERVER_ERROR", "Erreur serveur", 500);
  }

  const label = err instanceof Error ? err.name : "unknown";
  console.error(`[error] ${label}`);
  return fail(res, "SERVER_ERROR", "Erreur serveur", 500);
}
