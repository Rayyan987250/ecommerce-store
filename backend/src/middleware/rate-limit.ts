import type { NextFunction, Request, Response } from "express";

type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
};

type Entry = {
  count: number;
  resetAt: number;
};

const requestBuckets = new Map<string, Entry>();

export function createRateLimiter(config: RateLimitConfig) {
  return function rateLimit(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const key = `${config.keyPrefix ?? "global"}:${ip}`;
    const now = Date.now();
    const existing = requestBuckets.get(key);

    if (!existing || now > existing.resetAt) {
      requestBuckets.set(key, { count: 1, resetAt: now + config.windowMs });
      next();
      return;
    }

    if (existing.count >= config.maxRequests) {
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
      return;
    }

    existing.count += 1;
    next();
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestBuckets.entries()) {
    if (now > value.resetAt) {
      requestBuckets.delete(key);
    }
  }
}, 30_000).unref();
