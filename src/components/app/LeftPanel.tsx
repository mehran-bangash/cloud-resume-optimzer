"use client";
import DownloadPDF from "@/components/DownloadPDF";
import KeywordGap from "@/components/app/KeywordGap";
import { KeywordGapResult } from "@/lib/types";

interface Props {
  atsScore: number;
  isGenerating: boolean;
  isAnalyzingKeywords: boolean;
  keywordGap: KeywordGapResult | null;
  hasJobDescription: boolean;
  onOptimize: () => void;
  onJobDescriptionChange: (val: string) => void;
  onAddKeyword: (keyword: string) => void;
  onAddAllKeywords: (keywords: string[]) => void;
}

export default function LeftPanel({
  atsScore,
  isGenerating,
  isAnalyzingKeywords,
  keywordGap,
  hasJobDescription,
  onOptimize,
  onJobDescriptionChange,
  onAddKeyword,
  onAddAllKeywords,
}: Props) {
  const score = atsScore ?? 82;
  const isReady = score >= 78;

  return (
    <div className="bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 lg:flex lg:flex-col lg:h-[calc(100vh-57px)] lg:sticky lg:top-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Job Description */}
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-1">
            Job Description
          </h2>
          <p className="text-xs text-slate-500 mb-2">
            Paste any job posting to tailor your CV instantly.
          </p>
          <textarea
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 text-slate-200 placeholder-slate-600 p-3 rounded-lg text-sm outline-none resize-none h-36 transition-all"
          />
        </div>

        {/* Optimize button */}
        <button
          onClick={onOptimize}
          disabled={isGenerating}
          className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Optimizing with AI...
            </>
          ) : "🚀 Analyze & Optimize CV"}
        </button>

        {/* Download button */}
        <DownloadPDF targetId="cv-preview-container" />

        <div className="border-t border-slate-800" />

        {/* ✅ Keyword Gap Analysis — Phase 2 Module 1 */}
       <KeywordGap
  result={keywordGap}
  isLoading={isAnalyzingKeywords}
  hasJobDescription={hasJobDescription}
  onAddKeyword={onAddKeyword}
  onAddAllKeywords={onAddAllKeywords}
/>

        <div className="border-t border-slate-800" />

        {/* ATS Score */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
            Current ATS Score
          </p>
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-bold ${isReady ? "text-green-400" : "text-amber-400"}`}>
              {score}
            </div>
            <div className="flex-1">
              <div className="w-full h-2 bg-slate-700 rounded-full">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${isReady ? "bg-green-400" : "bg-amber-400"}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isReady ? "✓ ATS Ready" : "Needs improvement"}
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
            How it works
          </p>
          <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside">
            <li>Edit your CV directly on the right</li>
            <li>Paste a job description above</li>
            <li>See keyword gaps instantly</li>
            <li>Click Optimize — AI fills missing keywords</li>
            <li>Download as PDF when ready</li>
          </ol>
        </div>

      </div>
    </div>
  );
}