import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_UA = [
  "python-requests",
  "curl/",
  "wget/",
  "scrapy",
  "nikto",
  "sqlmap",
  "masscan",
];

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 1. Block bad user agents
  const ua = request.headers.get("user-agent") ?? "";
  const isBlocked = BLOCKED_UA.some((bad) =>
    ua.toLowerCase().includes(bad.toLowerCase())
  );
  if (isBlocked) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. IP rate limiting — 100 requests per minute
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + 60_000 });
  } else if (entry.count >= 100) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  } else {
    entry.count++;
  }

  // 3. Security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};