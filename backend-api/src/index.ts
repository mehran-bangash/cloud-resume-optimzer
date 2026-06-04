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

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (request.method !== "POST") return new Response(null, { status: 405 });

    try {
      const payload = await request.json();
      const { resume, jobDescription } = payload;

      const systemPrompt = `You are an elite ATS Optimization Engine. 
      Analyze the resume data against the JD (if provided). 
      Return a STRICT JSON object in this structure:
      {
        "auditReport": { "score": 85, "redFlags": ["flag1", "flag2"], "actionableEdits": ["edit1"] },
        "optimizedResume": { "title": "...", "aboutMe": "...", "projects": [...], "experience": [...] }
      }
      Return ONLY valid JSON. No markdown backticks.`;

      const userQuery = `JD: "${jobDescription || 'N/A'}". Resume: ${JSON.stringify(resume)}`;

      const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userQuery }]
      });

      const parsedData = JSON.parse(aiResponse.response.replace(/```json/g, '').replace(/```/g, ''));

      return new Response(JSON.stringify({ success: true, ...parsedData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};