import { Router } from "express";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongo";
import { User } from "../models/User";
import { signToken } from "../lib/jwt";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email";
import { requireAuth } from "../middlewares/auth";

const router = Router();

function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    await connectDB();
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    const hashed = await bcrypt.hash(password, 12);
    const code = makeCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({
      name, email, password: hashed,
      verifyCode: code, verifyExpires: expires,
    });
    await sendVerificationEmail(email, name, code);
    res.json({ message: "Verification code sent", userId: user._id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Signup failed" });
  }
});

// ── POST /api/auth/verify-email ───────────────────────────────────────────────
router.post("/verify-email", async (req, res) => {
  try {
    await connectDB();
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    if (user.isVerified) { res.json({ message: "Already verified" }); return; }
    if (!user.verifyCode || user.verifyCode !== code) {
      res.status(400).json({ error: "Invalid code" }); return;
    }
    if (user.verifyExpires && user.verifyExpires < new Date()) {
      res.status(400).json({ error: "Code expired. Please request a new one." }); return;
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
    if (user.isVerified) { res.json({ message: "Already verified" }); return; }
    const code = makeCode();
    user.verifyCode = code;
    user.verifyExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendVerificationEmail(email, user.name, code);
    res.json({ message: "New code sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "Email and password required" }); return; }
    const user = await User.findOne({ email });
    if (!user) { res.status(401).json({ error: "Invalid email or password" }); return; }
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

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.json({ message: "If that email exists, a code was sent" }); return; }
    const code = makeCode();
    user.resetCode = code;
    user.resetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail(email, user.name, code);
    res.json({ message: "Reset code sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/reset-password ────────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  try {
    await connectDB();
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) { res.status(400).json({ error: "All fields required" }); return; }
    if (newPassword.length < 6) { res.status(400).json({ error: "Password must be at least 6 characters" }); return; }
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
  res.json({ user: { id: user._id, name: user.name, email: user.email, level: user.level } });
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
