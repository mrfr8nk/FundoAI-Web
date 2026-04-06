import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Loader2, Bot, User, Trash2, MessageCircle, Sparkles, Globe,
  Zap, ChevronRight, Lock, ArrowRight, X, Paperclip, Image as ImageIcon,
  FileText, FileType2, Clock, History, ChevronLeft,
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

/* ── Markdown renderer ─────────────────────────────────── */
function Markdown({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="h-1" />;
        const bold = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        if (t.startsWith("• ") || t.startsWith("- "))
          return <div key={i} className="flex gap-2 items-start pl-1"><span style={{ color: "#a855f7", marginTop: 2 }}>•</span><span dangerouslySetInnerHTML={{ __html: bold.replace(/^[•\-]\s/, "") }} /></div>;
        if (/^#{1,3}\s/.test(t))
          return <div key={i} className="font-bold text-white mt-2" dangerouslySetInnerHTML={{ __html: bold.replace(/^#+\s/, "") }} />;
        return <div key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
      })}
    </div>
  );
}

/* ── Date group label ──────────────────────────────────── */
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

/* ── Suggested prompts ─────────────────────────────────── */
const SUGGESTED = [
  "What is photosynthesis? 🌿", "Help me with O-Level Maths 📐",
  "Explain the Zimbabwe Civil War 📚", "Write a poem about Zimbabwe 🇿🇼",
  "What's the weather in Harare? 🌤️", "Solve: 2x + 5 = 13 🔢",
];

/* ── Guest wall modal ──────────────────────────────────── */
function GuestWall({ onClose }: { onClose: () => void }) {
  const [, nav] = useLocation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(6,3,15,0.88)", backdropFilter: "blur(16px)" }}>
      <div className="relative w-full max-w-md rounded-3xl p-8 text-center" style={{ background: "rgba(15,10,30,0.98)", border: "1px solid rgba(168,85,247,0.25)", boxShadow: "0 0 80px rgba(168,85,247,0.18), 0 32px 80px rgba(0,0,0,0.7)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)" }}><X size={14} /></button>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.12))", border: "1px solid rgba(168,85,247,0.25)", boxShadow: "0 0 40px rgba(168,85,247,0.2)" }}>
          <Lock size={36} style={{ color: "#a855f7" }} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">You've used your 5 free messages</h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Create a free account to unlock unlimited AI chat, file uploads, and your full learning history.</p>
        <div className="space-y-2 mb-7 text-left">
          {[["🧠","Unlimited AI conversations"],["📄","Upload PDFs, images & Word docs"],["💾","Chat history saved across sessions"],["🎓","Full ZIMSEC curriculum alignment"]].map(([icon,text]) => (
            <div key={text} className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-base">{icon}</span>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{text}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => nav("/signup")} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.4)" }}>
            <Bot size={16} />Create free account <ArrowRight size={15} />
          </button>
          <button onClick={() => nav("/login")} className="w-full py-3 rounded-xl text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Already have an account? <span style={{ color: "#a855f7" }}>Log in</span>
          </button>
        </div>
        <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Free forever · No credit card needed · 🇿🇼</p>
      </div>
    </div>
  );
}

