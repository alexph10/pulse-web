import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const RATE_LIMITS = {
  AI_ENDPOINTS: {
    requests: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  TRANSCRIBE: {
    requests: 50,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  GENERAL: {
    requests: 200,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

export function checkRateLimit(
  identifier: string,
  limit: { requests: number; windowMs: number }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  
  const record = store[key];
  
  if (!record || now > record.resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + limit.windowMs,
    };
    
    // Clean up old entries periodically
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
  
  record.count++;
  
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

export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.floor(resetTime / 1000).toString(),
  };
}

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(limit: { requests: number; windowMs: number }) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const identifier = req.userId || req.ip || 'unknown';
    const rateLimit = checkRateLimit(identifier, limit);
    
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.',
      });
    }
    
    // Add rate limit headers to response
    res.set(getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime));
    next();
  };
}

