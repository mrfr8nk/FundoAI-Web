import { useState, useEffect } from "react";
import { Bot, Menu, X, MessageCircle, ChevronRight, LogOut } from "lucide-react";
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
    { label: "Features",     href: "/#features" },
    { label: "How It Works", href: "/#how" },
    { label: "Pricing",      href: "/pricing" },
    { label: "About",        href: "/about" },
    { label: "Chat",         href: "/chat" },
  ];

  function handleNav(href: string) {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      nav("/");
      setTimeout(() => {
        const id = href.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      nav(href);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#09090d" }}>

      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(9,9,13,0.95)" : "rgba(9,9,13,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid #1e1e2b" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[68px]">

            <button onClick={() => handleNav("/")} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-600">
                <Bot size={16} className="text-white" />
              </div>
              <span className="text-base font-black tracking-tight text-white">FUNDO <span className="text-violet-400">AI</span></span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {NAV.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNav(href)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{ color: "#8888a0" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8888a0")}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => handleNav("/chat")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
                  >
                    <MessageCircle size={14} /> Chat
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ color: "#6b6b85", background: "#111117", border: "1px solid #1e1e2b" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#6b6b85")}
                  >
                    <LogOut size={13} /> Sign out
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => handleNav("/login")}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: "#8888a0" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#8888a0")}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => handleNav("/signup")}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
                  >
                    Sign up free
                  </button>
                </div>
              )}

              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                style={{ background: "#111117", border: "1px solid #1e1e2b" }}
              >
                {mobileOpen ? <X size={16} className="text-white" /> : <Menu size={16} className="text-white" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-1 slide-down" style={{ borderTop: "1px solid #1e1e2b" }}>
              {NAV.map(({ label, href }) => (
                <button key={label} onClick={() => handleNav(href)}
                  className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium"
                  style={{ color: "#8888a0" }}>
                  {label} <ChevronRight size={14} style={{ color: "#3a3a50" }} />
                </button>
              ))}
              <div className="pt-2 space-y-2">
                {user ? (
                  <>
                    <button onClick={() => { handleNav("/chat"); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-violet-600">
                      <MessageCircle size={15} /> Open Chat
                    </button>
                    <button onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium"
                      style={{ color: "#8888a0", background: "#111117", border: "1px solid #1e1e2b" }}>
                      <LogOut size={14} /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { handleNav("/login"); setMobileOpen(false); }}
                      className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-medium"
                      style={{ color: "#8888a0", background: "#111117", border: "1px solid #1e1e2b" }}>
                      Log in
                    </button>
                    <button onClick={() => { handleNav("/signup"); setMobileOpen(false); }}
                      className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white bg-violet-600">
                      Sign up free
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="relative">{children}</main>

      <footer style={{ borderTop: "1px solid #1a1a27" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-violet-600">
                <Bot size={13} className="text-white" />
              </div>
              <span className="text-sm font-black text-white">FUNDO <span className="text-violet-400">AI</span></span>
            </div>
            <div className="flex items-center gap-5">
              {[{ l: "About", h: "/about" }, { l: "Privacy", h: "/privacy" }, { l: "Terms", h: "/terms" }].map(({ l, h }) => (
                <button key={l} onClick={() => handleNav(h)}
                  className="text-xs transition-colors duration-150"
                  style={{ color: "#4a4a62" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4a4a62")}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: "#4a4a62" }}>
              © 2025 FUNDO AI · <span className="text-violet-400">Darrell Mucheri</span> & <span className="text-violet-400">Crejinai Makanyisa</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
