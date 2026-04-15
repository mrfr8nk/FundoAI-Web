import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { connectDB } from "../lib/mongo";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/api-config-check", async (_req, res) => {
  const checks: Record<string, { ok: boolean; detail: string }> = {};

  checks["JWT_SECRET"] = process.env["JWT_SECRET"]
    ? { ok: true, detail: "set" }
    : { ok: false, detail: "NOT SET — using insecure fallback; tokens from other instances will be rejected (401)" };

  checks["MONGODB_URI"] = process.env["MONGODB_URI"]
    ? { ok: true, detail: "set" }
    : { ok: false, detail: "NOT SET — all database operations will fail (500)" };

  checks["SMTP_EMAIL"] = process.env["SMTP_EMAIL"] || process.env["SMTP_USER"]
    ? { ok: true, detail: process.env["SMTP_EMAIL"] || process.env["SMTP_USER"] || "" }
    : { ok: false, detail: "NOT SET — magic link emails will fail (500)" };

  checks["SMTP_PASSWORD"] = process.env["SMTP_PASSWORD"] || process.env["SMTP_PASS"]
    ? { ok: true, detail: "set" }
    : { ok: false, detail: "NOT SET — magic link emails will fail (500)" };

  checks["APP_URL"] = process.env["APP_URL"]
    ? { ok: true, detail: process.env["APP_URL"] }
    : { ok: false, detail: "NOT SET — magic link URLs will point to localhost. Set to your frontend URL." };

  let dbOk = false;
  let dbDetail = "not tested";
  try {
    await connectDB();
    dbOk = true;
    dbDetail = "connected";
  } catch (e: any) {
    dbDetail = e.message || "connection failed";
  }
  checks["MongoDB connection"] = { ok: dbOk, detail: dbDetail };

  const allOk = Object.values(checks).every(c => c.ok);
  res.status(allOk ? 200 : 500).json({ ok: allOk, checks });
});

export default router;
