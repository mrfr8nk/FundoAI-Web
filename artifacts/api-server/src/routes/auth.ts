import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongo";
import { User } from "../models/User";
import { signToken } from "../lib/jwt";
import { sendMagicLinkEmail, sendPasswordResetEmail } from "../lib/email";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// APP_URL: set this to your deployed frontend URL (e.g. https://fundo-ai.onrender.com)
// Fallback order:
//   1. APP_URL env var (always wins — set this in production)
//   2. RENDER_EXTERNAL_URL (auto-set by Render)
//   3. REPLIT_DEV_DOMAIN (auto-set by Replit — used during development)
//   4. localhost (last resort)
const APP_URL =
  process.env["APP_URL"] ||
  process.env["RENDER_EXTERNAL_URL"] ||
  (process.env["REPLIT_DEV_DOMAIN"] ? `https://${process.env["REPLIT_DEV_DOMAIN"]}` : null) ||
  `http://localhost:${process.env["PORT"] || 8080}`;

function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function makeMagicToken() {
  return crypto.randomBytes(32).toString("hex");
}

// ── POST /api/auth/magic ──────────────────────────────────────────────────────
// Unified: signup OR login — just send a magic link
router.post("/magic", async (req, res) => {
  try {
    await connectDB();
    const { email, name } = req.body;
    if (!email) { res.status(400).json({ error: "Email is required" }); return; }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    let isNew = false;

    if (!user) {
      // New user — name required
      if (!name || !name.trim()) {
        res.status(400).json({ error: "Please enter your name to create an account", needsName: true });
        return;
      }
      user = await User.create({ name: name.trim(), email: email.toLowerCase().trim() });
      isNew = true;
    } else if (!user.isVerified) {
      // Existing unverified — treat as new so they see "complete signup"
      if (name) user.pendingName = name.trim();
      isNew = true;
    }

    // Generate token
    const token = makeMagicToken();
    user.magicToken = token;
    user.magicTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const link = `${APP_URL}/auth/verify?token=${token}`;
    await sendMagicLinkEmail(email, user.pendingName || user.name, link, isNew);

    res.json({ message: "Magic link sent", isNew });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to send magic link" });
  }
});

// ── GET /api/auth/magic/verify ────────────────────────────────────────────────
router.get("/magic/verify", async (req, res) => {
  try {
    await connectDB();
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      res.status(400).json({ error: "Invalid or missing token" }); return;
    }

    const user = await User.findOne({
      magicToken: token,
      magicTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ error: "This link has expired or already been used. Please request a new one." });
      return;
    }

    // Activate account
    if (user.pendingName) {
      user.name = user.pendingName;
      user.pendingName = null;
    }
    user.isVerified = true;
    user.magicToken = null;
    user.magicTokenExpires = null;
    await user.save();

    const jwt = signToken(String(user._id));
    res.json({ token: jwt, user: { id: user._id, name: user.name, email: user.email, level: user.level } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/login (password fallback — kept for existing users) ────────
router.post("/login", async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "Email and password required" }); return; }
    const user = await User.findOne({ email });
    if (!user || !user.password) { res.status(401).json({ error: "Invalid email or password" }); return; }
    const match = await bcrypt.compare(password, user.password);
    if (!match) { res.status(401).json({ error: "Invalid email or password" }); return; }
    if (!user.isVerified) {
      res.status(403).json({ error: "Please verify your email first", needsVerification: true, email });
      return;
    }
    const token = signToken(String(user._id));
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, level: user.level } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/signup (legacy — kept for backward compat) ─────────────────
router.post("/signup", async (req, res) => {
  try {
    await connectDB();
    const { name, email, password } = req.body;
    if (!name || !email) { res.status(400).json({ error: "Name and email required" }); return; }

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      res.status(409).json({ error: "Email already registered. Use magic link to sign in." }); return;
    }

    const token = makeMagicToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    if (user) {
      user.magicToken = token;
      user.magicTokenExpires = expires;
      if (password) user.password = await bcrypt.hash(password, 12);
      await user.save();
    } else {
      user = await User.create({
        name, email,
        password: password ? await bcrypt.hash(password, 12) : "",
        magicToken: token, magicTokenExpires: expires,
      });
    }

    const link = `${APP_URL}/auth/verify?token=${token}`;
    await sendMagicLinkEmail(email, name, link, true);
    res.json({ message: "Magic link sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Signup failed" });
  }
});

// ── POST /api/auth/verify-email (legacy OTP — kept for compatibility) ─────────
router.post("/verify-email", async (req, res) => {
  try {
    await connectDB();
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    if (user.isVerified) {
      const token = signToken(String(user._id));
      res.json({ message: "Already verified", token, user: { id: user._id, name: user.name, email: user.email, level: user.level } });
      return;
    }
    if (!user.verifyCode || user.verifyCode !== code) {
      res.status(400).json({ error: "Invalid code" }); return;
    }
    if (user.verifyExpires && user.verifyExpires < new Date()) {
      res.status(400).json({ error: "Code expired. Please request a new magic link." }); return;
    }
    user.isVerified = true;
    user.verifyCode = null;
    user.verifyExpires = null;
    await user.save();
    const token = signToken(String(user._id));
    res.json({ message: "Email verified", token, user: { id: user._id, name: user.name, email: user.email, level: user.level } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/resend-code ────────────────────────────────────────────────
router.post("/resend-code", async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const token = makeMagicToken();
    user.magicToken = token;
    user.magicTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    const link = `${APP_URL}/auth/verify?token=${token}`;
    await sendMagicLinkEmail(email, user.name, link, !user.isVerified);
    res.json({ message: "New magic link sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.json({ message: "If that email exists, a link was sent" }); return; }

    // Send magic link instead of OTP (simpler UX)
    const token = makeMagicToken();
    user.magicToken = token;
    user.magicTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    const link = `${APP_URL}/auth/verify?token=${token}`;
    await sendMagicLinkEmail(email, user.name, link, false);
    res.json({ message: "Sign-in link sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/reset-password (legacy) ────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  try {
    await connectDB();
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) { res.status(400).json({ error: "All fields required" }); return; }
    const user = await User.findOne({ email });
    if (!user || !user.resetCode || user.resetCode !== code) {
      res.status(400).json({ error: "Invalid or expired code" }); return;
    }
    if (user.resetExpires && user.resetExpires < new Date()) {
      res.status(400).json({ error: "Code expired" }); return;
    }
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetCode = null;
    user.resetExpires = null;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get("/me", requireAuth, (req, res) => {
  const user = (req as any).user;
  res.json({ user: { id: user._id, name: user.name, email: user.email, level: user.level, hasPassword: !!user.password } });
});

// ── POST /api/auth/set-password ───────────────────────────────────────────────
// Lets a logged-in user set or change their password
router.post("/set-password", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" }); return;
    }
    // If they already have a password, verify the current one
    if (user.password) {
      if (!currentPassword) {
        res.status(400).json({ error: "Enter your current password to change it" }); return;
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        res.status(401).json({ error: "Current password is incorrect" }); return;
      }
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: "Password set successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/auth/profile ───────────────────────────────────────────────────
router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { name, level } = req.body;
    if (name) user.name = name;
    if (level) user.level = level;
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, level: user.level } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
