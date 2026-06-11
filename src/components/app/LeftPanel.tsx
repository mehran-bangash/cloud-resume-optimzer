"use client";
import { useState } from "react";
import DownloadPDF from "@/components/DownloadPDF";
import KeywordGap from "@/components/app/KeywordGap";
import UploadCV from "@/components/app/UploadCV";
import LinkedInImport from "@/components/app/LinkedInImport";
import CoverLetter from "@/components/app/CoverLetter";
import CVVersions from "@/components/app/CVVersions";
import { KeywordGapResult, CoverLetterResult } from "@/lib/types";
import { ResumeModel } from "@/models/resume";

type Panel =
  | "optimize"
  | "upload"
  | "linkedin"
  | "keywords"
  | "score"
  | "cover"
  | "versions";

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

const NAV_ITEMS: {
  id: Panel;
  label: string;
  icon: string;
  color?: string;
}[] = [
  { id: "optimize",  label: "Optimize",   icon: "ti-bolt"           },
  { id: "upload",    label: "Upload CV",   icon: "ti-upload"         },
  { id: "linkedin",  label: "LinkedIn",    icon: "ti-brand-linkedin", color: "#0A66C2" },
  { id: "keywords",  label: "Keywords",    icon: "ti-tags"           },
  { id: "cover",     label: "Cover Letter",icon: "ti-mail"           },
  { id: "versions",  label: "CV Versions", icon: "ti-versions"       },
  { id: "score",     label: "ATS Score",   icon: "ti-chart-bar"      },
];

