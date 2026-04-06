import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Bot, Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function MagicVerify() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [userName, setUserName] = useState("");
  const [, nav] = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setErrorMsg("No token found in the link. Please request a new one.");
      setStatus("error");
      return;
    }
    api.verifyMagicLink(token)
      .then(data => {
        login(data.token, data.user);
        setUserName(data.user.name.split(" ")[0]);
        setStatus("success");
        setTimeout(() => nav("/chat"), 2200);
      })
      .catch(err => {
        setErrorMsg(err.message || "Invalid or expired link.");
        setStatus("error");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(88,28,135,0.22) 0%, transparent 70%), #06030f" }}>

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full opacity-10" style={{ background: "#7c3aed", filter: "blur(100px)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-8" style={{ background: "#06b6d4", filter: "blur(80px)" }} />
      </div>

      <div className="relative w-full max-w-sm text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}>
            <Bot size={20} className="text-white" />
          </div>
          <div className="text-left">
            <div className="text-base font-black tracking-tight" style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FUNDO AI</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Zimbabwe's AI</div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: "rgba(15,10,30,0.95)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(168,85,247,0.1)" }}>

          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)" }}>
                <Loader2 size={32} className="animate-spin" style={{ color: "#a855f7" }} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Signing you in…</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Verifying your magic link</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", boxShadow: "0 0 30px rgba(168,85,247,0.25)" }}>
                <CheckCircle2 size={32} style={{ color: "#a855f7" }} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Welcome, {userName}! 🎉</h2>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
                You're signed in. Taking you to FUNDO AI…
              </p>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#06b6d4)", animation: "progress 2.2s ease-in-out forwards" }} />
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <XCircle size={32} style={{ color: "#f87171" }} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Link expired ⏱</h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {errorMsg}
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={() => nav("/login")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 16px rgba(168,85,247,0.35)" }}>
                  Get a new link <ArrowRight size={15} />
                </button>
                <button onClick={() => nav("/")}
                  className="w-full py-3 rounded-xl text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Back to home
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  );
}
