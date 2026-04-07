import { useState, useEffect } from "react";
import { Mail, User, ArrowRight, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import AuthCard from "@/components/AuthCard";

const inputBase = {
  background: "#1a1a27",
  border: "1px solid #1e1e2b",
} as React.CSSProperties;

const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "rgba(139,92,246,0.5)";
};
const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "#1e1e2b";
};

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [, nav] = useLocation();

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
    "Unlimited AI chat",
    "Persistent memory across sessions",
    "Upload PDFs, images & Word docs",
    "Full ZIMSEC curriculum coverage",
  ];

  if (sent) {
    return (
      <AuthCard title="" subtitle="">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <CheckCircle2 size={32} className="text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Almost there!</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: "#8888a0", maxWidth: 280 }}>
            We sent a magic link to <strong className="text-white">{form.email}</strong>.
            Click it to activate your account — expires in 15 minutes.
          </p>
          <div className="space-y-2 w-full">
            <div className="px-3 py-2.5 rounded-xl text-xs text-center" style={{ background: "#1a1a27", border: "1px solid #1e1e2b", color: "#6b6b85" }}>
              💡 Check your spam folder if you don't see it
            </div>
            <button onClick={() => setSent(false)}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "#6b6b85", background: "#1a1a27", border: "1px solid #1e1e2b" }}>
              Try a different email
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your account" subtitle="Join thousands of Zimbabwean students learning smarter">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="px-3 py-2.5 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        {/* Perks */}
        <div className="space-y-1.5 mb-1">
          {perks.map(text => (
            <div key={text} className="flex items-center gap-2.5 text-xs" style={{ color: "#8888a0" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>Your full name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a62" }} />
            <input type="text" required value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Tinashe Moyo"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-150"
              style={inputBase} onFocus={focusIn} onBlur={focusOut} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a62" }} />
            <input type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@email.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-150"
              style={inputBase} onFocus={focusIn} onBlur={focusOut} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-violet-700 hover:bg-violet-600 transition-colors disabled:opacity-60 mt-1">
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <><Sparkles size={14} /><span>Send me a magic link</span><ArrowRight size={15} /></>
          )}
        </button>

        <p className="text-center text-xs" style={{ color: "#4a4a62" }}>
          No password needed · Free forever ·{" "}
          <button type="button" onClick={() => nav("/terms")} className="underline hover:text-violet-400 transition-colors" style={{ color: "#4a4a62" }}>Terms</button>
          {" "}·{" "}
          <button type="button" onClick={() => nav("/privacy")} className="underline hover:text-violet-400 transition-colors" style={{ color: "#4a4a62" }}>Privacy</button>
        </p>

        <p className="text-center text-sm" style={{ color: "#6b6b85" }}>
          Already have an account?{" "}
          <button type="button" onClick={() => nav("/login")}
            className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
            Sign in
          </button>
        </p>

        <p className="text-center text-xs" style={{ color: "#3a3a50" }}>
          🇿🇼 Built for Zimbabwean students
        </p>
      </form>
    </AuthCard>
  );
}
