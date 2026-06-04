"use client";
import { useState } from "react";
import { ResumeModel } from "@/models/resume";

export type CVTemplate = "modern" | "minimalist" | "creative";

const DEFAULT_RESUME: ResumeModel = {
  fullName: "Alex Morgan",
  email: "alex.morgan@gmail.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexmorgan",
  github: "github.com/alexmorgan",
  title: "Senior Full Stack Engineer",
  aboutMe:
    "Results-driven Full Stack Engineer with 5+ years building scalable cloud-native applications. Proven track record of reducing infrastructure costs by 40% and shipping products used by 500K+ users. Passionate about clean architecture, CI/CD, and developer experience.",
  skills: [
    "React", "Next.js", "TypeScript", "Node.js",
    "Python", "AWS", "Docker", "PostgreSQL",
    "GraphQL", "CI/CD", "Terraform", "Redis",
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "CloudScale Inc.",
      duration: "Jan 2022 – Present",
      description:
        "Led migration of monolithic app to microservices on AWS, reducing latency by 60%. Mentored 4 junior engineers and introduced automated testing achieving 92% code coverage.",
    },
    {
      role: "Full Stack Developer",
      company: "DevHub Solutions",
      duration: "Mar 2019 – Dec 2021",
      description:
        "Built real-time collaboration features using WebSockets and React, increasing user engagement by 35%. Optimized PostgreSQL queries reducing load times by 50%.",
    },
  ],
  projects: [
    {
      title: "AI Resume Optimizer",
      description:
        "SaaS platform using Cloudflare Workers AI to parse and optimize resumes against job descriptions. 2K+ active users.",
      technologies: ["Next.js", "Cloudflare Workers", "Llama 3.1", "TypeScript"],
    },
    {
      title: "CloudMonitor Dashboard",
      description:
        "Real-time AWS cost monitoring dashboard with anomaly detection and Slack alerts.",
      technologies: ["React", "AWS Lambda", "Python", "Terraform"],
    },
  ],
  education: [
    {
      degree: "B.Sc. Computer Science",
      institution: "University of California, Berkeley",
      year: "2019",
    },
  ],
  atsScore: 82,
};

export function useResumeForm() {
  const [resume, setResume] = useState<ResumeModel>(DEFAULT_RESUME);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingATS, setIsCheckingATS] = useState(false);
  const [atsMessage, setAtsMessage] = useState<string | null>(null);

  const updateField = (field: keyof ResumeModel, value: any) =>
    setResume((p) => ({ ...p, [field]: value }));

  const optimize = async () => {
    if (!jobDescription.trim()) {
      setAtsMessage("⚠️ Please paste a job description first.");
      return;
    }
    setIsGenerating(true);
    setAtsMessage("🔄 Sending your CV to Cloudflare AI...");
    try {
      const res = await fetch("https://backend-api.221029.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = (await res.json()) as any;
      if (data.error) {
        setAtsMessage(`❌ Backend error: ${data.error}`);
        return;
      }
      if (data.optimized) {
        setResume((prev) => ({
          ...(data.optimized as ResumeModel),
          atsScore: data.atsScore ?? prev.atsScore,
        }));
        setAtsMessage(
          `✅ CV optimized! ATS Score: ${data.atsScore ?? "??"}/100. ${data.changes ?? ""}`
        );
      } else {
        setAtsMessage(
          `⚠️ Unexpected AI response: ${JSON.stringify(data).slice(0, 120)}`
        );
      }
    } catch (e: any) {
      setAtsMessage(`❌ Network error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const checkATS = async () => {
    setIsCheckingATS(true);
    setAtsMessage("🔄 Analyzing your CV with AI...");
    try {
      const res = await fetch("https://backend-api.221029.workers.dev/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = (await res.json()) as any;
      if (data.error) {
        setAtsMessage(`❌ Backend error: ${data.error}`);
        return;
      }
      const score: number = typeof data.score === "number" ? data.score : 0;
      setResume((p) => ({ ...p, atsScore: score }));
      if (score >= 78) {
        setAtsMessage(
          `✅ ATS Score: ${score}/100 — ${data.feedback ?? "Already great!"}`
        );
      } else {
        if (data.improved) {
          setResume({
            ...(data.improved as ResumeModel),
            atsScore: data.newScore ?? score,
          });
          setAtsMessage(
            `🔄 Score was ${score}/100. AI improved your CV to ${data.newScore ?? score}/100. ${data.feedback ?? ""}`
          );
        } else {
          setAtsMessage(
            `⚠️ ATS Score: ${score}/100. ${data.feedback ?? "Consider improving skills and summary."}`
          );
        }
      }
    } catch (e: any) {
      setAtsMessage(`❌ Network error: ${e.message}`);
    } finally {
      setIsCheckingATS(false);
    }
  };

  // ✅ THIS WAS MISSING — return all values
  return {
    resume,
    jobDescription,
    isGenerating,
    isCheckingATS,
    atsMessage,
    setAtsMessage,
    selectedTemplate,
    setSelectedTemplate,
    setJobDescription,
    updateField,
    optimize,
    checkATS,
  };
}