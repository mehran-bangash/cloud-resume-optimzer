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
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null); // Added this missing line!

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
      // Calling your live Cloudflare Worker
      const response = await fetch("https://backend-api.221029.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        throw new Error("Failed to optimize portfolio via AI backend.");
      }

      const data = await response.json();
      
      // The Cloudflare AI returns the optimized fields wrapped inside data.optimized
      console.log("AI Optimized Output:", data.optimized);
      
      setLiveUrl(`https://cloud-resume-optimzer.vercel.app/preview/${resume.fullName.toLowerCase().replace(/\s+/g, '-')}`);
    } catch (error) {
      console.error("Error generating portfolio:", error);
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