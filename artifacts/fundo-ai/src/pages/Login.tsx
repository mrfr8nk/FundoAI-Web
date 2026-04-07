import { useState, useEffect, useRef } from "react";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import AuthCard from "@/components/AuthCard";

const inputBase = {
  background: "#1a1a27",
  border: "1px solid #1e1e2b",
} as React.CSSProperties;

const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "rgba(139,92,246,0.5)";
  e.target.style.outline = "none";
};
const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "#1e1e2b";
};

export default function Login() {
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slowConn, setSlowConn] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [, nav] = useLocation();
  const { login } = useAuth();
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) {
      slowTimer.current = setTimeout(() => setSlowConn(true), 6000);
    } else {
      if (slowTimer.current) clearTimeout(slowTimer.current);
      setSlowConn(false);
    }
    return () => { if (slowTimer.current) clearTimeout(slowTimer.current); };
  }, [loading]);

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

  if (sent) {
    return (
      <AuthCard title="" subtitle="">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <CheckCircle2 size={32} className="text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: "#8888a0", maxWidth: 280 }}>
            We sent a sign-in link to <strong className="text-white">{email}</strong>.
            Click it to sign in — expires in 15 minutes.
          </p>
          <div className="space-y-2 w-full">
            <div className="px-3 py-2.5 rounded-xl text-xs text-center" style={{ background: "#1a1a27", border: "1px solid #1e1e2b", color: "#6b6b85" }}>
              💡 Check your spam folder if you don't see it
            </div>
            <button onClick={() => { setSent(false); setEmail(""); }}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "#6b6b85", background: "#1a1a27", border: "1px solid #1e1e2b" }}>
              Use a different email
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your FUNDO AI account">
      {/* Mode tabs */}
      <div className="flex rounded-xl p-1 mb-5" style={{ background: "#1a1a27", border: "1px solid #1e1e2b" }}>
        {(["magic", "password"] as const).map(m => (
          <button key={m} type="button" onClick={() => { setMode(m); setError(""); }}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
            style={mode === m
              ? { background: "#7c3aed", color: "#fff" }
              : { color: "#6b6b85" }}>
            {m === "magic" ? "Magic Link" : "Password"}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-3 py-2.5 rounded-xl text-xs font-medium mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {/* Magic link form */}
      {mode === "magic" && (
        <form onSubmit={submitMagic} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a62" }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-150"
                style={inputBase} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-violet-700 hover:bg-violet-600 transition-colors disabled:opacity-60">
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /><span>{slowConn ? "Waking server up…" : "Sending…"}</span></>
            ) : (
              <><Sparkles size={14} /><span>Send magic link</span><ArrowRight size={15} /></>
            )}
          </button>
          {slowConn && (
            <p className="text-center text-xs" style={{ color: "#a78bfa" }}>
              ⏳ Server is starting up — this takes ~30s on first load
            </p>
          )}
          {!slowConn && (
            <p className="text-center text-xs" style={{ color: "#4a4a62" }}>
              We'll email you a one-click sign-in link — no password needed
            </p>
          )}
        </form>
      )}

      {/* Password form */}
      {mode === "password" && (
        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a62" }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-150"
                style={inputBase} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold" style={{ color: "#6b6b85" }}>Password</label>
              <button type="button" onClick={() => nav("/forgot-password")}
                className="text-xs transition-colors"
                style={{ color: "#6b6b85" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#a78bfa")}
                onMouseLeave={e => (e.currentTarget.style.color = "#6b6b85")}>
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a62" }} />
              <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-150"
                style={inputBase} onFocus={focusIn} onBlur={focusOut} />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#4a4a62" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#8888a0")}
                onMouseLeave={e => (e.currentTarget.style.color = "#4a4a62")}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-violet-700 hover:bg-violet-600 transition-colors disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <><Lock size={14} /><span>Sign in</span><ArrowRight size={15} /></>}
          </button>
          <p className="text-center text-xs" style={{ color: "#4a4a62" }}>
            No password yet?{" "}
            <button type="button" onClick={() => setMode("magic")} className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
              Use a magic link instead
            </button>
          </p>
        </form>
      )}

      <div className="flex items-center gap-3 mt-5">
        <div className="flex-1 h-px" style={{ background: "#1e1e2b" }} />
        <span className="text-xs" style={{ color: "#3a3a50" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "#1e1e2b" }} />
      </div>

      <p className="text-center text-sm mt-4" style={{ color: "#6b6b85" }}>
        Don't have an account?{" "}
        <button type="button" onClick={() => nav("/signup")}
          className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Sign up free
        </button>
      </p>
    </AuthCard>
  );
}
