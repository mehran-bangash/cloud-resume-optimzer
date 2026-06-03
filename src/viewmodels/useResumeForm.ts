"use client";

import { useState } from "react";
import { ResumeModel, Project, Experience } from "@/models/resume";

export function useResumeForm() {
  const [resume, setResume] = useState<ResumeModel>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    aboutMe: "",
    skills: [],
    projects: [],
    experience: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  // Updates any top-level simple text fields (like fullName, title, email, aboutMe)
  const updateField = (field: keyof ResumeModel, value: any) => {
    setResume((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Adds a blank project item
  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", technologies: [] }],
    }));
  };

  // Updates specific fields of a project based on its array index
  const updateProject = (index: number, field: keyof Project, value: any) => {
    setResume((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value,
      };
      return {
        ...prev,
        projects: updatedProjects,
      };
    });
  };

  // Adds a blank experience item
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, { role: "", company: "", duration: "", description: "" }],
    }));
  };

  // Updates specific fields of an experience item based on its array index
  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setResume((prev) => {
      const updatedExp = [...prev.experience];
      updatedExp[index] = {
        ...updatedExp[index],
        [field]: value,
      };
      return {
        ...prev,
        experience: updatedExp,
      };
    });
  };

  // Submits form data to your live Cloudflare AI Backend
  const generatePortfolio = async () => {
    setIsGenerating(true);
    setLiveUrl(null);
    setGeneratedHtml(null);
    try {
      const response = await fetch("https://backend-api.221029.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        // Cast as any to bypass the TypeScript 'unknown' check
        const errorData = (await response.json().catch(() => ({}))) as any;
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      // Cast as any to bypass the TypeScript 'unknown' check
      const data = (await response.json()) as any;
      console.log("AI Optimized Output:", data.optimized);
      setLiveUrl(`https://cloud-resume-optimzer.vercel.app/preview/${resume.fullName.toLowerCase().replace(/\s+/g, '-')}`);
    } catch (error: any) {
      console.error("CRITICAL ERROR:", error.message || error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    resume,
    isGenerating,
    liveUrl,
    generatedHtml,
    updateField,
    addProject,
    updateProject,
    addExperience,
    updateExperience,
    generatePortfolio,
  };
}