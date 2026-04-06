import { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import AuthCard from "@/components/AuthCard";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [, nav] = useLocation();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  if (sent) return (
    <AuthCard title="Code sent! 📬" subtitle={`Check ${email} for your reset code`}>
      <div className="space-y-6">
        <div className="text-center py-4">
          <CheckCircle2 size={56} className="mx-auto mb-4" style={{ color: "#25d366" }} />
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            We sent a 6-digit reset code to your email. It expires in 10 minutes.
          </p>
        </div>
        <button onClick={() => nav(`/reset-password?email=${encodeURIComponent(email)}`)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)" }}>
          Enter reset code <ArrowRight size={16} />
        </button>
      </div>
    </AuthCard>
  );

  return (
    <AuthCard title="Forgot password? 🔑" subtitle="Enter your email and we'll send you a reset code">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)", opacity: loading ? 0.7 : 1 }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Send reset code</span><ArrowRight size={16} /></>}
        </button>
        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
          Remember it?{" "}
          <button type="button" onClick={() => nav("/login")} className="font-semibold" style={{ color: "#a855f7" }}>Sign in</button>
        </p>
      </form>
    </AuthCard>
  );
}
