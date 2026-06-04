export interface Env { AI: any; }

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonRes(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// Tries harder to extract JSON — handles extra text, markdown fences, truncation
function extractJson(text: string): any | null {
  try {
    // Strip markdown code fences if present
    const stripped = text.replace(/```json|```/gi, "").trim();
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(stripped.substring(start, end + 1));
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return jsonRes({ error: "POST only" }, 405);

    const url = new URL(request.url);
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonRes({ error: "Invalid JSON body" }, 400);
    }

    // ── /ats-check route ──────────────────────────────────────────
    if (url.pathname === "/ats-check") {
      const { resume } = body as { resume: any };
      if (!resume) return jsonRes({ error: "Missing resume" }, 400);

      // Count real skills/experience to help AI score honestly
      const skillCount = Array.isArray(resume.skills) ? resume.skills.length : 0;
      const expCount = Array.isArray(resume.experience) ? resume.experience.length : 0;
      const aboutLength = typeof resume.aboutMe === "string" ? resume.aboutMe.length : 0;

      const prompt = `You are a strict ATS (Applicant Tracking System) resume scorer.

IMPORTANT: You must ACTUALLY analyze the content quality below. Do NOT return a fixed score.
- If skills contain nonsense words (random letters), score must be BELOW 40.
- If experience descriptions are vague or gibberish, score must be BELOW 50.
- If the resume looks professional and complete, score can be 75-90.

Resume stats: ${skillCount} skills listed, ${expCount} experience entries, summary length: ${aboutLength} chars.

Resume content to analyze:
${JSON.stringify(resume, null, 2)}

Return ONLY this exact JSON structure, nothing else, no markdown:
{"score":<integer 0-100>,"feedback":"<one sentence explaining the score>","improved":${null},"newScore":${null}}

If score < 78, set "improved" to a corrected resume object and "newScore" to the improved score.
If score >= 78, keep "improved" and "newScore" as null.`;

      try {
        const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            {
              role: "system",
              content: `You are an ATS scoring engine. Rules:
1. Output ONLY raw JSON — no markdown, no backticks, no explanation text before or after.
2. Start your response with { and end with }
3. Analyze content quality honestly — gibberish text = low score.`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 2048,
        });

        const result = extractJson(ai.response);
        if (!result) {
          return jsonRes({
            error: "AI returned unparseable response",
            raw: ai.response.slice(0, 300),
          }, 500);
        }
        return jsonRes(result);
      } catch (e: any) {
        return jsonRes({ error: "AI call failed: " + e.message }, 500);
      }
    }

    // ── / default route — Optimize CV against JD ─────────────────
    const { resume, jobDescription } = body as { resume: any; jobDescription: string };
    if (!resume || !jobDescription) {
      return jsonRes({ error: "Missing resume or jobDescription" }, 400);
    }

    const prompt = `You are an ATS Resume Optimization Engine.

Task: Rewrite the resume to match the job description as closely as possible.

Job Description:
${jobDescription}

Current Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY this exact JSON structure — no markdown, no backticks, no text before or after:
{"optimized":{<full rewritten resume object with same keys as input>},"atsScore":<integer 0-100>,"changes":"<one sentence summary of changes made>"}

Rules for "optimized":
- Keep all keys from the original resume (fullName, email, phone, location, linkedin, github, title, aboutMe, skills, experience, projects, education)
- Rewrite title, aboutMe, skills, experience descriptions to match the job description keywords
- Do NOT invent fake companies or dates — keep original company names and dates
- skills array must contain relevant technologies from the job description`;

    try {
      const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "system",
            content: `You are an ATS resume optimizer. Rules:
1. Output ONLY raw JSON — no markdown, no backticks, no explanation.
2. Start your response with { and end with }
3. The "optimized" key must contain a complete resume object.`,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 3000,
      });

      const result = extractJson(ai.response) as any;
      if (!result) {
        return jsonRes({
          error: "AI returned unparseable response",
          raw: ai.response.slice(0, 300),
        }, 500);
      }
      if (!result.optimized) {
        return jsonRes({
          error: "AI response missing optimized key",
          raw: JSON.stringify(result).slice(0, 300),
        }, 500);
      }
      return jsonRes(result);
    } catch (e: any) {
      return jsonRes({ error: "AI call failed: " + e.message }, 500);
    }
  },
};