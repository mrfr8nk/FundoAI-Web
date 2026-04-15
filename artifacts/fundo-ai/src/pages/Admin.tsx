import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import {
  Users, BarChart2, Settings, LogOut, Search, RefreshCw,
  Trash2, Edit3, Check, X, ChevronLeft, ChevronRight,
  Shield, MessageCircle, TrendingUp, UserCheck, UserX,
  AlertCircle, Save, Eye, Crown,
} from "lucide-react";

const PLAN_COLOR: Record<string, string> = {
  free:     "rgba(107,114,128,0.2)",
  starter:  "rgba(59,130,246,0.2)",
  basic:    "rgba(16,185,129,0.2)",
  pro:      "rgba(139,92,246,0.2)",
  premium:  "rgba(245,158,11,0.2)",
};
const PLAN_TEXT: Record<string, string> = {
  free: "#9ca3af", starter: "#60a5fa", basic: "#34d399", pro: "#a78bfa", premium: "#fbbf24",
};
const PLANS = ["free","starter","basic","pro","premium"];

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span style={{
      background: PLAN_COLOR[plan] || PLAN_COLOR.free,
      color: PLAN_TEXT[plan] || PLAN_TEXT.free,
      padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      textTransform: "capitalize", letterSpacing: 0.3,
    }}>{plan}</span>
  );
}

function StatCard({ label, value, sub, color = "#a855f7" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 16, padding: "20px 24px" }}>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, marginBottom: sub ? 4 : 0 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#4b5563" }}>{sub}</div>}
    </div>
  );
}

// ── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.adminStats()
      .then(d => setStats(d))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "#6b7280", padding: 40 }}>Loading stats…</div>;
  if (err) return <div style={{ color: "#f87171", padding: 40 }}>{err}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
        <StatCard label="Total Users"     value={stats.totalUsers}      color="#a855f7" />
        <StatCard label="Verified"        value={stats.verifiedUsers}   color="#34d399" sub={`${stats.unverifiedUsers} unverified`} />
        <StatCard label="Paid Users"      value={stats.paidUsers}       color="#fbbf24" />
        <StatCard label="New Today"       value={stats.newToday}        color="#60a5fa" />
        <StatCard label="New This Week"   value={stats.newThisWeek}     color="#60a5fa" />
        <StatCard label="New This Month"  value={stats.newThisMonth}    color="#60a5fa" />
        <StatCard label="Chats Today"     value={stats.totalChatsToday} color="#f472b6" />
      </div>

      <div style={{ background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e5e7eb", marginBottom: 16 }}>Users by Plan</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PLANS.map(plan => {
            const count = stats.plans[plan] || 0;
            const pct = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;
            return (
              <div key={plan} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 70, fontSize: 12, fontWeight: 700, color: PLAN_TEXT[plan], textTransform: "capitalize" }}>{plan}</div>
                <div style={{ flex: 1, height: 8, background: "#1e1535", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: PLAN_TEXT[plan], borderRadius: 99, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ width: 40, fontSize: 13, fontWeight: 700, color: "#9ca3af", textAlign: "right" }}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers]     = useState<any[]>([]);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [planFilter, setPlan] = useState("all");
  const [sort, setSort]       = useState("newest");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const d = await api.adminUsers({ search, plan: planFilter === "all" ? "" : planFilter, page, sort });
      setUsers(d.users); setTotal(d.total); setPages(d.pages);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }, [search, planFilter, page, sort]);

  useEffect(() => { load(); }, [load]);

  async function savePlan(userId: string) {
    setSaving(true);
    try {
      await api.adminUpdateUser(userId, { plan: editPlan });
      setEditing(null);
      load();
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await api.adminDeleteUser(userId);
      setDeleting(null);
      load();
    } catch (e: any) { alert(e.message); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            style={{ width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9, background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 10, color: "#e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <select value={planFilter} onChange={e => { setPlan(e.target.value); setPage(1); }}
          style={{ padding: "9px 12px", background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 10, color: "#e5e7eb", fontSize: 13 }}>
          <option value="all">All plans</option>
          {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: "9px 12px", background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 10, color: "#e5e7eb", fontSize: 13 }}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A-Z</option>
          <option value="chats">Most chats today</option>
        </select>
        <button onClick={load} style={{ padding: "9px 14px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10, color: "#a855f7", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div style={{ fontSize: 12, color: "#6b7280" }}>{total} user{total !== 1 ? "s" : ""} found</div>

      {err && <div style={{ color: "#f87171", fontSize: 13 }}>{err}</div>}

      {/* Table */}
      <div style={{ overflowX: "auto", background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1535" }}>
              {["Name / Email", "Plan", "Chats Today", "Joined", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>No users found</td></tr>
            ) : users.map((u: any) => (
              <tr key={u._id} style={{ borderBottom: "1px solid rgba(30,21,53,0.5)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: 600, color: "#e5e7eb", display: "flex", alignItems: "center", gap: 6 }}>
                    {u.isAdmin && <Crown size={12} color="#fbbf24" />}
                    {u.name}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{u.email}</div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {editing === u._id ? (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <select value={editPlan} onChange={e => setEditPlan(e.target.value)}
                        style={{ padding: "4px 8px", background: "#1e1535", border: "1px solid #2d2050", borderRadius: 8, color: "#e5e7eb", fontSize: 12 }}>
                        {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <button onClick={() => savePlan(u._id)} disabled={saving}
                        style={{ padding: "4px 8px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 6, color: "#34d399", cursor: "pointer" }}>
                        <Check size={12} />
                      </button>
                      <button onClick={() => setEditing(null)}
                        style={{ padding: "4px 8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, color: "#f87171", cursor: "pointer" }}>
                        <X size={12} />
                      </button>
                    </div>
                  ) : <PlanBadge plan={u.plan} />}
                </td>
                <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{u.chatsToday}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { setEditing(u._id); setEditPlan(u.plan); }}
                      title="Change plan"
                      style={{ padding: "5px 8px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 8, color: "#a855f7", cursor: "pointer" }}>
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => deleteUser(u._id)}
                      title="Delete user"
                      style={{ padding: "5px 8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#f87171", cursor: "pointer" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "6px 12px", background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 8, color: page === 1 ? "#4b5563" : "#e5e7eb", cursor: page === 1 ? "default" : "pointer" }}>
            <ChevronLeft size={14} />
          </button>
          <span style={{ color: "#9ca3af", fontSize: 13 }}>Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            style={{ padding: "6px 12px", background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 8, color: page === pages ? "#4b5563" : "#e5e7eb", cursor: page === pages ? "default" : "pointer" }}>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Site Config Tab ───────────────────────────────────────────────────────────
function SiteConfigTab() {
  const [config, setConfig]   = useState<Record<string, string>>({});
  const [whatsapp, setWA]     = useState("");
  const [announce, setAnn]    = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [err, setErr]         = useState("");

  useEffect(() => {
    api.adminGetConfig()
      .then(d => {
        setConfig(d.config || {});
        setWA(d.config?.whatsapp_number || "263719647303");
        setAnn(d.config?.announcement || "");
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true); setErr(""); setSaved(false);
    try {
      const d = await api.adminUpdateConfig({ whatsapp_number: whatsapp, announcement: announce });
      setConfig(d.config || {});
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) { setErr(e.message); }
    finally { setSaving(false); }
  }

  if (loading) return <div style={{ color: "#6b7280", padding: 40 }}>Loading config…</div>;

  const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 600 }}>
      {err && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px", color: "#f87171", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
          <AlertCircle size={14} /> {err}
        </div>
      )}

      {/* WhatsApp */}
      <div style={{ background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ background: "rgba(37,211,102,0.15)", borderRadius: 10, padding: 8 }}>
            <MessageCircle size={18} color="#25d366" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#e5e7eb" }}>WhatsApp Bot Number</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>This number appears in the links across the site</div>
          </div>
        </div>
        <input
          value={whatsapp}
          onChange={e => setWA(e.target.value)}
          placeholder="e.g. 263719647303"
          style={{ width: "100%", padding: "10px 14px", background: "#06030f", border: "1px solid #1e1535", borderRadius: 10, color: "#e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }}
        />
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          Preview link: <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: "#25d366" }}>{waLink}</a>
        </div>
      </div>

      {/* Announcement */}
      <div style={{ background: "#0f0a1e", border: "1px solid #1e1535", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ background: "rgba(251,191,36,0.15)", borderRadius: 10, padding: 8 }}>
            <AlertCircle size={18} color="#fbbf24" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#e5e7eb" }}>Site Announcement</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Optional banner message shown to all users (leave blank to hide)</div>
          </div>
        </div>
        <textarea
          value={announce}
          onChange={e => setAnn(e.target.value)}
          placeholder="e.g. 🎉 We're launching A-Level content this week! Stay tuned."
          rows={3}
          style={{ width: "100%", padding: "10px 14px", background: "#06030f", border: "1px solid #1e1535", borderRadius: 10, color: "#e5e7eb", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        style={{
          padding: "12px 28px", background: saving ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg,#a855f7,#7c3aed)",
          border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 15,
          cursor: saving ? "default" : "pointer", display: "flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
        }}>
        {saving ? <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} /> : saved ? <Check size={16} /> : <Save size={16} />}
        {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
      </button>

      {saved && (
        <div style={{ color: "#34d399", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={14} /> Changes saved. The site will use the new WhatsApp number immediately.
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart2 },
  { id: "users",     label: "Users",     icon: Users },
  { id: "config",    label: "Site Settings", icon: Settings },
];

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#06030f", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
        Loading…
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#06030f", color: "#e5e7eb" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1535", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", borderRadius: 10, padding: "6px 8px" }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 900, fontSize: 16, color: "#a855f7" }}>FUNDO AI</span>
            <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>Admin Portal</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{user.email}</span>
          <button
            onClick={() => setLocation("/")}
            style={{ padding: "6px 12px", background: "transparent", border: "1px solid #1e1535", borderRadius: 8, color: "#9ca3af", cursor: "pointer", fontSize: 12 }}>
            ← Back to site
          </button>
          <button
            onClick={() => { logout(); setLocation("/"); }}
            style={{ padding: "6px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#f87171", cursor: "pointer" }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        {/* Sidebar */}
        <div style={{ width: 200, borderRight: "1px solid #1e1535", padding: "24px 12px", flexShrink: 0 }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 10, marginBottom: 4,
                  background: active ? "rgba(139,92,246,0.15)" : "transparent",
                  border: active ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                  color: active ? "#a855f7" : "#9ca3af",
                  cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 400,
                  textAlign: "left",
                }}>
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "28px 32px", overflowX: "auto" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 900, color: "#fff" }}>
            {TABS.find(t => t.id === tab)?.label}
          </h2>
          {tab === "dashboard" && <DashboardTab />}
          {tab === "users"     && <UsersTab />}
          {tab === "config"    && <SiteConfigTab />}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
