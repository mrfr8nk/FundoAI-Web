import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { User } from "../models/User";
import { connectDB } from "../lib/mongo";
import { PLAN_INFO, initiateWebPayment, initiateEcoCashPayment, pollPaymentStatus } from "../lib/paynow";

const router = Router();

const INTEGRATION_ID  = process.env["PAYNOW_INTEGRATION_ID"]  || "";
const INTEGRATION_KEY = process.env["PAYNOW_INTEGRATION_KEY"] || "";
const APP_URL = process.env["APP_URL"] || "http://localhost:5000";

function paynowConfigured() {
  return !!(INTEGRATION_ID && INTEGRATION_KEY);
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function isActivePlan(user: InstanceType<typeof User>): boolean {
  if (user.plan === "free") return true;
  if (!user.planExpires) return false;
  return new Date(user.planExpires) > new Date();
}

router.get("/plans", (_req, res) => {
  res.json({
    plans: PLAN_INFO,
    configured: paynowConfigured(),
  });
});

router.get("/status", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById((req as unknown as { userId: string }).userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = todayString();
    if (user.usageResetDate !== today) {
      user.chatsToday    = 0;
      user.imagestoday   = 0;
      user.pdfsToday     = 0;
      user.downloadsToday = 0;
      user.usageResetDate = today;
      await user.save();
    }

    const activePlan = isActivePlan(user) ? user.plan : "free";
    const planInfo = PLAN_INFO[activePlan] || PLAN_INFO.free;

    res.json({
      plan: activePlan,
      planExpires: user.planExpires,
      planInfo,
      usage: {
        chatsToday:     user.chatsToday,
        imagestoday:    user.imagestoday,
        pdfsToday:      user.pdfsToday,
        downloadsToday: user.downloadsToday,
      },
      limits: {
        chats:     planInfo.chats,
        images:    planInfo.images,
        pdfs:      planInfo.pdfs,
        downloads: planInfo.downloads,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/upgrade", requireAuth, async (req, res) => {
  if (!paynowConfigured()) {
    return res.status(503).json({ error: "Payment system not configured. Contact support@fundo.ai." });
  }

  const { plan, method, phone } = req.body as { plan: string; method: "web" | "ecocash"; phone?: string };

  if (!plan || !PLAN_INFO[plan] || plan === "free") {
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  if (method === "ecocash" && !phone) {
    return res.status(400).json({ error: "Phone number required for EcoCash" });
  }

  try {
    await connectDB();
    const user = await User.findById((req as unknown as { userId: string }).userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const planInfo = PLAN_INFO[plan];
    const reference = `FUNDO-${user.id}-${Date.now()}`;
    const returnUrl = `${APP_URL}/upgrade/result`;
    const resultUrl = `${APP_URL}/api/billing/result`;

    if (method === "ecocash") {
      const result = await initiateEcoCashPayment({
        integrationId: INTEGRATION_ID,
        integrationKey: INTEGRATION_KEY,
        reference,
        email: user.email,
        planName: planInfo.name,
        amount: planInfo.price,
        phone: phone!,
        returnUrl,
        resultUrl,
      });

      if (!result.success) {
        return res.status(502).json({ error: result.error || "Payment initiation failed" });
      }

      user.paynowPollUrl = result.pollUrl || null;
      user.paynowRef = reference;
      await user.save();

      return res.json({
        method: "ecocash",
        pollUrl: result.pollUrl,
        instructions: result.instructions,
        reference,
      });
    } else {
      const result = await initiateWebPayment({
        integrationId: INTEGRATION_ID,
        integrationKey: INTEGRATION_KEY,
        reference,
        email: user.email,
        planName: planInfo.name,
        amount: planInfo.price,
        returnUrl,
        resultUrl,
      });

      if (!result.success) {
        return res.status(502).json({ error: result.error || "Payment initiation failed" });
      }

      user.paynowPollUrl = result.pollUrl || null;
      user.paynowRef = reference;
      await user.save();

      return res.json({
        method: "web",
        redirectUrl: result.redirectUrl,
        pollUrl: result.pollUrl,
        reference,
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/poll", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById((req as unknown as { userId: string }).userId);
    if (!user || !user.paynowPollUrl) {
      return res.status(400).json({ error: "No pending payment found" });
    }

    const result = await pollPaymentStatus(user.paynowPollUrl);

    if (result.paid) {
      const plan = req.query["plan"] as string || "pro";
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      user.plan = plan;
      user.planExpires = expires;
      user.paynowPollUrl = null;
      user.paynowRef = null;
      await user.save();
    }

    res.json({ paid: result.paid, status: result.status });
  } catch {
    res.status(500).json({ error: "Poll failed" });
  }
});

router.post("/result", async (req, res) => {
  const { reference, paynowreference, amount, status } = req.body as Record<string, string>;

  if (status?.toLowerCase() === "paid" && reference) {
    try {
      await connectDB();
      const user = await User.findOne({ paynowRef: reference });
      if (user) {
        const planMatch = reference.match(/FUNDO-[^-]+-(\d+)/);
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);
        user.planExpires = expires;
        user.paynowPollUrl = null;
        user.paynowRef = null;
        await user.save();
      }
    } catch { /* silent */ }
  }

  void (amount, paynowreference);
  res.status(200).send("OK");
});

export default router;
