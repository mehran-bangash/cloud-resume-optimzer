const FEATURES = [
  {
    icon: "🤖",
    title: "AI Job Description Matching",
    desc: "Paste any job posting. AI rewrites your entire CV — title, summary, skills, experience — to match the exact keywords recruiters search for.",
    badge: "Most used feature",
  },
  {
    icon: "📊",
    title: "Real ATS Score",
    desc: "Get an honest ATS compatibility score 0-100. If your score is below 78, AI automatically rewrites your CV until it passes.",
    badge: "Instant feedback",
  },
  {
    icon: "✏️",
    title: "Fully Editable CV",
    desc: "Every field is directly editable. Click any text to change it. Changes reflect live in the preview.",
    badge: "No forms needed",
  },
  {
    icon: "🎨",
    title: "3 Professional Templates",
    desc: "Switch between Modern, Minimalist, and Creative templates instantly. All ATS-friendly and 2026 formatted.",
    badge: "A4 ready",
  },
  {
    icon: "📄",
    title: "PDF Download",
    desc: "Download your optimized CV as a clean A4 PDF with one click. Ready to send to any employer.",
    badge: "Print-perfect",
  },
  {
    icon: "☁️",
    title: "Cloud-Native & Fast",
    desc: "Built on Cloudflare edge network. Your CV is processed in the data centre closest to you — never slow.",
    badge: "Serverless",
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
            className="bg-slate-900 border border-slate-800 hover:border-teal-500/30 rounded-xl p-6 transition-all"
          >
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="text-white font-semibold text-base mb-1">{f.title}</h3>
            <span className="inline-block text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full mb-3">
              {f.badge}
            </span>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}