import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import videastesRouter from "./routes/videastes.routes.js";
import shootingsRouter from "./routes/shootings.routes.js";
import clientsRouter from "./routes/clients.routes.js";
import materielsRouter from "./routes/materiels.routes.js";
import seedRouter from "./routes/seed.routes.js";

const app = express();

// Ordre des middlewares — impératif.
app.use(helmet()); // 1. Headers de sécurité
app.use(cors({ origin: config.CORS_ORIGIN })); // 2. CORS explicite
app.use(express.json({ limit: "10kb" })); // 3. Limite la taille des body
app.use(morgan("[:method] :url :status :response-time ms")); // 4. Logging HTTP (sans body)
app.use(rateLimiter); // 5. Rate limiting

// Health check
app.get("/", (_req, res) => {
  res.json({ success: true, data: { status: "ok", service: "Markyn API" } });
});

// Routes métier
app.use("/api/videastes", videastesRouter);
app.use("/api/shootings", shootingsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/materiels", materielsRouter);
app.use("/api/seed", seedRouter);

// Gestion d'erreurs — toujours en dernier.
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`API Markyn démarrée sur http://localhost:${config.PORT}`);
});
