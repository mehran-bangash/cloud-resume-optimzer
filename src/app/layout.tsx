import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Cloud Resume Optimizer — 2026 ATS-Ready",
  description: "Build, optimize, and score your resume with AI. Get hired faster with our ATS-optimized 2026 resume builder powered by Cloudflare AI.",
  keywords: ["resume builder", "ATS optimizer", "AI resume", "job application", "CV builder"],
  openGraph: {
    title: "AI Cloud Resume Optimizer",
    description: "Build ATS-ready resumes with AI in seconds.",
    type: "website",
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