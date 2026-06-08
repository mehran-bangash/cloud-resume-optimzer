"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  aboutMe: "Results-driven Full Stack Engineer with 5+ years building scalable cloud-native applications.",
  skills: ["React", "Next.js", "TypeScript", "Node.js"],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "CloudScale Inc.",
      duration: "Jan 2022 – Present",
      description: "Led migration to microservices.",
    },
  ],
  projects: [
    {
      title: "AI Resume Optimizer",
      description: "SaaS platform.",
      technologies: ["Next.js", "TypeScript"],
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
  const { data: session } = useSession();
  const [resume, setResume] = useState<ResumeModel>(DEFAULT_RESUME);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingATS, setIsCheckingATS] = useState(false);
  const [atsMessage, setAtsMessage] = useState<string | null>(null);

  // Sync Google Session name and email with the default resume values if they haven't been edited
  useEffect(() => {
    if (
      session?.user &&
      resume.fullName === DEFAULT_RESUME.fullName &&
      resume.email === DEFAULT_RESUME.email
    ) {
      setResume((prev) => ({
        ...prev,
        fullName: session.user?.name ?? prev.fullName,
        email: session.user?.email ?? prev.email,
      }));
    }
  }, [session, resume.fullName, resume.email]);

  // Auto-load saved resume ONLY on first mount
  useEffect(() => {
    let cancelled = false;
    const loadSavedResume = async () => {
      try {
        const res = await fetch("/api/resume/save");
        if (!res.ok) return;
        const data = await res.json() as any;
        if (!cancelled && data.resume) {
          setResume(data.resume as ResumeModel);
        }
      } catch (e) {
        // Silent fail — just use default resume
      }
    };
    loadSavedResume();
    return () => { cancelled = true; };
  }, []);

  // Auto-save with status events
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json() as any;
        if (!sessionData?.user?.email) return;

        window.dispatchEvent(new Event("cv:saving"));
        await fetch("/api/resume/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData: resume }),
        });
        window.dispatchEvent(new Event("cv:saved"));
      } catch (e) {
        // silent fail
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [resume]);

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
      const data = await res.json() as any;
      if (data.error) {
        setAtsMessage(`❌ Backend error: ${data.error}`);
        return;
      }
      if (data.optimized) {
        setResume((prev) => ({
          ...(data.optimized as ResumeModel),
          atsScore: data.atsScore ?? prev.atsScore,
        }));
        setAtsMessage(`✅ CV optimized! ATS Score: ${data.atsScore ?? "??"}/100. ${data.changes ?? ""}`);
      } else {
        setAtsMessage(`⚠️ Unexpected AI response: ${JSON.stringify(data).slice(0, 120)}`);
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
      const data = await res.json() as any;
      if (data.error) {
        setAtsMessage(`❌ Backend error: ${data.error}`);
        return;
      }
      const score: number = typeof data.score === "number" ? data.score : 0;
      setResume((p) => ({ ...p, atsScore: score }));
      if (score >= 78) {
        setAtsMessage(`✅ ATS Score: ${score}/100 — ${data.feedback ?? "Already great!"}`);
      } else {
        if (data.improved) {
          setResume({ ...(data.improved as ResumeModel), atsScore: data.newScore ?? score });
          setAtsMessage(`🔄 Score was ${score}/100. AI improved your CV to ${data.newScore ?? score}/100.`);
        } else {
          setAtsMessage(`⚠️ ATS Score: ${score}/100. ${data.feedback ?? "Consider improving skills."}`);
        }
      }
    } catch (e: any) {
      setAtsMessage(`❌ Network error: ${e.message}`);
    } finally {
      setIsCheckingATS(false);
    }
  };

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