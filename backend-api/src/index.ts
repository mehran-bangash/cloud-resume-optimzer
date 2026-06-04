export interface Project {
  title: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface ResumeModel {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  aboutMe: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
}

export interface RequestPayload {
  resume: ResumeModel;
  jobDescription?: string;
}

export interface Env {
  AI: any;
}

// Strictly declared JSON schema configuration for hardware enforcement
const resumeSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    aboutMe: { type: "string" },
    skills: {
      type: "array",
      items: { type: "string" }
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          technologies: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["title", "description", "technologies"]
      }
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          company: { type: "string" },
          duration: { type: "string" },
          description: { type: "string" }
        },
        required: ["role", "company", "duration", "description"]
      }
    }
  },
  required: ["title", "aboutMe", "skills", "projects", "experience"]
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let resume: ResumeModel | undefined;

    try {
      const payload: RequestPayload = await request.json();
      
      if (!payload || !payload.resume) {
        return new Response(
          JSON.stringify({ error: "Missing resume payload." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      resume = payload.resume;
      const jobDescription = payload.jobDescription ? payload.jobDescription.trim() : "";

      // Quick guard check
      if (!resume.fullName || !resume.email) {
        return new Response(
          JSON.stringify({ error: "Please fill in at least your Name and Email." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let systemPrompt = "";
      let userQuery = "";

      if (jobDescription) {
        systemPrompt = "You are an elite ATS optimizer. Analyze the target Job Description and rewrite the resume's projects and history to perfectly match the target keywords and requirements using strong action verbs.";
        userQuery = `Target JD: "${jobDescription}" \nCandidate Profile: Title: "${resume.title}", Bio: "${resume.aboutMe}", Skills: ${JSON.stringify(resume.skills)}, Projects: ${JSON.stringify(resume.projects)}, Experience: ${JSON.stringify(resume.experience)}`;
      } else {
        systemPrompt = "You are a Professional Tech Recruiter. Take the raw developer inputs and optimize them with active phrasing and key results for a portfolio website.";
        userQuery = `Candidate Profile: Title: "${resume.title}", Bio: "${resume.aboutMe}", Skills: ${JSON.stringify(resume.skills)}, Projects: ${JSON.stringify(resume.projects)}, Experience: ${JSON.stringify(resume.experience)}`;
      }

      // Execute AI generation with strict physical schema constraint
      const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8-fast", {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "OptimizedResume",
            schema: resumeSchema
          }
        }
      });

      // The hardware constraint guarantees this response is a perfectly formatted, parseable string!
      const parsedData = JSON.parse(aiResponse.response);

      return new Response(
        JSON.stringify({ success: true, optimized: parsedData }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (error: any) {
      console.warn("AI optimization pipeline failed, falling back safely:", error);
      
      const fallbackData = resume ? {
        title: resume.title || "Software Developer",
        aboutMe: resume.aboutMe || "Experienced developer focusing on high-impact scalable services.",
        skills: resume.skills && resume.skills.length > 0 ? resume.skills : ["Software Engineering"],
        projects: resume.projects || [],
        experience: resume.experience || []
      } : {
        title: "Developer",
        aboutMe: "Technical Professional",
        skills: [],
        projects: [],
        experience: []
      };

      return new Response(
        JSON.stringify({ 
          success: true, 
          optimized: fallbackData, 
          warning: "Optimization bypass active."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }
};