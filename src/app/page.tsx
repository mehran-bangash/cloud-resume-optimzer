"use client";

import { useResumeForm } from "@/viewmodels/useResumeForm";

export default function Home() {
  const {
    resume,
    isGenerating,
    liveUrl,
    updateField,
    addProject,
    updateProject,
    addExperience,
    updateExperience,
    generatePortfolio,
  } = useResumeForm();

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: THE EDIT FORM */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-6">
          <h1 className="text-2xl font-bold text-teal-400">Cloud Resume Builder</h1>
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-1">Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={resume.location || ""}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">About Me</label>
              <textarea
                value={resume.aboutMe}
                onChange={(e) => updateField("aboutMe", e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-400 resize-none"
              />
            </div>
          </div>

          {/* Dynamic Projects */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-1">
              <h2 className="text-lg font-semibold text-slate-300">Projects</h2>
              <button
                type="button"
                onClick={addProject}
                className="text-xs bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-3 py-1 rounded"
              >
                + Add Project
              </button>
            </div>
            
            {resume.projects.map((project, index) => (
              <div key={index} className="p-4 bg-slate-900 border border-slate-700 rounded space-y-3">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) => updateProject(index, "title", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={generatePortfolio}
            disabled={isGenerating}
            className="w-full bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            {isGenerating ? "Deploying to Cloud..." : "Deploy Portfolio to CDN"}
          </button>
        </section>

        {/* RIGHT COLUMN: LIVE LOCAL PREVIEW */}
        <section className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Live Preview</span>
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-white">{resume.fullName || "Your Name"}</h1>
                <p className="text-teal-400 font-medium text-sm">{resume.title || "Your Title"}</p>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">{resume.aboutMe || "Tell us about yourself..."}</p>

              {resume.projects.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Featured Projects</h3>
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="border-l-2 border-teal-400 pl-4 py-1">
                      <h4 className="font-semibold text-slate-200 text-sm">{proj.title || "Untitled Project"}</h4>
                      <p className="text-slate-400 text-xs mt-1">{proj.description || "Project details..."}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Simulated Cloud Deployment Result */}
          {liveUrl && (
            <div className="mt-8 p-4 bg-teal-950/40 border border-teal-500/30 rounded-lg text-center space-y-2">
              <p className="text-xs text-teal-300 font-semibold">🚀 Successfully Deployed Globally!</p>
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-sm text-white underline hover:text-teal-300 font-bold"
              >
                View Live Portfolio
              </a>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}