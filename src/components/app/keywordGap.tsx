"use client";
import { KeywordGapResult } from "@/lib/types";

interface Props {
  result: KeywordGapResult | null;
  isLoading: boolean;
  hasJobDescription: boolean;
}

export default function KeywordGap({ result, isLoading, hasJobDescription }: Props) {
  // Not shown if no JD entered yet
  if (!hasJobDescription) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Keyword Gap Analysis
        </p>
        <p className="text-xs text-slate-600">
          Paste a job description above to see which keywords your CV is missing.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Keyword Gap Analysis
        </p>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-wrap gap-2">
              {[80, 60, 90, 70].map((w) => (
                <div
                  key={w}
                  className="h-6 rounded-full bg-slate-700 animate-pulse"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { foundInCV, missingFromCV, matchScore } = result;
  const total = foundInCV.length + missingFromCV.length;
  const scoreColor =
    matchScore >= 75
      ? "text-green-400"
      : matchScore >= 50
      ? "text-amber-400"
      : "text-red-400";
  const barColor =
    matchScore >= 75
      ? "bg-green-400"
      : matchScore >= 50
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-4">
      {/* Header + score */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Keyword Gap Analysis
        </p>
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-2xl font-bold ${scoreColor}`}>
            {matchScore}%
          </span>
          <div className="flex-1">
            <div className="w-full h-1.5 bg-slate-700 rounded-full">
              <div
                className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {foundInCV.length} of {total} keywords matched
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs text-slate-500">Found in CV</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs text-slate-500">Missing — add these</span>
        </div>
      </div>

      {/* Missing keywords — shown first as they are most important */}
      {missingFromCV.length > 0 && (
        <div>
          <p className="text-xs text-red-400 font-medium mb-2">
            ⚠ {missingFromCV.length} missing keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingFromCV.map((kw) => (
              <span
                key={kw}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-950/60 text-red-400 border border-red-900/50"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Found keywords */}
      {foundInCV.length > 0 && (
        <div>
          <p className="text-xs text-green-400 font-medium mb-2">
            ✓ {foundInCV.length} keywords found
          </p>
          <div className="flex flex-wrap gap-1.5">
            {foundInCV.map((kw) => (
              <span
                key={kw}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-950/60 text-green-400 border border-green-900/50"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      {missingFromCV.length > 0 && (
        <p className="text-xs text-slate-600 border-t border-slate-700 pt-3">
          💡 Click <span className="text-teal-400">Analyze & Optimize CV</span> to automatically add missing keywords.
        </p>
      )}
    </div>
  );
}