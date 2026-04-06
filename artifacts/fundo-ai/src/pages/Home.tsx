import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  Brain, BookOpen, Globe, Zap, MessageCircle, FileText,
  Search, Music, Calculator, FlaskConical, Microscope, Atom,
  Code2, Lightbulb, Map, Languages, ChevronRight, ChevronDown, Star,
  Shield, Clock, Users, Sparkles, Bot, GraduationCap,
  PenTool, Camera, Headphones, Database, Wifi, Heart,
  Trophy, Target, Rocket, Moon, Sun, Flame, Leaf, Award,
  CheckCircle2, TrendingUp, Cpu, ImageIcon, Volume2,
  Menu, X, MapPin, ArrowUpRight,
} from "lucide-react";

/* ─── Scroll-reveal hook ─── */
function useScrollReveal(threshold = 0.12) {
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

/* ─── Count-up hook ─── */
function useCountUp(target: string, duration = 1200) {
  const [display, setDisplay] = useState("0");
  const triggered = useRef(false);
  const start = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
    const suffix = target.replace(/[0-9.]/g, "");
    if (isNaN(numeric)) { setDisplay(target); return; }
    const steps = 40;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += numeric / steps;
      if (current >= numeric) {
        setDisplay(`${target}`);
        clearInterval(timer);
      } else {
        const val = numeric < 10 ? current.toFixed(1) : Math.floor(current);
        setDisplay(`${val}${suffix}`);
      }
    }, interval);
  }, [target, duration]);
  return { display, start };
}

