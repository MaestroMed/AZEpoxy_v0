/**
 * Next.js instrumentation hook. Sentry is loaded server-side only via a
 * dynamic import so the client bundle stays lean — a DSN-less deploy ships
 * no observability code at all. Client-side error capture can be added
 * later by re-introducing `instrumentation-client.ts` when needed.
 */

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  if (!dsn) return;

  const Sentry = await import("@sentry/nextjs");

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      tracesSampleRate: 0.1,
      release: process.env.VERCEL_GIT_COMMIT_SHA,
    });
    return;
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      tracesSampleRate: 0.05,
      release: process.env.VERCEL_GIT_COMMIT_SHA,
    });
  }
}

/**
 * Exposes Sentry's request-error capture when a DSN is set. Without Sentry we
 * fall back to a no-op so Next's runtime integration keeps working.
 */
export async function onRequestError(
  err: unknown,
  request: unknown,
  context: unknown
) {
  if (!(process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN)) return;
  const Sentry = await import("@sentry/nextjs");
  return Sentry.captureRequestError(
    err,
    request as Parameters<typeof Sentry.captureRequestError>[1],
    context as Parameters<typeof Sentry.captureRequestError>[2]
  );
}
