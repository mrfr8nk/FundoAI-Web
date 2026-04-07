import { useState, useRef } from "react";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { api } from "@/lib/api";
import AuthCard from "@/components/AuthCard";

const inputBase = { background: "#1a1a27", border: "1px solid #1e1e2b" } as React.CSSProperties;
const focusIn = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; };
const focusOut = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#1e1e2b"; };

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
    const next = [...digits]; next[i] = ch; setDigits(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  }
  function handleKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    const code = digits.join("");
    if (code.length < 6) { setError("Please enter the 6-digit code"); return; }
    setLoading(true);
    try {
      await api.resetPassword({ email, code, newPassword: password });
      setSuccess(true);
      setTimeout(() => nav("/login"), 2000);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  if (success) return (
    <AuthCard title="Password reset!" subtitle="Your password has been updated successfully">
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <CheckCircle2 size={28} className="text-violet-400" />
        </div>
        <p className="text-sm" style={{ color: "#8888a0" }}>Redirecting to login…</p>
      </div>
    </AuthCard>
  );

  return (
    <AuthCard title="Reset your password" subtitle={`Enter the code sent to ${email || "your email"}`}>
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="px-3 py-2.5 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: "#6b6b85" }}>6-digit code</label>
          <div className="flex justify-center gap-2.5">
            {digits.map((d, i) => (
              <input key={i} ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleDigit(i, e.target.value)} onKeyDown={e => handleKey(i, e)}
                className="w-10 h-12 text-center text-lg font-bold text-white rounded-xl outline-none transition-all duration-150"
                style={{ background: "#1a1a27", border: `1px solid ${d ? "rgba(139,92,246,0.5)" : "#1e1e2b"}` }} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>New password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a62" }} />
            <input type={show ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-150"
              style={inputBase} onFocus={focusIn} onBlur={focusOut} />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#4a4a62" }}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6b6b85" }}>Confirm password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a62" }} />
            <input type={show ? "text" : "password"} required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-150"
              style={inputBase} onFocus={focusIn} onBlur={focusOut} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-violet-700 hover:bg-violet-600 transition-colors disabled:opacity-60">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <><span>Reset password</span><ArrowRight size={15} /></>}
        </button>

        <p className="text-center text-sm" style={{ color: "#6b6b85" }}>
          <button type="button" onClick={() => nav("/forgot-password")} className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Resend code
          </button>
          {" · "}
          <button type="button" onClick={() => nav("/login")} className="hover:text-white transition-colors">
            Back to login
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
