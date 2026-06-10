import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Cloud Resume Optimizer — Free ATS Resume Builder 2026",
  description:
    "Build, optimize, and score your resume with AI in seconds. Get ATS scores above 90, match any job description, and download a professional PDF. Free — no credit card required.",
  keywords: [
    "resume builder", "ATS resume", "AI resume optimizer",
    "free resume builder 2026", "ATS score checker",
    "CV builder", "job application", "resume optimizer",
    "cover letter generator", "resume template",
  ],
  authors: [{ name: "ResumeAI" }],
  creator: "ResumeAI",
  openGraph: {
    title: "AI Cloud Resume Optimizer — Free ATS Resume Builder",
    description:
      "Paste any job description. AI rewrites your CV to match — skills, experience, and summary. ATS score included. Free.",
    type: "website",
    locale: "en_US",
    siteName: "ResumeAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Cloud Resume Optimizer",
    description: "Build ATS-ready resumes with AI. Free, instant, no signup required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}