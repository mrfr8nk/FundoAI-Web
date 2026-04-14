import { useState } from "react";
import { useLocation } from "wouter";
import { Check, Zap, Crown, Star, Rocket, Shield, ArrowRight, MessageCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/lib/auth";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "/month",
    tagline: "Perfect for trying FUNDO AI",
    icon: Shield,
    color: "#6b7280",
    gradient: "from-gray-500 to-gray-600",
    border: "rgba(107,114,128,0.3)",
    glow: "rgba(107,114,128,0.1)",
    features: [
      "25 AI chats per day",
      "3 image generations per day",
      "1 PDF document per day",
      "10 material downloads per day",
      "Basic ZIMSEC tutoring",
      "Live web search",
      "Document analysis (PDF, Word, Images)",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: 1,
    period: "/month",
    tagline: "Less than a bread loaf 🍞",
    icon: Zap,
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-500",
    border: "rgba(16,185,129,0.35)",
    glow: "rgba(16,185,129,0.12)",
    features: [
      "75 AI chats per day",
      "8 image generations per day",
      "3 PDFs per month",
      "Unlimited material downloads",
      "Full ZIMSEC curriculum coverage",
      "Priority responses",
      "School project generation",
    ],
    cta: "Start for $1",
    popular: false,
  },
  {
    id: "basic",
    name: "Basic",
    price: 3,
    period: "/month",
    tagline: "Best for serious students",
    icon: Star,
    color: "#3b82f6",
    gradient: "from-blue-500 to-indigo-500",
    border: "rgba(59,130,246,0.35)",
    glow: "rgba(59,130,246,0.12)",
    features: [
      "300 AI chats per day",
      "20 image generations per day",
      "10 PDFs per month",
      "Unlimited material downloads",
      "Flash quizzes & practice exams",
      "Past exam papers access",
      "Marking schemes access",
    ],
    cta: "Get Basic",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 10,
    period: "/month",
    tagline: "For the A-students 🚀",
    icon: Rocket,
    color: "#a855f7",
    gradient: "from-violet-500 to-purple-600",
    border: "rgba(168,85,247,0.5)",
    glow: "rgba(168,85,247,0.15)",
    features: [
      "1,000 AI chats per day",
      "50 image generations per day",
      "50 PDFs per month",
      "Unlimited material downloads",
      "Full study materials library",
      "Syllabuses, textbooks, past papers",
      "Advanced project generation",
      "Priority support",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 20,
    period: "/month",
    tagline: "BEAST mode — zero limits 👑",
    icon: Crown,
    color: "#f59e0b",
    gradient: "from-amber-400 to-orange-500",
    border: "rgba(245,158,11,0.4)",
    glow: "rgba(245,158,11,0.12)",
    features: [
      "Unlimited AI chats",
      "Unlimited image generations",
      "Unlimited PDF documents",
      "Unlimited material downloads",
      "Everything in Pro",
      "First access to new features",
      "WhatsApp + Web combo access",
      "VIP support channel",
    ],
    cta: "Go Premium",
    popular: false,
  },
];

const CAPABILITIES = [
  { emoji: "🧠", title: "AI Tutoring", desc: "All ZIMSEC subjects Grade 1 through A-Level" },
  { emoji: "📐", title: "Step-by-Step Math", desc: "Full working shown for every problem" },
  { emoji: "🔍", title: "Live Web Search", desc: "Current news, prices, weather, exam results" },
  { emoji: "📄", title: "Document Analysis", desc: "Upload PDFs, Word docs, images for instant analysis" },
  { emoji: "🎨", title: "Image Generation", desc: "Create any image from a description" },
  { emoji: "📋", title: "School Projects", desc: "Full ZIMSEC-quality project PDFs with headings" },
  { emoji: "⚡", title: "Flash Quizzes", desc: "Practice exams for any subject and level" },
  { emoji: "📚", title: "Study Materials", desc: "Syllabuses, textbooks, past papers, marking schemes" },
  { emoji: "🌍", title: "Real-Time Data", desc: "Weather, time zones, exchange rates, live scores" },
  { emoji: "💾", title: "Persistent Memory", desc: "Remembers your name, grade, subjects, and goals" },
  { emoji: "🤖", title: "WhatsApp Bot", desc: "Same AI on WhatsApp — always in your pocket" },
  { emoji: "🎓", title: "ZIMSEC Aligned", desc: "Curriculum-perfect from Grade 1 to A-Level" },
];

export default function Pricing() {
  const [, nav] = useLocation();
  const { user } = useAuth();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  function handleCTA(planId: string) {
    if (planId === "free") {
      nav(user ? "/chat" : "/signup");
    } else {
      if (!user) {
        nav("/signup");
      } else {
        nav(`/upgrade?plan=${planId}`);
      }
    }
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-20 pb-12 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 60%)" }} />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>
            💳 Simple, honest pricing · Pay via EcoCash or card
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Invest in your{" "}
            <span style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              education
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Start free. Upgrade when you're ready. Cancel anytime. All plans include ZIMSEC-aligned AI tutoring across every subject.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PLANS.map(plan => {
              const Icon = plan.icon;
              const isHovered = hoveredPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className="relative flex flex-col rounded-2xl p-5 transition-all duration-300 cursor-default"
                  style={{
                    background: plan.popular
                      ? `linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.08))`
                      : "#111117",
                    border: `1px solid ${isHovered || plan.popular ? plan.border : "#1e1e2b"}`,
                    boxShadow: plan.popular
                      ? `0 0 40px ${plan.glow}, 0 0 0 1px ${plan.border}`
                      : isHovered ? `0 0 24px ${plan.glow}` : "none",
                    transform: plan.popular ? "scale(1.02)" : "none",
                  }}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 12px rgba(168,85,247,0.4)" }}>
                      Most Popular 🔥
                    </div>
                  )}

                  {/* Icon + name */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${plan.color}22, ${plan.color}11)`, border: `1px solid ${plan.color}44` }}>
                      <Icon size={16} style={{ color: plan.color }} />
                    </div>
                    <span className="text-sm font-bold text-white">{plan.name}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-1">
                    <span className="text-3xl font-black text-white">${plan.price}</span>
                    <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.period}</span>
                  </div>
                  <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.tagline}</p>

                  {/* CTA */}
                  <button
                    onClick={() => handleCTA(plan.id)}
                    className="w-full py-2.5 rounded-xl text-sm font-bold mb-5 transition-all duration-200"
                    style={
                      plan.popular
                        ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff", boxShadow: "0 4px 16px rgba(168,85,247,0.35)" }
                        : {
                            background: isHovered ? `${plan.color}22` : "#1a1a27",
                            color: isHovered ? plan.color : "rgba(255,255,255,0.7)",
                            border: `1px solid ${isHovered ? plan.border : "#2a2a3a"}`,
                          }
                    }
                  >
                    {plan.cta} {plan.id !== "free" && <ArrowRight size={13} className="inline ml-1" />}
                  </button>

                  {/* Features */}
                  <ul className="space-y-2 flex-1">
                    {plan.features.map(feat => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: plan.popular ? "#a855f7" : plan.color }} />
                        <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Payment note */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              💳 Pay via <strong style={{ color: "rgba(255,255,255,0.6)" }}>EcoCash</strong> or <strong style={{ color: "rgba(255,255,255,0.6)" }}>PayNow</strong> (card) · Billed monthly · Cancel anytime
            </p>
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
              Questions? Email <a href="mailto:support.fundo.ai@gmail.com" className="text-violet-400 hover:text-violet-300">support.fundo.ai@gmail.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* What's included — capabilities grid */}
      <section className="px-4 sm:px-6 py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Everything FUNDO AI can do</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>All capabilities included in every plan — more usage on higher tiers.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CAPABILITIES.map(cap => (
              <div key={cap.title} className="rounded-xl p-4 transition-all duration-200" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
                <div className="text-2xl mb-2">{cap.emoji}</div>
                <div className="text-xs font-bold text-white mb-1">{cap.title}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Payment info */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-8 text-center">Payment & Billing FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "How do I pay?", a: "We use PayNow Zimbabwe — you can pay via EcoCash (mobile money) or with a VISA/Mastercard through the PayNow web checkout. Just click 'Upgrade', enter your EcoCash number or use card checkout, and you're done." },
              { q: "When does my plan activate?", a: "Immediately after your EcoCash payment is confirmed (usually within seconds). You'll see your updated plan in the chat interface right away." },
              { q: "Is it a monthly subscription?", a: "Yes — your plan lasts exactly 30 days from the date you upgrade. You can upgrade again at any time to renew or change plans." },
              { q: "Can I cancel or change plans?", a: "Yes — simply upgrade to a different plan. There's no lock-in. If you have unused time on a plan and upgrade to a higher plan, you get the new limits immediately." },
              { q: "What's the refund policy?", a: "If you have any issues, contact support.fundo.ai@gmail.com within 24 hours of payment and we'll sort it out." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl p-5" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
                <h3 className="text-sm font-bold text-white mb-2">{q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <div className="rounded-3xl p-10" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.06))", border: "1px solid rgba(139,92,246,0.2)" }}>
            <h2 className="text-2xl font-black text-white mb-3">Start free today</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>No credit card needed. 25 chats a day, free forever.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => nav(user ? "/chat" : "/signup")} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)" }}>
                Get started free <ArrowRight size={14} />
              </button>
              <a href="https://wa.me/263719647303" target="_blank" rel="noopener" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
                <MessageCircle size={14} /> Try on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
