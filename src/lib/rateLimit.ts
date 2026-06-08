// In-memory rate limiter — works on Vercel Edge
// For 1M+ users, upgrade to Upstash Redis rate limiter

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((value, key) => {
    if (now > value.resetTime) store.delete(key);
  });
}, 5 * 60 * 1000);

interface RateLimitConfig {
  maxRequests: number;  // max requests per window
  windowMs: number;     // window size in milliseconds
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    store.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count++;
  store.set(key, entry);
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

// Helper to get real IP from request
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}