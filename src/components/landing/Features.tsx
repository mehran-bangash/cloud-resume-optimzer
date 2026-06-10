const FEATURES = [
  {
    icon: "🤖",
    title: "AI Job Description Matching",
    desc: "Paste any job posting. AI rewrites your entire CV — title, summary, skills, experience — to match the exact keywords recruiters search for.",
    badge: "Most used feature",
    isNew: false,
  },
  {
    icon: "🔍",
    title: "Keyword Gap Analysis",
    desc: "See exactly which keywords from the job description are missing from your CV. Missing ones shown in red — add them instantly with one click.",
    badge: "New in Phase 2",
    isNew: true,
  },
  {
    icon: "📊",
    title: "Real ATS Score",
    desc: "Get an honest ATS compatibility score 0-100. If your score is below 78, AI automatically rewrites your CV until it passes.",
    badge: "Instant feedback",
    isNew: false,
  },
  {
    icon: "✏️",
    title: "Fully Editable CV",
    desc: "Every field is directly editable. Click any text to change it. Changes reflect live in the preview.",
    badge: "No forms needed",
    isNew: false,
  },
  {
    icon: "🎨",
    title: "3 Professional Templates",
    desc: "Switch between Modern, Minimalist, and Creative templates instantly. All ATS-friendly and 2026 formatted.",
    badge: "A4 ready",
    isNew: false,
  },
  {
    icon: "📄",
    title: "PDF Download",
    desc: "Download your optimized CV as a clean A4 PDF with one click. Ready to send to any employer.",
    badge: "Print-perfect",
    isNew: false,
  },
  {
  icon: "🔗",
  title: "LinkedIn Import",
  desc: "Export your LinkedIn profile as PDF and upload it. AI reads your entire work history, skills, and education and fills all CV fields in seconds.",
  badge: "New in Phase 2",
  isNew: true,
},
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-bold text-white mb-4">
          Everything you need to get hired
        </h2>
        <p className="text-slate-400">
          Built for 2026 job market — ATS-first, AI-powered, instant results
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={`bg-slate-900 border rounded-xl p-6 transition-all relative ${
              f.isNew
                ? "border-teal-500/30 hover:border-teal-500/60"
                : "border-slate-800 hover:border-slate-600"
            }`}
          >
            {f.isNew && (
              <div className="absolute -top-2.5 -right-2.5 bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg shadow-teal-500/30">
                NEW
              </div>
            )}
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="text-white font-semibold text-base mb-1">{f.title}</h3>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-3 ${
              f.isNew
                ? "text-teal-300 bg-teal-500/20"
                : "text-teal-400 bg-teal-500/10"
            }`}>
              {f.badge}
            </span>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}