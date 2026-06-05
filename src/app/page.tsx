"use client";
import { useResumeForm, CVTemplate } from "@/viewmodels/useResumeForm";
import CVPreview from "@/components/CVPreview";
import DownloadPDF from "@/components/DownloadPDF";

export default function Home() {
  const {
    resume, isGenerating, isCheckingATS, atsMessage,
    selectedTemplate, setSelectedTemplate,
    setJobDescription, updateField, optimize, checkATS,
  } = useResumeForm();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">AI Cloud Resume Optimizer</h1>
          <p className="text-xs text-slate-500">2026 ATS-Ready Format · Powered by Cloudflare AI</p>
        </div>
        <div className="flex gap-2">
          {(["modern", "minimalist", "creative"] as CVTemplate[]).map((t) => (
            <button key={t} onClick={() => setSelectedTemplate(t)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                selectedTemplate === t
                  ? "bg-teal-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[300px_1fr] min-h-[calc(100vh-65px)]">

        {/* ── Left Panel ── */}
        <div className="bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-65px)] sticky top-0">
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {/* Job Description */}
            <div>
              <h2 className="text-sm font-semibold text-slate-300 mb-1">Job Description</h2>
              <p className="text-xs text-slate-500 mb-2">Paste the job posting, then click Optimize.</p>
              <textarea
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 text-slate-200 placeholder-slate-600 p-3 rounded-lg text-sm outline-none resize-none h-40 transition-all"
              />
            </div>

            {/* Optimize Button */}
            <button
              onClick={optimize}
              disabled={isGenerating}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Optimizing with AI...
                </>
              ) : "🚀 Analyze & Optimize CV"}
            </button>

            {/* Download Button */}
            <DownloadPDF targetId="cv-preview-container" />

            {/* Divider */}
            <div className="border-t border-slate-800 pt-2" />

            {/* How it works */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">How it works</p>
              <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
                <li>Edit your CV directly on the right</li>
                <li>Paste a job description above</li>
                <li>Click Optimize — AI rewrites your CV</li>
                <li>Use ⚡ Check ATS Score anytime</li>
              </ol>
            </div>

            {/* Current Score */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Current Score</p>
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold ${(resume.atsScore ?? 82) >= 78 ? "text-green-400" : "text-amber-400"}`}>
                  {resume.atsScore ?? 82}
                </div>
                <div className="flex-1">
                  <div className="w-full h-2 bg-slate-700 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all ${(resume.atsScore ?? 82) >= 78 ? "bg-green-400" : "bg-amber-400"}`}
                      style={{ width: `${resume.atsScore ?? 82}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {(resume.atsScore ?? 82) >= 78 ? "ATS Ready ✓" : "Needs improvement"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Right Panel — CV Preview ── */}
        <div className="overflow-y-auto bg-slate-950 p-8">
          <div id="cv-preview-container">
            <CVPreview
              resume={resume}
              updateField={updateField}
              onCheckATS={checkATS}
              isCheckingATS={isCheckingATS}
              atsMessage={atsMessage}
              template={selectedTemplate}
            />
          </div>
        </div>

      </div>
    </main>
  );
}