/* ── History sidebar ───────────────────────────────────── */
function HistorySidebar({ messages, onClose, onClearAll, clearing }: {
  messages: Msg[];
  onClose: () => void;
  onClearAll: () => void;
  clearing: boolean;
}) {
  // Group messages by day (only user messages to create titles)
  const groups: { key: string; label: string; ts: number; preview: string; count: number }[] = [];
  const seen = new Set<string>();

  messages.forEach(m => {
    if (m.role !== "user" || !m.ts) return;
    const k = dayKey(m.ts);
    if (seen.has(k)) return;
    seen.add(k);
    const label = dateLabel(m.ts);
    const preview = m.fileName
      ? `📎 ${m.fileName}`
      : m.content.substring(0, 50) + (m.content.length > 50 ? "…" : "");
    const count = messages.filter(x => x.role === "user" && x.ts && dayKey(x.ts) === k).length;
    groups.push({ key: k, label, ts: m.ts, preview, count });
  });
  groups.reverse();

  return (
    <div className="flex flex-col h-full" style={{ background: "rgba(8,5,17,0.98)", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2">
          <History size={15} style={{ color: "#a855f7" }} />
          <span className="text-sm font-bold text-white">Chat History</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)" }}>
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
        {groups.length === 0 ? (
          <div className="text-center py-8 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>No chat history yet</div>
        ) : (
          groups.map(g => (
            <div key={g.key} className="px-3 py-2.5 rounded-xl cursor-default" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={10} style={{ color: "#a855f7" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#a855f7" }}>{g.label}</span>
                <span className="text-[10px] ml-auto" style={{ color: "rgba(255,255,255,0.2)" }}>{g.count} msg{g.count !== 1 ? "s" : ""}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{g.preview}</p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {messages.length > 0 && (
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={onClearAll} disabled={clearing}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{ color: "#f87171", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
            {clearing ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Clear all history
          </button>
        </div>
      )}
    </div>
  );
}

/* ── File chip in input ────────────────────────────────── */
function FileChip({ file, onRemove }: { file: AttachedFile; onRemove: () => void }) {
  const icon = file.type === "image" ? <ImageIcon size={13} style={{ color: "#06b6d4" }} />
    : file.type === "pdf" ? <FileText size={13} style={{ color: "#f59e0b" }} />
    : <FileType2 size={13} style={{ color: "#10b981" }} />;
  const color = file.type === "image" ? "rgba(6,182,212,0.12)" : file.type === "pdf" ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)";
  const border = file.type === "image" ? "rgba(6,182,212,0.25)" : file.type === "pdf" ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.25)";

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl max-w-xs" style={{ background: color, border: `1px solid ${border}` }}>
      {file.type === "image" && file.dataUrl ? (
        <img src={file.dataUrl} alt="" className="w-6 h-6 rounded object-cover flex-shrink-0" />
      ) : icon}
      <span className="text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.8)", maxWidth: 140 }}>{file.name}</span>
      {file.charCount && <span className="text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>{(file.charCount / 1000).toFixed(1)}k chars</span>}
      <button onClick={onRemove} className="ml-auto flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>
        <X size={12} />
      </button>
    </div>
  );
}

/* ── Main Chat page ────────────────────────────────────── */
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

    // Build what to show in chat and what to send to AI
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

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" className="hidden"
        accept="image/*,.pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelect} />

      <div className="flex" style={{ height: "calc(100vh - 68px)" }}>

        {/* History Sidebar */}
        {showHistory && user && (
          <div className="flex-shrink-0 w-64 hidden sm:flex flex-col" style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
            <HistorySidebar messages={messages} onClose={() => setShowHistory(false)} onClearAll={clearHistory} clearing={clearing} />
          </div>
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 flex-shrink-0" style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
            <div className="flex items-center gap-3">
              {user && (
                <button onClick={() => setShowHistory(h => !h)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-1 transition-all"
                  style={{ color: showHistory ? "#a855f7" : "rgba(255,255,255,0.35)", background: showHistory ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${showHistory ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.08)"}` }}
                  title="Chat history">
                  <History size={14} />
                </button>
              )}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 14px rgba(168,85,247,0.4)" }}>
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">FUNDO AI 🤖</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Online · Llama 4 Scout · Vision</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!user && !authLoading && guestCount > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: remainingGuest === 0 ? "rgba(239,68,68,0.1)" : "rgba(168,85,247,0.1)", border: `1px solid ${remainingGuest === 0 ? "rgba(239,68,68,0.25)" : "rgba(168,85,247,0.25)"}`, color: remainingGuest === 0 ? "#fca5a5" : "#c084fc" }}>
                  {remainingGuest === 0 ? "⚠️ Limit reached" : `${remainingGuest} left`}
                </div>
              )}
              {!user && (
                <button onClick={() => nav("/signup")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 2px 10px rgba(168,85,247,0.3)" }}>
                  Sign up free
                </button>
              )}
            </div>
          </div>

          {/* Guest banner */}
          {!user && !authLoading && (
            <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-center justify-between flex-shrink-0"
              style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                <Sparkles size={13} style={{ color: "#a855f7" }} />
                <span>
                  {guestCount === 0 ? `Guest mode — ${GUEST_LIMIT} free messages`
                    : remainingGuest === 0 ? "Free messages used — create an account to continue"
                    : `${remainingGuest} free message${remainingGuest === 1 ? "" : "s"} remaining`}
                </span>
              </div>
              <button onClick={() => nav("/signup")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#a855f7" }}>
                Sign up <ChevronRight size={12} />
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
            {histLoading && <div className="flex justify-center pt-8"><Loader2 size={24} className="animate-spin" style={{ color: "#a855f7" }} /></div>}

            {isEmpty && !histLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-4 py-8">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.12))", border: "1px solid rgba(168,85,247,0.2)", boxShadow: "0 0 40px rgba(168,85,247,0.15)" }}>
                  <Bot size={40} style={{ color: "#a855f7" }} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Hey{user ? ` ${user.name.split(" ")[0]}` : ""}! I'm FUNDO AI 🤖🔥</h2>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 340 }}>Zimbabwe's most powerful AI study assistant. Ask me anything, or upload a document to get started.</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg mb-4">
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.65)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(168,85,247,0.12)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[{ icon: Globe, label: "Web search" }, { icon: Zap, label: "Real-time data" }, { icon: MessageCircle, label: "ZIMSEC" }, { icon: ImageIcon, label: "Images" }, { icon: FileText, label: "PDF & Word" }].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>
                      <Icon size={11} />{label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => {
              // Date separator
              const showDate = msg.role === "user" && msg.ts && (i === 0 || (messages[i - 2]?.ts && dayKey(msg.ts) !== dayKey(messages[i - 2].ts!)));
              return (
                <div key={i}>
                  {showDate && msg.ts && (
                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>{dateLabel(msg.ts)}</span>
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>
                  )}
                  <div className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 10px rgba(168,85,247,0.35)" }}>
                        <Bot size={15} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[78%] sm:max-w-[70%] rounded-2xl ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                      style={msg.role === "user"
                        ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.88)" }}>
                      {/* Image attachment in message */}
                      {msg.imageDataUrl && (
                        <div className="p-2 pb-0">
                          <img src={msg.imageDataUrl} alt={msg.fileName || "uploaded"} className="rounded-xl max-h-48 max-w-full object-cover" />
                        </div>
                      )}
                      {/* File tag */}
                      {msg.fileName && !msg.imageDataUrl && (
                        <div className="px-4 pt-3 pb-0 flex items-center gap-2">
                          {msg.fileType === "pdf" ? <FileText size={13} style={{ color: "#f59e0b" }} /> : <FileType2 size={13} style={{ color: "#10b981" }} />}
                          <span className="text-xs font-medium opacity-80">{msg.fileName}</span>
                        </div>
                      )}
                      <div className="px-4 py-3">
                        {msg.role === "user"
                          ? <p className="text-sm leading-relaxed">{msg.content}</p>
                          : <Markdown text={msg.content} />}
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <User size={15} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {thinking && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 10px rgba(168,85,247,0.35)" }}>
                  <Bot size={15} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: "#a855f7", animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input area */}
          <div className="px-4 sm:px-6 py-3 flex-shrink-0" style={{ background: "rgba(8,5,17,0.85)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="max-w-3xl mx-auto">

              {/* Upload error */}
              {uploadErr && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2 text-xs" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                  ❌ {uploadErr}
                  <button onClick={() => setUploadErr("")} className="ml-auto"><X size={11} /></button>
                </div>
              )}

              {/* File chip */}
              {(attachedFile || uploading) && (
                <div className="mb-2 flex items-center gap-2">
                  {uploading ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <Loader2 size={13} className="animate-spin" style={{ color: "#a855f7" }} />
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Reading file…</span>
                    </div>
                  ) : attachedFile && (
                    <FileChip file={attachedFile} onRemove={() => setAttachedFile(null)} />
                  )}
                </div>
              )}

              {/* Limit reached inline */}
              {guestLimitReached && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
                  style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)" }}>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <Lock size={14} style={{ color: "#a855f7" }} />
                    <span>Free messages used — create an account to keep chatting</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => nav("/login")} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>Log in</button>
                    <button onClick={() => nav("/signup")} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>Sign up</button>
                  </div>
                </div>
              )}

              {/* Text input row */}
              <div className={`flex gap-2 items-end rounded-2xl p-2 transition-all duration-200 ${guestLimitReached ? "opacity-50 pointer-events-none" : ""}`}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(168,85,247,0.08)"; }}
                onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>

                {/* Attach button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || guestLimitReached}
                  title="Attach image, PDF, or Word document"
                  className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ color: attachedFile ? "#a855f7" : "rgba(255,255,255,0.35)", background: attachedFile ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.05)" }}>
                  {uploading ? <Loader2 size={15} className="animate-spin" /> : <Paperclip size={15} />}
                </button>

                <textarea
                  ref={inputRef} value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; }}
                  onKeyDown={handleKey}
                  placeholder={attachedFile ? "Add a question about this file… (optional)" : guestLimitReached ? "Sign up to continue…" : "Ask FUNDO AI anything… 🤖"}
                  disabled={guestLimitReached}
                  rows={1}
                  className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed py-2"
                  style={{ color: "rgba(255,255,255,0.88)", maxHeight: 160, minHeight: 24, scrollbarWidth: "none" }}
                />

                <button onClick={() => send()} disabled={(!input.trim() && !attachedFile) || thinking || uploading || guestLimitReached}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{ background: (input.trim() || attachedFile) && !thinking && !guestLimitReached ? "linear-gradient(135deg,#a855f7,#7c3aed)" : "rgba(255,255,255,0.08)", boxShadow: (input.trim() || attachedFile) && !thinking && !guestLimitReached ? "0 3px 12px rgba(168,85,247,0.35)" : "none" }}>
                  {thinking ? <Loader2 size={15} className="animate-spin text-white" /> : <Send size={15} className="text-white" />}
                </button>
              </div>

              <p className="text-center text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.22)" }}>
                Supports images, PDFs & Word docs · FUNDO AI can make mistakes · 🇿🇼 ZIMSEC-aligned
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>
    </PageLayout>
  );
}
