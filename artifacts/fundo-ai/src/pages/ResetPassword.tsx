import { useState, useRef } from "react";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { api } from "@/lib/api";
import AuthCard from "@/components/AuthCard";

export default function ResetPassword() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const email = params.get("email") || "";
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [, nav] = useLocation();

  function handleDigit(i: number, val: string) {
    const ch = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  }
  function handleKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    const code = digits.join("");
    if (code.length < 6) { setError("Please enter the 6-digit code"); return; }
    setLoading(true);
    try {
      await api.resetPassword({ email, code, newPassword: password });
      setSuccess(true);
      setTimeout(() => nav("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  if (success) return (
    <AuthCard title="Password reset! 🎉" subtitle="Your password has been updated successfully">
      <div className="text-center py-8">
        <CheckCircle2 size={64} className="mx-auto mb-4" style={{ color: "#25d366" }} />
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Redirecting to login...</p>
      </div>
    </AuthCard>
  );

  return (
    <AuthCard title="Reset password 🔑" subtitle={`Enter the code sent to ${email || "your email"}`}>
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        {/* Code */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>6-digit code</label>
          <div className="flex justify-center gap-2.5">
            {digits.map((d, i) => (
              <input key={i} ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleDigit(i, e.target.value)} onKeyDown={e => handleKey(i, e)}
                className="w-10 h-12 text-center text-lg font-black text-white rounded-xl outline-none transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${d ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.12)"}` }} />
            ))}
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>New password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type={show ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
              className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Confirm password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type={show ? "text" : "password"} required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)", opacity: loading ? 0.7 : 1 }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Reset password</span><ArrowRight size={16} /></>}
        </button>

        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
          <button type="button" onClick={() => nav("/forgot-password")} style={{ color: "#a855f7" }}>Resend code</button>
          {" · "}
          <button type="button" onClick={() => nav("/login")} style={{ color: "rgba(255,255,255,0.45)" }}>Back to login</button>
        </p>
      </form>
    </AuthCard>
  );
}
