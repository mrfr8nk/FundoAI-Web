import { Bot } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0a0614 0%, #060b18 50%, #0c0a1a 100%)" }}
    >
      <div className="text-center">
        <Bot size={60} className="mx-auto mb-4" style={{ color: "#a855f7" }} />
        <h1 className="text-4xl font-black text-white mb-2">404</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Page not found</p>
        <a href="/" className="mt-6 inline-block text-purple-400 underline">
          Go home
        </a>
      </div>
    </div>
  );
}
