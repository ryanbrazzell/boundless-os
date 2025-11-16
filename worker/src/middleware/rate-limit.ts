/**
 * Simple in-memory rate limiting middleware
 * For production, consider using Cloudflare Rate Limiting or Upstash Redis
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate limit middleware
 * @param maxRequests Maximum requests per window
 * @param windowSeconds Time window in seconds
 */
export const rateLimit = (maxRequests: number = 100, windowSeconds: number = 60) => {
  return async (c: any, next: () => Promise<void>) => {
    const key = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
    const now = Math.floor(Date.now() / 1000);
    const windowKey = `${key}:${Math.floor(now / windowSeconds)}`;

    // Clean up old entries (simple cleanup)
    if (Object.keys(store).length > 10000) {
      Object.keys(store).forEach((k) => {
        if (store[k].resetAt < now) {
          delete store[k];
        }
      });
    }

    // Check rate limit
    if (!store[windowKey]) {
      store[windowKey] = {
        count: 0,
        resetAt: now + windowSeconds,
      };
    }

    store[windowKey].count++;

    if (store[windowKey].count > maxRequests) {
      return c.json(
        {
          error: "Rate limit exceeded",
          retryAfter: store[windowKey].resetAt - now,
        },
        429
      );
    }

    // Add rate limit headers
    c.header("X-RateLimit-Limit", String(maxRequests));
    c.header("X-RateLimit-Remaining", String(Math.max(0, maxRequests - store[windowKey].count)));
    c.header("X-RateLimit-Reset", String(store[windowKey].resetAt));

    await next();
  };
};

