const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "");
const API = `${BASE}/api`;

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
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { ...headers(), ...(opts.headers as Record<string, string> || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
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
    const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "");
    const res = await fetch(`${BASE}/api/ai/upload`, {
      method: "POST",
      headers: { ...(localStorage.getItem("fundo_token") ? { Authorization: `Bearer ${localStorage.getItem("fundo_token")}` } : {}) },
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
};