export default function LeftPanel({
  atsScore, isGenerating, isAnalyzingKeywords,
  isUploadingCV, setIsUploadingCV,
  keywordGap, hasJobDescription,
  coverLetter, isGeneratingCoverLetter,
  currentResume, isLoggedIn,
  onOptimize, onJobDescriptionChange,
  onAddKeyword, onAddAllKeywords,
  onParsedCV, onGenerateCoverLetter, onLoadVersion,
}: Props) {
  const [active, setActive] = useState<Panel>("optimize");
  const [mobileOpen, setMobileOpen] = useState(false);
  const score = atsScore ?? 82;
  const isReady = score >= 78;

  const missingCount = keywordGap?.missingFromCV?.length ?? 0;

  return (
    <>
      {/* ── Mobile trigger bar ────────────────────────────── */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActive(item.id); setMobileOpen(true); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              active === item.id && mobileOpen
                ? "bg-teal-500 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
            style={active === item.id && mobileOpen && item.color
              ? { background: item.color }
              : {}
            }
          >
            <i className={`ti ${item.icon} text-sm`} aria-hidden="true" />
            {item.label}
            {item.id === "keywords" && missingCount > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {missingCount > 9 ? "9+" : missingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Mobile content panel ──────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
            <p className="text-xs font-semibold text-slate-300">
              {NAV_ITEMS.find(n => n.id === active)?.label}
            </p>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-slate-500 hover:text-white text-lg w-6 h-6 flex items-center justify-center rounded"
            >
              ×
            </button>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <PanelContent
              active={active}
              setActive={setActive}
              score={score}
              isReady={isReady}
              isGenerating={isGenerating}
              isAnalyzingKeywords={isAnalyzingKeywords}
              isUploadingCV={isUploadingCV}
              setIsUploadingCV={setIsUploadingCV}
              keywordGap={keywordGap}
              hasJobDescription={hasJobDescription}
              coverLetter={coverLetter}
              isGeneratingCoverLetter={isGeneratingCoverLetter}
              currentResume={currentResume}
              isLoggedIn={isLoggedIn}
              onOptimize={onOptimize}
              onJobDescriptionChange={onJobDescriptionChange}
              onAddKeyword={onAddKeyword}
              onAddAllKeywords={onAddAllKeywords}
              onParsedCV={onParsedCV}
              onGenerateCoverLetter={onGenerateCoverLetter}
              onLoadVersion={onLoadVersion}
            />
          </div>
        </div>
      )}

      {/* ── Desktop layout ────────────────────────────────── */}
      <aside className="hidden lg:flex h-[calc(100vh-57px)] sticky top-0 border-r border-slate-800">

        {/* Icon rail */}
        <div className="w-14 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-3 gap-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.id} className="relative group w-full px-1">
              <button
                onClick={() => setActive(item.id)}
                aria-label={item.label}
                className={`w-full flex flex-col items-center justify-center py-2.5 rounded-lg transition-all relative ${
                  active === item.id
                    ? "bg-slate-800 text-teal-400"
                    : "text-slate-600 hover:text-slate-300 hover:bg-slate-800/60"
                }`}
                style={active === item.id && item.color
                  ? { color: item.color }
                  : {}
                }
              >
                {/* Active indicator */}
                {active === item.id && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                    style={{ background: item.color ?? "#14B8A6" }}
                  />
                )}
                <i className={`ti ${item.icon} text-xl`} aria-hidden="true" />
                {/* Badge */}
                {item.id === "keywords" && missingCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {missingCount > 9 ? "9+" : missingCount}
                  </span>
                )}
                {item.id === "score" && (
                  <span className={`text-[10px] font-bold mt-0.5 ${isReady ? "text-green-400" : "text-amber-400"}`}>
                    {score}
                  </span>
                )}
              </button>

              {/* Tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                  {item.label}
                  {item.id === "keywords" && missingCount > 0 && (
                    <span className="ml-1.5 text-red-400">({missingCount} missing)</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content panel */}
        <div className="w-72 bg-slate-900 overflow-y-auto">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2 sticky top-0 bg-slate-900 z-10">
            <i
              className={`ti ${NAV_ITEMS.find(n => n.id === active)?.icon} text-base`}
              style={{ color: NAV_ITEMS.find(n => n.id === active)?.color ?? "#14B8A6" }}
              aria-hidden="true"
            />
            <p className="text-xs font-semibold text-slate-300">
              {NAV_ITEMS.find(n => n.id === active)?.label}
            </p>
          </div>

          {/* Panel body */}
          <div className="p-4">
            <PanelContent
              active={active}
              setActive={setActive}
              score={score}
              isReady={isReady}
              isGenerating={isGenerating}
              isAnalyzingKeywords={isAnalyzingKeywords}
              isUploadingCV={isUploadingCV}
              setIsUploadingCV={setIsUploadingCV}
              keywordGap={keywordGap}
              hasJobDescription={hasJobDescription}
              coverLetter={coverLetter}
              isGeneratingCoverLetter={isGeneratingCoverLetter}
              currentResume={currentResume}
              isLoggedIn={isLoggedIn}
              onOptimize={onOptimize}
              onJobDescriptionChange={onJobDescriptionChange}
              onAddKeyword={onAddKeyword}
              onAddAllKeywords={onAddAllKeywords}
              onParsedCV={onParsedCV}
              onGenerateCoverLetter={onGenerateCoverLetter}
              onLoadVersion={onLoadVersion}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Shared panel content ─────────────────────────────────────

interface PanelContentProps {
  active: Panel;
  setActive: (p: Panel) => void;
  score: number;
  isReady: boolean;
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

function PanelContent({
  active, setActive, score, isReady,
  isGenerating, isAnalyzingKeywords,
  isUploadingCV, setIsUploadingCV,
  keywordGap, hasJobDescription,
  coverLetter, isGeneratingCoverLetter,
  currentResume, isLoggedIn,
  onOptimize, onJobDescriptionChange,
  onAddKeyword, onAddAllKeywords,
  onParsedCV, onGenerateCoverLetter, onLoadVersion,
}: PanelContentProps) {

  if (active === "optimize") return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          Paste any job posting. AI rewrites your entire CV to match the role.
        </p>
        <textarea
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder={"Senior Flutter Developer at Careem...\n\nPaste the full job description here."}
          className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/60 text-slate-200 placeholder-slate-700 p-3 rounded-lg text-xs outline-none resize-none h-44 transition-all leading-relaxed"
        />
      </div>
      <button
        onClick={() => { onOptimize(); setTimeout(() => setActive("keywords"), 600); }}
        disabled={isGenerating}
        className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Optimizing...</>
        ) : (
          <><i className="ti ti-rocket text-base" aria-hidden="true" />Analyze & Optimize CV</>
        )}
      </button>
      <DownloadPDF targetId="cv-preview-container" />
      <div className="border-t border-slate-800 pt-3 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick guide</p>
        {[
          { icon: "ti-upload",         text: "Upload your CV first" },
          { icon: "ti-brand-linkedin", text: "Or import from LinkedIn" },
          { icon: "ti-bolt",           text: "Paste JD and click Optimize" },
          { icon: "ti-tags",           text: "Add missing keywords manually" },
        ].map((tip) => (
          <div key={tip.icon} className="flex items-center gap-2.5">
            <i className={`ti ${tip.icon} text-sm text-slate-600`} aria-hidden="true" />
            <p className="text-xs text-slate-500">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (active === "upload") return (
    <UploadCV
      onParsed={(d) => { onParsedCV(d); setActive("optimize"); }}
      isLoading={isUploadingCV}
      setIsLoading={setIsUploadingCV}
    />
  );

  if (active === "linkedin") return (
    <LinkedInImport
      onParsed={(d) => { onParsedCV(d); setActive("optimize"); }}
      isLoading={isUploadingCV}
      setIsLoading={setIsUploadingCV}
    />
  );

  if (active === "keywords") return (
    <div className="space-y-3">
      <KeywordGap
        result={keywordGap}
        isLoading={isAnalyzingKeywords}
        hasJobDescription={hasJobDescription}
        onAddKeyword={onAddKeyword}
        onAddAllKeywords={onAddAllKeywords}
      />
      {!hasJobDescription && (
        <button
          onClick={() => setActive("optimize")}
          className="w-full text-xs text-teal-400 border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 py-2.5 rounded-lg transition-all"
        >
          ← Paste a job description first
        </button>
      )}
    </div>
  );

  if (active === "cover") return (
    <CoverLetter
      result={coverLetter}
      isGenerating={isGeneratingCoverLetter}
      hasJobDescription={hasJobDescription}
      onGenerate={onGenerateCoverLetter}
      onBack={() => setActive("optimize")}
    />
  );

  if (active === "versions") return (
    <CVVersions
      currentResume={currentResume}
      onLoad={(r) => { onLoadVersion(r); }}
      isLoggedIn={isLoggedIn}
    />
  );

  if (active === "score") return (
    <div className="space-y-4">
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-5">
        <div className="flex items-end gap-3 mb-4">
          <span className={`text-5xl font-black tracking-tight ${isReady ? "text-green-400" : "text-amber-400"}`}>
            {score}
          </span>
          <div className="pb-1">
            <p className="text-xs text-slate-500">out of 100</p>
            <p className={`text-xs font-semibold ${isReady ? "text-green-400" : "text-amber-400"}`}>
              {isReady ? "✓ ATS Ready" : "Needs work"}
            </p>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${
              score >= 90 ? "bg-green-400" : score >= 78 ? "bg-teal-400" : score >= 50 ? "bg-amber-400" : "bg-red-400"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          {score >= 90 ? "Excellent. Top 5% of applicants."
            : score >= 78 ? "Good. Ready to apply."
            : score >= 50 ? "Fair. Optimize before applying."
            : "Needs improvement. Use AI Optimize."}
        </p>
      </div>
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Score guide</p>
        <div className="space-y-2.5">
          {[
            { range: "90–100", label: "Excellent", w: "100%", color: "bg-green-400" },
            { range: "78–89",  label: "ATS Ready", w: "85%",  color: "bg-teal-400"  },
            { range: "50–77",  label: "Fair",       w: "60%",  color: "bg-amber-400" },
            { range: "0–49",   label: "Poor",       w: "40%",  color: "bg-red-400"   },
          ].map((item) => (
            <div key={item.range} className="flex items-center gap-3">
              <span className="w-14 text-xs text-slate-600 font-mono">{item.range}</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-1.5 ${item.color} rounded-full`} style={{ width: item.w }} />
              </div>
              <span className="w-16 text-xs text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return null;
}