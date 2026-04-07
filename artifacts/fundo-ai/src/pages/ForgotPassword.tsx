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
    <AuthCard title="Code sent!" subtitle={`Check ${email} for your reset code`}>
      <div className="space-y-5">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <CheckCircle2 size={28} className="text-violet-400" />
          </div>
          <p className="text-sm" style={{ color: "#8888a0" }}>
            We sent a 6-digit reset code to your email. It expires in 10 minutes.
          </p>
        </div>
        <button onClick={() => nav(`/reset-password?email=${encodeURIComponent(email)}`)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-violet-700 hover:bg-violet-600 transition-colors">
          Enter reset code <ArrowRight size={15} />
        </button>
      </div>
    </AuthCard>
  );

  return (
    <AuthCard title="Forgot your password?" subtitle="Enter your email and we'll send you a reset code">
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="px-3 py-2.5 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a62" }} />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-150"
              style={{ background: "#1a1a27", border: "1px solid #1e1e2b" }}
              onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; }}
              onBlur={e => { e.target.style.borderColor = "#1e1e2b"; }} />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-violet-700 hover:bg-violet-600 transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <><span>Send reset code</span><ArrowRight size={15} /></>}
        </button>
        <p className="text-center text-sm" style={{ color: "#6b6b85" }}>
          Remember it?{" "}
          <button type="button" onClick={() => nav("/login")} className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
            Sign in
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
