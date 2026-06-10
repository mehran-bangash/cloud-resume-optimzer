"use client";
import { useState } from "react";
import DownloadPDF from "@/components/DownloadPDF";
import KeywordGap from "@/components/app/KeywordGap";
import UploadCV from "@/components/app/UploadCV";
import CoverLetter from "@/components/app/CoverLetter";
import LinkedInImport from "@/components/app/LinkedInImport";
import CVVersions from "@/components/app/CVVersions";
import { KeywordGapResult, CoverLetterResult } from "@/lib/types";
import { ResumeModel } from "@/models/resume";

type Tab = "optimize" | "upload" | "linkedin" | "keywords" | "score" | "cover" | "versions";

interface Props {
  atsScore: number;
  isGenerating: boolean;
  isAnalyzingKeywords: boolean;
  isUploadingCV: boolean;
  setIsUploadingCV: (v: boolean) => void;
  keywordGap: KeywordGapResult | null;
  hasJobDescription: boolean;
  coverLetter: CoverLetterResult | null;
  isGeneratingCoverLetter: boolean;
  currentResume: ResumeModel;
  isLoggedIn: boolean;
  onOptimize: () => void;
  onJobDescriptionChange: (val: string) => void;
  onAddKeyword: (keyword: string) => void;
  onAddAllKeywords: (keywords: string[]) => void;
  onParsedCV: (data: any) => void;
  onGenerateCoverLetter: () => void;
  onLoadVersion: (resume: ResumeModel) => void;
}

