import express from "express";
import cors from "cors";
import videasteRoutes from "./routes/videasteRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "platform_market API" });
});

app.use("/api/videastes", videasteRoutes);

app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});
