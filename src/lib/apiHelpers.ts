import { NextResponse } from "next/server";

// Standard error responses
export const ApiError = {
  unauthorized: () =>
    NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  rateLimited: (resetTime: number) =>
    NextResponse.json(
      {
        error: "Too many requests. Please slow down.",
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)),
          "X-RateLimit-Limit": "10",
        },
      }
    ),
  badRequest: (msg: string) =>
    NextResponse.json({ error: msg }, { status: 400 }),
  serverError: (msg: string) =>
    NextResponse.json({ error: msg }, { status: 500 }),
  notFound: () =>
    NextResponse.json({ error: "Not found" }, { status: 404 }),
};

// Validate request size — prevents large payload attacks
export function validatePayloadSize(
  body: string,
  maxBytes = 50_000 // 50KB max
): boolean {
  return new Blob([body]).size <= maxBytes;
}

// Sanitize string input — strips dangerous characters
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .trim()
    .slice(0, 10_000); // max 10K chars per field
}