import { useEffect, useRef, useState } from "react";
import {
  Brain, BookOpen, Globe, Zap, MessageCircle, FileText,
  Search, Music, Calculator, FlaskConical, Microscope, Atom,
  Code2, Lightbulb, Map, Languages, ChevronRight, Star,
  Shield, Clock, Users, Sparkles, Bot, GraduationCap,
  PenTool, Camera, Headphones, Database, Wifi, Heart,
  Trophy, Target, Rocket, Moon, Sun, Flame, Leaf, Award
} from "lucide-react";

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

const FEATURES = [
  {
    icon: Brain,
    title: "Intelligent AI",
    desc: "Powered by cutting-edge AI models that understand context, nuance, and the ZIMSEC curriculum perfectly.",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.3)",
  },
  {
    icon: BookOpen,
    title: "ZIMSEC Aligned",
    desc: "Deep knowledge of the Zimbabwean education system — Grade 1–7, Form 1–6, O-Level, and A-Level.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    icon: Globe,
    title: "Real-Time Search",
    desc: "Searches the web live so you always get current information — news, weather, scores, prices.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    icon: FileText,
    title: "Document Creator",
    desc: "Generate beautiful PDFs, study notes, essays, and posters directly in your chat.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
  },
  {
    icon: Calculator,
    title: "Math Master",
    desc: "Step-by-step solutions with full working shown. Supports all ZIMSEC math topics.",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.3)",
  },
  {
    icon: Database,
    title: "Memory System",
    desc: "Remembers your name, grade level, subjects, and goals across every conversation.",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
  },
];

const STATS = [
  { value: "50K+", label: "Students Helped", icon: Users },
  { value: "99%", label: "Accuracy Rate", icon: Target },
  { value: "24/7", label: "Always Available", icon: Clock },
  { value: "A+", label: "Grade Results", icon: Star },
];

