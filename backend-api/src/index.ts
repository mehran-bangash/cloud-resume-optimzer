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
 * Utility to safely extract clean JSON strings from raw LLM outputs
 * to prevent JSON parsing exceptions (crashes) when markdown fences are returned.
 */
function extractJSON(rawText: string): any {
  let cleanText = rawText.trim();
  
  // Remove starting markdown block if present
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.substring(3);
  }
  
  // Remove ending markdown block if present
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }
  
  cleanText = cleanText.trim();
  return JSON.parse(cleanText);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Define strict CORS headers to allow secure requests from your Vercel URL
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };

    // Handle preflight OPTIONS requests immediately
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      const payload: RequestPayload = await request.json();
      
      if (!payload.resume) {
        return new Response(
          JSON.stringify({ error: "Missing resume payload." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const resume = payload.resume;
      const jobDescription = payload.jobDescription ? payload.jobDescription.trim() : "";

      // Ensure arrays have fallbacks to prevent undefined mappings
      const rawAbout = resume.aboutMe || "";
      const rawProjects = resume.projects || [];
      const rawExperience = resume.experience || [];
      const rawSkills = resume.skills || [];

      let systemPrompt = "";
      let userQuery = "";

      if (jobDescription) {
        // SCENARIO A: User supplied a target job description (Tailored CV Optimization)
        systemPrompt = `You are an elite, ATS-optimizing tech recruiter and career strategist.
        Your task is to analyze the user's raw resume against the provided Job Description (JD).
        Modify their resume to strategically highlight experiences and projects that align with the target role's key requirements, using high-impact metrics and action verbs, without fabricating credentials.`;

        userQuery = `Compare this Candidate's Profile with this target Job Description and generate an ATS-optimized matched resume version.
        
        [Target Job Description]:
        "${jobDescription}"

        [Candidate Profile]:
        - Title: "${resume.title}"
        - Bio: "${rawAbout}"
        - Skills: ${JSON.stringify(rawSkills)}
        - Projects: ${JSON.stringify(rawProjects)}
        - Experience: ${JSON.stringify(rawExperience)}

        Format the optimized response strictly as a single minified JSON object matching the exact structure below, without comments or markdown wrappers:
        {
          "title": "Optimized target title matched to JD",
          "aboutMe": "Professional summary optimized for the JD",
          "skills": ["Skill1", "Skill2"],
          "projects": [{"title": "title", "description": "optimized description incorporating JD terms", "technologies": ["tech"]}],
          "experience": [{"role": "role", "company": "company", "duration": "duration", "description": "optimized bullets highlighting JD requirements"}]
        }`;
      } else {
        // SCENARIO B: Standard high-end CV Optimization
        systemPrompt = `You are a Principal Tech Recruiter.
        Rewrite raw developer inputs into professional, high-impact, action-oriented text with strong verbs and measurable results suitable for a world-class portfolio website.`;

        userQuery = `Optimize this candidate data for a tech resume portfolio:
        - Title: "${resume.title}"
        - Bio: "${rawAbout}"
        - Skills: ${JSON.stringify(rawSkills)}
        - Projects: ${JSON.stringify(rawProjects)}
        - Experience: ${JSON.stringify(rawExperience)}

        Format the optimized response strictly as a single minified JSON object matching the exact structure below, without comments or markdown wrappers:
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
        aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery }
          ]
        });
      } catch (aiError) {
        // High-availability fallback to standard Mistral 7B model if Llama-3.1 is overloaded
        aiResponse = await env.AI.run("@cf/mistral/mistral-7b-instruct-v0.1", {
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
      // Secure SaaS Error Shield: Prevents leak of raw infrastructure details
      return new Response(
        JSON.stringify({ error: "Failed to optimize. Please verify your fields and try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }
};