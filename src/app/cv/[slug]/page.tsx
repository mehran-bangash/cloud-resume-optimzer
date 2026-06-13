

import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabaseAdmin
    .from("shared_cvs")
    .select("resume_data")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "CV Not Found" };

  const resume = data.resume_data as any;
  return {
    title: `${resume.fullName} — ${resume.title}`,
    description: resume.aboutMe?.slice(0, 160),
  };
}

export default async function SharedCVPage({ params }: Props) {
  // Increment view count
  const { data } = await supabaseAdmin
    .from("shared_cvs")
    .select("resume_data, template, view_count")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!data) notFound();

  await supabaseAdmin
    .from("shared_cvs")
    .update({ view_count: (data.view_count ?? 0) + 1 })
    .eq("slug", params.slug);

  const resume = data.resume_data as any;
  const template = data.template ?? "modern";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 16px" }}>
      {/* Top bar */}
      <div style={{ maxWidth: "800px", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", background: "#14B8A6", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#fff" }}>AI</div>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Shared via ResumeAI</span>
        </div>
        <a href="/" style={{ fontSize: "12px", background: "#14B8A6", color: "#fff", padding: "6px 14px", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>
          Create my CV →
        </a>
      </div>

      {/* CV Card */}
      <div style={{ maxWidth: "800px", margin: "0 auto", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "sans-serif" }}>

        {/* Header */}
        <div style={{ background: template === "creative" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "#1e293b", padding: "32px", color: "#fff" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 4px", color: "#fff" }}>{resume.fullName}</h1>
          <p style={{ fontSize: "16px", color: template === "creative" ? "#c4b5fd" : "#14B8A6", margin: "0 0 16px" }}>{resume.title}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", color: template === "creative" ? "#ddd6fe" : "#94a3b8" }}>
            {resume.email && <span>✉ {resume.email}</span>}
            {resume.phone && <span>📱 {resume.phone}</span>}
            {resume.location && <span>📍 {resume.location}</span>}
            {resume.linkedin && <a href={`https://${resume.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: "#14B8A6" }}>🔗 LinkedIn</a>}
            {resume.github && <a href={`https://${resume.github}`} target="_blank" rel="noopener noreferrer" style={{ color: "#14B8A6" }}>💻 GitHub</a>}
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", fontFamily: "sans-serif" }}>
          {/* Left */}
          <div style={{ background: "#f8fafc", padding: "24px", borderRight: "1px solid #e2e8f0" }}>
            {/* Skills */}
            {resume.skills?.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Skills</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {resume.skills.map((skill: string, i: number) => (
                    <span key={i} style={{ fontSize: "11px", background: "#e0f2fe", color: "#0369a1", padding: "3px 8px", borderRadius: "20px", fontWeight: 500 }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Education */}
            {resume.education?.length > 0 && (
              <div>
                <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Education</h3>
                {resume.education.map((edu: any, i: number) => (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", margin: 0 }}>{edu.degree}</p>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0" }}>{edu.institution}</p>
                    <p style={{ fontSize: "11px", color: "#14B8A6", margin: 0 }}>{edu.year}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div style={{ padding: "24px" }}>
            {resume.aboutMe && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Summary</h3>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7, margin: 0 }}>{resume.aboutMe}</p>
              </div>
            )}
            {resume.experience?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Experience</h3>
                {resume.experience.map((exp: any, i: number) => (
                  <div key={i} style={{ marginBottom: "16px", paddingLeft: "12px", borderLeft: "2px solid #14B8A6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "4px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", margin: 0 }}>{exp.role}</p>
                      <p style={{ fontSize: "11px", color: "#14B8A6", margin: 0 }}>{exp.duration}</p>
                    </div>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 6px" }}>{exp.company}</p>
                    <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.6, margin: 0 }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
            {resume.projects?.length > 0 && (
              <div>
                <h3 style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Projects</h3>
                {resume.projects.map((proj: any, i: number) => (
                  <div key={i} style={{ marginBottom: "14px", paddingLeft: "12px", borderLeft: "2px solid #e2e8f0" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>{proj.title}</p>
                    <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.6, margin: "0 0 6px" }}>{proj.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {proj.technologies?.map((tech: string, j: number) => (
                        <span key={j} style={{ fontSize: "11px", background: "#f1f5f9", color: "#64748b", padding: "2px 8px", borderRadius: "4px" }}>{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#1e293b", padding: "12px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "#475569", margin: 0 }}>
            Created with <a href="/" style={{ color: "#14B8A6", textDecoration: "none" }}>ResumeAI</a> · 2026 ATS-Optimized Format
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: "800px", margin: "20px auto", textAlign: "center" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#0f172a", color: "#14B8A6", padding: "10px 20px", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: 600, border: "1px solid #1e293b" }}>
          Build your own ATS-ready CV →
        </a>
      </div>
    </div>
  );
}