"use client";
import Link from "next/link";

const FREE_FEATURES = [
  "3 AI optimizations per month",
  "1 CV template",
  "ATS score checker",
  "PDF download",
  "Keyword gap analysis",
  "Upload & parse existing CV",
];

const PRO_FEATURES = [
  "Unlimited AI optimizations",
  "All 3 CV templates",
  "AI cover letter generator",
  "Multiple CV versions (up to 10)",
  "LinkedIn profile import",
  "Share CV as public link",
  "Job application tracker",
  "Priority AI processing",
  "Early access to new features",
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f1f5f9", fontFamily: "sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1e293b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f172a" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "28px", height: "28px", background: "#14B8A6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#fff" }}>AI</div>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>ResumeAI</span>
        </Link>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none" }}>← Back</Link>
          <Link href="/" style={{ fontSize: "13px", background: "#14B8A6", color: "#fff", padding: "7px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>Try Free</Link>
        </div>
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#14B8A610", border: "1px solid #14B8A630", color: "#14B8A6", fontSize: "12px", fontWeight: 600, padding: "5px 14px", borderRadius: "20px", marginBottom: "20px" }}>
            Simple, transparent pricing
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px", lineHeight: 1.2 }}>
            Start free.<br />Upgrade when you need more.
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            No credit card required to start. Free plan includes everything you need to get hired.
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "60px" }}>

          {/* Free */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Free</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: "#f1f5f9" }}>$0</span>
                <span style={{ fontSize: "14px", color: "#64748b" }}>/month</span>
              </div>
              <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>Forever free. No credit card needed.</p>
            </div>
            <div style={{ flex: 1, marginBottom: "28px" }}>
              {FREE_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ width: "18px", height: "18px", background: "#14B8A615", border: "1px solid #14B8A630", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#14B8A6", flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{f}</p>
                </div>
              ))}
            </div>
            <Link href="/" style={{ display: "block", background: "#1e293b", color: "#f1f5f9", textAlign: "center", padding: "13px", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: 600, border: "1px solid #334155" }}>
              Get started free →
            </Link>
          </div>

          {/* Pro */}
          <div style={{ background: "#0f172a", border: "2px solid #14B8A6", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column", position: "relative" }}>
            {/* Popular badge */}
            <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#14B8A6", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 16px", borderRadius: "20px", whiteSpace: "nowrap", boxShadow: "0 4px 12px #14B8A640" }}>
              MOST POPULAR
            </div>
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Pro</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: "#f1f5f9" }}>$9</span>
                <span style={{ fontSize: "14px", color: "#64748b" }}>/month</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#64748b", textDecoration: "line-through" }}>$19/mo</span>
                <span style={{ fontSize: "11px", background: "#14B8A620", color: "#14B8A6", padding: "2px 8px", borderRadius: "8px", fontWeight: 600 }}>Save 53%</span>
              </div>
              <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>Unlimited everything. Cancel anytime.</p>
            </div>
            <div style={{ flex: 1, marginBottom: "28px" }}>
              {PRO_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ width: "18px", height: "18px", background: "#14B8A620", border: "1px solid #14B8A650", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#14B8A6", flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: "13px", color: "#cbd5e1", margin: 0 }}>{f}</p>
                </div>
              ))}
            </div>
            <button
              style={{ display: "block", width: "100%", background: "#14B8A6", color: "#fff", textAlign: "center", padding: "14px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 16px #14B8A640" }}
              onClick={() => alert("Payment integration coming soon! You will be notified when Pro launches.")}
            >
              Upgrade to Pro →
            </button>
            <p style={{ fontSize: "11px", color: "#475569", textAlign: "center", margin: "10px 0 0" }}>Cancel anytime · Secure payment</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f1f5f9", textAlign: "center", marginBottom: "32px" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { q: "Is the free plan really free forever?", a: "Yes. No credit card required, no trial period. The free plan gives you 3 AI optimizations per month indefinitely." },
              { q: "What counts as an optimization?", a: "Each time you click 'Analyze & Optimize CV' it uses one optimization credit. ATS score checks, keyword analysis, and LinkedIn import do not count." },
              { q: "Can I cancel Pro anytime?", a: "Yes. Cancel anytime from your account settings. You keep Pro access until the end of your billing period." },
              { q: "Is my CV data private?", a: "Yes. Your CV data is encrypted and stored securely in our database. We never share or sell your data. You can delete your account at any time." },
              { q: "When will Pro launch?", a: "Pro is coming soon. Sign up free now — you will be the first to know and get a special early-bird discount." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "18px 20px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9", margin: "0 0 8px" }}>{item.q}</p>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "60px", padding: "40px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px" }}>
            Ready to get more interviews?
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px" }}>
            Start free today. No credit card required.
          </p>
          <Link href="/" style={{ display: "inline-block", background: "#14B8A6", color: "#fff", padding: "14px 32px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: 700 }}>
            Start for free →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e293b", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "#334155", margin: 0 }}>
          ResumeAI · Built with Next.js · Cloudflare Workers AI · Deployed on Vercel
        </p>
      </footer>
    </div>
  );
}