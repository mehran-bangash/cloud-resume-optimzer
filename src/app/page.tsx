
import { useState, useEffect } from "react";
import { useResumeForm, CVTemplate } from "@/viewmodels/useResumeForm";

export default function Home() {
  const {
    resume,
    jobDescription,
    optimizedResume,
    selectedTemplate,
    isGenerating,
    errorMessage,
    setJobDescription,
    setSelectedTemplate,
    setOptimizedResume,
    updateField,
    addProject,
    updateProject,
    addExperience,
    updateExperience,
    optimizeResumeWithAI,
  } = useResumeForm();

  // "draft" represents raw edits, "ai" represents the optimized system output
  const [activeTab, setActiveTab] = useState<"draft" | "ai">("draft");

  // Automatically switch tab to "ai" when generation completes successfully
  useEffect(() => {
    if (optimizedResume) {
      setActiveTab("ai");
    }
  }, [optimizedResume]);

  const activeResume = activeTab === "ai" && optimizedResume ? optimizedResume : resume;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* SaaS Navigation Banner */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 font-black text-lg h-9 w-9 flex items-center justify-center rounded-lg shadow-lg">R</span>
            <div>
              <h1 className="text-md font-bold text-white tracking-wide">ResumeOptimize <span className="text-xs bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded ml-2">SaaS V1.0</span></h1>
              <p className="text-[10px] text-slate-400">Enterprise AI Engine</p>
            </div>
          </div>
          
          {/* Real-time Status Indicator */}
          <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs">
            <span className={`h-2 w-2 rounded-full ${isGenerating ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}></span>
            <span className="text-slate-300 font-medium">{isGenerating ? "Optimizing CV..." : "Ready to optimize"}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: THE SAAS DATA CONTROL PANEL */}
        <div className="space-y-8">
          
          {/* Step A: Optional Target Job Matching */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">1. Target Job Description (Optional)</h2>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full font-bold">Premium Matcher</span>
            </div>
            <p className="text-xs text-slate-400">Paste the target job description. The AI matches your experience, bullet-points, and projects dynamically to target this exact role.</p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste Job Description / Requirements here..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-400 transition"
            />
          </section>

          {/* Step B: Candidate Raw Resume Data */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-3">2. Raw Candidate Profile Details</h2>
            
            {/* Essential Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Professional Title</label>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
                <input
                  type="text"
                  value={resume.location || ""}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Profile Bio */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">About Me</label>
              <textarea
                value={resume.aboutMe}
                onChange={(e) => updateField("aboutMe", e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Dynamic Projects Block */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Candidate Projects</h3>
                <button
                  type="button"
                  onClick={addProject}
                  className="text-[10px] bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold px-3 py-1 rounded-md transition"
                >
                  + Add Project
                </button>
              </div>

              {resume.projects.map((project, index) => (
                <div key={index} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={project.title}
                    onChange={(e) => updateProject(index, "title", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <textarea
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Submit Control Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={optimizeResumeWithAI}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-xs uppercase tracking-wider"
              >
                {isGenerating ? "Compiling via Cloud Edge..." : "Optimize & Compile CV"}
              </button>

              {errorMessage && (
                <div className="mt-4 p-3.5 bg-rose-950/30 border border-rose-500/30 text-rose-300 rounded-xl text-xs space-y-1">
                  <p className="font-bold">Error compiling output:</p>
                  <p className="text-[10px] text-rose-400/90 leading-normal">{errorMessage}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: REAL-TIME INTERACTIVE PORTFOLIO RENDERER */}
        <div className="space-y-6">
          
          {/* Main Viewer Tab Selection (Draft vs AI output) */}
          <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex justify-between items-center gap-1.5">
            <button
              onClick={() => setActiveTab("draft")}
              className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all ${
                activeTab === "draft"
                  ? "bg-slate-800 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📝 Draft Preview (Live)
            </button>
            <button
              onClick={() => {
                if (optimizedResume) setActiveTab("ai");
              }}
              disabled={!optimizedResume}
              className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                !optimizedResume ? "opacity-40 cursor-not-allowed" : ""
              } ${
                activeTab === "ai"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ✨ Your New Suggested CV from AI
              {optimizedResume && (
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              )}
            </button>
          </div>

          {/* Template Controller Switcher */}
          <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 flex justify-between items-center gap-2">
            <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-widest hidden sm:inline">Active Design:</span>
            <div className="flex gap-1.5 w-full sm:w-auto">
              {(["modern", "minimalist", "creative"] as CVTemplate[]).map((temp) => (
                <button
                  key={temp}
                  onClick={() => setSelectedTemplate(temp)}
                  className={`flex-1 sm:flex-none text-xs font-semibold px-4 py-2 rounded-lg capitalize transition-all ${
                    selectedTemplate === temp
                      ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* Core Interactive Resume Canvas */}
          <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl min-h-[750px] flex flex-col">
            
            {/* RENDER DESIGN TEMPLATE #1: MODERN TECH */}
            {selectedTemplate === "modern" && (
              <div className="flex-1 flex flex-col">
                {/* Header block with solid dark accents */}
                <div className="bg-slate-900 text-white p-10 flex flex-col justify-center">
                  <h1 className="text-3xl font-extrabold tracking-tight">{activeResume.fullName || "Candidate Name"}</h1>
                  <p className="text-cyan-400 text-sm font-medium mt-1">{activeResume.title || "Target Professional Role"}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-6 border-t border-slate-800 pt-4">
                    <span>✉️ {activeResume.email}</span>
                    {activeResume.phone && <span>📞 {activeResume.phone}</span>}
                    {activeResume.location && <span>📍 {activeResume.location}</span>}
                  </div>
                </div>

                <div className="p-10 space-y-8 flex-1 bg-white">
                  {/* Bio */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold tracking-widest text-cyan-600 uppercase border-b-2 border-cyan-500/20 pb-1.5">Executive Statement</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{activeResume.aboutMe || "Candidate Bio details..."}</p>
                  </div>

                  {/* Skills tags */}
                  {activeResume.skills && activeResume.skills.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold tracking-widest text-cyan-600 uppercase border-b-2 border-cyan-500/20 pb-1.5">Key Core Competencies</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {activeResume.skills.map((skill, index) => (
                          <span key={index} className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {activeResume.experience && activeResume.experience.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold tracking-widest text-cyan-600 uppercase border-b-2 border-cyan-500/20 pb-1.5">Professional Experience</h3>
                      <div className="space-y-4">
                        {activeResume.experience.map((exp, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-bold text-slate-950">{exp.role}</h4>
                              <span className="text-[10px] font-medium text-slate-500">{exp.duration}</span>
                            </div>
                            <p className="text-[11px] text-cyan-600 font-bold">{exp.company}</p>
                            <p className="text-[11px] text-slate-500 leading-normal">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {activeResume.projects && activeResume.projects.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold tracking-widest text-cyan-600 uppercase border-b-2 border-cyan-500/20 pb-1.5">Select Products / Artifacts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeResume.projects.map((proj, idx) => (
                          <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{proj.title || "Product Title"}</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{proj.description}</p>
                            {proj.technologies && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {proj.technologies.map((t, i) => (
                                  <span key={i} className="text-[8px] tracking-wide font-bold bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RENDER DESIGN TEMPLATE #2: MINIMALIST EXECUTIVE */}
            {selectedTemplate === "minimalist" && (
              <div className="p-12 space-y-8 flex-1 bg-white text-slate-900">
                {/* Clean serif-styled header */}
                <div className="text-center space-y-1 border-b border-slate-200 pb-6">
                  <h1 className="text-3xl font-light uppercase tracking-widest text-slate-900">{activeResume.fullName || "Candidate Name"}</h1>
                  <p className="text-slate-500 text-xs tracking-wider uppercase font-medium">{activeResume.title}</p>
                  <div className="flex justify-center gap-3 text-[10px] text-slate-400 pt-3">
                    <span>{activeResume.email}</span>
                    {activeResume.location && <span>• {activeResume.location}</span>}
                  </div>
                </div>

                {/* Core summary */}
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Professional Summary</h3>
                  <p className="text-slate-600 text-xs leading-relaxed italic">{activeResume.aboutMe}</p>
                </div>

                {/* Experience section */}
                {activeResume.experience && activeResume.experience.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 border-b border-slate-100 pb-1">Professional History</h3>
                    <div className="space-y-5">
                      {activeResume.experience.map((exp, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-1.5">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">{exp.duration}</span>
                          <div className="md:col-span-3 space-y-1">
                            <h4 className="text-xs font-bold text-slate-900">{exp.role} <span className="text-slate-400 font-normal">at</span> {exp.company}</h4>
                            <p className="text-[11px] text-slate-600 leading-normal">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RENDER DESIGN TEMPLATE #3: CREATIVE SIDEBAR */}
            {selectedTemplate === "creative" && (
              <div className="flex-1 flex flex-col md:flex-row">
                {/* Elegant dark slate sidebar panel */}
                <div className="bg-slate-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-black text-cyan-400 leading-tight">{activeResume.fullName || "Name"}</h1>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{activeResume.title}</p>
                    </div>

                    <div className="space-y-3 text-[10px] text-slate-300">
                      <p className="font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">Contact</p>
                      <p>✉️ {activeResume.email}</p>
                      {activeResume.phone && <p>📞 {activeResume.phone}</p>}
                    </div>

                    {activeResume.skills && activeResume.skills.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">Skillset</p>
                        <div className="flex flex-wrap gap-1">
                          {activeResume.skills.map((s, i) => (
                            <span key={i} className="bg-slate-800 text-slate-200 text-[8px] font-bold px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[8px] text-slate-600 mt-8">Dynamic Template v1.0</p>
                </div>

                {/* Premium light main content area */}
                <div className="bg-white p-8 flex-1 space-y-6">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Background</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{activeResume.aboutMe}</p>
                  </div>

                  {activeResume.experience && activeResume.experience.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider border-b-2 border-slate-100 pb-1">Experience</h3>
                      <div className="space-y-4">
                        {activeResume.experience.map((exp, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-950">{exp.role}</h4>
                            <div className="flex justify-between text-[10px] text-cyan-600 font-bold">
                              <span>{exp.company}</span>
                              <span className="text-slate-400 font-normal">{exp.duration}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal pt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}