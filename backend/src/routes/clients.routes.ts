import { Router } from "express";
import { clientsController as c } from "../controllers/clients.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import { clientCreateSchema, clientUpdateSchema } from "../schemas/client.schema.js";

const router = Router();

router.get("/", asyncHandler(c.findAll));
router.get("/:id", asyncHandler(c.findById));
router.post("/", validate(clientCreateSchema), asyncHandler(c.create));
router.put("/:id", validate(clientUpdateSchema), asyncHandler(c.update));
router.delete("/:id", asyncHandler(c.remove));

export default router;
