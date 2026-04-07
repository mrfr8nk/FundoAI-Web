import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Loader2, Bot, User, Trash2, MessageCircle, Globe,
  Zap, X, Paperclip, Image as ImageIcon,
  FileText, FileType2, Clock, History, ChevronLeft, KeyRound, LogOut, Eye, EyeOff,
  Lock, ArrowRight,
} from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import PageLayout from "@/components/PageLayout";

const GUEST_LIMIT = 5;

interface Msg {
  role: "user" | "assistant";
  content: string;
  ts?: number;
  imageDataUrl?: string;
  fileName?: string;
  fileType?: "image" | "pdf" | "word";
}

interface AttachedFile {
  type: "image" | "pdf" | "word";
  name: string;
  dataUrl?: string;
  base64?: string;
  text?: string;
  charCount?: number;
}

/* ── Markdown renderer ── */
function Markdown({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="h-1" />;
        const bold = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        if (t.startsWith("• ") || t.startsWith("- "))
          return (
            <div key={i} className="flex gap-2 items-start pl-1">
              <span className="text-violet-400 mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: bold.replace(/^[•\-]\s/, "") }} />
            </div>
          );
        if (/^#{1,3}\s/.test(t))
          return <div key={i} className="font-bold text-white mt-2" dangerouslySetInnerHTML={{ __html: bold.replace(/^#+\s/, "") }} />;
        return <div key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
      })}
    </div>
  );
}

/* ── Date helpers ── */
function dateLabel(ts: number) {
  const d = new Date(ts), now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return d.toLocaleDateString("en-GB", { weekday: "long" });
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/* ── Suggested prompts ── */
const SUGGESTED = [
  "What is photosynthesis?",
  "Help me with O-Level Maths",
  "Explain the Zimbabwe Civil War",
  "Solve: 2x + 5 = 13",
  "What's the weather in Harare?",
  "Write a poem about Zimbabwe",
];

/* ── Guest wall modal ── */
function GuestWall({ onClose }: { onClose: () => void }) {
  const [, nav] = useLocation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(9,9,13,0.85)", backdropFilter: "blur(16px)" }}>
      <div className="relative w-full max-w-md rounded-2xl p-8 text-center" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ color: "#6b6b85", background: "#1a1a27" }}>
          <X size={14} />
        </button>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <Lock size={28} className="text-violet-400" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">You've used your 5 free messages</h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#8888a0" }}>
          Create a free account to unlock unlimited AI chat, file uploads, and your full learning history.
        </p>
        <div className="space-y-2 mb-6 text-left">
          {[["Unlimited AI conversations"], ["Upload PDFs, images & Word docs"], ["Chat history saved across sessions"], ["Full ZIMSEC curriculum alignment"]].map(([text]) => (
            <div key={text} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "#1a1a27", border: "1px solid #1e1e2b" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              <span className="text-sm font-medium" style={{ color: "#a0a0bc" }}>{text}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => nav("/signup")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors">
            <Bot size={15} /> Create free account <ArrowRight size={14} />
          </button>
          <button onClick={() => nav("/login")}
            className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ color: "#6b6b85", background: "#1a1a27", border: "1px solid #1e1e2b" }}>
            Already have an account? <span className="text-violet-400">Log in</span>
          </button>
        </div>
        <p className="mt-4 text-xs" style={{ color: "#3a3a50" }}>Free forever · No credit card · 🇿🇼</p>
      </div>
    </div>
  );
}

