import { NextResponse } from "next/server";

/**
 * Minimal health check for uptime monitors and smoke tests. Reports which
 * integrations are wired up via env vars so it's easy to diagnose a misconfigured
 * deploy. No sensitive values are returned.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION ?? "unknown",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    integrations: {
      sanity: Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
      resend: Boolean(process.env.RESEND_API_KEY),
      upstash: Boolean(
        process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ),
      qstash: Boolean(process.env.QSTASH_TOKEN),
      turnstile: Boolean(process.env.TURNSTILE_SECRET_KEY),
      leadWebhook: Boolean(process.env.LEAD_WEBHOOK_URL),
      calcom: Boolean(process.env.NEXT_PUBLIC_CALCOM_LINK),
      googlePlaces: Boolean(
        process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID
      ),
      sentry: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    },
  });
}
