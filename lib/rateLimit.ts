/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-based solution like @upstash/ratelimit
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  // AI endpoints - expensive operations
  AI_ENDPOINTS: {
    requests: 100, // requests per window
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Transcription - moderate cost
  TRANSCRIBE: {
    requests: 50, // requests per window
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // General API endpoints
  GENERAL: {
    requests: 200, // requests per window
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (userId or IP address)
 * @param limit - Rate limit configuration
 * @returns true if within limit, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  limit: { requests: number; windowMs: number }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  
  const record = store[key];
  
  // If no record or window expired, create new record
  if (!record || now > record.resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + limit.windowMs,
    };
    
    // Clean up old entries periodically (simple cleanup)
    if (Object.keys(store).length > 10000) {
      Object.keys(store).forEach(k => {
        if (store[k].resetTime < now) {
          delete store[k];
        }
      });
    }
    
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime: now + limit.windowMs,
    };
  }
  
  // Increment count
  record.count++;
  
  // Check if over limit
  if (record.count > limit.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }
  
  return {
    allowed: true,
    remaining: limit.requests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.floor(resetTime / 1000).toString(),
  };
}

