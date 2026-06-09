"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { ResumeModel } from "@/models/resume";
import { KeywordGapResult } from "@/lib/types";

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
  const [keywordGap, setKeywordGap] = useState<KeywordGapResult | null>(null);
  const [isAnalyzingKeywords, setIsAnalyzingKeywords] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const keywordDebounceRef = useRef<NodeJS.Timeout | null>(null);

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

  // Add a single keyword to CV skills
  const addKeyword = (keyword: string) => {
    setResume((prev) => {
      const exists = prev.skills.some(
        (s) => s.toLowerCase() === keyword.toLowerCase()
      );
      if (exists) return prev;
      return { ...prev, skills: [...prev.skills, keyword] };
    });
  };

  // Add all missing keywords at once
  const addAllKeywords = (keywords: string[]) => {
    setResume((prev) => {
      const existingLower = prev.skills.map((s) => s.toLowerCase());
      const newSkills = keywords.filter(
        (kw) => !existingLower.includes(kw.toLowerCase())
      );
      if (newSkills.length === 0) return prev;
      return { ...prev, skills: [...prev.skills, ...newSkills] };
    });
  };

  const handleParsedCV = (parsed: any) => {
    // Merge parsed data with defaults for any missing fields
    setResume((prev) => ({
      ...prev,
      fullName:   parsed.fullName   || prev.fullName,
      email:      parsed.email      || prev.email,
      phone:      parsed.phone      || prev.phone,
      location:   parsed.location   || prev.location,
      linkedin:   parsed.linkedin   || prev.linkedin,
      github:     parsed.github     || prev.github,
      title:      parsed.title      || prev.title,
      aboutMe:    parsed.aboutMe    || prev.aboutMe,
      skills:     parsed.skills?.length       ? parsed.skills     : prev.skills,
      experience: parsed.experience?.length ? parsed.experience : prev.experience,
      projects:   parsed.projects?.length   ? parsed.projects   : prev.projects,
      education:  parsed.education?.length  ? parsed.education  : prev.education,
    }));
    setAtsMessage("✅ CV uploaded and parsed! Review your details and optimize.");
  };

  const analyzeKeywords = async (jd: string, currentResume: ResumeModel) => {
    if (!jd.trim()) return;
    setIsAnalyzingKeywords(true);
    try {
      const res = await fetch("https://backend-api.221029.workers.dev/keyword-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: currentResume, jobDescription: jd }),
      });
      const data = await res.json() as any;
      if (!data.error) {
        setKeywordGap(data as KeywordGapResult);
      }
    } catch (e) {
      console.error("Keyword gap error:", e);
    } finally {
      setIsAnalyzingKeywords(false);
    }
  };

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
        await analyzeKeywords(jobDescription, data.optimized as ResumeModel);
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

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    // Auto-analyze keywords 1.5s after user stops typing
    if (keywordDebounceRef.current) clearTimeout(keywordDebounceRef.current);
    keywordDebounceRef.current = setTimeout(() => {
      if (value.trim().length > 50) {
        analyzeKeywords(value, resume);
      }
    }, 1500);
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
    setJobDescription: handleJobDescriptionChange,
    updateField,
    optimize,
    checkATS,
    keywordGap,
    isAnalyzingKeywords,
    addKeyword,
    addAllKeywords,
    isUploadingCV,
    setIsUploadingCV,
    handleParsedCV,
  };
}