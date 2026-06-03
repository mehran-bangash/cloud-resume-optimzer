export interface Env {
  AI: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1. Enable CORS so your Vercel frontend can call this backend securely
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
      return Response.json({ error: "Only POST requests are allowed" }, { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();
      const rawAboutMe = data.aboutMe || "";
      const rawProjects = data.projects || [];
      const rawExperience = data.experience || [];

      // 2. Define our prompt to optimize the resume with AI
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

      // 3. Call Cloudflare's free GPU infrastructure running Meta Llama-3-8b
      const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery }
        ]
      });

      // 4. Return the AI optimized response back to Vercel
      return new Response(JSON.stringify({ success: true, optimized: aiResponse.response }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
  }
};