"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { CVTemplate } from "@/viewmodels/useResumeForm";
import { useEffect, useState } from "react";

interface Props {
  onBack: () => void;
  selectedTemplate: CVTemplate;
  setSelectedTemplate: (t: CVTemplate) => void;
}

const TEMPLATES: CVTemplate[] = ["modern", "minimalist", "creative"];

export default function AppHeader({ onBack, selectedTemplate, setSelectedTemplate }: Props) {
  const { data: session } = useSession();
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | null>(null);

  // Listen for save events
  useEffect(() => {
    const handleSaving = () => setSaveStatus("saving");
    const handleSaved = () => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2000);
    };
    window.addEventListener("cv:saving", handleSaving);
    window.addEventListener("cv:saved", handleSaved);
    return () => {
      window.removeEventListener("cv:saving", handleSaving);
      window.removeEventListener("cv:saved", handleSaved);
    };
  }, []);

  return (
    <>
      <div className="border-b border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between bg-slate-950 sticky top-0 z-40">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800"
          >
            ← Back
          </button>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center text-xs font-bold text-white">AI</div>
            <span className="text-sm font-bold text-white">ResumeAI</span>
          </div>

          {/* Dynamic Status Badges for Guest vs Authenticated User */}
          {saveStatus ? (
            <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-all ${
              saveStatus === "saving"
                ? "text-amber-400 bg-amber-400/10"
                : "text-green-400 bg-green-400/10"
            }`}>
              {saveStatus === "saving" ? (
                <span className="animate-spin inline-block w-3 h-3 border border-amber-400 border-t-transparent rounded-full" />
              ) : "✓"}
              {saveStatus === "saving" ? "Saving..." : "Saved"}
            </div>
          ) : !session ? (
            /* Clear Guest Mode Badge */
            <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Guest Mode
            </div>
          ) : (
            /* Clear Active Cloud Sync Badge */
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Cloud Sync Active
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-1 mr-2">
            {TEMPLATES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTemplate(t)}
                className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  selectedTemplate === t
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  width={28}
                  height={28}
                  className="rounded-full ring-2 ring-teal-500/30"
                />
              )}
              <span className="text-xs text-slate-400 hidden sm:inline">
                {session.user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="text-xs text-slate-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            /* Clean Action Button to prompt Sign-In from Guest mode */
            <button
              onClick={() => signIn("google")}
              className="text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border border-teal-500/20"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in to save
            </button>
          )}
        </div>
      </div>

      {/* Mobile template switcher */}
      <div className="sm:hidden flex gap-1 px-4 py-2 border-b border-slate-800 overflow-x-auto bg-slate-950">
        {TEMPLATES.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTemplate(t)}
            className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all whitespace-nowrap ${
              selectedTemplate === t ? "bg-teal-500 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </>
  );
}