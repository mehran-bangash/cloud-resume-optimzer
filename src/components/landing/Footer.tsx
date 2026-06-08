export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center text-xs font-bold text-white">
            AI
          </div>
          <span className="text-slate-400 text-sm">
            ResumeAI · 2026 ATS-Optimized Format
          </span>
        </div>
        <p className="text-slate-600 text-xs">
          Built with Next.js · Cloudflare Workers AI · Deployed on Vercel
        </p>
      </div>
    </footer>
  );
}