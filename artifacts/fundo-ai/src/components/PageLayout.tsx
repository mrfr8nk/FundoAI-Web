import { useState, useEffect } from "react";
import { Bot, Menu, X, MessageCircle, ChevronRight, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, nav] = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how" },
    { label: "About", href: "/about" },
    { label: "Chat", href: "/chat" },
  ];

  function handleNav(href: string) {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      nav("/");
      setTimeout(() => {
        const id = href.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else nav(href);
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "linear-gradient(135deg,#080511 0%,#050a14 50%,#09091a 100%)" }}>
      {/* orbs */}
      <div className="fixed w-[700px] h-[700px] top-[-300px] left-[-300px] rounded-full opacity-[0.15] pointer-events-none" style={{ background: "radial-gradient(circle,#7c3aed 0%,transparent 70%)", animation: "orbFloat 13s ease-in-out infinite" }} />
      <div className="fixed w-[500px] h-[500px] bottom-[-200px] right-[-200px] rounded-full opacity-[0.10] pointer-events-none" style={{ background: "radial-gradient(circle,#0891b2 0%,transparent 70%)", animation: "orbFloat 17s ease-in-out 4s infinite" }} />
      <div className="fixed inset-0 opacity-[0.018] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 transition-all duration-300" style={{ background: scrolled ? "rgba(8,5,17,0.94)" : "rgba(8,5,17,0.35)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent", boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.45)" : "none" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => handleNav("/")} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 16px rgba(168,85,247,0.45)" }}>
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight leading-none block" style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FUNDO AI</span>
                <span className="text-[9px] font-semibold uppercase tracking-widest block" style={{ color: "rgba(255,255,255,0.28)" }}>Zimbabwe's AI</span>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {NAV.map(({ label, href }) => (
                <button key={label} onClick={() => handleNav(href)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200" style={{ color: "rgba(255,255,255,0.52)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.52)"; e.currentTarget.style.background = "transparent"; }}>
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button onClick={() => handleNav("/chat")} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                    style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 3px 14px rgba(168,85,247,0.28)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                    <MessageCircle size={14} />Chat
                  </button>
                  <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200" style={{ color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}>
                    <LogOut size={13} />Sign out
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button onClick={() => handleNav("/login")} className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200" style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}>
                    Log in
                  </button>
                  <button onClick={() => handleNav("/signup")} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                    style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 3px 14px rgba(168,85,247,0.28)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                    Sign up free
                  </button>
                </div>
              )}
              <button onClick={() => setMobileOpen(o => !o)} className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
                {mobileOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-4 pt-2 space-y-1 slide-down" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {NAV.map(({ label, href }) => (
                <button key={label} onClick={() => handleNav(href)} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-left" style={{ color: "rgba(255,255,255,0.72)" }}>
                  {label}<ChevronRight size={14} style={{ color: "rgba(255,255,255,0.28)" }} />
                </button>
              ))}
              {user ? (
                <>
                  <button onClick={() => { handleNav("/chat"); setMobileOpen(false); }} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
                    <MessageCircle size={15} />Open Chat
                  </button>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium mt-1" style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <LogOut size={14} />Sign out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleNav("/login")} className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>Log in</button>
                  <button onClick={() => handleNav("/signup")} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white mt-1" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
                    Sign up free
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Page content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 mt-16" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ background: "rgba(5,4,12,0.97)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
                  <Bot size={16} className="text-white" />
                </div>
                <span className="text-sm font-bold" style={{ background: "linear-gradient(135deg,#a855f7,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FUNDO AI</span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.27)" }}>
                {[{ l: "About", h: "/about" }, { l: "Privacy", h: "/privacy" }, { l: "Terms", h: "/terms" }].map(({ l, h }) => (
                  <button key={l} onClick={() => handleNav(h)} className="transition-colors duration-200 hover:text-white">{l}</button>
                ))}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                © 2025 FUNDO AI · 🇿🇼 Made by <span style={{ color: "#a855f7" }}>Darrell Mucheri</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
