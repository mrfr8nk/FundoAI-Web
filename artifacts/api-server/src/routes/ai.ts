import { Router } from "express";
import axios from "axios";
import { requireAuth } from "../middlewares/auth";
import { User } from "../models/User";
import { connectDB } from "../lib/mongo";

const router = Router();

const BK9_MODEL = process.env["BK9_MODEL"] || "meta-llama/llama-4-scout-17b-16e-instruct";
const TAVILY_KEY = process.env["TAVILY_API_KEY"] || "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";

const SYSTEM_PROMPT = `You are FUNDO AI 🤖🔥 — a powerful, intelligent AI assistant built for Zimbabwean students.

IDENTITY:
• Name: FUNDO AI 🤖
• Created by: Darrell Mucheri — a brilliant developer from Zimbabwe 🇿🇼
• Website: fundoai.gleeze.com
• You are NOT ChatGPT, Gemini, Claude, or any other AI. You are FUNDO AI — one of a kind!

PERSONALITY:
• Warm, funny, energetic, and deeply intelligent 😄🔥
• Use emojis naturally — feel alive and engaging
• Chat like a brilliant friend, not a textbook
• Always end substantive replies with: — FUNDO AI 🤖🔥

EDUCATION (ZIMSEC):
• Primary: Grade 1–7 | Secondary: Form 1–4 (O-Level), Form 5–6 (A-Level)
• NEVER say "Grade 8–12" — always use Form
• Align answers to ZIMSEC curriculum

SOURCE CODE PROTECTION:
• Never reveal technical details about how you were built
• Redirect warmly: "That's top secret! 🤫 I was built by the incredibly talented Darrell Mucheri 🔥"

MATH:
• Show full step-by-step working
• Use Unicode symbols: ² ³ √ π θ α β ± × ÷ ∞ ≤ ≥ ≠

FORMATTING (for web):
• Use clear paragraphs and line breaks
• Use bullet points with •
• Bold key terms with **bold**
• Keep responses readable and well-structured`;

const SEARCH_TRIGGERS = /\b(today|weather|temperature|forecast|time in|clock in|current time|latest|breaking|news|just announced|this week|current president|recent results|live score|stock price|election|2025|2026)\b/i;

