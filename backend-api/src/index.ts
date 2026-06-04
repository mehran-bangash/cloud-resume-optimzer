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

/**
 * Robust JSON extraction utility.
 * Locates the outermost curly braces to isolate the pure JSON payload,
 * completely ignoring any conversational prefixes or markdown code block markers.
 */
function extractJSON(rawText: string): any {
  const cleanText = rawText.trim();
  
  const firstBrace = cleanText.indexOf("{");
  const lastBrace = cleanText.lastIndexOf("}");
  
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error(`Failed to locate structured JSON markers in raw AI output.`);
  }
  
  const jsonPayload = cleanText.substring(firstBrace, lastBrace + 1);
  return JSON.parse(jsonPayload);
}

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

    // Keep references ready for universal fallback
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

      const rawAbout = (resume.aboutMe || "").trim();
      const rawProjects = resume.projects || [];
      const rawExperience = resume.experience || [];
      const rawSkills = resume.skills || [];

      // SaaS Input Validation Guard (Check essentials only)
      if (!resume.fullName || !resume.email) {
        return new Response(
          JSON.stringify({ 
            error: "Please fill in at least your Full Name and Email before optimizing." 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let systemPrompt = "";
      let userQuery = "";

      if (jobDescription) {
        systemPrompt = `You are an elite, ATS-optimizing tech recruiter and career strategist.
        Your task is to analyze the user's raw resume against the provided Job Description (JD).
        Modify their resume to strategically highlight experiences and projects that align with the target role's key requirements.
        IMPORTANT: If any array input (projects, experience, or skills) is empty or has blank items, return an empty array [] for that property. Do not write warnings or make up content if none is provided.`;

        userQuery = `Compare this Candidate's Profile with this target Job Description and generate an ATS-optimized matched resume version.
        
        [Target Job Description]:
        "${jobDescription}"

        [Candidate Profile]:
        - Title: "${resume.title || ''}"
        - Bio: "${rawAbout}"
        - Skills: ${JSON.stringify(rawSkills)}
        - Projects: ${JSON.stringify(rawProjects)}
        - Experience: ${JSON.stringify(rawExperience)}

        Format the optimized response strictly as a single JSON object matching the exact structure below, without comments or markdown wrappers:
        {
          "title": "Optimized target title matched to JD",
          "aboutMe": "Professional summary optimized for the JD",
          "skills": ["Skill1", "Skill2"],
          "projects": [{"title": "title", "description": "optimized description incorporating JD terms", "technologies": ["tech"]}],
          "experience": [{"role": "role", "company": "company", "duration": "duration", "description": "optimized bullets highlighting JD requirements"}]
        }`;
      } else {
        systemPrompt = `You are a Principal Tech Recruiter.
        Rewrite raw developer inputs into professional, high-impact, action-oriented text with strong verbs and measurable results suitable for a world-class portfolio website.
        IMPORTANT: If any array input (projects, experience, or skills) is empty or has blank items, return an empty array [] for that property. Do not write conversational text or warnings.`;

        userQuery = `Optimize this candidate data for a tech resume portfolio:
        - Title: "${resume.title || ''}"
        - Bio: "${rawAbout}"
        - Skills: ${JSON.stringify(rawSkills)}
        - Projects: ${JSON.stringify(rawProjects)}
        - Experience: ${JSON.stringify(rawExperience)}

        Format the optimized response strictly as a single JSON object matching the exact structure below, without comments or markdown wrappers:
        {
          "title": "Optimized professional title",
          "aboutMe": "High-impact summary",
          "skills": ["Skill1", "Skill2"],
          "projects": [{"title": "title", "description": "professional description with metrics", "technologies": ["tech"]}],
          "experience": [{"role": "role", "company": "company", "duration": "duration", "description": "impactful bullet points"}]
        }`;
      }

      let aiResponse;
      try {
        // Run stable Llama 3.2 3B
        aiResponse = await env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery }
          ]
        });
      } catch (aiError) {
        // Fallback to stable Llama 3.1 8B FP8 Fast
        aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8-fast", {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery }
          ]
        });
      }

      const rawText = aiResponse.response || "";
      const parsedData = extractJSON(rawText);

      return new Response(
        JSON.stringify({ success: true, optimized: parsedData }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (error: any) {
      console.warn("AI compilation failed or raw parsing error occurred. Executing secure no-crash fallback:", error);
      
      // FALLBACK MECHANISM: If AI crashes or parsing fails, return original data with a successful response
      const fallbackData = resume ? {
        title: resume.title || "Software Developer",
        aboutMe: resume.aboutMe || "Resourceful engineer focused on solving challenging technical problems.",
        skills: resume.skills || [],
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
          warning: "Fallback triggered. The system accepted your values directly without AI optimization to avoid server interruption."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }
};