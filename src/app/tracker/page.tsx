"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { JobApplication } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

const STATUS_CONFIG = {
  applied:   { label: "Applied",   color: "#3B82F6", bg: "#1d3461", border: "#2563eb40" },
  interview: { label: "Interview", color: "#F59E0B", bg: "#3d2e0d", border: "#d9780040" },
  offer:     { label: "Offer",     color: "#10B981", bg: "#0d3326", border: "#05966940" },
  rejected:  { label: "Rejected",  color: "#EF4444", bg: "#3d1111", border: "#dc262640" },
  withdrawn: { label: "Withdrawn", color: "#6B7280", bg: "#1e2023", border: "#4b556340" },
};

const STATUSES = Object.keys(STATUS_CONFIG) as (keyof typeof STATUS_CONFIG)[];

export default function TrackerPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json() as any;
      setApplications(data.applications ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadApplications();
    else if (status === "unauthenticated") setIsLoading(false);
  }, [status, loadApplications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: newStatus as any } : a)
    );
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await fetch("/api/applications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const filtered = applications.filter((app) => {
    const matchStatus = filterStatus === "all" || app.status === filterStatus;
    const matchSearch =
      !searchQuery ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f1f5f9" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1e293b", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f172a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ color: "#64748b", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            ← Back
          </Link>
          <div style={{ width: "1px", height: "16px", background: "#1e293b" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "24px", height: "24px", background: "#14B8A6", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff" }}>AI</div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Job Tracker</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {session?.user?.image && (
            <Image src={session.user.image} alt="avatar" width={28} height={28} style={{ borderRadius: "50%" }} />
          )}
          {session?.user?.name && (
            <span style={{ fontSize: "12px", color: "#64748b" }}>{session.user.name.split(" ")[0]}</span>
          )}
          <Link href="/app" style={{ fontSize: "12px", background: "#14B8A6", color: "#fff", padding: "6px 14px", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>
            Open CV Editor
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Not logged in */}
        {status === "unauthenticated" && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#f1f5f9", marginBottom: "8px" }}>Sign in to use Job Tracker</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>Track your job applications, interview progress, and offers in one place.</p>
            <button onClick={() => signIn("google")} style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Sign in with Google
            </button>
          </div>
        )}

        {status === "authenticated" && (
          <>
            {/* Page title + Add button */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Job Applications</h1>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0" }}>Track every application, interview, and offer</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                + Add Application
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "Total", value: stats.total, color: "#94a3b8" },
                { label: "Applied", value: stats.applied, color: "#3B82F6" },
                { label: "Interview", value: stats.interview, color: "#F59E0B" },
                { label: "Offer", value: stats.offer, color: "#10B981" },
                { label: "Rejected", value: stats.rejected, color: "#EF4444" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "28px", fontWeight: 700, color: stat.color, margin: 0, lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search company or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#f1f5f9", outline: "none", width: "220px" }}
              />
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setFilterStatus("all")}
                  style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: "pointer", border: "1px solid", borderColor: filterStatus === "all" ? "#14B8A6" : "#1e293b", background: filterStatus === "all" ? "#14B8A615" : "transparent", color: filterStatus === "all" ? "#14B8A6" : "#64748b" }}
                >
                  All ({applications.length})
                </button>
                {STATUSES.map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  const count = applications.filter((a) => a.status === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: "pointer", border: "1px solid", borderColor: filterStatus === s ? cfg.color : "#1e293b", background: filterStatus === s ? cfg.bg : "transparent", color: filterStatus === s ? cfg.color : "#64748b" }}
                    >
                      {cfg.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Applications list */}
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ height: "72px", background: "#0f172a", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", background: "#0f172a", borderRadius: "16px", border: "1px solid #1e293b" }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>📋</p>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>
                  {applications.length === 0 ? "No applications yet" : "No results found"}
                </p>
                <p style={{ fontSize: "13px", color: "#475569", marginBottom: "20px" }}>
                  {applications.length === 0
                    ? "Start tracking your job applications to stay organised."
                    : "Try a different search or filter."}
                </p>
                {applications.length === 0 && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    + Add your first application
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {filtered.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    app={app}
                    isEditing={editingId === app.id}
                    onEdit={() => setEditingId(editingId === app.id ? null : app.id)}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onSave={async (updates) => {
                      setApplications((prev) =>
                        prev.map((a) => a.id === app.id ? { ...a, ...updates } : a)
                      );
                      await fetch("/api/applications", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: app.id, ...updates }),
                      });
                      setEditingId(null);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Application Modal */}
      {showAddForm && (
        <AddApplicationModal
          onClose={() => setShowAddForm(false)}
          onAdded={(app) => {
            setApplications((prev) => [app, ...prev]);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
}

// ── Application Row ──────────────────────────────────────────

function ApplicationRow({
  app, isEditing, onEdit, onStatusChange, onDelete, onSave,
}: {
  app: JobApplication;
  isEditing: boolean;
  onEdit: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onSave: (updates: any) => void;
}) {
  const cfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.applied;
  const [notes, setNotes] = useState(app.notes ?? "");
  const [jobUrl, setJobUrl] = useState(app.job_url ?? "");

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ background: "#0f172a", border: `1px solid #1e293b`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#334155")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
    >
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 16px", flexWrap: "wrap" }}>
        {/* Company initial */}
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: cfg.color, flexShrink: 0 }}>
          {app.company[0].toUpperCase()}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{app.role}</p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
            {app.company}
            {app.cv_version_name && (
              <span style={{ marginLeft: "8px", fontSize: "11px", background: "#1e293b", color: "#94a3b8", padding: "1px 6px", borderRadius: "4px" }}>
                {app.cv_version_name}
              </span>
            )}
          </p>
        </div>

        {/* Date */}
        <p style={{ fontSize: "12px", color: "#475569", flexShrink: 0 }}>{formatDate(app.applied_date)}</p>

        {/* Status dropdown */}
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app.id, e.target.value)}
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, borderRadius: "8px", padding: "5px 10px", fontSize: "12px", fontWeight: 600, cursor: "pointer", outline: "none" }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} style={{ background: "#0f172a", color: STATUS_CONFIG[s].color }}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>

        {/* Actions */}
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {app.job_url && (
            <a href={app.job_url} target="_blank" rel="noopener noreferrer"
              style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", background: "#1e293b", color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}
              title="View job posting"
            >↗</a>
          )}
          <button onClick={onEdit}
            style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", background: isEditing ? "#14B8A620" : "#1e293b", color: isEditing ? "#14B8A6" : "#94a3b8", border: "none", cursor: "pointer", fontSize: "13px" }}
            title="Edit notes"
          >✎</button>
          <button onClick={() => onDelete(app.id)}
            style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", background: "#1e293b", color: "#64748b", border: "none", cursor: "pointer", fontSize: "13px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.background = "#3d111120"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; (e.currentTarget as HTMLButtonElement).style.background = "#1e293b"; }}
            title="Delete"
          >✕</button>
        </div>
      </div>

      {/* Expanded edit panel */}
      {isEditing && (
        <div style={{ borderTop: "1px solid #1e293b", padding: "14px 16px", background: "#0a1628", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ fontSize: "11px", color: "#64748b", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Job URL</label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://linkedin.com/jobs/..."
                style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#f1f5f9", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "#64748b", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interview notes, contact name, salary range..."
              rows={3}
              style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#f1f5f9", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button onClick={() => onSave({ notes, job_url: jobUrl })}
              style={{ background: "#14B8A6", color: "#fff", border: "none", padding: "7px 16px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              Save
            </button>
            <button onClick={onEdit}
              style={{ background: "#1e293b", color: "#94a3b8", border: "none", padding: "7px 16px", borderRadius: "7px", fontSize: "12px", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Application Modal ────────────────────────────────────

function AddApplicationModal({ onClose, onAdded }: { onClose: () => void; onAdded: (app: JobApplication) => void }) {
  const [form, setForm] = useState({ company: "", role: "", status: "applied", job_url: "", notes: "", cv_version_name: "", applied_date: new Date().toISOString().split("T")[0] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and role are required.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as any;
      if (data.error) { setError(data.error); return; }
      if (data.application) onAdded(data.application);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "#f1f5f9", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" };
  const labelStyle = { fontSize: "11px", color: "#64748b", display: "block" as const, marginBottom: "5px", textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Add Application</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: "20px", cursor: "pointer", padding: "0 4px" }}>×</button>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Company *</label>
              <input type="text" placeholder="Google" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Role *</label>
              <input type="text" placeholder="Software Engineer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date Applied</label>
              <input type="date" value={form.applied_date} onChange={(e) => setForm({ ...form, applied_date: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Job URL</label>
            <input type="url" placeholder="https://linkedin.com/jobs/..." value={form.job_url} onChange={(e) => setForm({ ...form, job_url: e.target.value })} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>CV Version Used</label>
            <input type="text" placeholder="Flutter Dev CV" value={form.cv_version_name} onChange={(e) => setForm({ ...form, cv_version_name: e.target.value })} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea placeholder="Recruiter name, salary range, interview notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {error && <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>⚠ {error}</p>}

          <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ flex: 1, background: "#14B8A6", color: "#fff", border: "none", padding: "11px", borderRadius: "9px", fontSize: "13px", fontWeight: 700, cursor: "pointer", opacity: isSubmitting ? 0.6 : 1 }}
            >
              {isSubmitting ? "Saving..." : "Add Application"}
            </button>
            <button onClick={onClose} style={{ background: "#1e293b", color: "#94a3b8", border: "none", padding: "11px 20px", borderRadius: "9px", fontSize: "13px", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}