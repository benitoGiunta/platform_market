import { Router } from "express";
import { videastesController as c } from "../controllers/videastes.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import {
  videasteCreateSchema,
  videasteUpdateSchema,
  videasteMaterielLinkSchema,
} from "../schemas/videaste.schema.js";

const router = Router();

router.get("/", asyncHandler(c.findAll));
router.get("/:id", asyncHandler(c.findById));
router.post("/", validate(videasteCreateSchema), asyncHandler(c.create));
router.put("/:id", validate(videasteUpdateSchema), asyncHandler(c.update));
router.delete("/:id", asyncHandler(c.remove));

router.post("/:id/materiels", validate(videasteMaterielLinkSchema), asyncHandler(c.linkMateriel));
router.delete("/:id/materiels/:materielId", asyncHandler(c.unlinkMateriel));

export default router;
