import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CreditCard, Smartphone, Check, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

const PLAN_INFO: Record<string, { name: string; price: number; color: string }> = {
  starter: { name: "Starter", price: 1,  color: "#10b981" },
  basic:   { name: "Basic",   price: 3,  color: "#3b82f6" },
  pro:     { name: "Pro",     price: 10, color: "#a855f7" },
  premium: { name: "Premium", price: 20, color: "#f59e0b" },
};

type Step = "method" | "ecocash" | "processing" | "success" | "error";

export default function Upgrade() {
  const [location, nav] = useLocation();
  const { user } = useAuth();
  const planId = new URLSearchParams(location.split("?")[1] || "").get("plan") || "pro";
  const plan = PLAN_INFO[planId] || PLAN_INFO.pro;

  const [step, setStep] = useState<Step>("method");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pollInterval, setPollInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (!user) nav("/login");
  }, [user, nav]);

  useEffect(() => {
    return () => { if (pollInterval) clearInterval(pollInterval); };
  }, [pollInterval]);

  async function handleEcoCash() {
    if (!phone.trim()) { setErrorMsg("Please enter your EcoCash number"); return; }
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await api.billingUpgrade({ plan: planId, method: "ecocash", phone: phone.trim() });
      setInstructions(result.instructions || `Check your EcoCash on ${phone} to approve $${plan.price.toFixed(2)}.`);
      setStep("processing");

      const interval = setInterval(async () => {
        try {
          const poll = await api.billingPoll(planId);
          if (poll.paid) {
            clearInterval(interval);
            setPollInterval(null);
            setStep("success");
          }
        } catch { /* keep polling */ }
      }, 4000);
      setPollInterval(interval);

      setTimeout(() => {
        clearInterval(interval);
        setPollInterval(null);
        if (step !== "success") setStep("error");
      }, 5 * 60 * 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg.includes("not configured")) {
        setErrorMsg("Payment system is not yet configured. Contact support.fundo.ai@gmail.com to upgrade.");
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleWebCheckout() {
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await api.billingUpgrade({ plan: planId, method: "web" });
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setErrorMsg("Could not initiate payment. Try EcoCash instead.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg.includes("not configured")) {
        setErrorMsg("Payment system is not yet configured. Contact support.fundo.ai@gmail.com to upgrade.");
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-20">
        <div className="w-full max-w-md">

          {/* Back */}
          <button onClick={() => nav("/pricing")} className="flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: "#6b6b85" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6b6b85")}>
            <ArrowLeft size={15} /> Back to pricing
          </button>

          {/* Plan badge */}
          <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}22`, border: `1px solid ${plan.color}44` }}>
              <span className="text-lg">⚡</span>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: plan.color }}>Upgrading to</div>
              <div className="text-lg font-black text-white">{plan.name} Plan — ${plan.price}/month</div>
            </div>
          </div>

          {/* Step: method */}
          {step === "method" && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white mb-6">Choose payment method</h2>

              <button
                onClick={() => setStep("ecocash")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
                style={{ background: "#111117", border: "1px solid #1e1e2b" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2b"; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <Smartphone size={18} style={{ color: "#10b981" }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">EcoCash</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Pay from your EcoCash wallet — instant confirmation</div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>Recommended</span>
              </button>

              <button
                onClick={handleWebCheckout}
                disabled={loading}
                className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
                style={{ background: "#111117", border: "1px solid #1e1e2b", opacity: loading ? 0.7 : 1 }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1e1e2b"; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}>
                  {loading ? <Loader2 size={18} style={{ color: "#818cf8" }} className="animate-spin" /> : <CreditCard size={18} style={{ color: "#818cf8" }} />}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Card / PayNow Web</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Pay with VISA, Mastercard via PayNow checkout</div>
                </div>
              </button>

              {errorMsg && (
                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                  <p className="text-sm" style={{ color: "#fca5a5" }}>{errorMsg}</p>
                </div>
              )}

              <p className="text-xs text-center mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                Secure payment powered by <span style={{ color: "rgba(255,255,255,0.5)" }}>PayNow Zimbabwe</span>
              </p>
            </div>
          )}

          {/* Step: ecocash */}
          {step === "ecocash" && (
            <div>
              <h2 className="text-xl font-black text-white mb-2">Enter your EcoCash number</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>We'll send a payment prompt to your phone for ${plan.price.toFixed(2)}.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "rgba(255,255,255,0.5)" }}>EcoCash Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 0771234567 or 263771234567"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ background: "#111117", border: "1px solid #2a2a3a", caretColor: "#a855f7" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#2a2a3a")}
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                    <p className="text-sm" style={{ color: "#fca5a5" }}>{errorMsg}</p>
                  </div>
                )}

                <button
                  onClick={handleEcoCash}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: loading ? "#1a1a27" : "linear-gradient(135deg,#a855f7,#7c3aed)", opacity: loading ? 0.8 : 1 }}
                >
                  {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={15} className="animate-spin" /> Processing...</span> : `Pay $${plan.price.toFixed(2)} via EcoCash`}
                </button>

                <button onClick={() => setStep("method")} className="w-full py-2 text-sm transition-colors" style={{ color: "#6b6b85" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#6b6b85")}>
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* Step: processing */}
          {step === "processing" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)" }}>
                <Loader2 size={28} className="animate-spin" style={{ color: "#a855f7" }} />
              </div>
              <h2 className="text-xl font-black text-white mb-3">Waiting for payment</h2>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{instructions}</p>
              <div className="p-4 rounded-xl" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  📱 Check your EcoCash app or USSD prompt to approve the payment. This page will update automatically.
                </p>
              </div>
            </div>
          )}

          {/* Step: success */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <CheckCircle2 size={32} style={{ color: "#10b981" }} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">You're on {plan.name}! 🎉</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Payment confirmed. Your upgraded limits are active now.</p>
              <div className="space-y-2 text-left mb-6 p-4 rounded-xl" style={{ background: "#111117", border: "1px solid rgba(16,185,129,0.2)" }}>
                {["Increased daily limits active", "Full study materials library unlocked", "Priority AI responses enabled"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={13} style={{ color: "#10b981" }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => nav("/chat")} className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
                Start chatting →
              </button>
            </div>
          )}

          {/* Step: error */}
          {step === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <AlertCircle size={28} style={{ color: "#f87171" }} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Payment timed out</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>We didn't receive payment confirmation. If you were charged, email us at support.fundo.ai@gmail.com.</p>
              <button onClick={() => setStep("method")} className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ background: "#1a1a27", border: "1px solid #2a2a3a" }}>
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
