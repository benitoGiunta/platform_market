import type { Request, Response, NextFunction, RequestHandler } from "express";

// Wrapper async pour les controllers — élimine le boilerplate try/catch.
// Les erreurs sont automatiquement transmises au middleware errorHandler.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
