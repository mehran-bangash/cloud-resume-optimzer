const STEPS = [
  {
    step: "01",
    title: "Edit your CV",
    desc: "Start with our pre-built 2026 template. Edit any field directly — name, experience, skills, projects.",
  },
  {
    step: "02",
    title: "Paste job description",
    desc: "Copy any job posting from LinkedIn, Indeed, or any job board. Paste it into the job description box.",
  },
  {
    step: "03",
    title: "Get optimized instantly",
    desc: "Click Optimize. AI rewrites your entire CV to match the job in seconds. Download as PDF and apply.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-900 py-20 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
          <p className="text-slate-400">
            From blank page to interview-ready in under 2 minutes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.step}>
              <div className="text-5xl font-black text-slate-800 mb-4">{s.step}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}