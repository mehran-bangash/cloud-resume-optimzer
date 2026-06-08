const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "SC",
    color: "bg-blue-500",
    text: "I had been applying for 3 months with no callbacks. I used ResumeAI to optimize my CV for a Google SWE role and got an interview within 4 days. The ATS score went from 61 to 94.",
    result: "Got interview in 4 days",
  },
  {
    name: "Ahmed Al-Rashidi",
    role: "Flutter Developer at Careem",
    avatar: "AA",
    color: "bg-teal-500",
    text: "The job description matching is insane. It rewrote my experience section to include Flutter, Dart, and Firebase keywords I had missed. My ATS score jumped from 58 to 91 in one click.",
    result: "ATS score: 58 → 91",
  },
  {
    name: "Priya Sharma",
    role: "Product Manager at Shopify",
    avatar: "PS",
    color: "bg-purple-500",
    text: "I was switching careers from engineering to PM. The AI rewrote my technical experience to highlight leadership and product thinking. Got 3 interviews in my first week of applying.",
    result: "3 interviews in one week",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-bold text-white mb-4">
          Real results from real users
        </h2>
        <p className="text-slate-400">
          Join thousands who landed jobs faster with AI-optimized resumes
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
              >
                {t.avatar}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-slate-500 text-xs">{t.role}</div>
              </div>
            </div>
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-amber-400 text-sm">★</span>
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1">
              "{t.text}"
            </p>
            <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-lg inline-block">
              ✓ {t.result}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}