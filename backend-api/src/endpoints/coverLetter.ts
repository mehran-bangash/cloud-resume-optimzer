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

export async function handleCoverLetter(
  body: any,
  env: Env
): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const { resume, jobDescription } = body as {
    resume: any;
    jobDescription: string;
  };

  if (!resume || !jobDescription?.trim()) {
    return new Response(
      JSON.stringify({ error: "Missing resume or jobDescription" }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const prompt = `You are a professional cover letter writer.

Write a compelling, personalized cover letter based on this resume and job description.

Candidate Resume:
Name: ${resume.fullName}
Title: ${resume.title}
Email: ${resume.email}
Location: ${resume.location}
Summary: ${resume.aboutMe}
Skills: ${resume.skills?.join(", ")}
Most Recent Role: ${resume.experience?.[0]?.role} at ${resume.experience?.[0]?.company}

Job Description:
${jobDescription.slice(0, 1500)}

Return ONLY this exact JSON — no markdown, no backticks:
{
  "subject": "<email subject line>",
  "body": "<full cover letter text with proper paragraphs separated by \\n\\n>",
  "tone": "professional"
}

Cover letter requirements:
- 3-4 paragraphs, 250-350 words total
- Opening: express interest in the specific role and company
- Middle: highlight 2-3 most relevant achievements matching the JD
- Closing: call to action and contact info
- Use candidate's real name, skills, and experience — never invent
- Professional but warm tone
- Do NOT include date or address headers — just the letter body`;

  try {
    const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a professional cover letter writer. Output ONLY raw JSON. No markdown.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
    });

    const result = extractJson(ai.response);
    if (!result) {
      return new Response(
        JSON.stringify({ error: "AI returned unparseable response" }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
}