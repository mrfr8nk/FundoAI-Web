import { Bot, Zap, Globe, Heart, GraduationCap, MessageCircle, Star } from "lucide-react";
import { useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useConfig, waLink } from "@/hooks/useConfig";

export default function About() {
  const [, nav] = useLocation();
  const config = useConfig();

  const timeline = [
    { year: "2024", title: "The Idea", desc: "Darrell noticed Zimbabwean students struggling to access quality AI tutoring in their local curriculum context." },
    { year: "Early 2025", title: "WhatsApp Bot Launch", desc: "FUNDO AI launched as a WhatsApp bot, reaching students directly on the platform they already use every day." },
    { year: "Mid 2025", title: "Web Platform", desc: "Expanded to a full web platform with persistent memory, multi-modal AI, and advanced ZIMSEC-aligned features." },
    { year: "2026+", title: "The Future", desc: "Expanding to schools, tablets, and low-bandwidth environments to reach every Zimbabwean student." },
  ];

  const features = [
    { icon: GraduationCap, label: "ZIMSEC-Aligned", desc: "Tuned for the Zimbabwean curriculum — Grade 1 through A-Level" },
    { icon: Zap, label: "Powered by Llama 4", desc: "Meta's latest frontier AI model for maximum intelligence" },
    { icon: Globe, label: "Real-time Search", desc: "Tavily & DuckDuckGo integration for live, accurate answers" },
    { icon: MessageCircle, label: "WhatsApp + Web", desc: "Available wherever students are — no app download needed" },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#c084fc" }}>
            🇿🇼 Made in Zimbabwe · Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            AI education for{" "}
            <span style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              every Zimbabwean
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            FUNDO AI was built on one belief: every student in Zimbabwe deserves access to world-class AI tutoring, in their curriculum, on their terms.
          </p>
        </div>
      </section>

      {/* Creator */}
      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-10" style={{ boxShadow: "0 0 60px rgba(168,85,247,0.08)" }}>
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src="https://mrfranko-cdn.hf.space/synapex/darex.jpeg"
                    alt="Darrell Mucheri"
                    className="w-28 h-28 rounded-3xl object-cover object-top"
                    style={{ boxShadow: "0 0 40px rgba(168,85,247,0.4)", border: "2px solid rgba(168,85,247,0.35)" }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: "rgba(8,5,17,0.9)", border: "2px solid rgba(168,85,247,0.3)" }}>🇿🇼</div>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a855f7" }}>Creator & Developer</div>
                <h2 className="text-3xl font-black text-white mb-1">Darrell Mucheri</h2>
                <p className="text-sm font-medium mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Zimbabwe 🇿🇼 · Full-Stack Developer · AI Engineer</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Darrell is a passionate Zimbabwean developer on a mission to democratize quality education through AI. He built FUNDO AI from scratch — from the backend architecture to the WhatsApp bot integrations and this web platform.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  His vision: no Zimbabwean student should be left behind because they couldn't access a good tutor. FUNDO AI is the tutor that never sleeps, never judges, and always has time.
                </p>
                <div className="flex flex-wrap gap-2 mt-5 justify-center sm:justify-start">
                  {["React", "Node.js", "MongoDB", "AI/ML", "WhatsApp API", "Zimbabwe 🇿🇼"].map(t => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "rgba(255,255,255,0.6)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner */}
      <section className="px-4 sm:px-6 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-10" style={{ boxShadow: "0 0 60px rgba(6,182,212,0.07)" }}>
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src="https://mrfranko-cdn.hf.space/synapex/crej.jpeg"
                    alt="Crejinai Makanyisa"
                    className="w-28 h-28 rounded-3xl object-cover object-top"
                    style={{ boxShadow: "0 0 40px rgba(6,182,212,0.35)", border: "2px solid rgba(6,182,212,0.35)" }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: "rgba(8,5,17,0.9)", border: "2px solid rgba(6,182,212,0.3)" }}>🇿🇼</div>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#06b6d4" }}>Partner & Co-owner</div>
                <h2 className="text-3xl font-black text-white mb-1">Crejinai Makanyisa</h2>
                <p className="text-sm font-medium mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Zimbabwe 🇿🇼 · Strategic Partner · 40% Co-owner</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Crejinai is a trusted partner and co-owner of FUNDO AI, providing strategic financial sponsorship, marketing support, and business development to help the platform grow and reach more Zimbabwean students.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  His belief in the mission — that every student in Zimbabwe deserves world-class AI tutoring — has been instrumental in making FUNDO AI a reality.
                </p>
                <div className="flex flex-wrap gap-2 mt-5 justify-center sm:justify-start">
                  {["Strategic Partner", "Marketing", "Business Development", "Zimbabwe 🇿🇼"].map(t => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "rgba(255,255,255,0.6)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Our mission</h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
            To make world-class AI tutoring accessible to every Zimbabwean student, regardless of location, device, or economic background.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="glass-card rounded-2xl p-6 hover-lift text-left" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.15))", border: "1px solid rgba(168,85,247,0.2)" }}>
                  <Icon size={20} style={{ color: "#a855f7" }} />
                </div>
                <div className="text-sm font-bold text-white mb-1">{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 text-center">Our journey</h2>
          <div className="space-y-1">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 14px rgba(168,85,247,0.35)" }}>
                    <Star size={16} className="text-white" />
                  </div>
                  {i < timeline.length - 1 && <div className="w-px flex-1 my-2" style={{ background: "rgba(168,85,247,0.2)" }} />}
                </div>
                <div className="pb-8">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#a855f7" }}>{item.year}</span>
                  <h3 className="text-base font-bold text-white mt-0.5 mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-3xl p-10" style={{ boxShadow: "0 0 60px rgba(168,85,247,0.1)" }}>
            <Heart size={40} className="mx-auto mb-4" style={{ color: "#a855f7" }} />
            <h2 className="text-2xl font-black text-white mb-3">Ready to study smarter?</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Join thousands of Zimbabwean students already learning with FUNDO AI</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => nav("/signup")} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)" }}>
                <Bot size={16} />Get started free
              </button>
              <a href={waLink(config.whatsapp_number)} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
                <MessageCircle size={16} />WhatsApp instead
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
