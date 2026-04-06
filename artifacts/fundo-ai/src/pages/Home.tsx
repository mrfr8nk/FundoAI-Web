import { useEffect, useRef, useState, useCallback } from "react";
import {
  Brain, BookOpen, Globe, Zap, MessageCircle, FileText,
  Search, Music, Calculator, FlaskConical, Microscope, Atom,
  Code2, Lightbulb, Map, Languages, ChevronRight, Star,
  Shield, Clock, Users, Sparkles, Bot, GraduationCap,
  PenTool, Camera, Headphones, Database, Wifi, Heart,
  Trophy, Target, Rocket, Moon, Sun, Flame, Leaf, Award,
  CheckCircle2, TrendingUp, Cpu, ImageIcon, Volume2,
  Menu, X, ExternalLink, Mail, Phone, MapPin, ArrowUpRight,
  Twitter, Youtube, Instagram, Linkedin,
} from "lucide-react";

/* ─── Scroll-reveal hook ─── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Reveal wrapper ─── */
function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
}) {
  const { ref, visible } = useScrollReveal();
  const transforms: Record<string, string> = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.88)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Icon rows data ─── */
const ICONS_ROW1 = [
  { icon: Brain, label: "AI Brain", color: "#a855f7" },
  { icon: BookOpen, label: "Study", color: "#06b6d4" },
  { icon: Globe, label: "Web Search", color: "#10b981" },
  { icon: Calculator, label: "Math", color: "#f59e0b" },
  { icon: FlaskConical, label: "Science", color: "#ec4899" },
  { icon: Code2, label: "Code", color: "#8b5cf6" },
  { icon: Languages, label: "Languages", color: "#06b6d4" },
  { icon: FileText, label: "Documents", color: "#a855f7" },
  { icon: Search, label: "Research", color: "#10b981" },
  { icon: Microscope, label: "Biology", color: "#f59e0b" },
  { icon: Atom, label: "Physics", color: "#ec4899" },
  { icon: Music, label: "Creative", color: "#8b5cf6" },
  { icon: Map, label: "Geography", color: "#06b6d4" },
  { icon: Lightbulb, label: "Ideas", color: "#a855f7" },
  { icon: PenTool, label: "Writing", color: "#10b981" },
  { icon: Camera, label: "Vision", color: "#f59e0b" },
];

const ICONS_ROW2 = [
  { icon: MessageCircle, label: "Chat", color: "#ec4899" },
  { icon: Zap, label: "Fast", color: "#a855f7" },
  { icon: GraduationCap, label: "Education", color: "#06b6d4" },
  { icon: Bot, label: "AI Agent", color: "#10b981" },
  { icon: Headphones, label: "Voice", color: "#f59e0b" },
  { icon: Database, label: "Memory", color: "#8b5cf6" },
  { icon: Wifi, label: "Online", color: "#ec4899" },
  { icon: Heart, label: "Care", color: "#a855f7" },
  { icon: Trophy, label: "Achieve", color: "#06b6d4" },
  { icon: Target, label: "Goals", color: "#10b981" },
  { icon: Rocket, label: "Launch", color: "#f59e0b" },
  { icon: Moon, label: "Night Study", color: "#8b5cf6" },
  { icon: Sun, label: "Day Learn", color: "#ec4899" },
  { icon: Flame, label: "Motivation", color: "#a855f7" },
  { icon: Leaf, label: "Growth", color: "#06b6d4" },
  { icon: Award, label: "Excellence", color: "#10b981" },
];

