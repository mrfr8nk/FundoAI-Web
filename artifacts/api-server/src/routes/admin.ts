import { Router } from "express";
import { requireAdmin } from "../middlewares/admin";
import { User } from "../models/User";
import { connectDB } from "../lib/mongo";
import { getConfig, setConfig, SiteConfig } from "../models/SiteConfig";

const router = Router();

// All admin routes require admin auth
router.use(requireAdmin);

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get("/stats", async (_req, res) => {
  try {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      verifiedUsers,
      newToday,
      newThisWeek,
      newThisMonth,
      planCounts,
      totalChatsToday,
      paidUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({ createdAt: { $gte: monthAgo } }),
      User.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }]),
      User.aggregate([{ $group: { _id: null, total: { $sum: "$chatsToday" } } }]),
      User.countDocuments({ plan: { $ne: "free" } }),
    ]);

    const plans: Record<string, number> = { free: 0, starter: 0, basic: 0, pro: 0, premium: 0 };
    for (const p of planCounts) plans[p._id] = p.count;

    res.json({
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      newToday,
      newThisWeek,
      newThisMonth,
      paidUsers,
      plans,
      totalChatsToday: totalChatsToday[0]?.total ?? 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    await connectDB();
    const { search = "", plan = "", page = "1", limit = "50", sort = "newest" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));

    const filter: any = {};
    if (plan && plan !== "all") filter.plan = plan;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { name:  { $regex: search, $options: "i" } },
      ];
    }

    const sortMap: Record<string, any> = {
      newest:    { createdAt: -1 },
      oldest:    { createdAt: 1 },
      name:      { name: 1 },
      chats:     { chatsToday: -1 },
    };

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -magicToken -verifyCode -resetCode -chatHistory")
        .sort(sortMap[sort] || sortMap.newest)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/admin/users/:id ──────────────────────────────────────────────────
router.get("/users/:id", async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.params.id)
      .select("-password -magicToken -verifyCode -resetCode")
      .lean();
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/admin/users/:id ────────────────────────────────────────────────
router.patch("/users/:id", async (req, res) => {
  try {
    await connectDB();
    const allowed = ["name", "plan", "isVerified", "isAdmin", "chatsToday", "pdfsToday", "planExpires"];
    const update: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    if (update.plan && !["free", "starter", "basic", "pro", "premium"].includes(update.plan)) {
      res.status(400).json({ error: "Invalid plan" }); return;
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select("-password -magicToken -verifyCode -resetCode -chatHistory");
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
router.delete("/users/:id", async (req, res) => {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/admin/config ─────────────────────────────────────────────────────
router.get("/config", async (_req, res) => {
  try {
    await connectDB();
    const configs = await SiteConfig.find().lean();
    const map: Record<string, string> = {};
    for (const c of configs) map[c.key] = c.value;
    res.json({ config: map });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/admin/config ───────────────────────────────────────────────────
router.patch("/config", async (req, res) => {
  try {
    await connectDB();
    const allowed = ["whatsapp_number", "announcement", "site_name"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        await setConfig(key, String(req.body[key]));
      }
    }
    const configs = await SiteConfig.find().lean();
    const map: Record<string, string> = {};
    for (const c of configs) map[c.key] = c.value;
    res.json({ config: map });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
