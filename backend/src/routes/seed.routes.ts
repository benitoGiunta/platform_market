import { Router } from "express";
import { seedGuard } from "../middlewares/seedGuard.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../lib/reply.js";
import { seedDatabase, resetDatabase } from "../lib/seed.js";

const router = Router();

// POST /api/seed — réinitialise et recharge le jeu de données de test.
router.post(
  "/",
  seedGuard,
  asyncHandler(async (_req, res) => {
    const counts = await seedDatabase();
    return ok(res, counts);
  }),
);

// DELETE /api/seed — vide toutes les tables et remet les IDs à zéro.
router.delete(
  "/",
  seedGuard,
  asyncHandler(async (_req, res) => {
    await resetDatabase();
    return ok(res, { reset: true });
  }),
);

export default router;
