"use client";

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
    updateField,
    addProject,
    updateProject,
    addExperience,
    updateExperience,
    optimizeResumeWithAI,
  } = useResumeForm();

  // Active resume data container (falls back to raw inputs if AI hasn't been triggered yet)
  const activeResume = optimizedResume || resume;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans pb-24">
      
      {}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-teal-500/10 text-teal-400 p-2 rounded-lg border border-teal-500/20 font-mono text-xs font-bold uppercase tracking-wider">
              SaaS Engine v1.0
            </span>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Cloud Resume Optimizer
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">Edge Worker Status: Connected</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPILER PANEL (Controls & Inputs) */}
        <section className="lg:col-span-5 space-y-6">
          
          {}
          <div className="p-5 bg-slate-900/60 border border-slate-900 rounded-2xl space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              1. Select Style Template
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {(["modern", "minimalist", "creative"] as CVTemplate[]).map((temp) => (
                <button
                  key={temp}
                  type="button"
                  onClick={() => setSelectedTemplate(temp)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                    selectedTemplate === temp
                      ? "bg-teal-500/10 border-teal-500 text-teal-400 shadow-lg shadow-teal-500/5"
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {}
          <div className="p-5 bg-slate-900/60 border border-slate-900 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                2. Target Job Description (Optional)
              </h2>
              <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                Premium AI Match
              </span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job role descriptions here. The Cloudflare AI engine will dynamically rewrite, align, and match your resume to target keywords."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder-slate-600 font-sans"
            />
          </div>

          {}
          <div className="p-6 bg-slate-900/40 border border-slate-900/60 rounded-2xl space-y-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-900 pb-2">
              3. Raw Candidate Profile Details
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={resume.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={resume.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={resume.location || ""}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Professional Title</label>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Candidate Summary</label>
                <textarea
                  value={resume.aboutMe}
                  onChange={(e) => updateField("aboutMe", e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            {}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase text-slate-400">Featured Projects</h3>
                <button
                  type="button"
                  onClick={addProject}
                  className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-teal-400 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  + Add Project
                </button>
              </div>
              
              {resume.projects.map((project, index) => (
                <div key={index} className="p-4 bg-slate-950/50 border border-slate-900 rounded-xl space-y-3">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={project.title}
                    onChange={(e) => updateProject(index, "title", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <textarea
                    placeholder="Project Description..."
                    value={project.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>
              ))}
            </div>

            {}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase text-slate-400">Work Experience</h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-teal-400 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  + Add History
                </button>
              </div>
              
              {resume.experience.map((exp, index) => (
                <div key={index} className="p-4 bg-slate-950/50 border border-slate-900 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Role (e.g. Lead Dev)"
                      value={exp.role}
                      onChange={(e) => updateExperience(index, "role", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Duration (e.g. 2024 - Pres)"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, "duration", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Job description..."
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {}
            <button
              onClick={optimizeResumeWithAI}
              disabled={isGenerating}
              className="w-full bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition disabled:opacity-50 flex justify-center items-center gap-2 text-sm shadow-xl shadow-teal-400/5 mt-6"
            >
              {isGenerating ? (
                <>
                  <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Processing with AI Edge...
                </>
              ) : (
                "Optimize & compile CV"
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded-xl">
              ⚠️ {errorMessage}
            </div>
          )}
        </section>

        {/* RIGHT LIVE COMPILING PREVIEW (Viewer & Template Engine) */}
        <section className="lg:col-span-7 lg:sticky lg:top-24 space-y-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Compiled Output
            </span>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span>Layout Match:</span>
              <span className="text-teal-400 capitalize">{selectedTemplate}</span>
            </div>
          </div>

          {}
          <div className="w-full border border-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
            
            {}
            {selectedTemplate === "modern" && (
              <div className="bg-slate-950 p-8 sm:p-12 min-h-[650px] border border-slate-900 text-slate-200 space-y-8 flex flex-col justify-between">
                <div>
                  <div className="border-l-4 border-teal-400 pl-6 space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                      {activeResume.fullName || "Your Name"}
                    </h1>
                    <p className="text-teal-400 font-mono text-sm tracking-wide font-semibold">
                      {activeResume.title || "Your Profession"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1 font-mono">
                      <span>✉️ {activeResume.email || "email@address.com"}</span>
                      {activeResume.phone && <span>📞 {activeResume.phone}</span>}
                      {activeResume.location && <span>📍 {activeResume.location}</span>}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed max-w-3xl pt-6 border-t border-slate-900 mt-6">
                    {activeResume.aboutMe || "Describe your professional background..."}
                  </p>

                  {activeResume.experience && activeResume.experience.length > 0 && (
                    <div className="space-y-6 mt-8">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2">
                        Professional Work History
                      </h3>
                      <div className="space-y-6">
                        {activeResume.experience.map((exp, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-slate-100 text-sm">{exp.role || "Role"}</h4>
                                <p className="text-teal-400 text-xs font-mono">{exp.company || "Company"}</p>
                              </div>
                              <span className="text-xs text-slate-500 font-mono">{exp.duration}</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeResume.projects && activeResume.projects.length > 0 && (
                    <div className="space-y-6 mt-8">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2">
                        Key Engineering Projects
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeResume.projects.map((proj, idx) => (
                          <div key={idx} className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-2">
                            <h4 className="font-bold text-slate-200 text-sm">{proj.title || "Untitled Project"}</h4>
                            <p className="text-slate-400 text-[11px] leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <footer className="pt-8 border-t border-slate-900 text-center text-[10px] font-mono text-slate-600">
                  Built with AI-Cloud Compiler
                </footer>
              </div>
            )}

            {}
            {selectedTemplate === "minimalist" && (
              <div className="bg-white p-8 sm:p-12 min-h-[650px] text-slate-900 space-y-8 flex flex-col justify-between">
                <div>
                  <div className="text-center space-y-2 pb-6 border-b border-slate-200">
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">
                      {activeResume.fullName || "Your Name"}
                    </h1>
                    <p className="text-slate-500 font-serif italic text-sm">
                      {activeResume.title || "Your Profession"}
                    </p>
                    <div className="flex justify-center gap-6 text-[11px] text-slate-500 font-mono">
                      <span>{activeResume.email || "email@address.com"}</span>
                      {activeResume.phone && <span>{activeResume.phone}</span>}
                      {activeResume.location && <span>{activeResume.location}</span>}
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed italic text-center max-w-2xl mx-auto pt-6">
                    "{activeResume.aboutMe || "Your professional abstract..."}"
                  </p>

                  {activeResume.experience && activeResume.experience.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
                        Experience
                      </h3>
                      <div className="space-y-4">
                        {activeResume.experience.map((exp, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-slate-900 text-sm">
                                {exp.role || "Role"} <span className="font-normal text-slate-500 text-xs">at {exp.company}</span>
                              </h4>
                              <span className="text-xs text-slate-500 font-mono">{exp.duration}</span>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeResume.projects && activeResume.projects.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
                        Projects
                      </h3>
                      <div className="space-y-3">
                        {activeResume.projects.map((proj, idx) => (
                          <div key={idx} className="space-y-1">
                            <h4 className="font-bold text-slate-950 text-sm">{proj.title || "Untitled Project"}</h4>
                            <p className="text-slate-600 text-xs leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <footer className="pt-8 border-t border-slate-200 text-center text-[10px] font-serif italic text-slate-500">
                  Global Portfolio Engine
                </footer>
              </div>
            )}

            {}
            {selectedTemplate === "creative" && (
              <div className="bg-slate-900 p-8 sm:p-12 min-h-[650px] border border-slate-800 text-slate-200 space-y-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                        {activeResume.fullName || "Your Name"}
                      </h1>
                      <p className="text-rose-400 text-xs uppercase tracking-widest font-bold">
                        {activeResume.title || "Your Profession"}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-400 font-mono space-y-1 sm:self-end">
                      <p>{activeResume.email || "email@address.com"}</p>
                      {activeResume.phone && <p>{activeResume.phone}</p>}
                      {activeResume.location && <p>{activeResume.location}</p>}
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed pt-6">
                    {activeResume.aboutMe || "Tell your career story..."}
                  </p>

                  {activeResume.experience && activeResume.experience.length > 0 && (
                    <div className="space-y-6 mt-8">
                      <h3 className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">
                        Career Path
                      </h3>
                      <div className="relative border-l border-slate-800 ml-2 pl-6 space-y-6">
                        {activeResume.experience.map((exp, idx) => (
                          <div key={idx} className="relative space-y-1">
                            <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-amber-400"></span>
                            <div className="flex flex-wrap justify-between items-baseline gap-2">
                              <h4 className="font-bold text-slate-100 text-sm">{exp.role || "Role"}</h4>
                              <span className="text-xs text-amber-400/80 font-mono">{exp.duration}</span>
                            </div>
                            <p className="text-xs text-rose-300/80 font-mono">{exp.company}</p>
                            <p className="text-slate-400 text-xs leading-relaxed pt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeResume.projects && activeResume.projects.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h3 className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">
                        Work Showcase
                      </h3>
                      <div className="space-y-4">
                        {activeResume.projects.map((proj, idx) => (
                          <div key={idx} className="border-l-2 border-rose-400 pl-4 py-1 space-y-1">
                            <h4 className="font-bold text-slate-200 text-sm">{proj.title || "Untitled Project"}</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <footer className="pt-8 border-t border-slate-800 text-center text-[10px] font-mono text-slate-500">
                  Designed via AI SaaS Compiler
                </footer>
              </div>
            )}
            
          </div>
        </section>

      </div>
    </main>
  );
}

