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

  const updateField = (field: keyof ResumeModel, value: any) => {
    setResume((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", technologies: [] }],
    }));
  };

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

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, { role: "", company: "", duration: "", description: "" }],
    }));
  };

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
        const errorData = await response.json().catch(() => ({})) as Record<string, any>;
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json() as Record<string, any>;
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