"use client";
import { useState } from "react";
import DownloadPDF from "@/components/DownloadPDF";
import KeywordGap from "@/components/app/KeywordGap";
import UploadCV from "@/components/app/UploadCV";
import { KeywordGapResult } from "@/lib/types";

type Tab = "optimize" | "upload" | "keywords" | "score";

interface Props {
  atsScore: number;
  isGenerating: boolean;
  isAnalyzingKeywords: boolean;
  isUploadingCV: boolean;
  setIsUploadingCV: (v: boolean) => void;
  keywordGap: KeywordGapResult | null;
  hasJobDescription: boolean;
  onOptimize: () => void;
  onJobDescriptionChange: (val: string) => void;
  onAddKeyword: (keyword: string) => void;
  onAddAllKeywords: (keywords: string[]) => void;
  onParsedCV: (data: any) => void;
}

export default function LeftPanel({
  atsScore,
  isGenerating,
  isAnalyzingKeywords,
  isUploadingCV,
  setIsUploadingCV,
  keywordGap,
  hasJobDescription,
  onOptimize,
  onJobDescriptionChange,
  onAddKeyword,
  onAddAllKeywords,
  onParsedCV,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("optimize");
  const score = atsScore ?? 82;
  const isReady = score >= 78;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "optimize", label: "Optimize", icon: "⚡" },
    { id: "upload",   label: "Upload",   icon: "📤" },
    { id: "keywords", label: "Keywords", icon: "🔍" },
    { id: "score",    label: "Score",    icon: "📊" },
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
          </div>
        )}

        {/* ── Tab 2: Upload ── */}
        {activeTab === "upload" && (
          <UploadCV
            onParsed={(data) => {
              onParsedCV(data);
              setActiveTab("optimize");
            }}
            isLoading={isUploadingCV}
            setIsLoading={setIsUploadingCV}
          />
        )}

        {/* ── Tab 3: Keywords ── */}
        {activeTab === "keywords" && (
          <div className="space-y-4">
            <KeywordGap
              result={keywordGap}
              isLoading={isAnalyzingKeywords}
              hasJobDescription={hasJobDescription}
              onAddKeyword={onAddKeyword}
              onAddAllKeywords={onAddAllKeywords}
            />
          </div>
        )}

        {/* ── Tab 4: Score ── */}
        {activeTab === "score" && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">ATS Score</p>
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-4xl font-bold ${isReady ? "text-green-400" : "text-amber-400"}`}>{score}</div>
                <div className="flex-1">
                  <div className="w-full h-3 bg-slate-700 rounded-full">
                    <div className={`h-3 rounded-full transition-all duration-500 ${isReady ? "bg-green-400" : "bg-amber-400"}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}