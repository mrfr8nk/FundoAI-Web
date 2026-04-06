import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api";

interface User { id: string; name: string; email: string; level: string; }
interface AuthCtx {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("fundo_token");
    if (t) {
      setToken(t);
      api.me().then(d => setUser(d.user)).catch(() => { localStorage.removeItem("fundo_token"); }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  function login(t: string, u: User) {
    localStorage.setItem("fundo_token", t);
    setToken(t); setUser(u);
  }
  function logout() {
    localStorage.removeItem("fundo_token");
    setToken(null); setUser(null);
  }
  async function refresh() {
    try { const d = await api.me(); setUser(d.user); } catch { logout(); }
  }

  return <Ctx.Provider value={{ user, token, loading, login, logout, refresh }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
