/**
 * IP-based Rate Limiter
 * Tracks requests per IP address with sliding window algorithm
 * Free tier limit: 10 requests per hour per IP
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  error?: string;
}

/**
 * Check and update rate limit for an IP address
 * @param ip - Client IP address
 * @param limit - Maximum requests allowed per window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 1 hour)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // No previous requests or window expired
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(ip, { count: 1, resetAt });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt,
    };
  }

  // Within rate limit
  if (entry.count < limit) {
    entry.count++;
    rateLimitStore.set(ip, entry);

    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      resetAt: entry.resetAt,
    };
  }

  // Rate limit exceeded
  const minutesUntilReset = Math.ceil((entry.resetAt - now) / (60 * 1000));

  return {
    success: false,
    limit,
    remaining: 0,
    resetAt: entry.resetAt,
    error: `Troppe richieste. Hai rotto il cazzo. Torna tra ${minutesUntilReset} minuti.`,
  };
}

/**
 * Extract client IP from request headers
 * Checks multiple headers in order of preference
 */
export function getClientIp(request: Request): string {
  // Check Vercel-specific headers first
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // Check other common headers
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a default (shouldn't happen on Vercel)
  return "unknown";
}