function IconScrollRow({ icons, speed = 18, delay = 0 }: {
  icons: typeof ICONS_ROW1;
  speed?: number;
  delay?: number;
}) {
  const doubled = [...icons, ...icons, ...icons];
  return (
    <div className="overflow-hidden w-full relative">
      <div
        className="flex gap-6 py-2"
        style={{
          display: "flex",
          animation: `iconScrollLR ${speed}s linear infinite`,
          animationDelay: `${delay}s`,
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-1.5"
              style={{ minWidth: "72px" }}
            >
              <div
                className="glass-card rounded-2xl p-3.5 transition-all duration-300 hover:scale-110 cursor-default"
                style={{
                  boxShadow: `0 0 20px ${item.color}30, 0 4px 16px rgba(0,0,0,0.3)`,
                  border: `1px solid ${item.color}30`,
                }}
              >
                <Icon
                  size={26}
                  style={{ color: item.color, filter: `drop-shadow(0 0 6px ${item.color}80)` }}
                />
              </div>
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <div
      className="glass-card rounded-3xl p-7 group hover:scale-[1.02] transition-all duration-500 cursor-default relative overflow-hidden"
      style={{
        animationDelay: `${index * 0.1}s`,
        boxShadow: `0 0 0 1px ${feature.color}20, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${feature.glow} 0%, transparent 70%)`,
        }}
      />
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative"
        style={{
          background: `linear-gradient(135deg, ${feature.color}25, ${feature.color}10)`,
          border: `1px solid ${feature.color}40`,
          boxShadow: `0 0 20px ${feature.glow}`,
        }}
      >
        <Icon size={24} style={{ color: feature.color }} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
        {feature.desc}
      </p>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0614 0%, #060b18 50%, #0c0a1a 100%)" }}
    >
      {/* ── CSS for icon scroll animation ── */}
      <style>{`
        @keyframes iconScrollLR {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>

      {/* ── Background orbs ── */}
      <div
        className="orb w-[700px] h-[700px] top-[-200px] left-[-200px] opacity-30"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[500px] h-[500px] top-[10%] right-[-100px] opacity-20"
        style={{ background: "radial-gradient(circle, #0891b2 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[600px] h-[600px] top-[50%] left-[30%] opacity-15"
        style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-[10%] right-[20%] opacity-20"
        style={{ background: "radial-gradient(circle, #0e7490 0%, transparent 70%)" }}
      />

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ══════════════════════════════ NAVBAR ══════════════════════════════ */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center pulse-glow"
              style={{
                background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                boxShadow: "0 0 20px rgba(168,85,247,0.5)",
              }}
            >
              <Bot size={20} className="text-white" />
            </div>
            <span
              className="text-xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #a855f7, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FUNDO AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#a855f7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="https://wa.me/263719647303"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              boxShadow: "0 4px 16px rgba(168,85,247,0.4)",
            }}
          >
            <MessageCircle size={15} />
            Chat Now
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className="relative z-10 pt-24 pb-16 text-center px-6">
        <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-card border border-purple-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
              Zimbabwe's Most Advanced AI Assistant
            </span>
            <Sparkles size={12} style={{ color: "#a855f7" }} />
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6">
            <span className="block text-white">Meet</span>
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #c084fc 0%, #60a5fa 40%, #34d399 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FUNDO AI
            </span>
            <span className="block text-white text-4xl md:text-5xl lg:text-6xl mt-2 font-bold">
              🤖🔥
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            A powerful, intelligent AI agent built for Zimbabwean students. Ask anything — get
            brilliant answers, create documents, solve math, and learn like never before.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/263719647303"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #06b6d4 100%)",
                boxShadow: "0 8px 32px rgba(168,85,247,0.5), 0 0 60px rgba(168,85,247,0.2)",
              }}
            >
              <MessageCircle size={20} />
              Start Chatting on WhatsApp
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://fundoai.gleeze.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-105 glass-card"
              style={{ color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <Globe size={18} />
              Visit Website
            </a>
          </div>

          {/* Creator credit */}
          <p className="mt-6 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Created by{" "}
            <span className="font-semibold" style={{ color: "#a855f7" }}>
              Darrell Mucheri
            </span>{" "}
            🇿🇼 Zimbabwe
          </p>
        </div>

        {/* ── Floating AI orb ── */}
        <div className="flex justify-center mt-16 mb-4">
          <div className="relative float-anim">
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.2))",
                border: "1px solid rgba(168,85,247,0.3)",
                boxShadow:
                  "0 0 60px rgba(168,85,247,0.4), 0 0 120px rgba(168,85,247,0.15), inset 0 0 60px rgba(168,85,247,0.1)",
              }}
            >
              {/* Rotating outer ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, #a855f7 25%, transparent 50%, #06b6d4 75%, transparent 100%)",
                  animation: "rotate-gradient 4s linear infinite",
                  opacity: 0.6,
                }}
              />
              <div
                className="absolute inset-1 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #0a0614, #0c0a1a)",
                }}
              />
              <Bot
                size={60}
                className="relative z-10"
                style={{ color: "#a855f7", filter: "drop-shadow(0 0 20px #a855f7)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ ICON SCROLL ROWS ══════════════════════════════ */}
      <section className="relative z-10 py-8 overflow-hidden">
        <div className="space-y-6">
          <IconScrollRow icons={ICONS_ROW1} speed={22} delay={0} />
          <IconScrollRow icons={ICONS_ROW2} speed={28} delay={-5} />
        </div>

        {/* Edge fades */}
        <div
          className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #0a0614 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(270deg, #0a0614 0%, transparent 100%)",
          }}
        />
      </section>

      {/* ══════════════════════════════ STATS ══════════════════════════════ */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-3xl p-6 text-center group hover:scale-105 transition-all duration-300"
                style={{ boxShadow: "0 0 30px rgba(168,85,247,0.1), 0 8px 32px rgba(0,0,0,0.4)" }}
              >
                <Icon size={24} className="mx-auto mb-3" style={{ color: "#a855f7" }} />
                <div
                  className="text-3xl font-black mb-1"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════ FEATURES ══════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="text-xs font-bold uppercase tracking-widest mb-4 block"
              style={{ color: "#a855f7" }}
            >
              Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything you need
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #c084fc, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                to excel
              </span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              FUNDO AI combines real-time intelligence with deep academic knowledge to help
              every Zimbabwean student reach their full potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ HOW IT WORKS ══════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="text-xs font-bold uppercase tracking-widest mb-4 block"
            style={{ color: "#06b6d4" }}
          >
            How It Works
          </span>
          <h2 className="text-4xl font-black text-white mb-16">
            Three simple steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Open WhatsApp",
                desc: "Save FUNDO AI's number and open a chat on WhatsApp.",
                icon: MessageCircle,
                color: "#a855f7",
              },
              {
                step: "02",
                title: "Ask Anything",
                desc: "Type your question, upload files, or request notes, essays, or PDFs.",
                icon: Brain,
                color: "#06b6d4",
              },
              {
                step: "03",
                title: "Get Results",
                desc: "Receive brilliant, detailed answers tailored to your ZIMSEC level.",
                icon: Sparkles,
                color: "#10b981",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="glass-card rounded-3xl p-8 text-center relative overflow-hidden group hover:scale-[1.03] transition-all duration-500"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-60"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                    }}
                  />
                  <div
                    className="text-5xl font-black mb-4"
                    style={{ color: `${item.color}30` }}
                  >
                    {item.step}
                  </div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                      border: `1px solid ${item.color}30`,
                      boxShadow: `0 0 20px ${item.color}20`,
                    }}
                  >
                    <Icon size={24} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA BANNER ══════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(6,182,212,0.1) 100%)",
            border: "1px solid rgba(168,85,247,0.3)",
            boxShadow: "0 0 80px rgba(168,85,247,0.2), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(168,85,247,0.2) 0%, transparent 60%)",
            }}
          />
          <Bot
            size={52}
            className="mx-auto mb-6 relative"
            style={{ color: "#a855f7", filter: "drop-shadow(0 0 20px #a855f7)" }}
          />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 relative">
            Ready to unlock your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c084fc, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              full potential?
            </span>
          </h2>
          <p
            className="text-lg mb-10 max-w-xl mx-auto relative"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Join thousands of Zimbabwean students who are already studying smarter with FUNDO AI.
          </p>
          <a
            href="https://wa.me/263719647303"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300 hover:scale-105 relative"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #06b6d4 100%)",
              boxShadow: "0 8px 40px rgba(168,85,247,0.6), 0 0 80px rgba(168,85,247,0.3)",
            }}
          >
            <MessageCircle size={22} />
            Chat with FUNDO AI Now
            <ChevronRight size={20} />
          </a>
          <p className="mt-5 text-sm relative" style={{ color: "rgba(255,255,255,0.35)" }}>
            Free to use · No download needed · Works on any phone
          </p>
        </div>
      </section>

      {/* ══════════════════════════════ FOOTER ══════════════════════════════ */}
      <footer className="relative z-10 glass py-10 px-6 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
              >
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <div
                  className="font-black text-base"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  FUNDO AI
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  fundoai.gleeze.com
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield size={14} style={{ color: "#10b981" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Safe, private, and powered by advanced AI
              </span>
            </div>

            <div className="text-xs text-center md:text-right" style={{ color: "rgba(255,255,255,0.35)" }}>
              <div>
                Created with ❤️ by{" "}
                <span className="font-semibold" style={{ color: "#a855f7" }}>
                  Darrell Mucheri
                </span>{" "}
                🇿🇼
              </div>
              <div className="mt-1">© 2025 FUNDO AI · All rights reserved</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