/* ── History sidebar ── */
function HistorySidebar({ messages, onClose, onClearAll, clearing }: {
  messages: Msg[];
  onClose: () => void;
  onClearAll: () => void;
  clearing: boolean;
}) {
  const groups: { key: string; label: string; ts: number; preview: string; count: number }[] = [];
  const seen = new Set<string>();
  messages.forEach(m => {
    if (m.role !== "user" || !m.ts) return;
    const k = dayKey(m.ts);
    if (seen.has(k)) return;
    seen.add(k);
    const label = dateLabel(m.ts);
    const preview = m.fileName ? `📎 ${m.fileName}` : m.content.substring(0, 50) + (m.content.length > 50 ? "…" : "");
    const count = messages.filter(x => x.role === "user" && x.ts && dayKey(x.ts) === k).length;
    groups.push({ key: k, label, ts: m.ts, preview, count });
  });
  groups.reverse();

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d0d14", borderRight: "1px solid #1e1e2b" }}>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #1e1e2b" }}>
        <div className="flex items-center gap-2">
          <History size={14} className="text-violet-400" />
          <span className="text-sm font-semibold text-white">Chat History</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: "#6b6b85", background: "#1a1a27" }}>
          <ChevronLeft size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.3) transparent" }}>
        {groups.length === 0 ? (
          <div className="text-center py-8 text-xs" style={{ color: "#4a4a62" }}>No chat history yet</div>
        ) : (
          groups.map(g => (
            <div key={g.key} className="px-3 py-2.5 rounded-xl cursor-default" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={10} className="text-violet-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">{g.label}</span>
                <span className="text-[10px] ml-auto" style={{ color: "#3a3a50" }}>{g.count} msg{g.count !== 1 ? "s" : ""}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#6b6b85" }}>{g.preview}</p>
            </div>
          ))
        )}
      </div>

      {messages.length > 0 && (
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid #1e1e2b" }}>
          <button onClick={onClearAll} disabled={clearing}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            style={{ color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {clearing ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Clear all history
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Set Password Modal ── */
function SetPasswordModal({ hasPassword, onClose }: { hasPassword: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (form.newPassword !== form.confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    try {
      await api.setPassword({ newPassword: form.newPassword, currentPassword: form.currentPassword || undefined });
      setDone(true);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(9,9,13,0.85)", backdropFilter: "blur(16px)" }}>
      <div className="relative w-full max-w-sm rounded-2xl p-7" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "#6b6b85", background: "#1a1a27" }}>
          <X size={13} />
        </button>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <KeyRound size={22} className="text-violet-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">{hasPassword ? "Change Password" : "Set a Password"}</h2>
        <p className="text-xs mb-5" style={{ color: "#6b6b85" }}>
          {hasPassword ? "Enter your current password to change it." : "Add a password so you can sign in without a magic link."}
        </p>

        {done ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">✅</div>
            <p className="text-sm font-semibold text-white mb-1">Password {hasPassword ? "changed" : "set"}!</p>
            <p className="text-xs mb-5" style={{ color: "#6b6b85" }}>You can now sign in with email + password.</p>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            {error && (
              <div className="px-3 py-2.5 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                {error}
              </div>
            )}
            {hasPassword && (
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>Current password</label>
                <input type={showPw ? "text" : "password"} value={form.currentPassword}
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder="••••••••" required
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
                  style={{ background: "#1a1a27", border: "1px solid #1e1e2b" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e1e2b"; }} />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>New password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.newPassword}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  placeholder="Min. 6 characters" required
                  className="w-full px-3 pr-10 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
                  style={{ background: "#1a1a27", border: "1px solid #1e1e2b" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e1e2b"; }} />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#6b6b85" }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>Confirm password</label>
              <input type={showPw ? "text" : "password"} value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Repeat new password" required
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={{ background: "#1a1a27", border: "1px solid #1e1e2b" }}
                onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; }}
                onBlur={e => { e.target.style.borderColor = "#1e1e2b"; }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors mt-1 disabled:opacity-60">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <><KeyRound size={14} />{hasPassword ? "Change Password" : "Set Password"}</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── File chip ── */
function FileChip({ file, onRemove }: { file: AttachedFile; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl max-w-xs"
      style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
      {file.type === "image" && file.dataUrl ? (
        <img src={file.dataUrl} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
      ) : file.type === "image" ? (
        <ImageIcon size={13} className="text-violet-400" />
      ) : file.type === "pdf" ? (
        <FileText size={13} className="text-violet-400" />
      ) : (
        <FileType2 size={13} className="text-violet-400" />
      )}
      <span className="text-xs font-medium truncate" style={{ color: "#a0a0bc", maxWidth: 140 }}>{file.name}</span>
      {file.charCount && (
        <span className="text-[10px] flex-shrink-0" style={{ color: "#4a4a62" }}>
          {(file.charCount / 1000).toFixed(1)}k chars
        </span>
      )}
      <button onClick={onRemove} className="ml-auto flex-shrink-0" style={{ color: "#6b6b85" }}>
        <X size={12} />
      </button>
    </div>
  );
}

/* ── Main Chat page ── */
export default function Chat() {
  const { user, loading: authLoading } = useAuth();
  const [, nav] = useLocation();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sessionHistory, setSessionHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [histLoading, setHistLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showWall, setShowWall] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSetPw, setShowSetPw] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const guestCount = sessionHistory.filter(m => m.role === "user").length;
  const guestLimitReached = !user && guestCount >= GUEST_LIMIT;
  const remainingGuest = !user ? Math.max(0, GUEST_LIMIT - guestCount) : null;

  useEffect(() => {
    if (user) {
      setHistLoading(true);
      api.getHistory().then(d => {
        const hist: Msg[] = (d.history || []).slice(-40).map((h: any) => ({
          role: h.role === "user" ? "user" : "assistant",
          content: h.content,
          ts: h.ts,
        }));
        setMessages(hist);
      }).catch(() => {}).finally(() => setHistLoading(false));
      api.me().then(d => setHasPassword(!!d.user?.hasPassword)).catch(() => {});
    }
  }, [user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!e.target) return;
    (e.target as HTMLInputElement).value = "";
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const result = await api.uploadFile(file);
      setAttachedFile(result);
    } catch (err: any) {
      setUploadErr(err.message || "Upload failed");
    } finally { setUploading(false); }
  }, []);

  async function send(text?: string) {
    const msg = (text || input).trim();
    if ((!msg && !attachedFile) || thinking) return;
    if (!user && guestCount >= GUEST_LIMIT) { setShowWall(true); return; }

    setInput("");

    let displayContent = msg;
    let aiMessage = msg;
    let imageBase64: string | undefined;
    let msgMeta: Partial<Msg> = {};

    if (attachedFile) {
      if (attachedFile.type === "image") {
        imageBase64 = attachedFile.base64;
        displayContent = msg || `[Image: ${attachedFile.name}]`;
        aiMessage = msg
          ? `I've shared an image (${attachedFile.name}). ${msg}`
          : `I've shared an image: ${attachedFile.name}. Please describe and analyse it.`;
        msgMeta = { imageDataUrl: attachedFile.dataUrl, fileName: attachedFile.name, fileType: "image" };
      } else {
        const docType = attachedFile.type === "pdf" ? "PDF document" : "Word document";
        displayContent = msg || `[${attachedFile.name}]`;
        aiMessage = `I've uploaded a ${docType} named "${attachedFile.name}".\n\n[Document content — ${attachedFile.charCount?.toLocaleString() || "?"} chars]:\n${attachedFile.text}\n\n${msg ? `My question: ${msg}` : "Please read this document, summarise it, and let me know if I have any questions."}`;
        msgMeta = { fileName: attachedFile.name, fileType: attachedFile.type };
      }
      setAttachedFile(null);
    }

    if (!aiMessage.trim()) return;

    const userMsg: Msg = { role: "user", content: displayContent, ts: Date.now(), ...msgMeta };
    setMessages(m => [...m, userMsg]);
    setThinking(true);

    try {
      let data: any;
      if (user) {
        data = await api.chat(aiMessage, imageBase64);
      } else {
        const hist = sessionHistory.slice(-6).map(h => ({ role: h.role, content: h.content }));
        data = await api.chatGuest(aiMessage, hist, imageBase64);
        const assistantMsg: Msg = { role: "assistant", content: data.reply };
        setSessionHistory(h => [...h, { ...userMsg, content: aiMessage }, assistantMsg]);
        if (guestCount + 1 >= GUEST_LIMIT) setTimeout(() => setShowWall(true), 1800);
      }
      setMessages(m => [...m, { role: "assistant", content: data.reply, ts: Date.now() }]);
    } catch (err: any) {
      setMessages(m => [...m, { role: "assistant", content: `❌ ${err.message || "Something went wrong."}`, ts: Date.now() }]);
    } finally { setThinking(false); }
  }

  async function clearHistory() {
    if (!user) { setMessages([]); setSessionHistory([]); return; }
    setClearing(true);
    try { await api.clearHistory(); setMessages([]); setShowHistory(false); } catch { }
    finally { setClearing(false); }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const isEmpty = messages.length === 0 && !histLoading;

  return (
    <PageLayout>
      {showWall && <GuestWall onClose={() => setShowWall(false)} />}
      {showSetPw && (
        <SetPasswordModal hasPassword={hasPassword} onClose={() => {
          setShowSetPw(false);
          api.me().then(d => setHasPassword(!!d.user?.hasPassword)).catch(() => {});
        }} />
      )}
      {showUserMenu && <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />}

      <input ref={fileInputRef} type="file" className="hidden"
        accept="image/*,.pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelect} />

      <div className="flex" style={{ height: "calc(100vh - 68px)" }}>

        {/* Sidebar */}
        {showHistory && user && (
          <div className="flex-shrink-0 w-60 hidden sm:flex flex-col" style={{ borderRight: "1px solid #1e1e2b" }}>
            <HistorySidebar messages={messages} onClose={() => setShowHistory(false)} onClearAll={clearHistory} clearing={clearing} />
          </div>
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Chat header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 flex-shrink-0"
            style={{ background: "#0d0d14", borderBottom: "1px solid #1e1e2b" }}>
            <div className="flex items-center gap-2.5">
              {user && (
                <button onClick={() => setShowHistory(h => !h)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-1 transition-colors"
                  style={{
                    color: showHistory ? "#a78bfa" : "#6b6b85",
                    background: showHistory ? "rgba(139,92,246,0.12)" : "#1a1a27",
                    border: `1px solid ${showHistory ? "rgba(139,92,246,0.25)" : "#1e1e2b"}`,
                  }}
                  title="Chat history">
                  <History size={15} />
                </button>
              )}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-600 flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">FUNDO AI</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!user && remainingGuest !== null && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ color: remainingGuest <= 2 ? "#fbbf24" : "#6b6b85", background: "#1a1a27", border: "1px solid #1e1e2b" }}>
                  <Zap size={11} />
                  {remainingGuest === 0 ? "No free messages left" : `${remainingGuest} free message${remainingGuest !== 1 ? "s" : ""} left`}
                </div>
              )}

              {user && (
                <div className="relative">
                  <button onClick={() => setShowUserMenu(o => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ color: "#8888a0", background: "#1a1a27", border: "1px solid #1e1e2b" }}>
                    <div className="w-5 h-5 rounded-md bg-violet-600 flex items-center justify-center flex-shrink-0">
                      <User size={11} className="text-white" />
                    </div>
                    <span className="hidden sm:block max-w-[120px] truncate">{user.name || user.email}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50 slide-down"
                      style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid #1e1e2b" }}>
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs truncate" style={{ color: "#6b6b85" }}>{user.email}</p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <button onClick={() => { setShowSetPw(true); setShowUserMenu(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left"
                          style={{ color: "#8888a0" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1a1a27"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8888a0"; }}>
                          <KeyRound size={13} />
                          {hasPassword ? "Change password" : "Set a password"}
                        </button>
                        <button onClick={() => { clearHistory(); setShowUserMenu(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left"
                          style={{ color: "#8888a0" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1a1a27"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8888a0"; }}>
                          <Trash2 size={13} />
                          Clear chat history
                        </button>
                      </div>
                      <div className="p-1.5" style={{ borderTop: "1px solid #1e1e2b" }}>
                        <button onClick={() => { nav("/"); setShowUserMenu(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left"
                          style={{ color: "#8888a0" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1a1a27"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8888a0"; }}>
                          <LogOut size={13} />
                          Exit to home
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!user && (
                <div className="flex items-center gap-2">
                  <button onClick={() => nav("/login")}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ color: "#8888a0" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#8888a0")}>
                    Log in
                  </button>
                  <button onClick={() => nav("/signup")}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors">
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.3) transparent" }}>
            {histLoading ? (
              <div className="flex items-center justify-center h-full gap-3">
                <Loader2 size={18} className="animate-spin text-violet-400" />
                <span className="text-sm" style={{ color: "#6b6b85" }}>Loading history…</span>
              </div>
            ) : isEmpty ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-violet-600 mb-5">
                  <MessageCircle size={28} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Ask FUNDO AI anything</h2>
                <p className="text-sm mb-8 max-w-xs" style={{ color: "#6b6b85" }}>
                  From ZIMSEC past papers to live web search — I'm here to help you learn.
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium transition-colors"
                      style={{ background: "#111117", border: "1px solid #1e1e2b", color: "#8888a0" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2b"; (e.currentTarget as HTMLElement).style.color = "#8888a0"; }}>
                      {s}
                    </button>
                  ))}
                </div>
                {!user && (
                  <p className="mt-8 text-xs" style={{ color: "#4a4a62" }}>
                    {remainingGuest} free message{remainingGuest !== 1 ? "s" : ""} remaining · <button onClick={() => nav("/signup")} className="text-violet-400 underline">Create account</button> for unlimited
                  </p>
                )}
              </div>
            ) : (
              /* Message list */
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {msg.role === "assistant" ? (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-600">
                          <Bot size={15} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1a1a27", border: "1px solid #1e1e2b" }}>
                          <User size={15} style={{ color: "#8888a0" }} />
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`flex flex-col gap-1 max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      {/* Image preview */}
                      {msg.imageDataUrl && (
                        <img src={msg.imageDataUrl} alt="uploaded" className="rounded-xl max-w-[200px] max-h-[200px] object-cover mb-1" />
                      )}
                      {/* File chip */}
                      {msg.fileName && !msg.imageDataUrl && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl mb-1"
                          style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                          {msg.fileType === "pdf" ? <FileText size={13} className="text-violet-400" /> : <FileType2 size={13} className="text-violet-400" />}
                          <span className="text-xs font-medium" style={{ color: "#a0a0bc" }}>{msg.fileName}</span>
                        </div>
                      )}
                      <div
                        className="px-4 py-3 rounded-2xl"
                        style={{
                          background: msg.role === "user" ? "#7c3aed" : "#111117",
                          border: msg.role === "user" ? "none" : "1px solid #1e1e2b",
                          borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        }}
                      >
                        {msg.role === "assistant" ? (
                          <Markdown text={msg.content} />
                        ) : (
                          <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                        )}
                      </div>
                      {msg.ts && (
                        <span className="text-[10px] px-1" style={{ color: "#3a3a50" }}>
                          {new Date(msg.ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {thinking && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-600 flex-shrink-0">
                      <Bot size={15} className="text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl" style={{ background: "#111117", border: "1px solid #1e1e2b", borderRadius: "18px 18px 18px 4px" }}>
                      <div className="flex gap-1 items-center h-5">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                            style={{ animation: `dot-bounce 1s ease-in-out ${i * 0.18}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="flex-shrink-0 px-4 py-3" style={{ background: "#0d0d14", borderTop: "1px solid #1e1e2b" }}>
            <div className="max-w-3xl mx-auto">

              {/* Upload error */}
              {uploadErr && (
                <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                  {uploadErr}
                  <button onClick={() => setUploadErr("")} className="ml-auto"><X size={12} /></button>
                </div>
              )}

              {/* Attached file chip */}
              {attachedFile && (
                <div className="mb-2">
                  <FileChip file={attachedFile} onRemove={() => setAttachedFile(null)} />
                </div>
              )}

              {/* Guest limit bar */}
              {!user && remainingGuest !== null && remainingGuest <= 2 && (
                <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-xl text-xs"
                  style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                  <span>{remainingGuest === 0 ? "Out of free messages" : `${remainingGuest} free message${remainingGuest !== 1 ? "s" : ""} left`}</span>
                  <button onClick={() => nav("/signup")} className="underline font-semibold">Create account</button>
                </div>
              )}

              {/* Textarea + buttons */}
              <div className="flex items-end gap-2 rounded-2xl p-2" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
                {/* Attach */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || guestLimitReached}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors self-end mb-0.5 disabled:opacity-40"
                  style={{ color: "#6b6b85", background: "#1a1a27" }}
                  title="Attach file (image, PDF, Word)"
                  onMouseEnter={e => !uploading && ((e.currentTarget as HTMLElement).style.color = "#a78bfa")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#6b6b85")}
                >
                  {uploading ? <Loader2 size={16} className="animate-spin text-violet-400" /> : <Paperclip size={16} />}
                </button>

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={guestLimitReached ? "Create an account to continue chatting…" : "Ask anything…"}
                  disabled={guestLimitReached}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-white outline-none leading-relaxed py-2.5 px-1 disabled:opacity-50"
                  style={{ maxHeight: 120, minHeight: 40, scrollbarWidth: "none" }}
                  onInput={e => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 120) + "px";
                  }}
                />

                <button
                  onClick={() => send()}
                  disabled={(!input.trim() && !attachedFile) || thinking || guestLimitReached}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors self-end mb-0.5 disabled:opacity-40"
                  style={{ background: "#7c3aed", color: "#fff" }}
                  onMouseEnter={e => !thinking && ((e.currentTarget as HTMLElement).style.background = "#6d28d9")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#7c3aed")}
                >
                  {thinking ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>

              <p className="text-center text-[10px] mt-2" style={{ color: "#3a3a50" }}>
                FUNDO AI can make mistakes · Always verify important information
              </p>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
