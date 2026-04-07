import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  Brain, BookOpen, Globe, Calculator, FileText, Database,
  Bot, ArrowRight, Users, Target, Clock, Star,
  Menu, X, LogOut, MessageCircle, ChevronRight,
  Zap, Shield, GraduationCap,
} from "lucide-react";

/* ── Scroll reveal ── */
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

/* ── Count-up ── */
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
      if (current >= numeric) { setDisplay(target); clearInterval(timer); }
      else {
        const val = numeric < 10 ? current.toFixed(1) : Math.floor(current);
        setDisplay(`${val}${suffix}`);
      }
    }, interval);
  }, [target, duration]);
  return { display, start };
}

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Data ── */
const FEATURES = [
  { icon: Brain,       title: "Intelligent AI Tutor",    desc: "Powered by advanced models that deeply understand the ZIMSEC curriculum from Grade 1 through A-Level." },
  { icon: BookOpen,    title: "ZIMSEC Aligned",           desc: "Full coverage of Zimbabwe's national curriculum — every subject, every level, every exam board requirement." },
  { icon: Globe,       title: "Real-Time Web Search",     desc: "Live internet access so you always get current exam results, news, exchange rates, and more." },
  { icon: FileText,    title: "Document Analysis",        desc: "Upload PDFs, Word documents, or images and get instant summaries, explanations, and answers." },
  { icon: Calculator,  title: "Step-by-Step Math",        desc: "Full working shown for every problem — from primary arithmetic to A-Level calculus and statistics." },
  { icon: Database,    title: "Persistent Memory",        desc: "Remembers your name, grade, subjects, and learning goals across every session." },
];

const STEPS = [
  { n: "01", title: "Create a free account",       desc: "Sign up with your email — no credit card, no password required. Just click the magic link we send you." },
  { n: "02", title: "Ask anything",                desc: "Type your question, upload a document or image, and get a detailed, curriculum-aligned answer in seconds." },
  { n: "03", title: "Learn and remember",          desc: "FUNDO tracks your learning history and adapts to your level so every session gets more useful over time." },
];

const STATS = [
  { value: "50K+", label: "Students Helped",  icon: Users },
  { value: "99%",  label: "Accuracy Rate",    icon: Target },
  { value: "24/7", label: "Always Available", icon: Clock },
  { value: "A+",   label: "Grade Results",    icon: Star },
];

const DEMO_CONVOS = [
  { label: "Math Help",      user: "Solve x² + 5x + 6 = 0 step by step",        ai: "Let me factor that for you:\n\nx² + 5x + 6 = 0\n(x + 2)(x + 3) = 0\n\n∴ x = −2  or  x = −3 ✓" },
  { label: "Study Notes",    user: "Give me Form 3 notes on photosynthesis",      ai: "Photosynthesis — Form 3 ZIMSEC\n\n• Occurs in the chloroplasts\n• Equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n• Has two stages: Light-dependent and Light-independent" },
  { label: "Live Search",    user: "What's the current USD to ZWG rate?",         ai: "Searching the web now…\n\nCurrent rate: 1 USD ≈ 26.5 ZWG\n(Live as of today, April 2026)\n\nAlways verify with the RBZ for official rates." },
  { label: "Document Help",  user: "Summarise this History PDF for me",            ai: "Sure — here's your summary:\n\n• Key dates and events extracted\n• Main figures and their roles\n• Essay tips and exam guidance\n\nReady to answer follow-up questions!" },
];

