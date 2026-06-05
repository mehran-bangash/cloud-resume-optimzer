"use client";
import { ResumeModel } from "@/models/resume";
import { CVTemplate } from "@/viewmodels/useResumeForm";

interface Props {
  resume: ResumeModel;
  updateField: (field: keyof ResumeModel, value: any) => void;
  onCheckATS: () => void;
  isCheckingATS: boolean;
  atsMessage: string | null;
  template: CVTemplate;
}

export default function CVPreview({
  resume, updateField, onCheckATS, isCheckingATS, atsMessage, template,
}: Props) {
  const score = resume.atsScore ?? 82;

  // ── Shared ATS bar (all templates) ──────────────────────────────
  const ATSBar = () => (
    <>
      <div data-ats-bar="true" className={`flex items-center justify-between px-6 py-3 border-b-2 ${score >= 78 ? "border-green-600 bg-slate-900" : "border-amber-600 bg-slate-900"}`}>
        <div className="flex items-center gap-3">
          <div className={`text-3xl font-bold ${score >= 78 ? "text-green-400" : "text-amber-400"}`}>{score}</div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">ATS Score</div>
            <div className="w-32 h-2 bg-slate-700 rounded-full mt-1">
              <div className={`h-2 rounded-full transition-all ${score >= 78 ? "bg-green-400" : "bg-amber-400"}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        </div>
        <button onClick={onCheckATS} disabled={isCheckingATS}
          className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all">
          {isCheckingATS ? "Checking..." : "⚡ Check ATS Score"}
        </button>
      </div>
      {atsMessage && (
        <div data-ats-message="true" className="bg-slate-800 text-sm text-teal-300 px-6 py-2 border-b border-slate-700">{atsMessage}</div>
      )}
    </>
  );

  // ── TEMPLATE: MODERN (default) ──────────────────────────────────
  if (template === "modern") {
    return (
      <div className="bg-white text-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans">
        <ATSBar />
        {/* Header */}
        <div className="bg-slate-800 text-white px-8 py-6">
          <input value={resume.fullName} onChange={(e) => updateField("fullName", e.target.value)}
            className="bg-transparent border-b border-dashed border-slate-500 focus:border-teal-400 outline-none w-full text-3xl font-bold text-white mb-1" />
          <input value={resume.title} onChange={(e) => updateField("title", e.target.value)}
            className="bg-transparent border-b border-dashed border-slate-600 focus:border-teal-400 outline-none w-full text-teal-400 text-lg font-medium mt-1 mb-3" />
          <div className="flex flex-wrap gap-4 text-sm text-slate-300 mt-2">
            {([
              { field: "email" as keyof ResumeModel, icon: "✉", val: resume.email },
              { field: "phone" as keyof ResumeModel, icon: "📱", val: resume.phone },
              { field: "location" as keyof ResumeModel, icon: "📍", val: resume.location },
              { field: "linkedin" as keyof ResumeModel, icon: "🔗", val: resume.linkedin },
              { field: "github" as keyof ResumeModel, icon: "💻", val: resume.github },
            ]).map(({ field, icon, val }) => (
              <span key={field} className="flex items-center gap-1">
                {icon}
                <input type="text" value={val} onChange={(e) => updateField(field, e.target.value)}
                  className="bg-transparent border-b border-dashed border-slate-600 focus:border-teal-400 outline-none text-slate-300 text-sm w-40" />
              </span>
            ))}
          </div>
        </div>
        {/* Body */}
        <div className="grid grid-cols-3 gap-0">
          {/* Left */}
          <div className="col-span-1 bg-slate-100 px-5 py-6 space-y-6">
            <SkillsSection resume={resume} updateField={updateField} chipClass="bg-teal-100 text-teal-800 border border-teal-200 focus:border-teal-500" />
            <EducationSection resume={resume} updateField={updateField} accentColor="text-teal-600" />
          </div>
          {/* Right */}
          <div className="col-span-2 px-6 py-6 space-y-6">
            <SummarySection resume={resume} updateField={updateField} />
            <ExperienceSection resume={resume} updateField={updateField} accentColor="border-teal-400" durationColor="text-teal-600" />
            <ProjectsSection resume={resume} updateField={updateField} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── TEMPLATE: MINIMALIST ────────────────────────────────────────
  if (template === "minimalist") {
    return (
      <div className="bg-white text-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans">
        <ATSBar />
        {/* Clean white header */}
        <div className="px-10 py-8 border-b-2 border-slate-800">
          <input value={resume.fullName} onChange={(e) => updateField("fullName", e.target.value)}
            className="bg-transparent border-b border-dashed border-slate-300 focus:border-slate-600 outline-none w-full text-4xl font-light text-slate-900 mb-2 tracking-tight" />
          <input value={resume.title} onChange={(e) => updateField("title", e.target.value)}
            className="bg-transparent border-b border-dashed border-slate-200 focus:border-slate-500 outline-none w-full text-slate-500 text-base font-normal mt-1 mb-4 uppercase tracking-widest text-xs" />
          <div className="flex flex-wrap gap-6 text-xs text-slate-500 mt-2">
            {([
              { field: "email" as keyof ResumeModel, val: resume.email },
              { field: "phone" as keyof ResumeModel, val: resume.phone },
              { field: "location" as keyof ResumeModel, val: resume.location },
              { field: "linkedin" as keyof ResumeModel, val: resume.linkedin },
              { field: "github" as keyof ResumeModel, val: resume.github },
            ]).map(({ field, val }) => (
              <input key={field} type="text" value={val} onChange={(e) => updateField(field, e.target.value)}
                className="bg-transparent border-b border-dashed border-slate-200 focus:border-slate-500 outline-none text-slate-500 text-xs w-40" />
            ))}
          </div>
        </div>
        {/* Single column body */}
        <div className="px-10 py-8 space-y-8">
          <SummarySection resume={resume} updateField={updateField} />
          {/* Skills inline */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, i) => (
                <input key={i} type="text" value={skill}
                  onChange={(e) => { const u = [...resume.skills]; u[i] = e.target.value; updateField("skills", u); }}
                  className="bg-slate-50 text-slate-600 text-xs px-3 py-1 rounded-full border border-slate-200 focus:border-slate-500 outline-none w-24" />
              ))}
              <button onClick={() => updateField("skills", [...resume.skills, "Skill"])}
                className="text-xs text-slate-400 border border-dashed border-slate-300 px-3 py-1 rounded-full hover:bg-slate-50">+ Add</button>
            </div>
          </section>
          <ExperienceSection resume={resume} updateField={updateField} accentColor="border-slate-300" durationColor="text-slate-400" />
          <ProjectsSection resume={resume} updateField={updateField} />
          <EducationSection resume={resume} updateField={updateField} accentColor="text-slate-500" />
        </div>
        <Footer />
      </div>
    );
  }

  // ── TEMPLATE: CREATIVE ──────────────────────────────────────────
  return (
    <div className="bg-white text-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans">
      <ATSBar />
      {/* Bold colored header */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-600 text-white px-8 py-8">
        <input value={resume.fullName} onChange={(e) => updateField("fullName", e.target.value)}
          className="bg-transparent border-b border-dashed border-white/40 focus:border-white outline-none w-full text-4xl font-black text-white mb-2 tracking-tight" />
        <input value={resume.title} onChange={(e) => updateField("title", e.target.value)}
          className="bg-transparent border-b border-dashed border-white/30 focus:border-white/80 outline-none w-full text-violet-200 text-lg font-medium mt-1 mb-4" />
        <div className="flex flex-wrap gap-4 text-sm text-violet-100 mt-2">
          {([
            { field: "email" as keyof ResumeModel, icon: "✉", val: resume.email },
            { field: "phone" as keyof ResumeModel, icon: "📱", val: resume.phone },
            { field: "location" as keyof ResumeModel, icon: "📍", val: resume.location },
            { field: "linkedin" as keyof ResumeModel, icon: "🔗", val: resume.linkedin },
            { field: "github" as keyof ResumeModel, icon: "💻", val: resume.github },
          ]).map(({ field, icon, val }) => (
            <span key={field} className="flex items-center gap-1">
              {icon}
              <input type="text" value={val} onChange={(e) => updateField(field, e.target.value)}
                className="bg-transparent border-b border-dashed border-white/30 focus:border-white outline-none text-violet-100 text-sm w-40" />
            </span>
          ))}
        </div>
      </div>
      {/* Body */}
      <div className="grid grid-cols-3 gap-0">
        {/* Left — violet sidebar */}
        <div className="col-span-1 bg-violet-50 px-5 py-6 space-y-6">
          <SkillsSection resume={resume} updateField={updateField} chipClass="bg-violet-100 text-violet-800 border border-violet-200 focus:border-violet-500" />
          <EducationSection resume={resume} updateField={updateField} accentColor="text-violet-600" />
        </div>
        {/* Right */}
        <div className="col-span-2 px-6 py-6 space-y-6">
          <SummarySection resume={resume} updateField={updateField} />
          <ExperienceSection resume={resume} updateField={updateField} accentColor="border-violet-500" durationColor="text-violet-600" />
          <ProjectsSection resume={resume} updateField={updateField} />
        </div>
      </div>
      <div className="bg-violet-700 text-center py-2 text-xs text-violet-200 tracking-widest uppercase">
        2026 ATS-Optimized Format · AI Cloud Resume Optimizer
      </div>
    </div>
  );
}

// ── Shared section components ────────────────────────────────────

function SkillsSection({ resume, updateField, chipClass }: { resume: ResumeModel; updateField: any; chipClass: string }) {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-300 pb-1">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {resume.skills.map((skill, i) => (
          <input key={i} type="text" value={skill}
            onChange={(e) => { const u = [...resume.skills]; u[i] = e.target.value; updateField("skills", u); }}
            className={`text-xs font-semibold px-2 py-1 rounded outline-none w-24 ${chipClass}`} />
        ))}
        <button onClick={() => updateField("skills", [...resume.skills, "New Skill"])}
          className="text-xs text-teal-600 border border-dashed border-teal-400 px-2 py-1 rounded hover:bg-teal-50">+ Add</button>
      </div>
    </section>
  );
}

function EducationSection({ resume, updateField, accentColor }: { resume: ResumeModel; updateField: any; accentColor: string }) {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-300 pb-1">Education</h3>
      {resume.education.map((edu, i) => (
        <div key={i} className="mb-3">
          <input type="text" value={edu.degree}
            onChange={(e) => { const u = [...resume.education]; u[i] = { ...u[i], degree: e.target.value }; updateField("education", u); }}
            className="bg-transparent text-sm font-semibold text-slate-700 border-b border-dashed border-slate-300 focus:border-teal-400 outline-none w-full" />
          <input type="text" value={edu.institution}
            onChange={(e) => { const u = [...resume.education]; u[i] = { ...u[i], institution: e.target.value }; updateField("education", u); }}
            className="bg-transparent text-xs text-slate-500 border-b border-dashed border-slate-200 focus:border-teal-400 outline-none w-full mt-1" />
          <input type="text" value={edu.year}
            onChange={(e) => { const u = [...resume.education]; u[i] = { ...u[i], year: e.target.value }; updateField("education", u); }}
            className={`bg-transparent text-xs border-b border-dashed border-slate-200 focus:border-teal-400 outline-none w-full mt-1 ${accentColor}`} />
        </div>
      ))}
      <button onClick={() => updateField("education", [...resume.education, { degree: "Degree", institution: "University", year: "2024" }])}
        className="text-xs text-teal-600 border border-dashed border-teal-400 px-2 py-1 rounded hover:bg-teal-50 mt-1">+ Add</button>
    </section>
  );
}

function SummarySection({ resume, updateField }: { resume: ResumeModel; updateField: any }) {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-200 pb-1">Professional Summary</h3>
      <textarea value={resume.aboutMe} onChange={(e) => updateField("aboutMe", e.target.value)} rows={3}
        className="w-full text-sm text-slate-600 bg-transparent border border-dashed border-slate-200 focus:border-teal-400 outline-none resize-none rounded p-2" />
    </section>
  );
}

function ExperienceSection({ resume, updateField, accentColor, durationColor }: { resume: ResumeModel; updateField: any; accentColor: string; durationColor: string }) {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">Experience</h3>
      {resume.experience.map((exp, i) => (
        <div key={i} className={`mb-4 pl-3 border-l-2 ${accentColor}`}>
          <div className="flex justify-between items-start gap-2">
            <input type="text" value={exp.role}
              onChange={(e) => { const u = [...resume.experience]; u[i] = { ...u[i], role: e.target.value }; updateField("experience", u); }}
              className="bg-transparent text-sm font-bold text-slate-700 border-b border-dashed border-slate-200 focus:border-teal-400 outline-none flex-1" />
            <input type="text" value={exp.duration}
              onChange={(e) => { const u = [...resume.experience]; u[i] = { ...u[i], duration: e.target.value }; updateField("experience", u); }}
              className={`bg-transparent text-xs border-b border-dashed border-slate-200 focus:border-teal-400 outline-none w-36 text-right ${durationColor}`} />
          </div>
          <input type="text" value={exp.company}
            onChange={(e) => { const u = [...resume.experience]; u[i] = { ...u[i], company: e.target.value }; updateField("experience", u); }}
            className="bg-transparent text-xs text-slate-500 border-b border-dashed border-slate-200 focus:border-teal-400 outline-none w-full mt-1" />
          <textarea value={exp.description} rows={3}
            onChange={(e) => { const u = [...resume.experience]; u[i] = { ...u[i], description: e.target.value }; updateField("experience", u); }}
            className="w-full text-xs text-slate-500 bg-transparent border border-dashed border-slate-100 focus:border-teal-300 outline-none resize-none rounded p-1 mt-2" />
          <button onClick={() => { const u = [...resume.experience]; u.splice(i, 1); updateField("experience", u); }}
            className="text-xs text-red-400 hover:text-red-600 mt-1">✕ Remove</button>
        </div>
      ))}
      <button onClick={() => updateField("experience", [...resume.experience, { role: "New Role", company: "Company", duration: "2024–Present", description: "Describe responsibilities..." }])}
        className="text-xs text-teal-600 border border-dashed border-teal-400 px-3 py-1 rounded hover:bg-teal-50 mt-1">+ Add Experience</button>
    </section>
  );
}

function ProjectsSection({ resume, updateField }: { resume: ResumeModel; updateField: any }) {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">Projects</h3>
      {resume.projects.map((proj, i) => (
        <div key={i} className="mb-4 pl-3 border-l-2 border-slate-300">
          <input type="text" value={proj.title}
            onChange={(e) => { const u = [...resume.projects]; u[i] = { ...u[i], title: e.target.value }; updateField("projects", u); }}
            className="bg-transparent text-sm font-bold text-slate-700 border-b border-dashed border-slate-200 focus:border-teal-400 outline-none w-full" />
          <textarea value={proj.description} rows={2}
            onChange={(e) => { const u = [...resume.projects]; u[i] = { ...u[i], description: e.target.value }; updateField("projects", u); }}
            className="w-full text-xs text-slate-500 bg-transparent border border-dashed border-slate-100 focus:border-teal-300 outline-none resize-none rounded p-1 mt-1" />
          {/* ✅ Technologies now editable */}
          <div className="flex flex-wrap gap-1 mt-2">
            {proj.technologies.map((tech, j) => (
              <input key={j} type="text" value={tech}
                onChange={(e) => {
                  const u = [...resume.projects];
                  const techs = [...u[i].technologies];
                  techs[j] = e.target.value;
                  u[i] = { ...u[i], technologies: techs };
                  updateField("projects", u);
                }}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 focus:border-teal-400 outline-none w-20" />
            ))}
            <button onClick={() => {
              const u = [...resume.projects];
              u[i] = { ...u[i], technologies: [...u[i].technologies, "Tech"] };
              updateField("projects", u);
            }} className="text-xs text-slate-400 border border-dashed border-slate-300 px-2 py-0.5 rounded hover:bg-slate-50">+</button>
          </div>
          <button onClick={() => { const u = [...resume.projects]; u.splice(i, 1); updateField("projects", u); }}
            className="text-xs text-red-400 hover:text-red-600 mt-1">✕ Remove</button>
        </div>
      ))}
      <button onClick={() => updateField("projects", [...resume.projects, { title: "New Project", description: "Project description...", technologies: ["Tech"] }])}
        className="text-xs text-teal-600 border border-dashed border-teal-400 px-3 py-1 rounded hover:bg-teal-50 mt-1">+ Add Project</button>
    </section>
  );
}

function Footer() {
  return (
    <div className="bg-slate-800 text-center py-2 text-xs text-slate-500 tracking-widest uppercase">
      2026 ATS-Optimized Format · AI Cloud Resume Optimizer
    </div>
  );
}