"use client";
import { useState } from "react";
import { KeywordGapResult } from "@/lib/types";

interface Props {
  result: KeywordGapResult | null;
  isLoading: boolean;
  hasJobDescription: boolean;
  onAddKeyword: (keyword: string) => void;
  onAddAllKeywords: (keywords: string[]) => void;
}

export default function KeywordGap({
  result,
  isLoading,
  hasJobDescription,
  onAddKeyword,
  onAddAllKeywords,
}: Props) {
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());

  const handleAddOne = (kw: string) => {
    if (addedKeywords.has(kw)) return;
    setAddedKeywords((prev) => new Set([...prev, kw]));
    onAddKeyword(kw);
  };

  const handleAddAll = (keywords: string[]) => {
    const toAdd = keywords.filter((kw) => !addedKeywords.has(kw));
    if (toAdd.length === 0) return;
    setAddedKeywords((prev) => new Set([...prev, ...toAdd]));
    onAddAllKeywords(toAdd);
  };

  if (!hasJobDescription) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Keyword Gap Analysis
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Paste a job description above to see which keywords your CV is missing.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="animate-spin w-3 h-3 border border-teal-400 border-t-transparent rounded-full inline-block" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Analyzing Keywords...
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[70, 55, 80, 60, 75, 50, 65].map((w) => (
            <div
              key={w}
              className="h-7 rounded-full bg-slate-700 animate-pulse"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { foundInCV, missingFromCV, matchScore } = result;
  const total = foundInCV.length + missingFromCV.length;
  const stillMissing = missingFromCV.filter((kw) => !addedKeywords.has(kw));
  const justAdded = missingFromCV.filter((kw) => addedKeywords.has(kw));

  // ✅ Recalculate score dynamically as user adds keywords
  const currentMatched = foundInCV.length + addedKeywords.size;
  const currentScore = total > 0 ? Math.round((currentMatched / total) * 100) : matchScore;

  const scoreColor =
    currentScore >= 75 ? "text-green-400" :
    currentScore >= 50 ? "text-amber-400" : "text-red-400";
  const barColor =
    currentScore >= 75 ? "bg-green-400" :
    currentScore >= 50 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Keyword Match
          </p>
          <span className={`text-sm font-bold ${scoreColor}`}>{currentScore}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full mb-1">
          <div
            className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${currentScore}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">
          {currentMatched} of {total} keywords matched
        </p>
      </div>

      {stillMissing.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-red-400 font-semibold">
              ⚠ {stillMissing.length} missing — click to add
            </p>
            <button
              onClick={() => handleAddAll(stillMissing)}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Add all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stillMissing.map((kw) => (
              <button
                key={kw}
                onClick={() => handleAddOne(kw)}
                title={`Click to add "${kw}" to your CV skills`}
                className="group flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-red-950/60 text-red-400 border border-red-900/50 hover:bg-teal-500/20 hover:text-teal-300 hover:border-teal-500/50 transition-all cursor-pointer"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-400 text-xs">+</span>
                {kw}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-2">
            👆 Click any keyword to add it to your CV skills
          </p>
        </div>
      )}

      {justAdded.length > 0 && (
        <div>
          <p className="text-xs text-teal-400 font-semibold mb-2">
            ✚ {justAdded.length} added to your CV
          </p>
          <div className="flex flex-wrap gap-1.5">
            {justAdded.map((kw) => (
              <span
                key={kw}
                className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-teal-950/60 text-teal-400 border border-teal-900/50"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {foundInCV.length > 0 && (
        <div>
          <p className="text-xs text-green-400 font-semibold mb-2">
            ✓ {foundInCV.length} already in your CV
          </p>
          <div className="flex flex-wrap gap-1.5">
            {foundInCV.map((kw) => (
              <span
                key={kw}
                className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-green-950/60 text-green-400 border border-green-900/50"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {stillMissing.length === 0 && missingFromCV.length > 0 && (
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 text-center">
          <p className="text-sm text-teal-400 font-semibold">🎉 All keywords added!</p>
          <p className="text-xs text-slate-500 mt-1">
            Click Analyze & Optimize to rewrite your CV with these keywords.
          </p>
        </div>
      )}
    </div>
  );
}