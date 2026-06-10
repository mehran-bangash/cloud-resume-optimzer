"use client";
import { useState, useEffect } from "react";
import { ResumeModel } from "@/models/resume";

interface CVVersion {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  currentResume: ResumeModel;
  onLoad: (resume: ResumeModel) => void;
  isLoggedIn: boolean;
}

export default function CVVersions({ currentResume, onLoad, isLoggedIn }: Props) {
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const loadVersionsList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/resume/versions");
      const data = await res.json() as any;
      setVersions(data.versions ?? []);
    } catch {
      setError("Failed to load versions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) loadVersionsList();
  }, [isLoggedIn]);

  const handleSave = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/resume/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), data: currentResume }),
      });
      const data = await res.json() as any;
      if (data.error) {
        setError(data.error);
        return;
      }
      setNewName("");
      setShowNameInput(false);
      showSuccess(`"${newName}" saved!`);
      await loadVersionsList();
    } catch {
      setError("Failed to save version.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async (version: CVVersion) => {
    setLoadingId(version.id);
    try {
      const res = await fetch("/api/resume/versions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: version.id }),
      });
      const data = await res.json() as any;
      if (data.data) {
        onLoad(data.data as ResumeModel);
        showSuccess(`Loaded "${version.name}"`);
      }
    } catch {
      setError("Failed to load version.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/resume/versions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json() as any;
      if (data.error) {
        setError(data.error);
        return;
      }
      showSuccess(`"${name}" deleted.`);
      setVersions((prev) => prev.filter((v) => v.id !== id));
    } catch {
      setError("Failed to delete version.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Not logged in ────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-teal-500 rounded-full" />
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            CV Versions
          </p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <span className="text-xl">🔒</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">Sign in to save versions</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Save multiple CV versions — one for each job type. Switch between them instantly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-teal-500 rounded-full" />
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            CV Versions
          </p>
        </div>
        <span className="text-xs text-slate-600">
          {versions.length}/10
        </span>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          <p className="text-xs text-green-400">✓ {successMsg}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2 flex items-start gap-2">
          <span className="text-red-400 flex-shrink-0">⚠</span>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Save current CV */}
      {showNameInput ? (
        <div className="bg-slate-950 border border-teal-500/30 rounded-xl p-3 space-y-2">
          <p className="text-xs text-slate-400">Name this CV version:</p>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="e.g. Flutter Dev CV, Backend CV..."
            maxLength={50}
            autoFocus
            className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 text-slate-200 placeholder-slate-600 px-3 py-2 rounded-lg text-xs outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !newName.trim()}
              className="flex-1 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white text-xs font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1"
            >
              {isSaving ? (
                <span className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full" />
              ) : "Save"}
            </button>
            <button
              onClick={() => { setShowNameInput(false); setNewName(""); setError(null); }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs py-2 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNameInput(true)}
          disabled={versions.length >= 10}
          className="w-full bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-teal-400 text-xs font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Save Current CV as New Version
        </button>
      )}

      {/* Versions list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : versions.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center">
          <p className="text-xs text-slate-600 leading-relaxed">
            No saved versions yet. Save your current CV above to create your first version.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-300 truncate">
                    {version.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {formatDate(version.updated_at)}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleLoad(version)}
                    disabled={loadingId === version.id}
                    className="text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    {loadingId === version.id ? (
                      <span className="animate-spin w-3 h-3 border border-teal-400 border-t-transparent rounded-full" />
                    ) : "Load"}
                  </button>
                  <button
                    onClick={() => handleDelete(version.id, version.name)}
                    disabled={deletingId === version.id}
                    className="text-xs text-slate-600 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-all disabled:opacity-50"
                  >
                    {deletingId === version.id ? (
                      <span className="animate-spin w-3 h-3 border border-red-400 border-t-transparent rounded-full inline-block" />
                    ) : "✕"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
        <p className="text-xs text-slate-600 leading-relaxed">
          Save up to 10 CV versions. Each version stores your complete CV — skills, experience, and all fields. Load any version instantly.
        </p>
      </div>
    </div>
  );
}