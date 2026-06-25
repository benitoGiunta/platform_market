import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import xss from "xss";
import { fail } from "../lib/reply.js";

// Nettoie récursivement les strings (anti-XSS stocké).
function sanitize(value: unknown): unknown {
  if (typeof value === "string") return xss(value);
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, sanitize(v)]),
    );
  }
  return value;
}

// Valide le body avec un schéma Zod, puis sanitise les strings avant les controllers.
export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return fail(res, "VALIDATION", msg || "Données invalides", 400);
    }
    req.body = sanitize(result.data);
    next();
  };
