import { Bot } from "lucide-react";

export default function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background: "linear-gradient(135deg,#080511 0%,#050a14 50%,#09091a 100%)" }}>
      <div className="fixed w-[700px] h-[700px] top-[-300px] left-[-300px] rounded-full opacity-[0.18] pointer-events-none" style={{ background: "radial-gradient(circle,#7c3aed 0%,transparent 70%)", animation: "orbFloat 13s ease-in-out infinite" }} />
      <div className="fixed w-[500px] h-[500px] bottom-[-200px] right-[-200px] rounded-full opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(circle,#0891b2 0%,transparent 70%)", animation: "orbFloat 17s ease-in-out 4s infinite" }} />
      <div className="fixed inset-0 opacity-[0.018] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 24px rgba(168,85,247,0.5)" }}>
              <Bot size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black" style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FUNDO AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{subtitle}</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8" style={{ boxShadow: "0 0 60px rgba(168,85,247,0.1), 0 24px 64px rgba(0,0,0,0.5)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
