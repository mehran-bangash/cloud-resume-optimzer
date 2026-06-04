"use client";


import { useState } from "react";
import { ResumeModel, Project, Experience } from "@/models/resume";

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
  const [resume, setResume] = useState<ResumeModel>(starterTemplate);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [optimizedResume, setOptimizedResume] = useState<ResumeModel | null>(starterTemplate);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const optimizeResumeWithAI = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
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
        const errorDetails = (await response.json().catch(() => ({}))) as Record<string, any>;
        throw new Error(errorDetails.details || errorDetails.error || `Edge network status: ${response.status}`);
      }

      const data = (await response.json()) as Record<string, any>;
      
      if (data.success && data.optimized) {
        const parsedResume = typeof data.optimized === "string" 
          ? JSON.parse(data.optimized) 
          : data.optimized;
          
        const fullyCompiledResume: ResumeModel = {
          ...starterTemplate,
          ...parsedResume,
          fullName: resume.fullName,
          email: resume.email,
          phone: resume.phone,
          location: resume.location,
        };

        setOptimizedResume(fullyCompiledResume);
        
        if (data.warning) {
          console.warn("SaaS Fallback Warning:", data.warning);
        }
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