/* ─── Reveal wrapper ─── */
function Reveal({
  children, delay = 0, direction = "up", className = "",
}: {
  children: React.ReactNode; delay?: number;
  direction?: "up" | "left" | "right" | "scale"; className?: string;
}) {
  const { ref, visible } = useScrollReveal();
  const transforms: Record<string, string> = {
    up: "translateY(48px)",
    left: "translateX(-48px)",
    right: "translateX(48px)",
    scale: "scale(0.90)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section label ─── */
function SectionLabel({ text, color = "#a855f7" }: { text: string; color?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {text}
      </span>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}

/* ─── Icon rows ─── */
const ICONS_ROW1 = [
  { icon: Brain,       label: "AI Brain",   color: "#a855f7" },
  { icon: BookOpen,    label: "Study",       color: "#06b6d4" },
  { icon: Globe,       label: "Web Search",  color: "#10b981" },
  { icon: Calculator,  label: "Math",        color: "#f59e0b" },
  { icon: FlaskConical,label: "Science",     color: "#ec4899" },
  { icon: Code2,       label: "Code",        color: "#8b5cf6" },
  { icon: Languages,   label: "Languages",   color: "#06b6d4" },
  { icon: FileText,    label: "Documents",   color: "#a855f7" },
  { icon: Search,      label: "Research",    color: "#10b981" },
  { icon: Microscope,  label: "Biology",     color: "#f59e0b" },
  { icon: Atom,        label: "Physics",     color: "#ec4899" },
  { icon: Music,       label: "Creative",    color: "#8b5cf6" },
  { icon: Map,         label: "Geography",   color: "#06b6d4" },
  { icon: Lightbulb,   label: "Ideas",       color: "#a855f7" },
  { icon: PenTool,     label: "Writing",     color: "#10b981" },
  { icon: Camera,      label: "Vision",      color: "#f59e0b" },
];

const ICONS_ROW2 = [
  { icon: MessageCircle, label: "Chat",       color: "#ec4899" },
  { icon: Zap,           label: "Fast",       color: "#a855f7" },
  { icon: GraduationCap, label: "Education",  color: "#06b6d4" },
  { icon: Bot,           label: "AI Agent",   color: "#10b981" },
  { icon: Headphones,    label: "Voice",      color: "#f59e0b" },
  { icon: Database,      label: "Memory",     color: "#8b5cf6" },
  { icon: Wifi,          label: "Online",     color: "#ec4899" },
  { icon: Heart,         label: "Care",       color: "#a855f7" },
  { icon: Trophy,        label: "Achieve",    color: "#06b6d4" },
  { icon: Target,        label: "Goals",      color: "#10b981" },
  { icon: Rocket,        label: "Launch",     color: "#f59e0b" },
  { icon: Moon,          label: "Night Study",color: "#8b5cf6" },
  { icon: Sun,           label: "Day Learn",  color: "#ec4899" },
  { icon: Flame,         label: "Motivation", color: "#a855f7" },
  { icon: Leaf,          label: "Growth",     color: "#06b6d4" },
  { icon: Award,         label: "Excellence", color: "#10b981" },
];

/* ─── Features ─── */
const FEATURES = [
  { icon: Brain,       title: "Intelligent AI",     desc: "Powered by cutting-edge models that understand context, nuance, and the ZIMSEC curriculum perfectly.",                               color: "#a855f7", glow: "rgba(168,85,247,0.25)" },
  { icon: BookOpen,    title: "ZIMSEC Aligned",     desc: "Deep knowledge of the Zimbabwean system — Grade 1–7, Form 1–6, O-Level, and A-Level topics covered in full.",                        color: "#06b6d4", glow: "rgba(6,182,212,0.25)" },
  { icon: Globe,       title: "Real-Time Search",   desc: "Searches the web live so you always get current news, weather, exam results, and prices from Zimbabwe and beyond.",                   color: "#10b981", glow: "rgba(16,185,129,0.25)" },
  { icon: FileText,    title: "Document Creator",   desc: "Generate beautiful PDFs, study notes, essays, and posters — all from inside your WhatsApp chat without any extra apps.",             color: "#f59e0b", glow: "rgba(245,158,11,0.25)" },
  { icon: Calculator,  title: "Math Master",        desc: "Step-by-step solutions with full working shown for every ZIMSEC math topic from primary all the way to A-Level.",                     color: "#ec4899", glow: "rgba(236,72,153,0.25)" },
  { icon: Database,    title: "Memory System",      desc: "Remembers your name, grade, subjects, and goals — so every session feels personal and gets smarter over time.",                       color: "#8b5cf6", glow: "rgba(139,92,246,0.25)" },
];

/* ─── Demo conversations ─── */
const DEMO_CONVOS = [
  { label: "Math Help",     icon: Calculator, color: "#ec4899", user: "Solve x² + 5x + 6 = 0 step by step",     ai: "Sure! 🔥 Let me factor that:\n\nx² + 5x + 6 = 0\n(x + 2)(x + 3) = 0\n\nSo x = -2 or x = -3 ✅" },
  { label: "Study Notes",   icon: BookOpen,   color: "#06b6d4", user: "Give me Form 3 notes on photosynthesis",  ai: "Photosynthesis 🌿 — Form 3 ZIMSEC\n\n• Takes place in chloroplasts\n• Equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n• Light stage + Dark stage ☀️" },
  { label: "Real-Time Info",icon: Globe,      color: "#10b981", user: "What's the USD to ZWG rate today?",       ai: "Searching the web... 🔍\n\nCurrent rate: 1 USD ≈ 26.5 ZWG\n(Live as of today, April 2026)\n\nAlways verify with RBZ! 💡" },
  { label: "PDF Creator",   icon: FileText,   color: "#f59e0b", user: "Make me a revision sheet for O-Level History", ai: "Creating your PDF... 📄✨\n\nO-Level History Revision Sheet\n• Chapter summaries\n• Key dates & figures\n• Essay tips\n\nSending your PDF 🎉" },
];

/* ─── Stats ─── */
const STATS = [
  { value: "50K+", label: "Students Helped", icon: Users,  color: "#a855f7" },
  { value: "99%",  label: "Accuracy Rate",   icon: Target, color: "#06b6d4" },
  { value: "24/7", label: "Always Available",icon: Clock,  color: "#10b981" },
  { value: "A+",   label: "Grade Results",   icon: Star,   color: "#f59e0b" },
];

/* ─── Capabilities ─── */
const CAPABILITIES = [
  { icon: Brain,        text: "Answers any question" },
  { icon: Calculator,   text: "Step-by-step math" },
  { icon: FileText,     text: "Generates PDFs" },
  { icon: Globe,        text: "Searches the web live" },
  { icon: ImageIcon,    text: "Creates images & posters" },
  { icon: Volume2,      text: "Text to speech" },
  { icon: Cpu,          text: "Thinks intelligently" },
  { icon: TrendingUp,   text: "Tracks your progress" },
  { icon: GraduationCap,text: "ZIMSEC curriculum" },
  { icon: Database,     text: "Remembers everything" },
];

/* ─── Icon scroll row ─── */
function IconScrollRow({ icons, speed = 22, reversed = false }: { icons: typeof ICONS_ROW1; speed?: number; reversed?: boolean }) {
  const doubled = [...icons, ...icons, ...icons];
  return (
    <div className="overflow-hidden w-full relative">
      <div
        className="flex gap-5 py-2"
        style={{ width: "max-content", animation: `iconScrollLR${reversed ? "Rev" : ""} ${speed}s linear infinite`, willChange: "transform" }}
      >
        {doubled.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5" style={{ minWidth: "74px" }}>
              <div
                className="glass-card rounded-2xl p-3.5 cursor-default"
                style={{ boxShadow: `0 0 18px ${item.color}22, 0 4px 16px rgba(0,0,0,0.25)`, border: `1px solid ${item.color}22`, transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.12)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${item.color}55, 0 8px 24px rgba(0,0,0,0.35)`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 18px ${item.color}22, 0 4px 16px rgba(0,0,0,0.25)`; }}
              >
                <Icon size={26} style={{ color: item.color, filter: `drop-shadow(0 0 5px ${item.color}80)` }} />
              </div>
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.32)" }}>{item.label}</span>
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
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={index * 0.07} direction="up">
      <div
        className="glass-card rounded-3xl p-7 relative overflow-hidden h-full cursor-default card-top-shine"
        style={{
          boxShadow: hovered ? `0 0 0 1px ${feature.color}35, 0 20px 56px rgba(0,0,0,0.55)` : `0 0 0 1px ${feature.color}14, 0 8px 32px rgba(0,0,0,0.4)`,
          transform: hovered ? "translateY(-5px) scale(1.012)" : "none",
          transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.4s ease",
          borderColor: hovered ? `${feature.color}30` : "rgba(255,255,255,0.08)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${feature.glow} 0%, transparent 65%)`, opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }}
        />
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`, opacity: hovered ? 0.8 : 0, transition: "opacity 0.4s ease" }}
        />
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative"
          style={{
            background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}0a)`,
            border: `1px solid ${feature.color}30`,
            boxShadow: hovered ? `0 0 28px ${feature.glow}` : `0 0 14px ${feature.glow}80`,
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease",
          }}
        >
          <Icon size={24} style={{ color: feature.color }} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>{feature.desc}</p>
      </div>
    </Reveal>
  );
}

/* ─── Stat card ─── */
function StatCard({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const Icon = stat.icon;
  const { display, start } = useCountUp(stat.value);
  const { ref, visible } = useScrollReveal(0.3);
  const [hovered, setHovered] = useState(false);
  useEffect(() => { if (visible) start(); }, [visible, start]);
  return (
    <div
      ref={ref}
      className="glass-card rounded-3xl p-7 text-center cursor-default card-top-shine"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "scale(0.88) translateY(20px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s, box-shadow 0.35s ease`,
        boxShadow: hovered ? `0 0 0 1px ${stat.color}40, 0 20px 56px rgba(0,0,0,0.55)` : "0 0 30px rgba(168,85,247,0.07), 0 8px 32px rgba(0,0,0,0.4)",
        borderColor: hovered ? `${stat.color}28` : "rgba(255,255,255,0.08)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${stat.color}14`, border: `1px solid ${stat.color}25` }}>
        <Icon size={20} style={{ color: stat.color }} />
      </div>
      <div
        className="text-4xl font-black mb-1 num-appear"
        style={{ background: `linear-gradient(135deg, ${stat.color}, #fff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animationDelay: `${delay}s` }}
      >
        {display}
      </div>
      <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>{stat.label}</div>
    </div>
  );
}

/* ─── Chat Demo ─── */
function ChatDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showUser, setShowUser] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const runConvo = useCallback((idx: number) => {
    setShowUser(false); setShowTyping(false); setShowAi(false);
    setActiveIdx(idx);
    setTimeout(() => setShowUser(true), 250);
    setTimeout(() => setShowTyping(true), 950);
    setTimeout(() => { setShowTyping(false); setShowAi(true); }, 2700);
  }, []);

  useEffect(() => { runConvo(0); }, [runConvo]);
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => { const next = (prev + 1) % DEMO_CONVOS.length; runConvo(next); return next; });
    }, 5800);
    return () => clearInterval(id);
  }, [runConvo]);

  const convo = DEMO_CONVOS[activeIdx];
  const Icon = convo.icon;

  return (
    <div
      className="glass-card rounded-3xl p-6 relative overflow-hidden max-w-md w-full mx-auto"
      style={{ boxShadow: `0 0 50px ${convo.color}20, 0 20px 60px rgba(0,0,0,0.5)`, minHeight: 320, transition: "box-shadow 0.6s ease" }}
    >
      {/* Status bar */}
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 16px rgba(168,85,247,0.4)" }}>
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">FUNDO AI 🤖</div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#25d366" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online
          </div>
        </div>
        <div className="ml-auto flex gap-1.5">
          {DEMO_CONVOS.map((d, i) => {
            const Di = d.icon;
            return (
              <button
                key={i}
                onClick={() => runConvo(i)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ background: i === activeIdx ? `${d.color}28` : "rgba(255,255,255,0.04)", border: `1px solid ${i === activeIdx ? d.color + "55" : "transparent"}`, transform: i === activeIdx ? "scale(1.1)" : "scale(1)" }}
              >
                <Di size={13} style={{ color: i === activeIdx ? d.color : "rgba(255,255,255,0.28)" }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="space-y-4 min-h-[200px]">
        {/* User bubble */}
        <div
          className="flex justify-end"
          style={{ opacity: showUser ? 1 : 0, transform: showUser ? "none" : "translateY(14px)", transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)" }}
        >
          <div className="rounded-2xl rounded-br-sm px-4 py-3 max-w-[78%] text-sm text-white font-medium" style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}>
            {convo.user}
          </div>
        </div>

        {/* Typing dots */}
        {showTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
              <Bot size={13} className="text-white" />
            </div>
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#a855f7", animation: `dotBounce 1s ease-in-out ${i * 0.18}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI reply */}
        {showAi && (
          <div
            className="flex items-end gap-2"
            style={{ opacity: 1, transform: "none", animation: "fade-in-up 0.45s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
              <Bot size={13} className="text-white" />
            </div>
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 max-w-[82%] text-sm text-white leading-relaxed" style={{ whiteSpace: "pre-line" }}>
              {convo.ai}
            </div>
          </div>
        )}
      </div>

      {/* Active label */}
      <div className="mt-5 flex items-center gap-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Icon size={13} style={{ color: convo.color }} />
        <span className="text-xs font-semibold" style={{ color: convo.color }}>{convo.label} Demo</span>
        <div className="ml-auto flex gap-1">
          {DEMO_CONVOS.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-400" style={{ width: i === activeIdx ? 16 : 5, height: 5, background: i === activeIdx ? convo.color : "rgba(255,255,255,0.15)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ MAIN PAGE ═══════════════════════════════════════════ */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => { setScrolled(window.scrollY > 20); setScrollY(window.scrollY); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [, nav] = useLocation();
  const { user, logout } = useAuth();

  const NAV_LINKS = [
    { label: "Features",    href: "#features" },
    { label: "How It Works",href: "#how" },
    { label: "Demo",        href: "#demo" },
    { label: "About",       href: "/about" },
  ];

  function handleNavClick(href: string) {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      nav(href);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #080511 0%, #050a14 50%, #09091a 100%)" }}>

      {/* ── Background orbs ── */}
      <div className="absolute w-[900px] h-[900px] top-[-320px] left-[-320px] rounded-full opacity-[0.20] pointer-events-none" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", animation: "orbFloat 13s ease-in-out infinite", willChange: "transform" }} />
      <div className="absolute w-[600px] h-[600px] top-[8%] right-[-200px] rounded-full opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(circle, #0891b2 0%, transparent 70%)", animation: "orbFloat 17s ease-in-out 4s infinite" }} />
      <div className="absolute w-[500px] h-[500px] top-[55%] left-[38%] rounded-full opacity-[0.09] pointer-events-none" style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)", animation: "orbFloat 22s ease-in-out 8s infinite" }} />
      <div className="absolute w-[450px] h-[450px] bottom-[8%] right-[8%] rounded-full opacity-[0.13] pointer-events-none" style={{ background: "radial-gradient(circle, #0e7490 0%, transparent 70%)", animation: "orbFloat 15s ease-in-out 2s infinite" }} />

      {/* ── Grid ── */}
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "64px 64px" }}
      />

      {/* ════════════════════════════════ ANNOUNCEMENT BAR ════════════════════════════════ */}
      <div
        className="relative z-50 text-center py-2.5 px-4 text-xs font-semibold"
        style={{ background: "linear-gradient(90deg, rgba(37,211,102,0.10), rgba(168,85,247,0.12), rgba(6,182,212,0.10))", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span style={{ color: "rgba(255,255,255,0.55)" }}>🎓 Now available on WhatsApp for all Zimbabwean students · </span>
        <a
          href="https://wa.me/263719647303"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline underline-offset-2 transition-colors duration-200"
          style={{ color: "#25d366" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#4ade80"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#25d366"; }}
        >
          Start free today →
        </a>
      </div>

      {/* ════════════════════════════════ NAVBAR ════════════════════════════════ */}
      <nav
        className="sticky top-0 z-50 transition-all duration-400"
        style={{
          background: scrolled ? "rgba(8,5,17,0.94)" : "rgba(8,5,17,0.35)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.45)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group flex-shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 16px rgba(168,85,247,0.45)", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1) rotate(-4deg)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(168,85,247,0.7)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(168,85,247,0.45)"; }}
              >
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight leading-none block" style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  FUNDO AI
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest leading-none block" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Zimbabwe's AI
                </span>
              </div>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group overflow-hidden"
                  style={{ color: "rgba(255,255,255,0.52)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.52)"; e.currentTarget.style.background = "transparent"; }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(37,211,102,0.09)", border: "1px solid rgba(37,211,102,0.18)", color: "#4ade80" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Free to use
              </div>
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button onClick={() => nav("/chat")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                    style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 3px 14px rgba(168,85,247,0.28)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                    <MessageCircle size={14} />Chat
                  </button>
                  <button onClick={logout}
                    className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                    style={{ color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button onClick={() => nav("/login")}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    Log in
                  </button>
                  <button onClick={() => nav("/chat")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 3px 14px rgba(37,211,102,0.28)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                    <MessageCircle size={14} />Chat Now
                  </button>
                </div>
              )}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                {mobileOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden pb-4 pt-2 space-y-1 slide-down" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  {label}
                  <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.28)" }} />
                </button>
              ))}
              <button onClick={() => handleNavClick("/chat")}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white mt-2 transition-all duration-200"
                style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 16px rgba(168,85,247,0.3)" }}>
                <MessageCircle size={15} />Chat Now
              </button>
              {!user && (
                <button onClick={() => handleNavClick("/login")}
                  className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-medium mt-1"
                  style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  Log in
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ════════════════════════════════ HERO ════════════════════════════════ */}
      <section className="relative z-10 pt-20 sm:pt-28 pb-8 text-center px-4 sm:px-6">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-card"
          style={{
            border: "1px solid rgba(168,85,247,0.22)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(-14px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.68)" }}>Zimbabwe's Most Advanced AI Assistant</span>
          <Sparkles size={12} style={{ color: "#a855f7" }} />
        </div>

        {/* Headline */}
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(28px)", transition: "opacity 0.85s ease 0.2s, transform 0.85s cubic-bezier(0.22,1,0.36,1) 0.2s" }}>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6">
            <span className="block text-white">Meet</span>
            <span
              className="block"
              style={{ background: "linear-gradient(135deg, #c084fc 0%, #60a5fa 45%, #34d399 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shimmerMove 5s linear infinite" }}
            >
              FUNDO AI
            </span>
            <span className="block text-white text-4xl sm:text-5xl mt-3 font-bold">🤖🔥</span>
          </h1>
          <p className="text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.52)" }}>
            A powerful, intelligent AI agent built for Zimbabwean students. Ask anything — get brilliant answers, create documents, solve math, and learn like never before.
          </p>
        </div>

        {/* CTA */}
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s" }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => nav("/chat")}
              className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-2xl text-base font-bold text-white transition-all duration-300 active:scale-95"
              style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 24px rgba(168,85,247,0.4)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 36px rgba(168,85,247,0.55)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(168,85,247,0.4)"; }}
            >
              <Bot size={18} />Try Web Chat Free
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://wa.me/263719647303"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.13)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.09)",
                backdropFilter: "blur(14px)",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.10)"; el.style.borderColor = "rgba(37,211,102,0.38)"; el.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.borderColor = "rgba(255,255,255,0.13)"; el.style.transform = "none"; }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#25d366" }}>
                <MessageCircle size={13} className="text-white" />
              </div>
              WhatsApp Bot
            </a>
          </div>
          <p className="mt-5 text-sm" style={{ color: "rgba(255,255,255,0.28)" }}>
            Free · No download · Works on any device · Created by{" "}
            <span className="font-semibold" style={{ color: "#a855f7" }}>Darrell Mucheri</span> 🇿🇼
          </p>
        </div>

        {/* ── Floating AI orb ── */}
        <div className="flex justify-center mt-14 mb-2">
          <div className="relative" style={{ animation: "orbFloat 6s ease-in-out infinite", willChange: "transform" }}>
            <div className="absolute inset-[-14px] rounded-full opacity-25" style={{ background: "conic-gradient(from 0deg, #a855f7, #06b6d4, #10b981, #a855f7)", animation: "rotRing 7s linear infinite", filter: "blur(10px)" }} />
            <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, transparent 0%, #a855f7 25%, transparent 50%, #06b6d4 75%, transparent 100%)", animation: "rotRing 4.5s linear infinite", opacity: 0.65 }} />
            <div className="absolute inset-[9px] rounded-full" style={{ background: "conic-gradient(from 180deg, transparent 0%, #ec4899 25%, transparent 50%, #f59e0b 75%, transparent 100%)", animation: "counterRotRing 8s linear infinite", opacity: 0.35 }} />
            <div className="absolute inset-[3px] rounded-full" style={{ background: "linear-gradient(135deg, #0a0614, #0c0a1a)" }} />
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center relative" style={{ boxShadow: "0 0 60px rgba(168,85,247,0.45), 0 0 120px rgba(168,85,247,0.12)" }}>
              <Bot size={60} className="relative z-10" style={{ color: "#a855f7", filter: "drop-shadow(0 0 18px #a855f7)" }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="flex flex-col items-center gap-1.5 mt-10 bounce-down cursor-pointer"
          style={{ opacity: scrollY > 80 ? 0 : 0.45, transition: "opacity 0.4s ease" }}
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" })}
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Explore</span>
          <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
        </div>
      </section>

      {/* ════════════════════════════════ ICON SCROLL ROWS ════════════════════════════════ */}
      <section className="relative z-10 py-10 overflow-hidden">
        <div className="space-y-5">
          <IconScrollRow icons={ICONS_ROW1} speed={26} />
          <IconScrollRow icons={ICONS_ROW2} speed={34} reversed />
        </div>
        <div className="absolute inset-y-0 left-0 w-24 sm:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, #080511 0%, transparent 100%)" }} />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, #080511 0%, transparent 100%)" }} />
      </section>

      {/* ════════════════════════════════ CAPABILITIES PILLS ════════════════════════════════ */}
      <Reveal direction="up">
        <section className="relative z-10 py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <SectionLabel text="What FUNDO AI Can Do" color="rgba(255,255,255,0.3)" />
            <div className="flex flex-wrap justify-center gap-2.5">
              {CAPABILITIES.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium cursor-default"
                    style={{ color: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.07)", transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease" }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px) scale(1.04)"; el.style.borderColor = "rgba(168,85,247,0.3)"; el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.boxShadow = ""; }}
                  >
                    <CheckCircle2 size={12} style={{ color: "#25d366" }} />
                    <Icon size={12} style={{ color: "#a855f7" }} />
                    {cap.text}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ════════════════════════════════ STATS ════════════════════════════════ */}
      <section className="relative z-10 py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map((stat, i) => <StatCard key={i} stat={stat} delay={i * 0.09} />)}
        </div>
      </section>

      {/* ════════════════════════════════ AI DEMO ════════════════════════════════ */}
      <section id="demo" className="relative z-10 py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal direction="left">
              <div>
                <SectionLabel text="Live Demo" color="#25d366" />
                <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
                  See FUNDO AI{" "}
                  <span style={{ background: "linear-gradient(135deg, #c084fc, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    in action
                  </span>
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.48)" }}>
                  Watch as FUNDO AI solves math, creates study notes, searches the web in real time, and generates documents — all from a simple WhatsApp message.
                </p>
                <div className="space-y-3">
                  {DEMO_CONVOS.map((d, i) => {
                    const Di = d.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm rounded-xl px-4 py-2.5 transition-all duration-250 cursor-default"
                        style={{ color: "rgba(255,255,255,0.58)", background: "transparent" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${d.color}0d`; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.58)"; }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${d.color}18`, border: `1px solid ${d.color}30` }}>
                          <Di size={13} style={{ color: d.color }} />
                        </div>
                        {d.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.12}>
              <ChatDemo />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ FEATURES ════════════════════════════════ */}
      <section id="features" className="relative z-10 py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <SectionLabel text="Capabilities" color="#a855f7" />
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
                Everything you need
                <br />
                <span style={{ background: "linear-gradient(135deg, #c084fc, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>to excel</span>
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.42)" }}>
                FUNDO AI combines real-time intelligence with deep academic knowledge to help every Zimbabwean student reach their full potential.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map((feature, i) => <FeatureCard key={i} feature={feature} index={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ HOW IT WORKS ════════════════════════════════ */}
      <section id="how" className="relative z-10 py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <SectionLabel text="How It Works" color="#06b6d4" />
              <h2 className="text-3xl sm:text-4xl font-black text-white">Three simple steps</h2>
            </div>
          </Reveal>

          {/* Steps grid with connector lines */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-[4.5rem] left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-[1px] pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.15), rgba(168,85,247,0.3), rgba(6,182,212,0.15))" }} />

            {[
              { step: "01", title: "Open WhatsApp",   desc: "Save FUNDO AI's number and open a chat — no app download, no account needed.", icon: MessageCircle, color: "#25d366" },
              { step: "02", title: "Ask Anything",     desc: "Type your question, upload a file, or request notes, essays, or PDFs.",          icon: Brain,         color: "#a855f7" },
              { step: "03", title: "Get Results",      desc: "Receive brilliant, detailed answers tailored exactly to your ZIMSEC level.",      icon: Sparkles,      color: "#06b6d4" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i} delay={i * 0.13} direction="up">
                  <div
                    className="glass-card rounded-3xl p-7 sm:p-8 text-center relative overflow-hidden cursor-default card-top-shine"
                    style={{ transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.4s ease" }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-6px) scale(1.015)";
                      el.style.boxShadow = `0 0 0 1px ${item.color}30, 0 24px 56px rgba(0,0,0,0.55)`;
                      el.style.borderColor = `${item.color}28`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "none";
                      el.style.boxShadow = "";
                      el.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
                    {/* Step number */}
                    <div className="text-5xl font-black mb-3" style={{ color: `${item.color}18`, lineHeight: 1 }}>{item.step}</div>
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{ background: `linear-gradient(135deg, ${item.color}1a, ${item.color}0a)`, border: `1px solid ${item.color}30`, boxShadow: `0 0 22px ${item.color}1a`, transition: "transform 0.35s ease, box-shadow 0.35s ease" }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.1)"; el.style.boxShadow = `0 0 32px ${item.color}40`; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = `0 0 22px ${item.color}1a`; }}
                    >
                      <Icon size={24} style={{ color: item.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.46)" }}>{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ CTA BANNER ════════════════════════════════ */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6">
        <Reveal direction="scale">
          <div
            className="max-w-4xl mx-auto rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(37,211,102,0.07) 0%, rgba(18,140,126,0.05) 100%)", border: "1px solid rgba(37,211,102,0.18)", boxShadow: "0 0 80px rgba(37,211,102,0.10), 0 20px 60px rgba(0,0,0,0.5)" }}
          >
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(circle at 50% -10%, rgba(37,211,102,0.09) 0%, transparent 60%)" }} />
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] shimmer-border" />

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
              style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 0 36px rgba(37,211,102,0.38)", animation: "orbFloat 5s ease-in-out infinite" }}
            >
              <Bot size={30} className="text-white" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 relative leading-tight">
              Ready to unlock your{" "}
              <span style={{ background: "linear-gradient(135deg, #25d366, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                full potential?
              </span>
            </h2>
            <p className="text-base sm:text-lg mb-10 max-w-xl mx-auto relative" style={{ color: "rgba(255,255,255,0.5)" }}>
              Join thousands of Zimbabwean students already studying smarter with FUNDO AI.
            </p>

            <a
              href="https://wa.me/263719647303"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold text-white transition-all duration-300 relative group active:scale-95"
              style={{ background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)", boxShadow: "0 6px 32px rgba(37,211,102,0.42), 0 0 80px rgba(37,211,102,0.12)" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.04) translateY(-2px)"; el.style.boxShadow = "0 12px 48px rgba(37,211,102,0.55), 0 0 100px rgba(37,211,102,0.18)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = "0 6px 32px rgba(37,211,102,0.42), 0 0 80px rgba(37,211,102,0.12)"; }}
            >
              <MessageCircle size={22} />
              Chat with FUNDO AI Now
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-250" />
            </a>
            <p className="mt-5 text-sm relative" style={{ color: "rgba(255,255,255,0.28)" }}>
              Free to use · No download needed · Works on any phone
            </p>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════ FOOTER ════════════════════════════════ */}
      <footer className="relative z-10 mt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.45), rgba(6,182,212,0.45), transparent)" }} />
        <div style={{ background: "linear-gradient(180deg, rgba(8,5,17,0.55) 0%, rgba(5,4,12,0.97) 100%)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}>

          {/* Main columns */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 18px rgba(168,85,247,0.35)" }}>
                    <Bot size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-black tracking-tight leading-none" style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      FUNDO AI
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                      Zimbabwe's AI Assistant
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
                  A powerful, intelligent AI agent built for Zimbabwean students. Helping learners from Grade 1 to A-Level reach their full potential — available 24/7 on WhatsApp.
                </p>
                <div className="flex flex-wrap gap-2.5 mb-7">
                  {[
                    { icon: Shield,       text: "Safe & Private", color: "#25d366" },
                    { icon: Clock,        text: "24/7 Available", color: "#06b6d4" },
                    { icon: GraduationCap,text: "ZIMSEC Aligned", color: "#a855f7" },
                  ].map(({ icon: Icon, text, color }) => (
                    <div
                      key={text}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: `${color}0e`, border: `1px solid ${color}22`, color: "rgba(255,255,255,0.55)" }}
                    >
                      <Icon size={11} style={{ color }} />
                      {text}
                    </div>
                  ))}
                </div>
                <a
                  href="https://wa.me/263719647303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 4px 18px rgba(37,211,102,0.30)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.04)"; el.style.boxShadow = "0 6px 28px rgba(37,211,102,0.45)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = "0 4px 18px rgba(37,211,102,0.30)"; }}
                >
                  <MessageCircle size={15} />
                  Open WhatsApp Chat
                  <ArrowUpRight size={13} />
                </a>
              </div>

              {/* Quick links */}
              <div>
                <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-[0.14em]">Navigate</h4>
                <ul className="space-y-3">
                  {[
                    { label: "Features",             href: "#features" },
                    { label: "How It Works",          href: "#how" },
                    { label: "Live Demo",             href: "#demo" },
                    { label: "About FUNDO AI",        href: "#" },
                    { label: "Creator — Darrell Mucheri", href: "#" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="flex items-center gap-2 text-sm transition-all duration-200 group"
                        style={{ color: "rgba(255,255,255,0.40)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.paddingLeft = "4px"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.40)"; e.currentTarget.style.paddingLeft = "0"; }}
                      >
                        <ChevronRight size={12} style={{ color: "#a855f7", flexShrink: 0 }} />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-[0.14em]">Contact</h4>
                <ul className="space-y-4">
                  {[
                    { href: "https://wa.me/263719647303", icon: MessageCircle, color: "#25d366", label: "WhatsApp",  value: "+263 719 647 303" },
                    { href: "https://fundoai.gleeze.com", icon: Globe,         color: "#06b6d4", label: "Website",   value: "fundoai.gleeze.com" },
                  ].map(({ href, icon: Icon, color, label, value }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}0e`, border: `1px solid ${color}1e` }}>
                          <Icon size={14} style={{ color }} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>{label}</div>
                          <div
                            className="text-sm font-medium transition-colors duration-200"
                            style={{ color: "rgba(255,255,255,0.65)" }}
                            onMouseEnter={(e: any) => { e.target.style.color = color; }}
                            onMouseLeave={(e: any) => { e.target.style.color = "rgba(255,255,255,0.65)"; }}
                          >{value}</div>
                        </div>
                      </a>
                    </li>
                  ))}
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(168,85,247,0.09)", border: "1px solid rgba(168,85,247,0.18)" }}>
                      <MapPin size={14} style={{ color: "#a855f7" }} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>Based in</div>
                      <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>Zimbabwe 🇿🇼</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-xs" style={{ color: "rgba(255,255,255,0.27)" }}>
                <span>© 2025 FUNDO AI</span>
                <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                <span>All rights reserved</span>
                <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                <span>Built by <span className="font-semibold" style={{ color: "#a855f7" }}>Darrell Mucheri</span></span>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.36)" }}>
                🇿🇼 Made in Zimbabwe with ❤️
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.27)" }}>
                {["Privacy Policy", "Terms of Use"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="transition-colors duration-200"
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.27)"; }}
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
