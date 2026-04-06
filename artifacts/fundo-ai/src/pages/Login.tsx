import { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import AuthCard from "@/components/AuthCard";

export default function Login() {
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [, nav] = useLocation();
  const { login } = useAuth();

  async function submitMagic(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.requestMagicLink({ email });
      setSent(true);
    } catch (err: any) {
      if (err.message?.includes("needsName") || err.message?.toLowerCase().includes("name")) {
        nav(`/signup?email=${encodeURIComponent(email)}`);
      } else {
        setError(err.message);
      }
    } finally { setLoading(false); }
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await api.login({ email, password });
      login(data.token, data.user);
      nav("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(168,85,247,0.5)";
    e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
  };

  if (sent) {
    return (
      <AuthCard title="" subtitle="">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(124,58,237,0.1))", border: "1px solid rgba(168,85,247,0.25)", boxShadow: "0 0 40px rgba(168,85,247,0.2)" }}>
            <CheckCircle2 size={40} style={{ color: "#a855f7" }} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Check your inbox ✉️</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 300 }}>
            We sent a sign-in link to <strong className="text-white">{email}</strong>.<br />
            Click it to sign in — it expires in 15 minutes.
          </p>
          <div className="space-y-2 w-full">
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
              💡 Check your spam folder if you don't see it
            </div>
            <button onClick={() => { setSent(false); setEmail(""); }}
              className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              Use a different email
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Welcome back 👋" subtitle="Sign in to your FUNDO AI account">
      {/* Mode tabs */}
      <div className="flex rounded-xl p-1 mb-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {(["magic", "password"] as const).map(m => (
          <button key={m} type="button" onClick={() => { setMode(m); setError(""); }}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
            style={mode === m
              ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff", boxShadow: "0 2px 10px rgba(168,85,247,0.3)" }
              : { color: "rgba(255,255,255,0.4)" }}>
            {m === "magic" ? "✨ Magic Link" : "🔑 Password"}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium mb-4" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {/* Magic link form */}
      {mode === "magic" && (
        <form onSubmit={submitMagic} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Your email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
            style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)", opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={15} /><span>Send magic link</span><ArrowRight size={16} /></>}
          </button>
          <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            We'll email you a one-click sign-in link — no password needed
          </p>
        </form>
      )}

      {/* Password form */}
      {mode === "password" && (
        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
            style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)", opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Lock size={15} /><span>Sign in</span><ArrowRight size={16} /></>}
          </button>
          <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            No password yet?{" "}
            <button type="button" onClick={() => setMode("magic")} className="font-semibold" style={{ color: "#a855f7" }}>
              Use a magic link instead
            </button>
          </p>
        </form>
      )}

      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>

      <p className="text-center text-sm mt-4" style={{ color: "rgba(255,255,255,0.38)" }}>
        Don't have an account?{" "}
        <button type="button" onClick={() => nav("/signup")} className="font-semibold transition-colors" style={{ color: "#a855f7" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#c084fc"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#a855f7"; }}>
          Sign up free
        </button>
      </p>
    </AuthCard>
  );
}
