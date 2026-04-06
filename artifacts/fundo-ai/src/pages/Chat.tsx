import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Trash2, LogIn, MessageCircle, Sparkles, Globe, Zap, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import PageLayout from "@/components/PageLayout";

interface Msg { role: "user" | "assistant"; content: string; ts?: number; }

function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        // Bold
        const bold = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Bullet
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
          return <div key={i} className="flex gap-2 items-start pl-1"><span style={{ color: "#a855f7", marginTop: 2 }}>•</span><span dangerouslySetInnerHTML={{ __html: bold.replace(/^[•\-]\s/, "") }} /></div>;
        }
        return <div key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
      })}
    </div>
  );
}

const SUGGESTED = [
  "What is photosynthesis? 🌿",
  "Help me with O-Level Maths 📐",
  "Explain the Zimbabwe Civil War 📚",
  "Write a poem about Zimbabwe 🇿🇼",
  "What's the weather in Harare? 🌤️",
  "Solve: 2x + 5 = 13 🔢",
];

export default function Chat() {
  const { user, loading: authLoading } = useAuth();
  const [, nav] = useLocation();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sessionHistory, setSessionHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [histLoading, setHistLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user) {
      setHistLoading(true);
      api.getHistory().then(d => {
        const hist: Msg[] = (d.history || []).slice(-30).map((h: any) => ({ role: h.role === "user" ? "user" : "assistant", content: h.content, ts: h.ts }));
        setMessages(hist);
      }).catch(() => {}).finally(() => setHistLoading(false));
    }
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send(text?: string) {
    const msg = (text || input).trim();
    if (!msg || thinking) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: msg, ts: Date.now() };
    setMessages(m => [...m, userMsg]);
    setThinking(true);
    try {
      let data: any;
      if (user) {
        data = await api.chat(msg);
      } else {
        const hist = sessionHistory.slice(-6);
        data = await api.chatGuest(msg, hist);
        setSessionHistory(h => [...h, userMsg, { role: "assistant", content: data.reply }]);
      }
      setMessages(m => [...m, { role: "assistant", content: data.reply, ts: Date.now() }]);
    } catch (err: any) {
      setMessages(m => [...m, { role: "assistant", content: `❌ ${err.message || "Something went wrong"}`, ts: Date.now() }]);
    } finally { setThinking(false); }
  }

  async function clearHistory() {
    if (!user) { setMessages([]); setSessionHistory([]); return; }
    setClearing(true);
    try { await api.clearHistory(); setMessages([]); } catch { }
    finally { setClearing(false); }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const isEmpty = messages.length === 0 && !histLoading;

  return (
    <PageLayout>
      <div className="flex flex-col" style={{ height: "calc(100vh - 68px)" }}>
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3" style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 14px rgba(168,85,247,0.4)" }}>
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">FUNDO AI 🤖</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: "0 0 4px #4ade80" }} />
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Online · Llama 4 Scout</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <button onClick={() => nav("/signup")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 2px 10px rgba(168,85,247,0.3)" }}>
                <LogIn size={12} />Sign up
              </button>
            )}
            {messages.length > 0 && (
              <button onClick={clearHistory} disabled={clearing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                title="Clear chat">
                {clearing ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Guest banner */}
        {!user && !authLoading && (
          <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-center justify-between" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
              <Sparkles size={13} style={{ color: "#a855f7" }} />
              <span>You're chatting as a guest — messages won't be saved</span>
            </div>
            <button onClick={() => nav("/signup")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#a855f7" }}>
              Sign up <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
          {histLoading && (
            <div className="flex justify-center pt-8">
              <Loader2 size={24} className="animate-spin" style={{ color: "#a855f7" }} />
            </div>
          )}

          {isEmpty && !histLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-4 py-8">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.12))", border: "1px solid rgba(168,85,247,0.2)", boxShadow: "0 0 40px rgba(168,85,247,0.15)" }}>
                <Bot size={40} style={{ color: "#a855f7" }} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Hey{user ? ` ${user.name.split(" ")[0]}` : ""}! I'm FUNDO AI 🤖🔥</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 340 }}>
                Zimbabwe's most powerful AI study assistant. Ask me anything — I speak ZIMSEC!
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
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
              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 justify-center mt-5">
                {[{ icon: Globe, label: "Web search" }, { icon: Zap, label: "Real-time data" }, { icon: MessageCircle, label: "ZIMSEC curriculum" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>
                    <Icon size={11} />{label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 10px rgba(168,85,247,0.35)" }}>
                  <Bot size={15} className="text-white" />
                </div>
              )}
              <div className={`max-w-[78%] sm:max-w-[70%] px-4 py-3 rounded-2xl ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                style={msg.role === "user"
                  ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.88)" }}>
                {msg.role === "user"
                  ? <p className="text-sm leading-relaxed">{msg.content}</p>
                  : <Markdown text={msg.content} />}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <User size={15} className="text-white" />
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 10px rgba(168,85,247,0.35)" }}>
                <Bot size={15} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: "#a855f7", animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="px-4 sm:px-6 py-3" style={{ background: "rgba(8,5,17,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end rounded-2xl p-3 transition-all duration-200" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(168,85,247,0.08)"; }}
              onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              <textarea
                ref={inputRef} value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; }}
                onKeyDown={handleKey}
                placeholder="Ask FUNDO AI anything... 🤖"
                rows={1}
                className="flex-1 bg-transparent text-white text-sm resize-none outline-none leading-relaxed"
                style={{ color: "rgba(255,255,255,0.88)", maxHeight: 160, minHeight: 24, scrollbarWidth: "none" }}
              />
              <button onClick={() => send()} disabled={!input.trim() || thinking}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{ background: input.trim() && !thinking ? "linear-gradient(135deg,#a855f7,#7c3aed)" : "rgba(255,255,255,0.08)", boxShadow: input.trim() && !thinking ? "0 3px 12px rgba(168,85,247,0.35)" : "none" }}>
                {thinking ? <Loader2 size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white" />}
              </button>
            </div>
            <p className="text-center text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.22)" }}>
              FUNDO AI can make mistakes. Verify important answers. 🇿🇼 ZIMSEC-aligned
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>
    </PageLayout>
  );
}
