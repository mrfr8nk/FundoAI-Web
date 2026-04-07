// VITE_API_BASE_URL: set this on Render to your API service URL (e.g. https://fundo-ai-api.onrender.com)
// In Replit / same-domain deployments, leave it unset — the relative /api path will be used.
const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "");
const API = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}`
  : `${BASE}/api`;

function getToken() {
  return localStorage.getItem("fundo_token");
}

function headers(extra: Record<string, string> = {}) {
  const h: Record<string, string> = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function request(path: string, opts: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  try {
    const res = await fetch(`${API}${path}`, {
      ...opts,
      signal: controller.signal,
      headers: { ...headers(), ...(opts.headers as Record<string, string> || {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") throw new Error("Server is starting up — please wait a moment and try again");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  // Auth — magic link (primary)
  requestMagicLink: (body: { email: string; name?: string }) =>
    request("/auth/magic", { method: "POST", body: JSON.stringify(body) }),
  verifyMagicLink: (token: string) =>
    request(`/auth/magic/verify?token=${encodeURIComponent(token)}`),

  // Auth — legacy / fallback
  signup: (body: { name: string; email: string; password?: string }) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  verifyEmail: (body: { email: string; code: string }) =>
    request("/auth/verify-email", { method: "POST", body: JSON.stringify(body) }),
  resendCode: (email: string) =>
    request("/auth/resend-code", { method: "POST", body: JSON.stringify({ email }) }),
  login: (body: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (email: string) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (body: { email: string; code: string; newPassword: string }) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  updateProfile: (body: { name?: string; level?: string }) =>
    request("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),
  setPassword: (body: { newPassword: string; currentPassword?: string }) =>
    request("/auth/set-password", { method: "POST", body: JSON.stringify(body) }),

  // AI
  chat: (message: string, imageBase64?: string) =>
    request("/ai/chat", { method: "POST", body: JSON.stringify({ message, imageBase64 }) }),
  chatGuest: (message: string, sessionHistory: Array<{ role: string; content: string }>, imageBase64?: string) =>
    request("/ai/chat/guest", { method: "POST", body: JSON.stringify({ message, sessionHistory, imageBase64 }) }),
  getHistory: () => request("/ai/history"),
  clearHistory: () => request("/ai/history", { method: "DELETE" }),

  // File upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(`${API}/ai/upload`, {
        method: "POST",
        signal: controller.signal,
        headers: { ...(localStorage.getItem("fundo_token") ? { Authorization: `Bearer ${localStorage.getItem("fundo_token")}` } : {}) },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data;
    } catch (err: any) {
      if (err.name === "AbortError") throw new Error("Upload timed out — please try again");
      throw err;
    } finally {
      clearTimeout(timer);
    }
  },
};
