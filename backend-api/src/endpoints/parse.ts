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

  if (!cvText || cvText.trim().length < 50) {
    return new Response(
      JSON.stringify({ error: "CV text too short or missing" }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  // Limit text to 3000 chars to stay within token limits
  const truncatedText = cvText.slice(0, 3000);

  const prompt = `You are a CV parser. Extract structured data from this CV text and return ONLY a valid JSON object.

CV Text:
${truncatedText}

Return ONLY this exact JSON structure — no markdown, no explanation:
{
  "fullName": "<full name>",
  "email": "<email>",
  "phone": "<phone number>",
  "location": "<city, country>",
  "linkedin": "<linkedin url or empty string>",
  "github": "<github url or empty string>",
  "title": "<current job title>",
  "aboutMe": "<professional summary, 2-3 sentences>",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "role": "<job title>",
      "company": "<company name>",
      "duration": "<start – end>",
      "description": "<responsibilities in 1-2 sentences>"
    }
  ],
  "projects": [
    {
      "title": "<project name>",
      "description": "<what it does>",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<university name>",
      "year": "<graduation year>"
    }
  ]
}

Rules:
- If a field is not found, use empty string or empty array
- Never invent data — only use what is in the CV text
- skills must be an array of strings
- Keep descriptions concise`;

  try {
    const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a CV parser. Output ONLY raw JSON. No markdown, no backticks, no explanation.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const result = extractJson(ai.response);
    if (!result) {
      return new Response(
        JSON.stringify({
          error: "AI returned unparseable response",
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
      JSON.stringify({ error: "AI call failed: " + e.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
}