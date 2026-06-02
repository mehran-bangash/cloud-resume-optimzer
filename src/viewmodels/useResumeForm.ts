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

  // Triggered when clicking "Deploy Portfolio to CDN" (currently simulated)
  const generatePortfolio = async () => {
    setIsGenerating(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setIsGenerating(false);
      setLiveUrl("https://example.com/your-portfolio-preview");
    }, 2000);
  };

  return {
    resume,
    isGenerating,
    liveUrl,
    updateField,
    addProject,
    updateProject,
    addExperience,
    updateExperience,
    generatePortfolio,
  };
}