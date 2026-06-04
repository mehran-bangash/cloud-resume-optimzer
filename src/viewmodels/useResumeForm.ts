"use client";

import { useState } from "react";
import { ResumeModel, Project, Experience } from "@/models/resume";

// Premium pre-filled default data so your SaaS dashboard feels alive instantly on load
const starterTemplate: ResumeModel = {
  fullName: "Mehran Ali",
  email: "mehran.ali@saasdev.io",
  phone: "+92 300 1234567",
  location: "Islamabad, Pakistan",
  title: "Lead Flutter & Cloud Architect",
  aboutMe: "Senior engineer focused on building robust mobile experiences and auto-scaling serverless cloud architectures.",
  skills: ["Flutter", "Dart", "TypeScript", "Next.js", "Cloudflare Workers", "AWS Lambda", "SaaS Architecture"],
  projects: [
    {
      title: "Serverless Resume Compiler",
      description: "An automated cloud engine compiling JSON resume contracts into responsive global CDNs with real-time visitor geolocations.",
      technologies: ["Next.js", "Cloudflare Edge", "Tailwind CSS"]
    },
    {
      title: "SaaS Multi-Tenant CRM",
      description: "Successfully scaled a real-time CRM platform handling over 50,000 active concurrent WebSocket subscriptions.",
      technologies: ["Flutter", "Node.js", "AWS DynamoDB"]
    }
  ],
  experience: [
    {
      role: "Lead Software Engineer",
      company: "CloudVibe Technologies",
      duration: "2024 - Present",
      description: "Architected modern multi-cloud pipelines reducing server overhead by 45% using serverless edge functions."
    },
    {
      role: "Flutter Developer",
      company: "SadaPay Inc.",
      duration: "2022 - 2024",
      description: "Spearheaded user onboarding screen optimizations, directly improving verification conversions by 18%."
    }
  ]
};

export type CVTemplate = "modern" | "minimalist" | "creative";

export function useResumeForm() {
  // Current raw form state edited by user
  const [resume, setResume] = useState<ResumeModel>(starterTemplate);
  
  // Job Description state for customized tailoring
  const [jobDescription, setJobDescription] = useState<string>("");
  
  // Storage for the AI-optimized resume payload
  const [optimizedResume, setOptimizedResume] = useState<ResumeModel | null>(starterTemplate);
  
  // Active CSS layout template selection
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>("modern");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update simple profile text fields
  const updateField = (field: keyof ResumeModel, value: any) => {
    setResume((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add blank project item
  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", technologies: [] }],
    }));
  };

  // Update specific fields of a project based on array index
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

  // Add blank experience item
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, { role: "", company: "", duration: "", description: "" }],
    }));
  };

  // Update specific fields of an experience item based on array index
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

  // Dispatches current resume data to the live Cloudflare AI endpoint
  const optimizeResumeWithAI = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      // Robust payload containing both raw resume and optional job description for tailored matchmaking
      const payload = {
        resume,
        jobDescription: jobDescription.trim() || undefined
      };

      const response = await fetch("https://backend-api.221029.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}));
        throw new Error(errorDetails.error || `Edge network status: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the clean, sanitized JSON returned from the Cloudflare Worker AI Llama model
      if (data.success && data.optimized) {
        const parsedResume = typeof data.optimized === "string" 
          ? JSON.parse(data.optimized) 
          : data.optimized;
          
        // Injecting fallback data for values not modified by AI (like contact details)
        const fullyCompiledResume: ResumeModel = {
          ...starterTemplate,
          ...parsedResume,
          fullName: resume.fullName,
          email: resume.email,
          phone: resume.phone,
          location: resume.location,
        };

        setOptimizedResume(fullyCompiledResume);
      } else {
        throw new Error("Invalid response format returned by cloud edge engine.");
      }
    } catch (err: any) {
      console.error("AI SaaS Optimization Crash:", err);
      setErrorMessage(err.message || "Failed to reach AI. Please check your credentials.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    resume,
    jobDescription,
    optimizedResume,
    selectedTemplate,
    isGenerating,
    errorMessage,
    setJobDescription,
    setSelectedTemplate,
    updateField,
    addProject,
    updateProject,
    addExperience,
    updateExperience,
    optimizeResumeWithAI,
  };
}