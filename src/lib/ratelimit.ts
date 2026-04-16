import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Persistent rate limit backed by Upstash Redis. Falls back to an in-memory
 * Map (per server instance) when the Upstash env vars aren't set — good for
 * local dev but resets on every cold start, so production MUST configure
 * UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
 */

type WindowSpec = `${number} ${"s" | "m" | "h" | "d"}`;

export interface LimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

interface InMemoryEntry {
  count: number;
  resetAt: number;
}

const upstash =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const limiters = new Map<string, Ratelimit>();

function getUpstashLimiter(prefix: string, limit: number, window: WindowSpec) {
  if (!upstash) return null;
  const key = `${prefix}:${limit}:${window}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: upstash,
      limiter: Ratelimit.slidingWindow(limit, window),
      analytics: false,
      prefix: `ratelimit:${prefix}`,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

/* ------------------------- In-memory fallback ------------------------- */
const memory = new Map<string, InMemoryEntry>();

function windowMs(window: WindowSpec): number {
  const [num, unit] = window.split(" ") as [string, "s" | "m" | "h" | "d"];
  const n = Number(num);
  switch (unit) {
    case "s":
      return n * 1000;
    case "m":
      return n * 60_000;
    case "h":
      return n * 3_600_000;
    case "d":
      return n * 86_400_000;
  }
}

function inMemoryLimit(
  identifier: string,
  limit: number,
  window: WindowSpec
): LimitResult {
  const now = Date.now();
  const entry = memory.get(identifier);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs(window);
    memory.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, reset: resetAt };
  }
  entry.count += 1;
  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.resetAt,
  };
}

/**
 * Returns whether `identifier` is still within the allowance. `identifier`
 * is typically an IP address or `"ip:route"` combination.
 */
export async function ratelimit(
  identifier: string,
  { prefix, limit, window }: { prefix: string; limit: number; window: WindowSpec }
): Promise<LimitResult> {
  const upstashLimiter = getUpstashLimiter(prefix, limit, window);
  if (upstashLimiter) {
    const r = await upstashLimiter.limit(identifier);
    return { success: r.success, remaining: r.remaining, reset: r.reset };
  }
  return inMemoryLimit(`${prefix}:${identifier}`, limit, window);
}

export function extractIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
