import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

// Path to the compiled frontend.
// On Render (single-service): built before the server starts, found here automatically.
// On Replit: frontend runs as its own service so this dir won't exist — static serving is skipped.
const FRONTEND_DIST =
  process.env.FRONTEND_DIST ||
  path.resolve(import.meta.dirname, "..", "..", "fundo-ai", "dist", "public");

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// Serve compiled frontend + SPA fallback (single-service mode)
if (fs.existsSync(FRONTEND_DIST)) {
  logger.info({ FRONTEND_DIST }, "Serving frontend static files");
  app.use(express.static(FRONTEND_DIST));
  // For any route that isn't /api/*, send the React app (Express 5 requires regex for catch-all)
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
} else {
  logger.info("No frontend dist found — running in API-only mode");
}

export default app;
