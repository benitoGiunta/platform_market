import type { Response } from "express";

// Helpers de réponse API — format uniforme. Jamais construire { success } à la main.
export const ok = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data });

export const fail = (res: Response, code: string, message: string, status = 400) =>
  res.status(status).json({ success: false, error: { code, message } });
