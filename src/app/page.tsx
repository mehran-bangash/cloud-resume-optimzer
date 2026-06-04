
import { useState } from "react";
import { useResumeForm } from "@/viewmodels/useResumeForm";

export default function Home() {
  const { resume, jobDescription, optimizedResume, auditReport, isGenerating, setJobDescription, updateField, runBackendProcess } = useResumeForm();
  const [tab, setTab] = useState<"draft" | "ai" | "audit">("draft");

  return (
    <main className="p-8 bg-slate-950 min-h-screen text-white grid grid-cols-2 gap-8">
      {/* Left: Input Form */}
      <div className="space-y-6">
         <input placeholder="Full Name" value={resume.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="w-full bg-slate-900 p-3 rounded border border-slate-700"/>
         <textarea onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste Job Description for AI Tailoring..." className="w-full bg-slate-900 p-3 rounded h-40 border border-slate-700"/>
         
         <div className="flex gap-2">
            <button onClick={() => runBackendProcess("tailor")} disabled={isGenerating} className="bg-teal-500 p-4 rounded flex-1 font-bold">Tailor My CV</button>
            <button onClick={() => runBackendProcess("audit")} disabled={isGenerating} className="bg-indigo-500 p-4 rounded flex-1 font-bold">Audit CV</button>
         </div>
      </div>

      {/* Right: Tabbed Comparison */}
      <div className="bg-slate-900 p-6 rounded border border-slate-800">
        <div className="flex gap-4 border-b border-slate-700 mb-4 pb-2">
           <button onClick={() => setTab("draft")} className={tab === "draft" ? "text-teal-400 font-bold" : ""}>Personal Draft</button>
           <button onClick={() => setTab("ai")} className={tab === "ai" ? "text-teal-400 font-bold" : ""}>AI Tailored CV</button>
           <button onClick={() => setTab("audit")} className={tab === "audit" ? "text-teal-400 font-bold" : ""}>ATS Audit Report</button>
        </div>
        
        <div className="mt-4">
          {tab === "draft" && <h2 className="text-2xl">{resume.fullName || "Your Draft Name"}</h2>}
          {tab === "ai" && optimizedResume && <h2 className="text-2xl">{optimizedResume.fullName} (Optimized)</h2>}
          {tab === "audit" && auditReport && (
            <div className="text-teal-400">
               <h3 className="font-bold text-lg">Score: {auditReport.score}/100</h3>
               <p>Flags: {auditReport.redFlags?.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}