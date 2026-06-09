export interface Env { AI: any; }
import { handleParseCV } from "./endpoints/parse";

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

function extractJson(text: string): any | null {
  try {
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

    // ── /parse-cv route ───────────────────────────────────────────
    if (url.pathname === "/parse-cv") {
      return handleParseCV(body, env);
    }

    // ── /ats-check route ──────────────────────────────────────────
    if (url.pathname === "/ats-check") {
      const { resume } = body as { resume: any };
      if (!resume) return jsonRes({ error: "Missing resume" }, 400);

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

    // ── /keyword-gap route ────────────────────────────────────────
    if (url.pathname === "/keyword-gap") {
      const { resume, jobDescription } = body as {
        resume: any;
        jobDescription: string;
      };
      if (!resume || !jobDescription) {
        return jsonRes({ error: "Missing resume or jobDescription" }, 400);
      }

      const prompt = `You are a keyword extraction and matching engine for ATS resume analysis.

Extract ALL important keywords from the job description — skills, tools, technologies, methodologies, soft skills.
Then check which of those keywords exist in the resume text.

Job Description:
${jobDescription}

Resume:
${JSON.stringify(resume)}

Return ONLY this exact JSON — no markdown, no backticks, nothing else:
{
  "jdKeywords": ["keyword1", "keyword2"],
  "foundInCV": ["keyword1"],
  "missingFromCV": ["keyword2"],
  "matchScore": <integer 0-100>
}

Rules:
- jdKeywords: ALL important keywords from the JD (10-25 keywords)
- foundInCV: keywords from jdKeywords that appear in the resume
- missingFromCV: keywords from jdKeywords NOT in the resume
- matchScore: percentage of jdKeywords found in CV`;

      try {
        const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            {
              role: "system",
              content: "You are a keyword extraction engine. Output ONLY raw JSON. No markdown, no explanation.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 1000,
        });

        const result = extractJson(ai.response);
        if (!result) {
          return jsonRes({ error: "AI returned unparseable response", raw: ai.response.slice(0, 200) }, 500);
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

    const prompt = `You are an expert ATS Resume Optimizer.

TASK: Completely rewrite EVERY section of this resume to match the job description below.
You MUST update ALL of these fields:
- "title": rewrite to match the exact job title from JD
- "aboutMe": rewrite completely using keywords from JD (mention Flutter, Dart, years of experience, specific skills from JD)
- "skills": replace with skills DIRECTLY from JD requirements (Flutter, Dart, Provider, Riverpod, Bloc, GetX, Firebase, REST APIs, Git, MVVM, Clean Architecture, CI/CD etc.)
- "experience": rewrite EVERY description to include Flutter/Dart work, mobile app responsibilities from JD
- "projects": rewrite EVERY description to highlight Flutter/Dart/mobile relevance

RULES:
- Keep original fullName, email, phone, location, linkedin, github, company names, duration dates
- DO NOT keep any description unchanged — rewrite ALL descriptions
- Use action verbs: Developed, Built, Integrated, Optimized, Published, Collaborated
- Include specific JD keywords in every section

Job Description:
${jobDescription}

Current Resume to rewrite:
${JSON.stringify(resume, null, 2)}

Return ONLY this exact JSON — no markdown, no backticks, nothing before or after the JSON:
{"optimized":{fullName,email,phone,location,linkedin,github,title,aboutMe,skills,experience,projects,education},"atsScore":<integer>,"changes":"<one sentence>"}`;

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