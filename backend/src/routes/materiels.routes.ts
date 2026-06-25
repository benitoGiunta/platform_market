import { Router } from "express";
import { materielsController as c } from "../controllers/materiels.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import {
  materielCreateSchema,
  materielUpdateSchema,
  materielVideasteLinkSchema,
} from "../schemas/materiel.schema.js";

const router = Router();

router.get("/", asyncHandler(c.findAll));
router.get("/:id", asyncHandler(c.findById));
router.post("/", validate(materielCreateSchema), asyncHandler(c.create));
router.put("/:id", validate(materielUpdateSchema), asyncHandler(c.update));
router.delete("/:id", asyncHandler(c.remove));

router.post("/:id/videastes", validate(materielVideasteLinkSchema), asyncHandler(c.linkVideaste));
router.delete("/:id/videastes/:videasteId", asyncHandler(c.unlinkVideaste));

export default router;
