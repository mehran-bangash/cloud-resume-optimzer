"use client";

import { useState } from "react";
import { ResumeModel } from "@/models/resume";

export type CVTab = "draft" | "ai" | "audit";

export function useResumeForm() {
  const [resume, setResume] = useState<ResumeModel>({
    fullName: "", email: "", phone: "", location: "", title: "", aboutMe: "", skills: [], projects: [], experience: []
  });
  
  const [jobDescription, setJobDescription] = useState("");
  const [optimizedResume, setOptimizedResume] = useState<ResumeModel | null>(null);
  const [auditReport, setAuditReport] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateField = (field: keyof ResumeModel, value: any) => setResume(p => ({ ...p, [field]: value }));

  const runBackendProcess = async (mode: "audit" | "tailor") => {
    setIsGenerating(true);
    try {
      const res = await fetch("https://backend-api.221029.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, resume, jobDescription })
      });
      const data = await res.json() as any;
      if (mode === "tailor") setOptimizedResume(data.optimizedResume);
      else setAuditReport(data.auditReport);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return { resume, jobDescription, optimizedResume, auditReport, isGenerating, setJobDescription, updateField, runBackendProcess };
}