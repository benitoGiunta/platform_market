// Erreur applicative typée — interceptée par le middleware errorHandler.
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFound = (message = "Ressource introuvable") =>
  new AppError("NOT_FOUND", message, 404);

export const systemItem = (message = "Élément système protégé") =>
  new AppError("SYSTEM_ITEM", message, 403);
