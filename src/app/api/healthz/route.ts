import { NextResponse, type NextRequest } from "next/server";

/**
 * Health check pour uptime monitors et smoke tests. La réponse publique est
 * minimale ({ ok, timestamp }) — les détails (flags d'intégrations, région,
 * commit) ne sont renvoyés qu'avec un header `Authorization: Bearer
 * <CRON_SECRET>` valide, pour ne pas exposer la topologie du déploiement.
 * Aucune valeur sensible n'est jamais retournée.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const base = { ok: true, timestamp: new Date().toISOString() };

  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json(base);
  }

  return NextResponse.json({
    ...base,
    region: process.env.VERCEL_REGION ?? "unknown",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    integrations: {
      database: Boolean(process.env.DATABASE_URL),
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
