import { Bot } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const [, nav] = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#09090d" }}>
      {/* Subtle top gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.10) 0%, transparent 65%)" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => nav("/")} className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-600">
              <Bot size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-white">FUNDO <span className="text-violet-400">AI</span></span>
          </button>
          {title && <h1 className="text-2xl font-bold text-white mb-1.5">{title}</h1>}
          {subtitle && <p className="text-sm" style={{ color: "#8888a0" }}>{subtitle}</p>}
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7" style={{ background: "#111117", border: "1px solid #1e1e2b" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