/* ── Chat Demo ── */
function ChatDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showUser, setShowUser] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const runConvo = useCallback((idx: number) => {
    setShowUser(false); setShowTyping(false); setShowAi(false);
    setActiveIdx(idx);
    setTimeout(() => setShowUser(true), 200);
    setTimeout(() => setShowTyping(true), 800);
    setTimeout(() => { setShowTyping(false); setShowAi(true); }, 2400);
  }, []);

  useEffect(() => { runConvo(0); }, [runConvo]);
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(prev => { const next = (prev + 1) % DEMO_CONVOS.length; runConvo(next); return next; });
    }, 5500);
    return () => clearInterval(id);
  }, [runConvo]);

  const convo = DEMO_CONVOS[activeIdx];

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid #1e1e2b" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-violet-600 flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">FUNDO AI</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse-soft 2s ease-in-out infinite" }} />
            <span className="text-xs text-emerald-400">Online</span>
          </div>
        </div>
        <div className="flex gap-1">
          {DEMO_CONVOS.map((_, i) => (
            <button key={i} onClick={() => runConvo(i)}
              className="w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200"
              style={{ background: i === activeIdx ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === activeIdx ? "rgba(139,92,246,0.4)" : "transparent"}` }}>
              <span className="text-[8px] font-bold" style={{ color: i === activeIdx ? "#a78bfa" : "rgba(255,255,255,0.3)" }}>{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 min-h-[200px]">
        <div
          className="flex justify-end"
          style={{ opacity: showUser ? 1 : 0, transform: showUser ? "none" : "translateY(10px)", transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)" }}
        >
          <div className="rounded-xl rounded-br-sm px-3 py-2 max-w-[80%] text-sm text-white bg-violet-600">
            {convo.user}
          </div>
        </div>

        {showTyping && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-violet-600">
              <Bot size={12} className="text-white" />
            </div>
            <div className="rounded-xl rounded-bl-sm px-3 py-2" style={{ background: "#1e1e2b" }}>
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: `dot-bounce 1s ease-in-out ${i * 0.18}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {showAi && (
          <div className="flex items-end gap-2" style={{ animation: "fade-in-up 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-violet-600">
              <Bot size={12} className="text-white" />
            </div>
            <div className="rounded-xl rounded-bl-sm px-3 py-2 max-w-[85%] text-sm text-white leading-relaxed" style={{ background: "#1e1e2b", whiteSpace: "pre-line" }}>
              {convo.ai}
            </div>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-2" style={{ borderTop: "1px solid #1e1e2b" }}>
        {DEMO_CONVOS.map((d, i) => (
          <button key={i} onClick={() => runConvo(i)}
            className="px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-200"
            style={{ background: i === activeIdx ? "rgba(139,92,246,0.15)" : "transparent", color: i === activeIdx ? "#a78bfa" : "rgba(255,255,255,0.3)" }}>
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const Icon = stat.icon;
  const { display, start } = useCountUp(stat.value);
  const { ref, visible } = useScrollReveal(0.3);
  useEffect(() => { if (visible) start(); }, [visible, start]);
  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 p-6 rounded-2xl"
      style={{
        background: "#111117",
        border: "1px solid #1e1e2b",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
        <Icon size={18} className="text-violet-400" />
      </div>
      <div className="text-3xl font-black text-white">{display}</div>
      <div className="text-xs font-medium text-center" style={{ color: "#6b6b85" }}>{stat.label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════ MAIN PAGE ═══════════════════════════════════════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, nav] = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV_LINKS = [
    { label: "Features",     href: "#features" },
    { label: "How It Works", href: "#how" },
    { label: "Demo",         href: "#demo" },
    { label: "About",        href: "/about" },
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
    <div className="min-h-screen" style={{ background: "#09090d" }}>

      {/* ════════ NAVBAR ════════ */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(9,9,13,0.95)" : "rgba(9,9,13,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid #1e1e2b" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <button onClick={() => nav("/")} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-600">
                <Bot size={16} className="text-white" />
              </div>
              <span className="text-base font-black tracking-tight text-white">FUNDO <span className="text-violet-400">AI</span></span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{ color: "#8888a0" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8888a0")}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => nav("/chat")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
                  >
                    <MessageCircle size={14} /> Chat
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ color: "#6b6b85", background: "#111117", border: "1px solid #1e1e2b" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#6b6b85")}
                  >
                    <LogOut size={13} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => nav("/login")}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: "#8888a0" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#8888a0")}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => nav("/signup")}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
                  >
                    Sign up free
                  </button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ background: "#111117", border: "1px solid #1e1e2b" }}
            >
              {mobileOpen ? <X size={16} className="text-white" /> : <Menu size={16} className="text-white" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-1 slide-down" style={{ borderTop: "1px solid #1e1e2b" }}>
              {NAV_LINKS.map(({ label, href }) => (
                <button key={label} onClick={() => handleNavClick(href)}
                  className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium"
                  style={{ color: "#8888a0" }}>
                  {label} <ChevronRight size={14} style={{ color: "#3a3a50" }} />
                </button>
              ))}
              <div className="pt-2 space-y-2">
                {user ? (
                  <>
                    <button onClick={() => { nav("/chat"); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-violet-600">
                      <MessageCircle size={15} /> Open Chat
                    </button>
                    <button onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium"
                      style={{ color: "#8888a0", background: "#111117", border: "1px solid #1e1e2b" }}>
                      <LogOut size={14} /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { nav("/login"); setMobileOpen(false); }}
                      className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-medium"
                      style={{ color: "#8888a0", background: "#111117", border: "1px solid #1e1e2b" }}>
                      Log in
                    </button>
                    <button onClick={() => { nav("/signup"); setMobileOpen(false); }}
                      className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white bg-violet-600">
                      Sign up free
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden">
        {/* Single background orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 65%)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 fade-in-up"
                style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse-soft" />
                <span className="text-xs font-semibold text-violet-300">Now on WhatsApp for Zimbabwean students</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 fade-in-up delay-100">
                Your AI study assistant<br />
                <span className="text-gradient">built for Zimbabwe</span>
              </h1>

              <p className="text-base sm:text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 fade-in-up delay-200"
                style={{ color: "#8888a0" }}>
                FUNDO AI helps students across Zimbabwe study smarter — with ZIMSEC-aligned tutoring,
                real-time web search, and document analysis. Free to start.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 fade-in-up delay-300">
                <button
                  onClick={() => nav("/signup")}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors w-full sm:w-auto justify-center"
                >
                  Get started free <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                  style={{ color: "#8888a0", background: "#111117", border: "1px solid #1e1e2b" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8888a0")}
                >
                  See it in action
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start fade-in-up delay-400">
                {[
                  { icon: Shield, text: "Free forever" },
                  { icon: Zap, text: "No setup needed" },
                  { icon: GraduationCap, text: "ZIMSEC aligned" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={13} className="text-violet-400" />
                    <span className="text-xs" style={{ color: "#6b6b85" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Chat demo */}
            <div className="flex-1 w-full max-w-sm lg:max-w-none fade-in-up delay-200">
              <ChatDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} delay={i * 0.08} />)}
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <Reveal className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Everything you need to excel</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#8888a0" }}>
            One platform covering every subject, every level — designed for how Zimbabwean students actually study.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div
                  className="p-6 rounded-2xl h-full group cursor-default transition-all duration-200"
                  style={{ background: "#111117", border: "1px solid #1e1e2b" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2b"; }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <Icon size={20} className="text-violet-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b6b85" }}>{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how" className="py-20" style={{ background: "#0d0d14" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Up and running in 60 seconds</h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: "#8888a0" }}>
              No complicated setup. No credit card. Just sign up and start learning.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="p-6 rounded-2xl relative" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
                  <div className="text-4xl font-black mb-4 text-gradient" style={{ lineHeight: 1 }}>{step.n}</div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b6b85" }}>{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 -right-3 z-10">
                      <ChevronRight size={20} style={{ color: "#3a3a50" }} />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ DEMO ════════ */}
      <section id="demo" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <Reveal className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Live Demo</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">See FUNDO AI in action</h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "#8888a0" }}>
            Click through real conversations to see how FUNDO handles different subject areas and tasks.
          </p>
        </Reveal>
        <Reveal>
          <div className="max-w-md mx-auto">
            <ChatDemo />
          </div>
        </Reveal>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <Reveal>
          <div
            className="rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.1) 100%)", border: "1px solid rgba(139,92,246,0.25)" }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-violet-600 mx-auto mb-6">
                <GraduationCap size={28} className="text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Start learning smarter today
              </h2>
              <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "#8888a0" }}>
                Join thousands of Zimbabwean students already using FUNDO AI to ace their exams.
                Free to start, no credit card needed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => nav("/signup")}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors w-full sm:w-auto justify-center"
                >
                  Create free account <ArrowRight size={15} />
                </button>
                <a
                  href="https://wa.me/263719647303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
                  style={{ color: "#8888a0", background: "rgba(255,255,255,0.05)", border: "1px solid #1e1e2b" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8888a0")}
                >
                  Chat on WhatsApp
                </a>
              </div>
              <p className="mt-6 text-xs" style={{ color: "#4a4a62" }}>
                🇿🇼 Proudly built for Zimbabwe by Darrell Mucheri
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ borderTop: "1px solid #1a1a27" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-violet-600">
                <Bot size={14} className="text-white" />
              </div>
              <span className="text-sm font-black text-white">FUNDO <span className="text-violet-400">AI</span></span>
            </div>
            <div className="flex items-center gap-5">
              {[{ l: "About", h: "/about" }, { l: "Privacy", h: "/privacy" }, { l: "Terms", h: "/terms" }].map(({ l, h }) => (
                <button key={l} onClick={() => nav(h)}
                  className="text-xs transition-colors duration-150"
                  style={{ color: "#4a4a62" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4a4a62")}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: "#4a4a62" }}>
              © 2025 FUNDO AI · Made by{" "}
              <span className="text-violet-400">Darrell Mucheri</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
