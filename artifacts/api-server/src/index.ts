// Force IPv4 for all DNS lookups — prevents ENETUNREACH on Render (IPv6 not supported outbound)
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import app from "./app";
import { logger } from "./lib/logger";

const port = Number(process.env["PORT"] || 10000);

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
