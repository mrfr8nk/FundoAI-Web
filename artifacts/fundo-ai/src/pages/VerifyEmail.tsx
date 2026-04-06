import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import AuthCard from "@/components/AuthCard";

export default function VerifyEmail() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const email = params.get("email") || "";
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { login } = useAuth();
  const [, nav] = useLocation();

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleDigit(i: number, val: string) {
    const ch = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d)) {
      handleSubmit(next.join(""));
    }
  }

  function handleKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(""));
      handleSubmit(text);
    }
  }

  async function handleSubmit(code: string) {
    if (code.length < 6) return;
    setError(""); setLoading(true);
    try {
      const data = await api.verifyEmail({ email, code });
      login(data.token, data.user);
      setSuccess(true);
      setTimeout(() => nav("/chat"), 1500);
    } catch (err: any) {
      setError(err.message);
      setDigits(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    } finally { setLoading(false); }
  }

  async function resend() {
    if (countdown > 0) return;
    setResending(true); setError("");
    try {
      await api.resendCode(email);
      setCountdown(60);
    } catch (err: any) {
      setError(err.message);
    } finally { setResending(false); }
  }

  if (success) return (
    <AuthCard title="Email verified! 🎉" subtitle="You're all set. Redirecting to your chat...">
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle2 size={64} style={{ color: "#25d366" }} />
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Logging you in...</p>
      </div>
    </AuthCard>
  );

  return (
    <AuthCard title="Check your email 📬" subtitle={`We sent a 6-digit code to ${email || "your email"}`}>
      <div className="space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            {error}
          </div>
        )}

        {/* OTP inputs */}
        <div className="flex justify-center gap-3" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i} ref={el => { refs.current[i] = el; }}
              type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              className="w-11 h-14 text-center text-xl font-black text-white rounded-xl outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${d ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.12)"}`, boxShadow: d ? "0 0 0 3px rgba(168,85,247,0.1)" : "none" }}
            />
          ))}
        </div>

        <button
          onClick={() => handleSubmit(digits.join(""))}
          disabled={loading || digits.some(d => !d)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.35)", opacity: (loading || digits.some(d => !d)) ? 0.6 : 1 }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Verify email</span><ArrowRight size={16} /></>}
        </button>

        <div className="text-center">
          <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.38)" }}>Didn't receive the code?</p>
          <button onClick={resend} disabled={resending || countdown > 0}
            className="flex items-center justify-center gap-1.5 mx-auto text-sm font-semibold transition-all duration-200"
            style={{ color: countdown > 0 ? "rgba(255,255,255,0.25)" : "#a855f7" }}>
            {resending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
          </button>
        </div>

        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
          Wrong email?{" "}
          <button onClick={() => nav("/signup")} className="font-semibold" style={{ color: "#a855f7" }}>Go back</button>
        </p>
      </div>
    </AuthCard>
  );
}
