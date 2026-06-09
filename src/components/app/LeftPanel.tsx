"use client";
import { useState } from "react";
import DownloadPDF from "@/components/DownloadPDF";
import KeywordGap from "@/components/app/KeywordGap";
import { KeywordGapResult } from "@/lib/types";

type Tab = "optimize" | "keywords" | "score";

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
  const [activeTab, setActiveTab] = useState<Tab>("optimize");
  const score = atsScore ?? 82;
  const isReady = score >= 78;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "optimize", label: "Optimize", icon: "⚡" },
    { id: "keywords", label: "Keywords", icon: "🔍" },
    { id: "score", label: "Score", icon: "📊" },
  ];

  return (
    <div className="bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 lg:flex lg:flex-col lg:h-[calc(100vh-57px)] lg:sticky lg:top-0">

      {/* Tab Bar */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex gap-1 bg-slate-950 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* ── Tab 1: Optimize ── */}
        {activeTab === "optimize" && (
          <div className="space-y-4">
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
                className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 text-slate-200 placeholder-slate-600 p-3 rounded-lg text-sm outline-none resize-none h-48 transition-all"
              />
            </div>

            <button
              onClick={() => {
                onOptimize();
                // Auto-switch to keywords tab after optimizing
                setTimeout(() => setActiveTab("keywords"), 500);
              }}
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

            <DownloadPDF targetId="cv-preview-container" />

            {/* Quick tip */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold mb-2">💡 Quick tip</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                After optimizing, check the <span className="text-teal-400 font-medium">Keywords tab</span> to see which skills were added and add any missing ones manually.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 2: Keywords ── */}
        {activeTab === "keywords" && (
          <div className="space-y-4">
            <KeywordGap
              result={keywordGap}
              isLoading={isAnalyzingKeywords}
              hasJobDescription={hasJobDescription}
              onAddKeyword={onAddKeyword}
              onAddAllKeywords={onAddAllKeywords}
            />
            {/* Prompt to optimize if no JD yet */}
            {!hasJobDescription && (
              <button
                onClick={() => setActiveTab("optimize")}
                className="w-full text-xs text-teal-400 border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 py-2.5 rounded-lg transition-all"
              >
                ← Go to Optimize tab to paste a job description
              </button>
            )}
          </div>
        )}

        {/* ── Tab 3: Score ── */}
        {activeTab === "score" && (
          <div className="space-y-4">
            {/* ATS Score */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
                ATS Score
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-4xl font-bold ${isReady ? "text-green-400" : "text-amber-400"}`}>
                  {score}
                </div>
                <div className="flex-1">
                  <div className="w-full h-3 bg-slate-700 rounded-full">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${isReady ? "bg-green-400" : "bg-amber-400"}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${isReady ? "text-green-400" : "text-amber-400"}`}>
                    {isReady ? "✓ ATS Ready" : "Needs improvement"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {isReady
                  ? "Your CV is compatible with most ATS systems. You are ready to apply."
                  : "Paste a job description and click Optimize to improve your score."}
              </p>
            </div>

            {/* Score breakdown */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
                Score Guide
              </p>
              {[
                { range: "90–100", label: "Excellent", color: "bg-green-400", desc: "Top 5% of applicants" },
                { range: "78–89", label: "Good", color: "bg-teal-400", desc: "ATS ready, apply now" },
                { range: "50–77", label: "Fair", color: "bg-amber-400", desc: "Optimize before applying" },
                { range: "0–49", label: "Poor", color: "bg-red-400", desc: "Needs major improvement" },
              ].map((item) => (
                <div key={item.range} className="flex items-center gap-3 mb-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
                  <span className="text-xs text-slate-400 w-14">{item.range}</span>
                  <span className="text-xs font-medium text-slate-300 w-16">{item.label}</span>
                  <span className="text-xs text-slate-500">{item.desc}</span>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                How it works
              </p>
              <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside">
                <li>Edit your CV on the right</li>
                <li>Paste a job description in Optimize tab</li>
                <li>Click Optimize — AI rewrites your CV</li>
                <li>Check Keywords tab for missing skills</li>
                <li>Download as PDF when ready</li>
              </ol>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}