import "server-only";

const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;
const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

function pruneExpiredEntries(now: number) {
  rateLimitMap.forEach((value, key) => {
    if (value.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  });
}

export function checkContactRateLimit(ip: string) {
  const now = Date.now();
  pruneExpiredEntries(now);

  const current = rateLimitMap.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    });

    return { allowed: true, retryAfterMs: 0 } as const;
  }

  if (current.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterMs: current.resetAt - now,
    } as const;
  }

  current.count += 1;

  return { allowed: true, retryAfterMs: 0 } as const;
}