export default function LeftPanel({
  atsScore,
  isGenerating,
  isAnalyzingKeywords,
  isUploadingCV,
  setIsUploadingCV,
  keywordGap,
  hasJobDescription,
  coverLetter,
  isGeneratingCoverLetter,
  currentResume,
  isLoggedIn,
  onOptimize,
  onJobDescriptionChange,
  onAddKeyword,
  onAddAllKeywords,
  onParsedCV,
  onGenerateCoverLetter,
  onLoadVersion,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("optimize");
  const score = atsScore ?? 82;
  const isReady = score >= 78;

  const tabs: { id: Tab; label: string; icon: string; badge?: string }[] = [
    { id: "optimize", label: "Optimize", icon: "⚡" },
    { id: "upload",   label: "Upload",   icon: "↑" },
    { id: "linkedin", label: "LinkedIn", icon: "in" },
    { id: "keywords", label: "Keywords", icon: "◎",
      badge: keywordGap ? String(keywordGap.missingFromCV.length) : undefined },
    { id: "score",    label: "Score",    icon: String(score) },
    { id: "cover",    label: "Letter",   icon: "✉" },
    { id: "versions", label: "Versions", icon: "⊞" },
  ];

  return (
    <aside className="bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800/60 lg:flex lg:flex-col lg:h-[calc(100vh-57px)] lg:sticky lg:top-0">

      {/* ── Tab Bar ─────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-0">
        <div className="flex rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-2.5 text-xs font-medium transition-all border-r border-slate-800 last:border-r-0 ${
                activeTab === tab.id
                  ? tab.id === "linkedin"
                    ? "text-white"
                    : "bg-teal-500/10 text-teal-400"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
              style={activeTab === tab.id && tab.id === "linkedin"
                ? { background: "#0A66C215", color: "#0A66C2" }
                : {}
              }
            >
              {/* Active indicator line */}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-400 rounded-full" />
              )}
              {/* Badge for missing keywords */}
              {tab.badge && tab.badge !== "0" && (
                <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {parseInt(tab.badge) > 9 ? "9+" : tab.badge}
                </span>
              )}
              <span className={`text-base leading-none mb-0.5`}>
                {tab.id === "linkedin" ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ) : tab.icon}
              </span>
              <span className="text-[10px] tracking-wide hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* ══ OPTIMIZE TAB ════════════════════════════════════ */}
        {activeTab === "optimize" && (
          <div className="p-4 space-y-3">

            {/* Section label */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-teal-500 rounded-full" />
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Job Description
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Paste any job posting. AI rewrites your entire CV to match — skills, title, summary, and experience.
            </p>

            <textarea
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Senior Flutter Developer at Careem...&#10;&#10;Paste the full job description here."
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/60 text-slate-200 placeholder-slate-700 p-3 rounded-lg text-xs outline-none resize-none h-44 transition-all leading-relaxed"
            />

            <button
              onClick={() => {
                onOptimize();
                setTimeout(() => setActiveTab("keywords"), 600);
              }}
              disabled={isGenerating}
              className="w-full relative overflow-hidden bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2 group"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  <span>Optimizing with AI...</span>
                </>
              ) : (
                <>
                  <span className="text-base">🚀</span>
                  <span>Analyze & Optimize CV</span>
                </>
              )}
            </button>

            <DownloadPDF targetId="cv-preview-container" />

            {/* Divider */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-700">tips</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Tip */}
            <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 space-y-2">
              {[
                { icon: "1", text: "Upload your CV first using the Upload tab" },
                { icon: "2", text: "Paste a job description above" },
                { icon: "3", text: "Click Optimize — AI rewrites every section" },
                { icon: "4", text: "Check Keywords tab to add missing skills" },
              ].map((tip) => (
                <div key={tip.icon} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {tip.icon}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ UPLOAD TAB ══════════════════════════════════════ */}
        {activeTab === "upload" && (
          <div className="p-4">
            <UploadCV
              onParsed={(data) => {
                onParsedCV(data);
                setActiveTab("optimize");
              }}
              isLoading={isUploadingCV}
              setIsLoading={setIsUploadingCV}
            />
          </div>
        )}

        {/* ══ LINKEDIN TAB ════════════════════════════════════════ */}
        {activeTab === "linkedin" && (
          <div className="p-4">
            <LinkedInImport
              onParsed={(data) => {
                onParsedCV(data);
                setActiveTab("optimize");
              }}
              isLoading={isUploadingCV}
              setIsLoading={setIsUploadingCV}
            />
          </div>
        )}

        {/* ══ KEYWORDS TAB ════════════════════════════════════ */}
        {activeTab === "keywords" && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-teal-500 rounded-full" />
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Keyword Analysis
              </p>
            </div>
            <KeywordGap
              result={keywordGap}
              isLoading={isAnalyzingKeywords}
              hasJobDescription={hasJobDescription}
              onAddKeyword={onAddKeyword}
              onAddAllKeywords={onAddAllKeywords}
            />
            {!hasJobDescription && (
              <button
                onClick={() => setActiveTab("optimize")}
                className="w-full text-xs text-teal-400 border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 py-2.5 rounded-lg transition-all"
              >
                ← Paste a job description first
              </button>
            )}
          </div>
        )}

        {/* ══ SCORE TAB ═══════════════════════════════════════ */}
        {activeTab === "score" && (
          <div className="p-4 space-y-4">

            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-teal-500 rounded-full" />
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                ATS Score
              </p>
            </div>

            {/* Big score display */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-5">
              <div className="flex items-end gap-3 mb-4">
                <span className={`text-5xl font-black tracking-tight ${
                  isReady ? "text-green-400" : "text-amber-400"
                }`}>
                  {score}
                </span>
                <div className="pb-1">
                  <p className="text-xs text-slate-500">out of 100</p>
                  <p className={`text-xs font-semibold ${isReady ? "text-green-400" : "text-amber-400"}`}>
                    {isReady ? "✓ ATS Ready" : "Needs work"}
                  </p>
                </div>
              </div>
              {/* Score bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    score >= 90 ? "bg-green-400" :
                    score >= 78 ? "bg-teal-400" :
                    score >= 50 ? "bg-amber-400" : "bg-red-400"
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {score >= 90
                  ? "Excellent. Top 5% of applicants."
                  : score >= 78
                  ? "Good. You are ready to apply."
                  : score >= 50
                  ? "Fair. Optimize before applying."
                  : "Needs improvement. Use AI Optimize."}
              </p>
            </div>

            {/* Score guide */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                Score Guide
              </p>
              <div className="space-y-2.5">
                {[
                  { range: "90–100", label: "Excellent", color: "bg-green-400", w: "w-full" },
                  { range: "78–89",  label: "ATS Ready", color: "bg-teal-400",  w: "w-4/5" },
                  { range: "50–77",  label: "Fair",      color: "bg-amber-400", w: "w-3/5" },
                  { range: "0–49",   label: "Poor",      color: "bg-red-400",   w: "w-2/5" },
                ].map((item) => (
                  <div key={item.range} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-slate-600 font-mono">{item.range}</div>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-1.5 ${item.color} ${item.w} rounded-full`} />
                    </div>
                    <div className="w-20 text-xs text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══ COVER LETTER TAB ════════════════════════════════════ */}
        {activeTab === "cover" && (
          <div className="p-4">
            <CoverLetter
              result={coverLetter}
              isGenerating={isGeneratingCoverLetter}
              hasJobDescription={hasJobDescription}
              onGenerate={onGenerateCoverLetter}
              onBack={() => setActiveTab("optimize")}
            />
          </div>
        )}

        {/* ══ VERSIONS TAB ════════════════════════════════════════ */}
        {activeTab === "versions" && (
          <div className="p-4">
            <CVVersions
              currentResume={currentResume}
              onLoad={onLoadVersion}
              isLoggedIn={isLoggedIn}
            />
          </div>
        )}

      </div>
    </aside>
  );
}