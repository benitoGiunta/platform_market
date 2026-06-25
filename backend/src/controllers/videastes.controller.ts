import type { Request, Response } from "express";
import { videastesService as service } from "../services/videastes.service.js";
import { ok, fail } from "../lib/reply.js";

export const videastesController = {
  async findAll(_req: Request, res: Response) {
    return ok(res, await service.findAll());
  },

  async findById(req: Request, res: Response) {
    const item = await service.findById(Number(req.params.id));
    if (!item) return fail(res, "NOT_FOUND", "Vidéaste introuvable", 404);
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

  async linkMateriel(req: Request, res: Response) {
    const link = await service.linkMateriel(Number(req.params.id), Number(req.body.materiel_id));
    return ok(res, link, 201);
  },

  async unlinkMateriel(req: Request, res: Response) {
    await service.unlinkMateriel(Number(req.params.id), Number(req.params.materielId));
    return ok(res, { unlinked: true });
  },
};
