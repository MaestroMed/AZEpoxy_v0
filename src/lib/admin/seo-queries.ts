import "server-only";
import { desc } from "drizzle-orm";
import { getDb, seoQaRuns, type SeoQaRun } from "@/lib/db";

/**
 * Read helpers pour le dashboard /admin/seo.
 */

export async function getLatestQaRun(): Promise<SeoQaRun | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(seoQaRuns)
    .orderBy(desc(seoQaRuns.ranAt))
    .limit(1);
  return row ?? null;
}

export async function getRecentQaRuns(limit = 8): Promise<SeoQaRun[]> {
  const db = getDb();
  return db
    .select()
    .from(seoQaRuns)
    .orderBy(desc(seoQaRuns.ranAt))
    .limit(limit);
}
