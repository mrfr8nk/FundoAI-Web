import { useState, useEffect } from "react";
import { Mail, User, ArrowRight, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import AuthCard from "@/components/AuthCard";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [, nav] = useLocation();

  // Pre-fill email if redirected from login page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) setForm(f => ({ ...f, email: emailParam }));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.requestMagicLink({ email: form.email, name: form.name });
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  const perks = [
    { icon: "🧠", text: "Unlimited AI chat" },
    { icon: "💾", text: "Persistent memory" },
    { icon: "🔍", text: "Live web search" },
    { icon: "🎓", text: "ZIMSEC curriculum" },
  ];

  if (sent) {
    return (
      <AuthCard title="" subtitle="">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.1))", border: "1px solid rgba(168,85,247,0.25)", boxShadow: "0 0 40px rgba(168,85,247,0.2)" }}>
            <CheckCircle2 size={40} style={{ color: "#a855f7" }} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Almost there! ✉️</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 300 }}>
            We sent a magic link to <strong className="text-white">{form.email}</strong>.<br />
            Click it to activate your account — expires in 15 minutes.
          </p>
          <div className="space-y-2 w-full">
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
              💡 Check your spam folder if you don't see it
            </div>
            <button onClick={() => setSent(false)}
              className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              Try a different email
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your account 🚀" subtitle="Join thousands of Zimbabwean students learning smarter">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        {/* Perks */}
        <div className="grid grid-cols-2 gap-2 mb-1">
          {perks.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.15)", color: "rgba(255,255,255,0.65)" }}>
              <span>{icon}</span>{text}
            </div>
          ))}
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Your full name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type="text" required value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Tinashe Moyo"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@email.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 mt-2"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)", opacity: loading ? 0.7 : 1 }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={15} /><span>Send me a magic link</span><ArrowRight size={16} /></>}
        </button>

        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          No password needed · Free forever ·{" "}
          <button type="button" onClick={() => nav("/terms")} className="underline" style={{ color: "rgba(255,255,255,0.45)" }}>Terms</button>
          {" "}·{" "}
          <button type="button" onClick={() => nav("/privacy")} className="underline" style={{ color: "rgba(255,255,255,0.45)" }}>Privacy</button>
        </p>

        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
          Already have an account?{" "}
          <button type="button" onClick={() => nav("/login")} className="font-semibold" style={{ color: "#a855f7" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#c084fc"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#a855f7"; }}>
            Sign in
          </button>
        </p>

        <div className="flex items-center justify-center gap-1.5 pt-1">
          <CheckCircle2 size={11} style={{ color: "#25d366" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>🇿🇼 Built for Zimbabwean students</span>
        </div>
      </form>
    </AuthCard>
  );
}
