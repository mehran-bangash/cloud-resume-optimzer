export interface Env {
  AI: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight CORS requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST requests are allowed" }), 
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      const data = await request.json();
      const rawAboutMe = data.aboutMe || "";
      const rawProjects = data.projects || [];
      const rawExperience = data.experience || [];

      const systemPrompt = `You are a Principal Tech Recruiter and resume optimization engine. 
      Your task is to take raw developer resume inputs and rewrite them into professional, high-impact, action-oriented text suitable for a stellar portfolio. 
      Ensure you use strong action verbs and highlight accomplishments.`;

      const userQuery = `Optimize this candidate data for a high-end tech portfolio:
      - Bio: "${rawAboutMe}"
      - Projects: ${JSON.stringify(rawProjects)}
      - Experience: ${JSON.stringify(rawExperience)}
      
      Provide your output as a valid JSON object matching this structure:
      {
        "aboutMe": "optimized professional summary here",
        "projects": [{"title": "project title", "description": "optimized project description with key metrics/achievements", "technologies": ["tech1"]}],
        "experience": [{"role": "role name", "company": "company name", "duration": "duration", "description": "optimized bulleted description"}]
      }
      Return ONLY valid JSON. No markdown backticks, no comments.`;

      let aiResponse;
      try {
        // Try Llama 3 first
        aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery }
          ]
        });
      } catch (aiError) {
        // Fallback to Llama 2 if Llama 3 is busy or rate-limited
        aiResponse = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery }
          ]
        });
      }

      return new Response(
        JSON.stringify({ success: true, optimized: aiResponse.response }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (error: any) {
      // Use standard new Response here to ensure the error always gets sent back cleanly
      return new Response(
        JSON.stringify({ error: error.message || "Unknown error occurred" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }
};