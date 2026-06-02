import "server-only";
import { desc } from "drizzle-orm";
import { getDb, adminActivity, type AdminActivity } from "@/lib/db";

/**
 * Journal d'activité admin — un feed unique de tout ce qui se passe dans
 * le backoffice (changement de statut lead, devis créé/envoyé, contenu
 * édité…). Chaque module appelle `logActivity()` après une mutation.
 */

export interface LogActivityInput {
  actor: string;
  action: string;
  summary: string;
  entityType?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
}

export async function logActivity(input: LogActivityInput): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await getDb().insert(adminActivity).values({
      actor: input.actor,
      action: input.action,
      summary: input.summary,
      entityType: input.entityType,
      entityId: input.entityId,
      meta: input.meta,
    });
  } catch (err) {
    // Le journal ne doit jamais faire échouer une action métier.
    console.error("[activity] log failed", err);
  }
}

export async function getRecentActivity(limit = 50): Promise<AdminActivity[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await getDb()
      .select()
      .from(adminActivity)
      .orderBy(desc(adminActivity.createdAt))
      .limit(limit);
  } catch (err) {
    console.error("[activity] read failed", err);
    return [];
  }
}
