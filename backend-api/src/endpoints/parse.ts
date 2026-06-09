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

function base64ToText(base64: string): string {
  try {
    // Decode base64 to binary string
    const binary = atob(base64);
    // Extract readable ASCII text only
    let text = "";
    for (let i = 0; i < binary.length; i++) {
      const code = binary.charCodeAt(i);
      if (code >= 32 && code <= 126) {
        text += binary[i];
      } else if (code === 10 || code === 13 || code === 9) {
        text += " ";
      }
    }
    // Clean up excessive whitespace
    return text.replace(/\s+/g, " ").trim();
  } catch {
    return "";
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

  const { fileBase64, fileName, cvText } = body as {
    fileBase64?: string;
    fileName?: string;
    cvText?: string;
  };

  let textToProcess = "";

  if (fileBase64) {
    textToProcess = base64ToText(fileBase64);
  } else if (cvText) {
    textToProcess = cvText;
  }

  if (!textToProcess || textToProcess.trim().length < 30) {
    return new Response(
      JSON.stringify({
        error: "Could not extract readable text from this file. Please try a .txt or text-based PDF.",
      }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const truncatedText = textToProcess.slice(0, 3000);

  const prompt = `You are a CV parser. Extract structured data from this CV text.

CV Text:
${truncatedText}

Return ONLY this JSON — no markdown, no explanation:
{
  "fullName": "<full name or empty string>",
  "email": "<email or empty string>",
  "phone": "<phone or empty string>",
  "location": "<city, country or empty string>",
  "linkedin": "<linkedin url or empty string>",
  "github": "<github url or empty string>",
  "title": "<job title or empty string>",
  "aboutMe": "<2-3 sentence summary or empty string>",
  "skills": ["skill1", "skill2"],
  "experience": [{"role": "", "company": "", "duration": "", "description": ""}],
  "projects": [{"title": "", "description": "", "technologies": []}],
  "education": [{"degree": "", "institution": "", "year": ""}]
}

Rules:
- Only use data from the CV text — never invent data
- If a field is not found use empty string or empty array
- skills must be an array of strings`;

  try {
    const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: "You are a CV parser. Output ONLY raw JSON. No markdown, no backticks.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const result = extractJson(ai.response);
    if (!result) {
      return new Response(
        JSON.stringify({ error: "AI could not parse this file format", raw: ai.response.slice(0, 100) }),
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