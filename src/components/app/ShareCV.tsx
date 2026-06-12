"use client";
import { useState, useEffect } from "react";
import { ResumeModel } from "@/models/resume";
import { CVTemplate } from "@/viewmodels/useResumeForm";

interface Props {
  resume: ResumeModel;
  template: CVTemplate;
  isLoggedIn: boolean;
}

interface ShareInfo {
  slug: string;
  is_active: boolean;
  view_count: number;
  updated_at: string;
}

export default function ShareCV({ resume, template, isLoggedIn }: Props) {
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (!isLoggedIn) { setIsFetching(false); return; }
    fetch("/api/share")
      .then((r) => r.json() as any)
      .then((d) => setShareInfo(d.shared))
      .catch(() => {})
      .finally(() => setIsFetching(false));
  }, [isLoggedIn]);

  const handleShare = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: resume, template }),
      });
      const data = await res.json() as any;
      if (data.error) { setError(data.error); return; }
      setShareInfo((prev) => ({
        slug: data.slug,
        is_active: true,
        view_count: prev?.view_count ?? 0,
        updated_at: new Date().toISOString(),
      }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("This will deactivate your public CV link. Anyone with the link will see a 404.")) return;
    await fetch("/api/share", { method: "DELETE" });
    setShareInfo(null);
  };

  const handleCopy = () => {
    if (!shareInfo) return;
    navigator.clipboard.writeText(`${baseUrl}/cv/${shareInfo.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-teal-500 rounded-full" />
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Share CV</p>
        </div>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "24px", marginBottom: "10px" }}>🔗</p>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Sign in to share your CV</p>
          <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5, margin: 0 }}>
            Generate a public link to share your CV instead of sending a PDF file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-teal-500 rounded-full" />
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Share CV as Link</p>
      </div>

      {isFetching ? (
        <div style={{ height: "80px", background: "#0f172a", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
      ) : shareInfo ? (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px" }}>
          {/* Active link */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <span style={{ width: "7px", height: "7px", background: "#10b981", borderRadius: "50%", flexShrink: 0, boxShadow: "0 0 6px #10b981" }} />
            <p style={{ fontSize: "11px", color: "#10b981", fontWeight: 600, margin: 0 }}>Public link active</p>
          </div>

          {/* URL */}
          <div style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <p style={{ fontSize: "11px", color: "#64748b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {baseUrl}/cv/{shareInfo.slug}
            </p>
            <a href={`/cv/${shareInfo.slug}`} target="_blank" rel="noopener noreferrer"
              style={{ color: "#14B8A6", fontSize: "12px", textDecoration: "none", flexShrink: 0 }}>↗</a>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", flex: 1, textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{shareInfo.view_count}</p>
              <p style={{ fontSize: "10px", color: "#475569", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Views</p>
            </div>
            <div style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", flex: 1, textAlign: "center" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#f1f5f9", margin: 0 }}>
                {new Date(shareInfo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p style={{ fontSize: "10px", color: "#475569", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Updated</p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={handleCopy}
                style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid", borderColor: copied ? "#10b981" : "#1e293b", background: copied ? "#0d3326" : "#1e293b", color: copied ? "#10b981" : "#94a3b8", transition: "all 0.2s" }}>
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
              <button onClick={handleShare} disabled={isLoading}
                style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid #14B8A630", background: "#14B8A610", color: "#14B8A6", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                {isLoading ? <span style={{ width: "12px", height: "12px", border: "2px solid #14B8A640", borderTopColor: "#14B8A6", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> : "↑"}
                Update
              </button>
            </div>
            <button onClick={handleDeactivate}
              style={{ width: "100%", padding: "7px", borderRadius: "8px", fontSize: "11px", cursor: "pointer", border: "1px solid #1e293b", background: "transparent", color: "#475569" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#7f1d1d"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b"; }}>
              Deactivate link
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <p style={{ fontSize: "24px", marginBottom: "8px" }}>🔗</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#f1f5f9", marginBottom: "6px" }}>Share your CV as a link</p>
            <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Generate a public URL. Share it with recruiters instead of sending a PDF attachment.
            </p>
          </div>
          {error && <p style={{ fontSize: "12px", color: "#ef4444", marginBottom: "10px", textAlign: "center" }}>⚠ {error}</p>}
          <button onClick={handleShare} disabled={isLoading}
            style={{ width: "100%", background: "#14B8A6", color: "#fff", border: "none", padding: "11px", borderRadius: "9px", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            {isLoading ? <><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Generating...</> : "🔗 Generate Share Link"}
          </button>
          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {["Your CV gets a unique public URL", "Share with recruiters via link or email", "Update anytime — link stays the same", "See how many people viewed your CV"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#14B8A6", fontSize: "12px" }}>✓</span>
                <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}