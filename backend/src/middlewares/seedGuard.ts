import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { fail } from "../lib/reply.js";

// Protège les routes destructrices (seed/reset) par un header secret.
export const seedGuard = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers["x-seed-key"];
  if (key !== config.SEED_SECRET) {
    return fail(res, "FORBIDDEN", "Accès refusé.", 403);
  }
  next();
};
