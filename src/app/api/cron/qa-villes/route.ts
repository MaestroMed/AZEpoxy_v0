import { NextResponse, type NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, seoQaRuns } from "@/lib/db";
import { runQaPass } from "@/lib/seo/qa";
import { submitToIndexNow } from "@/lib/seo/indexnow";
import { getVilles } from "@/lib/villes-data";
import { allDeptHubSlugs } from "@/lib/villes/departments";

/**
 * Hebdo SEO QA — visite chaque page ville, vérifie les signaux
 * critiques (title, H1, schema.org, word count, noindex flag) et stocke
 * le résultat en DB pour suivi.
 *
 * Auth :
 *   - Vercel Cron passe automatiquement le header `Authorization: Bearer <CRON_SECRET>`
 *     quand on déclare le secret côté Project Settings.
 *   - Pour un trigger manuel depuis l'admin, on accepte aussi
 *     `?token=<CRON_SECRET>` en query.
 *
 * Schedule : voir vercel.json (`crons` array).
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.azepoxy.fr";

function isAuthed(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Sans secret configuré, le cron est ouvert en dev/preview pour
    // tester. En prod on exige le secret.
    return process.env.NODE_ENV !== "production";
  }

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const token = req.nextUrl.searchParams.get("token");
  if (token === secret) return true;

  return false;
}

async function handler(req: NextRequest, trigger: "cron" | "manual") {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const villes = await getVilles();
  const deptSlugs = allDeptHubSlugs();
  const paths = [
    "/",
    "/services",
    "/services/thermolaquage",
    "/services/sablage",
    "/services/finitions",
    "/couleurs-ral",
    "/professionnels",
    "/a-propos",
    "/villes",
    ...deptSlugs.map((s) => `/thermolaquage-${s}`),
    ...villes.map((v) => `/thermolaquage-${v.slug}`),
  ];

  const summary = await runQaPass({
    baseUrl: SITE_URL,
    paths,
    concurrency: 6,
    fetchTimeoutMs: 10_000,
  });

  // Persist for the /admin/seo dashboard.
  try {
    await getDb().insert(seoQaRuns).values({
      durationMs: String(summary.durationMs),
      totalPages: String(summary.totalPages),
      okCount: String(summary.okCount),
      koCount: String(summary.koCount),
      pages: summary.pages,
      trigger,
    });
  } catch (err) {
    console.error("[qa-villes] DB insert failed", err);
  }

  // Auto-ping IndexNow with the OK URLs — Bing / Yandex / Naver. Fire
  // and forget : on n'attend pas la réponse pour répondre au cron.
  let indexnowResult: Awaited<ReturnType<typeof submitToIndexNow>> | null = null;
  try {
    const okUrls = Object.entries(summary.pages)
      .filter(([, r]) => r.ok)
      .map(([path]) => `${SITE_URL}${path}`);
    if (okUrls.length > 0) {
      indexnowResult = await submitToIndexNow(okUrls);
    }
  } catch (err) {
    console.error("[qa-villes] indexnow ping failed", err);
  }

  return NextResponse.json({
    ok: true,
    trigger,
    ...summary,
    indexnow: indexnowResult,
  });
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends GET. Manual triggers via the admin button also GET.
  return handler(req, req.nextUrl.searchParams.get("manual") ? "manual" : "cron");
}

export async function POST(req: NextRequest) {
  return handler(req, "manual");
}
