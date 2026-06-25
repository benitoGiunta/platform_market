import { Router } from "express";
import { shootingsController as c } from "../controllers/shootings.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import {
  shootingCreateSchema,
  shootingUpdateSchema,
  shootingVideasteLinkSchema,
} from "../schemas/shooting.schema.js";

const router = Router();

router.get("/", asyncHandler(c.findAll));
router.get("/:id", asyncHandler(c.findById));
router.post("/", validate(shootingCreateSchema), asyncHandler(c.create));
router.put("/:id", validate(shootingUpdateSchema), asyncHandler(c.update));
router.delete("/:id", asyncHandler(c.remove));

router.post("/:id/videastes", validate(shootingVideasteLinkSchema), asyncHandler(c.linkVideaste));
router.delete("/:id/videastes/:videasteId", asyncHandler(c.unlinkVideaste));

export default router;
