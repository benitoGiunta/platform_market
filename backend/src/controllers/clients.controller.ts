import type { Request, Response } from "express";
import { clientsService as service } from "../services/clients.service.js";
import { ok, fail } from "../lib/reply.js";

export const clientsController = {
  async findAll(_req: Request, res: Response) {
    return ok(res, await service.findAll());
  },

  async findById(req: Request, res: Response) {
    const item = await service.findById(Number(req.params.id));
    if (!item) return fail(res, "NOT_FOUND", "Client introuvable", 404);
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
};
