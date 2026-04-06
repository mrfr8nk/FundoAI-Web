import app from "./app";
import { logger } from "./lib/logger";

// Render assigns PORT automatically. Default to 10000 (Render's default) so the
// server starts without crashing when PORT is absent (e.g. local dev without .env).
const port = Number(process.env["PORT"] || 10000);

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
