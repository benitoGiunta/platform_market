import type { Request, Response } from "express";
import { shootingsService as service } from "../services/shootings.service.js";
import { ok, fail } from "../lib/reply.js";

export const shootingsController = {
  async findAll(_req: Request, res: Response) {
    return ok(res, await service.findAll());
  },

  async findById(req: Request, res: Response) {
    const item = await service.findById(Number(req.params.id));
    if (!item) return fail(res, "NOT_FOUND", "Shooting introuvable", 404);
    return ok(res, item);
  },

  async create(req: Request, res: Response) {
    return ok(res, await service.create(req.body), 201);
  },

  async update(req: Request, res: Response) {
    return ok(res, await service.update(Number(req.params.id), req.body));
  },

  async remove(req: Request, res: Response) {
    await service.delete(Number(req.params.id));
    return ok(res, { id: Number(req.params.id) });
  },

  async linkVideaste(req: Request, res: Response) {
    const link = await service.linkVideaste(
      Number(req.params.id),
      Number(req.body.videaste_id),
      Number(req.body.taux_horaire_videaste),
    );
    return ok(res, link, 201);
  },

  async unlinkVideaste(req: Request, res: Response) {
    await service.unlinkVideaste(Number(req.params.id), Number(req.params.videasteId));
    return ok(res, { unlinked: true });
  },
};
