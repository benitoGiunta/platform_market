import { Router } from "express";
import { listVideastes, getVideaste } from "../controllers/videasteController.js";

const router = Router();

router.get("/", listVideastes);
router.get("/:id", getVideaste);

export default router;
