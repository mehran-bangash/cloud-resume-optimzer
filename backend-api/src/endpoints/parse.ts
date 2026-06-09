import { Env } from "../index";

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

export async function handleParseCV(
  body: any,
  env: Env
): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const { cvText } = body as { cvText: string };

  if (!cvText || cvText.trim().length < 30) {
    return new Response(
      JSON.stringify({ error: "Could not extract readable text from file." }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  // Use up to 6000 chars to capture all projects and experience
  const truncatedText = cvText.slice(0, 6000);

  const prompt = `You are a professional CV parser. Extract ALL data from this CV — do not skip any projects or experience entries.

CV Text:
${truncatedText}

Return ONLY this exact JSON — no markdown, no backticks, no explanation before or after:
{
  "fullName": "<full name>",
  "email": "<email>",
  "phone": "<phone>",
  "location": "<city, country>",
  "linkedin": "<linkedin url or empty string>",
  "github": "<github url or empty string>",
  "title": "<current or most recent job title>",
  "aboutMe": "<professional summary 2-3 sentences, or create one from the CV data>",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "role": "<job title>",
      "company": "<company name>",
      "duration": "<start – end dates>",
      "description": "<key responsibilities in 1-2 sentences>"
    }
  ],
  "projects": [
    {
      "title": "<project name>",
      "description": "<what it does and impact>",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<university>",
      "year": "<year>"
    }
  ]
}

IMPORTANT RULES:
- Extract ALL projects — do not skip any
- Extract ALL experience entries — do not skip any
- If summary is missing, write one based on the CV content
- Never invent companies, dates, or skills not in the CV
- skills array should contain all technical skills mentioned`;

  try {
    const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a CV parser. Output ONLY raw JSON. Extract ALL entries completely.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 3000,
    });

    const result = extractJson(ai.response);
    if (!result) {
      return new Response(
        JSON.stringify({
          error: "AI could not parse this file",
          raw: ai.response.slice(0, 200),
        }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ parsed: result }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
}