/* ─── Features ─── */
const FEATURES = [
  { icon: Brain, title: "Intelligent AI", desc: "Powered by cutting-edge models that understand context, nuance, and the ZIMSEC curriculum perfectly.", color: "#a855f7", glow: "rgba(168,85,247,0.3)" },
  { icon: BookOpen, title: "ZIMSEC Aligned", desc: "Deep knowledge of the Zimbabwean system — Grade 1–7, Form 1–6, O-Level, and A-Level topics.", color: "#06b6d4", glow: "rgba(6,182,212,0.3)" },
  { icon: Globe, title: "Real-Time Search", desc: "Searches the web live so you always get current news, weather, exam results, and prices.", color: "#10b981", glow: "rgba(16,185,129,0.3)" },
  { icon: FileText, title: "Document Creator", desc: "Generate beautiful PDFs, study notes, essays, and posters — all from inside your chat.", color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  { icon: Calculator, title: "Math Master", desc: "Step-by-step solutions with full working shown. Every ZIMSEC math topic covered.", color: "#ec4899", glow: "rgba(236,72,153,0.3)" },
  { icon: Database, title: "Memory System", desc: "Remembers your name, grade, subjects, and goals — so every session feels personal.", color: "#8b5cf6", glow: "rgba(139,92,246,0.3)" },
];

/* ─── AI showcase conversations ─── */
const DEMO_CONVOS = [
  {
    label: "Math Help",
    icon: Calculator,
    color: "#ec4899",
    user: "Solve x² + 5x + 6 = 0 step by step",
    ai: "Sure! 🔥 Let me factor that for you:\n\nx² + 5x + 6 = 0\n(x + 2)(x + 3) = 0\n\nSo x = -2 or x = -3 ✅",
  },
  {
    label: "Study Notes",
    icon: BookOpen,
    color: "#06b6d4",
    user: "Give me Form 3 notes on photosynthesis",
    ai: "Photosynthesis 🌿 — Form 3 ZIMSEC\n\n• Takes place in chloroplasts\n• Equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n• Light stage + Dark stage\n• Products: glucose + oxygen ☀️",
  },
  {
    label: "Real-Time Info",
    icon: Globe,
    color: "#10b981",
    user: "What's the USD to ZWG rate today?",
    ai: "Searching the web now... 🔍\n\nCurrent rate: 1 USD ≈ 26.5 ZWG\n(Live as of today, April 2026)\n\nAlways check RBZ for official rates! 💡",
  },
  {
    label: "PDF Creator",
    icon: FileText,
    color: "#f59e0b",
    user: "Make me a revision sheet for O-Level History",
    ai: "Creating your PDF now... 📄✨\n\nO-Level History Revision Sheet\n• Chapter summaries\n• Key dates & figures\n• Essay tips\n\nReady! Sending your PDF 🎉",
  },
];

/* ─── Stats ─── */
const STATS = [
  { value: "50K+", label: "Students Helped", icon: Users },
  { value: "99%", label: "Accuracy Rate", icon: Target },
  { value: "24/7", label: "Always Available", icon: Clock },
  { value: "A+", label: "Grade Results", icon: Star },
];

/* ─── AI capabilities pills ─── */
const CAPABILITIES = [
  { icon: Brain, text: "Answers any question" },
  { icon: Calculator, text: "Step-by-step math" },
  { icon: FileText, text: "Generates PDFs" },
  { icon: Globe, text: "Searches the web live" },
  { icon: ImageIcon, text: "Creates images & posters" },
  { icon: Volume2, text: "Text to speech" },
  { icon: Cpu, text: "Thinks intelligently" },
  { icon: TrendingUp, text: "Tracks your progress" },
  { icon: GraduationCap, text: "ZIMSEC curriculum" },
  { icon: Database, text: "Remembers everything" },
];

/* ─── Icon scroll row ─── */
function IconScrollRow({ icons, speed = 22, reversed = false }: {
  icons: typeof ICONS_ROW1;
  speed?: number;
  reversed?: boolean;
}) {
  const doubled = [...icons, ...icons, ...icons];
  return (
    <div className="overflow-hidden w-full relative">
      <div
        className="flex gap-5 py-2"
        style={{
          width: "max-content",
          animation: `iconScrollLR${reversed ? "Rev" : ""} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5" style={{ minWidth: "74px" }}>
              <div
                className="glass-card rounded-2xl p-3.5 transition-all duration-300 hover:scale-110 cursor-default"
                style={{ boxShadow: `0 0 18px ${item.color}28, 0 4px 16px rgba(0,0,0,0.3)`, border: `1px solid ${item.color}28` }}
              >
                <Icon size={26} style={{ color: item.color, filter: `drop-shadow(0 0 6px ${item.color}70)` }} />
              </div>
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Feature card ─── */
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <Reveal delay={index * 0.08} direction="up">
      <div
        className="glass-card rounded-3xl p-7 group hover:scale-[1.03] transition-all duration-500 cursor-default relative overflow-hidden h-full"
        style={{ boxShadow: `0 0 0 1px ${feature.color}18, 0 8px 32px rgba(0,0,0,0.4)` }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 0%, ${feature.glow} 0%, transparent 65%)` }}
        />
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative transition-transform duration-300 group-hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${feature.color}22, ${feature.color}0d)`, border: `1px solid ${feature.color}38`, boxShadow: `0 0 20px ${feature.glow}` }}
        >
          <Icon size={24} style={{ color: feature.color }} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.52)" }}>{feature.desc}</p>
      </div>
    </Reveal>
  );
}

/* ─── AI Chat Demo ─── */
function ChatDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showUser, setShowUser] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const runConvo = useCallback((idx: number) => {
    setShowUser(false);
    setShowTyping(false);
    setShowAi(false);
    setActiveIdx(idx);
    setTimeout(() => setShowUser(true), 200);
    setTimeout(() => setShowTyping(true), 900);
    setTimeout(() => { setShowTyping(false); setShowAi(true); }, 2600);
  }, []);

  useEffect(() => {
    runConvo(0);
  }, [runConvo]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % DEMO_CONVOS.length;
        runConvo(next);
        return next;
      });
    }, 5500);
    return () => clearInterval(id);
  }, [runConvo]);

  const convo = DEMO_CONVOS[activeIdx];
  const Icon = convo.icon;

  return (
    <div
      className="glass-card rounded-3xl p-6 relative overflow-hidden max-w-md w-full mx-auto"
      style={{ boxShadow: `0 0 60px ${convo.color}25, 0 20px 60px rgba(0,0,0,0.5)`, minHeight: 320 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">FUNDO AI 🤖</div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#25d366" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online
          </div>
        </div>
        {/* Tab pills */}
        <div className="ml-auto flex gap-1.5">
          {DEMO_CONVOS.map((d, i) => {
            const Di = d.icon;
            return (
              <button
                key={i}
                onClick={() => runConvo(i)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  background: i === activeIdx ? `${d.color}30` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i === activeIdx ? d.color + "60" : "transparent"}`,
                }}
              >
                <Di size={13} style={{ color: i === activeIdx ? d.color : "rgba(255,255,255,0.3)" }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="space-y-4 min-h-[180px]">
        {/* User message */}
        <div
          className="flex justify-end"
          style={{ opacity: showUser ? 1 : 0, transform: showUser ? "none" : "translateY(12px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}
        >
          <div
            className="rounded-2xl rounded-br-sm px-4 py-3 max-w-[75%] text-sm text-white font-medium"
            style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
          >
            {convo.user}
          </div>
        </div>

        {/* Typing indicator */}
        {showTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
              <Bot size={13} className="text-white" />
            </div>
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#a855f7", animation: `dotBounce 1s ease-in-out ${i * 0.18}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI response */}
        {showAi && (
          <div
            className="flex items-end gap-2"
            style={{ opacity: showAi ? 1 : 0, transform: showAi ? "none" : "translateY(12px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
              <Bot size={13} className="text-white" />
            </div>
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] text-sm text-white leading-relaxed" style={{ whiteSpace: "pre-line" }}>
              {convo.ai}
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: convo.color }} />
        <span className="text-xs font-semibold" style={{ color: convo.color }}>{convo.label} Demo</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ MAIN PAGE ═══════════════════════════════════════════ */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #080511 0%, #050a14 50%, #09091a 100%)" }}>

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes iconScrollLR {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes iconScrollLRRev {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-20px) scale(1.04); }
        }
        @keyframes rotRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counterRotRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes shimmerMove {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes capPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
      `}</style>

      {/* ── Background orbs ── */}
      <div className="absolute w-[800px] h-[800px] top-[-300px] left-[-300px] rounded-full opacity-[0.22] pointer-events-none" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", animation: "orbFloat 12s ease-in-out infinite" }} />
      <div className="absolute w-[600px] h-[600px] top-[5%] right-[-200px] rounded-full opacity-[0.14] pointer-events-none" style={{ background: "radial-gradient(circle, #0891b2 0%, transparent 70%)", animation: "orbFloat 16s ease-in-out 4s infinite" }} />
      <div className="absolute w-[500px] h-[500px] top-[55%] left-[35%] rounded-full opacity-[0.10] pointer-events-none" style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)", animation: "orbFloat 20s ease-in-out 8s infinite" }} />
      <div className="absolute w-[450px] h-[450px] bottom-[5%] right-[10%] rounded-full opacity-[0.15] pointer-events-none" style={{ background: "radial-gradient(circle, #0e7490 0%, transparent 70%)", animation: "orbFloat 14s ease-in-out 2s infinite" }} />

      {/* ── Grid ── */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* ════════════════════════════════ ANNOUNCEMENT BAR ════════════════════════════════ */}
      <div className="relative z-50 text-center py-2 px-4 text-xs font-semibold" style={{ background: "linear-gradient(90deg, rgba(37,211,102,0.15), rgba(168,85,247,0.15), rgba(6,182,212,0.15))", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🎓 Now available on WhatsApp for all Zimbabwean students · </span>
        <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2 transition-colors duration-200" style={{ color: "#25d366" }}>
          Start free today →
        </a>
      </div>

      {/* ════════════════════════════════ NAVBAR ════════════════════════════════ */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(8,5,17,0.92)" : "rgba(8,5,17,0.4)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Main nav row */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 16px rgba(168,85,247,0.5)" }}
              >
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <span
                  className="text-lg font-black tracking-tight leading-none block"
                  style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  FUNDO AI
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest leading-none block" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Zimbabwe's AI
                </span>
              </div>
            </a>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how" },
                { label: "Demo", href: "#demo" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; (e.currentTarget.style as any).background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; (e.currentTarget.style as any).background = "transparent"; }}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Tagline pill — desktop only */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", color: "#25d366" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Free to use
              </div>

              {/* CTA */}
              <a
                href="https://wa.me/263719647303"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 4px 16px rgba(37,211,102,0.35)" }}
              >
                <MessageCircle size={14} />
                Chat Now
              </a>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {mobileOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden pb-4 pt-2 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how" },
                { label: "Demo", href: "#demo" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  onMouseEnter={(e) => { (e.currentTarget.style as any).background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget.style as any).background = "transparent"; }}
                >
                  {label}
                  <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                </a>
              ))}
              <a
                href="https://wa.me/263719647303"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white mt-2"
                style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
              >
                <MessageCircle size={15} />
                Chat Now on WhatsApp
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* ════════════════════════════════ HERO ════════════════════════════════ */}
      <section className="relative z-10 pt-24 pb-10 text-center px-6">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-card"
          style={{
            border: "1px solid rgba(168,85,247,0.25)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(-12px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>Zimbabwe's Most Advanced AI Assistant</span>
          <Sparkles size={12} style={{ color: "#a855f7" }} />
        </div>

        {/* Headline */}
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(24px)", transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s" }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6">
            <span className="block text-white">Meet</span>
            <span className="block" style={{ background: "linear-gradient(135deg, #c084fc 0%, #60a5fa 45%, #34d399 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shimmerMove 5s linear infinite" }}>
              FUNDO AI
            </span>
            <span className="block text-white text-4xl md:text-5xl mt-2 font-bold">🤖🔥</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.58)" }}>
            A powerful, intelligent AI agent built for Zimbabwean students. Ask anything — get brilliant answers, create documents, solve math, and learn like never before.
          </p>
        </div>

        {/* CTA */}
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s" }}>
          <a
            href="https://wa.me/263719647303"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.35)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#25d366" }}>
              <MessageCircle size={13} className="text-white" />
            </div>
            Start Chatting on WhatsApp
            <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.4)" }} className="group-hover:translate-x-1 group-hover:text-white transition-all" />
          </a>
          <p className="mt-5 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Free · No download · Works on any phone · Created by{" "}
            <span className="font-semibold" style={{ color: "#a855f7" }}>Darrell Mucheri</span> 🇿🇼
          </p>
        </div>

        {/* ── Floating AI orb ── */}
        <div className="flex justify-center mt-16 mb-2">
          <div className="relative" style={{ animation: "orbFloat 6s ease-in-out infinite" }}>
            {/* outer glow ring */}
            <div className="absolute inset-[-12px] rounded-full opacity-30" style={{ background: "conic-gradient(from 0deg, #a855f7, #06b6d4, #10b981, #a855f7)", animation: "rotRing 6s linear infinite", filter: "blur(8px)" }} />
            {/* rotating border */}
            <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, transparent 0%, #a855f7 25%, transparent 50%, #06b6d4 75%, transparent 100%)", animation: "rotRing 4s linear infinite", opacity: 0.7 }} />
            {/* counter ring */}
            <div className="absolute inset-[8px] rounded-full" style={{ background: "conic-gradient(from 180deg, transparent 0%, #ec4899 25%, transparent 50%, #f59e0b 75%, transparent 100%)", animation: "counterRotRing 7s linear infinite", opacity: 0.4 }} />
            {/* inner fill */}
            <div className="absolute inset-[3px] rounded-full" style={{ background: "linear-gradient(135deg, #0a0614, #0c0a1a)" }} />
            {/* icon */}
            <div className="w-48 h-48 rounded-full flex items-center justify-center relative" style={{ boxShadow: "0 0 60px rgba(168,85,247,0.5), 0 0 120px rgba(168,85,247,0.15)" }}>
              <Bot size={62} className="relative z-10" style={{ color: "#a855f7", filter: "drop-shadow(0 0 20px #a855f7)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ ICON SCROLL ROWS ════════════════════════════════ */}
      <section className="relative z-10 py-10 overflow-hidden">
        <div className="space-y-5">
          <IconScrollRow icons={ICONS_ROW1} speed={24} />
          <IconScrollRow icons={ICONS_ROW2} speed={32} reversed />
        </div>
        <div className="absolute inset-y-0 left-0 w-36 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, #080511 0%, transparent 100%)" }} />
        <div className="absolute inset-y-0 right-0 w-36 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, #080511 0%, transparent 100%)" }} />
      </section>

      {/* ════════════════════════════════ CAPABILITIES PILLS ════════════════════════════════ */}
      <Reveal direction="up">
        <section className="relative z-10 py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>What FUNDO AI Can Do</p>
            <div className="flex flex-wrap justify-center gap-3">
              {CAPABILITIES.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{ color: "rgba(255,255,255,0.75)", animation: `capPulse ${2.5 + i * 0.2}s ease-in-out ${i * 0.1}s infinite`, border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <CheckCircle2 size={13} style={{ color: "#25d366" }} />
                    <Icon size={13} style={{ color: "#a855f7" }} />
                    {cap.text}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ════════════════════════════════ STATS ════════════════════════════════ */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Reveal key={i} delay={i * 0.1} direction="scale">
                <div className="glass-card rounded-3xl p-6 text-center group hover:scale-105 transition-all duration-300" style={{ boxShadow: "0 0 30px rgba(168,85,247,0.08), 0 8px 32px rgba(0,0,0,0.4)" }}>
                  <Icon size={22} className="mx-auto mb-3" style={{ color: "#a855f7" }} />
                  <div className="text-3xl font-black mb-1" style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════ AI DEMO ════════════════════════════════ */}
      <section id="demo" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: "#25d366" }}>Live Demo</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                  See FUNDO AI{" "}
                  <span style={{ background: "linear-gradient(135deg, #c084fc, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    in action
                  </span>
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Watch as FUNDO AI solves math, creates study notes, searches the web in real time, and generates documents — all from a simple WhatsApp message.
                </p>
                <div className="space-y-3">
                  {DEMO_CONVOS.map((d, i) => {
                    const Di = d.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${d.color}20`, border: `1px solid ${d.color}35` }}>
                          <Di size={13} style={{ color: d.color }} />
                        </div>
                        {d.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <ChatDemo />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ FEATURES ════════════════════════════════ */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: "#a855f7" }}>Capabilities</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Everything you need
                <br />
                <span style={{ background: "linear-gradient(135deg, #c084fc, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>to excel</span>
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
                FUNDO AI combines real-time intelligence with deep academic knowledge to help every Zimbabwean student reach their full potential.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ HOW IT WORKS ════════════════════════════════ */}
      <section id="how" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal direction="up">
            <div className="mb-16">
              <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: "#06b6d4" }}>How It Works</span>
              <h2 className="text-4xl font-black text-white">Three simple steps</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Open WhatsApp", desc: "Save FUNDO AI's number and open a chat — no app download, no account needed.", icon: MessageCircle, color: "#25d366" },
              { step: "02", title: "Ask Anything", desc: "Type your question, upload a file, or request notes, essays, or PDFs.", icon: Brain, color: "#a855f7" },
              { step: "03", title: "Get Results", desc: "Receive brilliant, detailed answers tailored exactly to your ZIMSEC level.", icon: Sparkles, color: "#06b6d4" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i} delay={i * 0.12} direction="up">
                  <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden group hover:scale-[1.04] transition-all duration-500 h-full">
                    <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
                    <div className="text-6xl font-black mb-3" style={{ color: `${item.color}20` }}>{item.step}</div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${item.color}20, ${item.color}0d)`, border: `1px solid ${item.color}35`, boxShadow: `0 0 24px ${item.color}20` }}>
                      <Icon size={24} style={{ color: item.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ CTA BANNER ════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <Reveal direction="scale">
          <div className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(18,140,126,0.06) 100%)", border: "1px solid rgba(37,211,102,0.2)", boxShadow: "0 0 80px rgba(37,211,102,0.12), 0 20px 60px rgba(0,0,0,0.5)" }}>
            <div className="absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(circle at 50% 0%, rgba(37,211,102,0.1) 0%, transparent 60%)" }} />
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative" style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 0 40px rgba(37,211,102,0.4)" }}>
              <Bot size={30} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 relative leading-tight">
              Ready to unlock your{" "}
              <span style={{ background: "linear-gradient(135deg, #25d366, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>full potential?</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto relative" style={{ color: "rgba(255,255,255,0.55)" }}>
              Join thousands of Zimbabwean students already studying smarter with FUNDO AI.
            </p>
            <a
              href="https://wa.me/263719647303"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300 hover:scale-105 relative group"
              style={{ background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)", boxShadow: "0 8px 40px rgba(37,211,102,0.5), 0 0 80px rgba(37,211,102,0.2)" }}
            >
              <MessageCircle size={22} />
              Chat with FUNDO AI Now
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="mt-5 text-sm relative" style={{ color: "rgba(255,255,255,0.3)" }}>Free to use · No download needed · Works on any phone</p>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════ FOOTER ════════════════════════════════ */}
      <footer className="relative z-10 mt-16" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Top gradient line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(6,182,212,0.5), transparent)" }} />

        {/* Main footer body */}
        <div
          style={{
            background: "linear-gradient(180deg, rgba(8,5,17,0.6) 0%, rgba(5,4,12,0.95) 100%)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
          }}
        >
          {/* Upper section */}
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

              {/* Brand column */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}
                  >
                    <Bot size={22} className="text-white" />
                  </div>
                  <div>
                    <div
                      className="text-xl font-black tracking-tight leading-none"
                      style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                      FUNDO AI
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Zimbabwe's AI Assistant
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  A powerful, intelligent AI agent built for Zimbabwean students. Helping learners from Grade 1 to A-Level reach their full potential — available 24/7 on WhatsApp.
                </p>
                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { icon: Shield, text: "Safe & Private", color: "#25d366" },
                    { icon: Clock, text: "24/7 Available", color: "#06b6d4" },
                    { icon: GraduationCap, text: "ZIMSEC Aligned", color: "#a855f7" },
                  ].map(({ icon: Icon, text, color }) => (
                    <div
                      key={text}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: `${color}12`, border: `1px solid ${color}28`, color: "rgba(255,255,255,0.6)" }}
                    >
                      <Icon size={11} style={{ color }} />
                      {text}
                    </div>
                  ))}
                </div>
                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/263719647303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 4px 20px rgba(37,211,102,0.35)" }}
                >
                  <MessageCircle size={15} />
                  Open WhatsApp Chat
                  <ArrowUpRight size={13} />
                </a>
              </div>

              {/* Quick links */}
              <div>
                <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-widest" style={{ letterSpacing: "0.12em" }}>
                  Navigate
                </h4>
                <ul className="space-y-3">
                  {[
                    { label: "Features", href: "#features" },
                    { label: "How It Works", href: "#how" },
                    { label: "Live Demo", href: "#demo" },
                    { label: "About FUNDO AI", href: "#" },
                    { label: "Creator — Darrell Mucheri", href: "#" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="flex items-center gap-2 text-sm transition-all duration-200 group"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                      >
                        <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0 duration-200" style={{ color: "#a855f7" }} />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact column */}
              <div>
                <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-widest" style={{ letterSpacing: "0.12em" }}>
                  Contact
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="https://wa.me/263719647303"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 group transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.2)" }}>
                        <MessageCircle size={14} style={{ color: "#25d366" }} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>WhatsApp</div>
                        <div className="text-sm font-medium transition-colors duration-200" style={{ color: "rgba(255,255,255,0.7)" }}
                          onMouseEnter={(e: any) => { e.target.style.color = "#25d366"; }}
                          onMouseLeave={(e: any) => { e.target.style.color = "rgba(255,255,255,0.7)"; }}
                        >+263 719 647 303</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://fundoai.gleeze.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.2)" }}>
                        <Globe size={14} style={{ color: "#06b6d4" }} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Website</div>
                        <div className="text-sm font-medium transition-colors duration-200" style={{ color: "rgba(255,255,255,0.7)" }}
                          onMouseEnter={(e: any) => { e.target.style.color = "#06b6d4"; }}
                          onMouseLeave={(e: any) => { e.target.style.color = "rgba(255,255,255,0.7)"; }}
                        >fundoai.gleeze.com</div>
                      </div>
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)" }}>
                      <MapPin size={14} style={{ color: "#a855f7" }} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Based in</div>
                      <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Zimbabwe 🇿🇼</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
          </div>

          {/* Bottom bar */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left */}
              <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span>© 2025 FUNDO AI</span>
                <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
                <span>All rights reserved</span>
                <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
                <span>
                  Built by{" "}
                  <span className="font-semibold" style={{ color: "#a855f7" }}>Darrell Mucheri</span>
                </span>
              </div>

              {/* Center — Made in Zimbabwe badge */}
              <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}
              >
                <span>🇿🇼</span>
                <span>Made in Zimbabwe with ❤️</span>
              </div>

              {/* Right — legal links */}
              <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {["Privacy Policy", "Terms of Use"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="transition-colors duration-200"
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
