import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import xss from "xss";
import { fail } from "../lib/reply.js";

// Nettoie récursivement les strings (anti-XSS stocké).
// On ne recurse que sur les objets *simples* (issus de JSON/Zod) — surtout pas
// sur les instances comme Date, sinon Object.entries(date) === [] et la valeur
// serait remplacée par {} (ce qui ferait planter Prisma).
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function sanitize(value: unknown): unknown {
  if (typeof value === "string") return xss(value);
  if (Array.isArray(value)) return value.map(sanitize);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sanitize(v)]));
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
