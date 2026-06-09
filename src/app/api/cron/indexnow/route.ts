import { NextResponse, type NextRequest } from "next/server";
import { submitToIndexNow } from "@/lib/seo/indexnow";
import { getVilles } from "@/lib/villes-data";
import { allDeptHubSlugs } from "@/lib/villes/departments";

/**
 * Cron quotidien IndexNow — soumet à Bing/Yandex/Naver l'ensemble des
 * pages villes + dept hubs pour notifier des updates récents.
 *
 * Pas de Google direct via IndexNow, mais Bingbot relaie souvent dans
 * Google. Couvre 30 %+ de la search en France via Yahoo!/Bing.
 *
 * Auth : CRON_SECRET en header Bearer (Vercel Cron) uniquement — pas de
 * secret en query (les URLs fuitent dans les logs/proxies).
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.azepoxy.fr";

function isAuthed(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  return false;
}

async function handler(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const villes = await getVilles();
  const depts = allDeptHubSlugs();

  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/services/thermolaquage`,
    `${SITE_URL}/services/sablage`,
    `${SITE_URL}/services/finitions`,
    `${SITE_URL}/couleurs-ral`,
    `${SITE_URL}/professionnels`,
    ...depts.map((s) => `${SITE_URL}/thermolaquage-${s}`),
    ...villes.map((v) => `${SITE_URL}/thermolaquage-${v.slug}`),
  ];

  const result = await submitToIndexNow(urls, {
    host: new URL(SITE_URL).hostname,
  });

  return NextResponse.json({
    submittedAt: new Date().toISOString(),
    urlsCount: urls.length,
    indexnow: result,
  });
}

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
