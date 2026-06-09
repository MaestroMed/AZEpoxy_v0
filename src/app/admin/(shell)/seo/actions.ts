"use server";

import { revalidatePath } from "next/cache";
import { runQaPass } from "@/lib/seo/qa";
import { getDb, seoQaRuns } from "@/lib/db";
import { getVilles } from "@/lib/villes-data";
import { requireAdmin } from "@/lib/admin/session";

/**
 * Trigger a manual QA pass from the /admin/seo "Re-run QA" button.
 *
 * Court-circuite la route `/api/cron/qa-villes` — utile car le user
 * est déjà authentifié en session admin et n'a pas à passer le
 * CRON_SECRET. Le code QA lui-même est partagé via `runQaPass`.
 */
export async function triggerQaRunAction(): Promise<void> {
  const admin = await requireAdmin();

  const villes = await getVilles();
  const paths = [
    "/",
    "/services",
    "/services/thermolaquage",
    "/services/sablage",
    "/services/finitions",
    "/couleurs-ral",
    "/professionnels",
    "/a-propos",
    ...villes.map((v) => `/thermolaquage-${v.slug}`),
  ];

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.azepoxy.fr";

  const summary = await runQaPass({
    baseUrl,
    paths,
    concurrency: 6,
    fetchTimeoutMs: 10_000,
  });

  await getDb().insert(seoQaRuns).values({
    durationMs: summary.durationMs,
    totalPages: summary.totalPages,
    okCount: summary.okCount,
    koCount: summary.koCount,
    pages: summary.pages,
    trigger: `manual:${admin.email}`,
  });

  revalidatePath("/admin/seo");
}