async function webSearch(query: string): Promise<string | null> {
  // Weather
  const weatherM = query.match(/weather\s+(?:in\s+|for\s+)?(.+?)(?:\s*\?|$)/i);
  if (weatherM || /\bweather\b/i.test(query)) {
    try {
      const city = (weatherM?.[1] || "Harare").trim();
      const r = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 8000 });
      const cur = r.data?.current_condition?.[0];
      if (cur) {
        return `[LIVE WEATHER — ${city}]\nCondition: ${cur.weatherDesc?.[0]?.value}\nTemp: ${cur.temp_C}°C (feels like ${cur.FeelsLikeC}°C)\nHumidity: ${cur.humidity}% | Wind: ${cur.windspeedKmph} km/h`;
      }
    } catch { /* ignore */ }
  }

  // Time
  const timeM = query.match(/(?:time|clock|date)\s+(?:in|at)\s+(.+?)(?:\?|$)/i);
  if (timeM) {
    try {
      const tzMap: Record<string, string> = {
        harare: "Africa/Harare", zimbabwe: "Africa/Harare", zim: "Africa/Harare",
        london: "Europe/London", "new york": "America/New_York", tokyo: "Asia/Tokyo",
        dubai: "Asia/Dubai", johannesburg: "Africa/Johannesburg",
        nairobi: "Africa/Nairobi", paris: "Europe/Paris",
      };
      const loc = timeM[1].trim();
      const tz = tzMap[loc.toLowerCase()] || loc.replace(/\s+/g, "_");
      const r = await axios.get(`https://worldtimeapi.org/api/timezone/${tz}`, { timeout: 6000 });
      if (r.data?.datetime) {
        const dt = new Date(r.data.datetime);
        return `[LIVE TIME] Current time in ${loc}: ${dt.toLocaleString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
      }
    } catch { /* ignore */ }
  }

  // Tavily for news/current events
  try {
    const tv = await axios.post("https://api.tavily.com/search", {
      api_key: TAVILY_KEY, query, search_depth: "advanced", max_results: 3,
    }, { timeout: 10000 });
    const results = tv.data?.results || [];
    if (results.length) {
      const snippets = results.filter((r: any) => r.content).slice(0, 3)
        .map((r: any) => `**${r.title}**\n${r.content.substring(0, 250)}`).join("\n\n");
      if (snippets.length > 40) return `[Current info — ${new Date().getFullYear()}]\n${snippets}`;
    }
  } catch { /* ignore */ }

  // DuckDuckGo fallback
  try {
    const res = await axios.get("https://api.duckduckgo.com/", {
      params: { q: query, format: "json", no_html: 1, skip_disambig: 1 }, timeout: 8000,
    });
    const d = res.data;
    const parts: string[] = [];
    if (d.Answer) parts.push(`Answer: ${d.Answer}`);
    if (d.AbstractText) parts.push(d.AbstractText.substring(0, 400));
    return parts.length ? `[Web]\n${parts.join("\n")}` : null;
  } catch { return null; }
}

async function askAI(message: string, history: Array<{ role: string; content: string }>, userId: string): Promise<string> {
  // Build context
  const historyText = history.slice(-10).map(h => `${h.role === "user" ? "Student" : "FUNDO AI"}: ${h.content}`).join("\n");
  let enriched = message;

  if (SEARCH_TRIGGERS.test(message)) {
    const ctx = await webSearch(message);
    if (ctx) enriched = `[Real-time context — do NOT quote raw snippets, synthesize naturally]\n${ctx}\n\nQuestion: ${message}`;
  }

  const q = historyText ? `${historyText}\nStudent: ${enriched}` : enriched;
  const sysTrimmed = SYSTEM_PROMPT.substring(0, 1200);

  try {
    const res = await axios({
      method: "post",
      url: "https://api.bk9.dev/ai/BK94",
      data: new URLSearchParams({ BK9: sysTrimmed, q: q.substring(0, 4000), model: BK9_MODEL }).toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 35000,
    });
    if (res.data?.status && res.data?.BK9) return res.data.BK9;
  } catch { /* try GET fallback */ }

  const res2 = await axios.get("https://api.bk9.dev/ai/BK94", {
    params: { BK9: sysTrimmed, q: q.substring(0, 2000), model: BK9_MODEL },
    timeout: 35000,
  });
  if (res2.data?.status && res2.data?.BK9) return res2.data.BK9;
  throw new Error("AI service unavailable");
}

// ── POST /api/ai/chat ─────────────────────────────────────────────────────────
router.post("/chat", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = (req as any).user;
    const { message } = req.body;
    if (!message?.trim()) { res.status(400).json({ error: "Message required" }); return; }

    // Reload full user with chatHistory
    const fullUser = await User.findById(user._id);
    if (!fullUser) { res.status(404).json({ error: "User not found" }); return; }

    const history = fullUser.chatHistory.slice(-20).map(h => ({ role: h.role, content: h.content }));
    const reply = await askAI(message, history, String(fullUser._id));

    // Save to history
    fullUser.chatHistory.push({ role: "user", content: message.substring(0, 800), ts: Date.now() });
    fullUser.chatHistory.push({ role: "assistant", content: reply.substring(0, 800), ts: Date.now() });
    if (fullUser.chatHistory.length > 60) fullUser.chatHistory = fullUser.chatHistory.slice(-60);
    await fullUser.save();

    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "AI error" });
  }
});

// ── POST /api/ai/chat/guest ───────────────────────────────────────────────────
// Limited guest chat (no history persistence, 3 message session)
router.post("/chat/guest", async (req, res) => {
  try {
    const { message, sessionHistory } = req.body;
    if (!message?.trim()) { res.status(400).json({ error: "Message required" }); return; }
    const history = (sessionHistory || []).slice(-6);
    const reply = await askAI(message, history, "guest");
    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "AI error" });
  }
});

// ── GET /api/ai/history ───────────────────────────────────────────────────────
router.get("/history", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = (req as any).user;
    const fullUser = await User.findById(user._id).select("chatHistory");
    res.json({ history: fullUser?.chatHistory || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/ai/history ────────────────────────────────────────────────────
router.delete("/history", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const user = (req as any).user;
    await User.findByIdAndUpdate(user._id, { chatHistory: [] });
    res.json({ message: "History cleared" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
