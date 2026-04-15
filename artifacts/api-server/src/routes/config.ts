import { Router } from "express";
import { connectDB } from "../lib/mongo";
import { getConfig } from "../models/SiteConfig";

const router = Router();

// ── GET /api/config ───────────────────────────────────────────────────────────
// Returns public site settings (no auth required)
router.get("/config", async (_req, res) => {
  try {
    await connectDB();
    const [whatsapp_number, announcement] = await Promise.all([
      getConfig("whatsapp_number", "263719647303"),
      getConfig("announcement", ""),
    ]);
    res.json({ whatsapp_number, announcement });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
