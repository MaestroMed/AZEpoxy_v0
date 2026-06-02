"use server";

import { revalidatePath } from "next/cache";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb, leads, leadEvents } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { logActivity } from "@/lib/admin/activity";

const STATUS = z.enum(["new", "contacted", "qualified", "won", "lost"]);

/** Changement de statut depuis le Kanban (drag-drop). */
export async function updateLeadStatusAction(
  leadId: string,
  status: string,
): Promise<{ ok: boolean }> {
  const admin = await requireAdmin();
  const parsed = STATUS.safeParse(status);
  if (!z.string().uuid().safeParse(leadId).success || !parsed.success) {
    return { ok: false };
  }
  try {
    const db = getDb();
    const [current] = await db
      .select({ status: leads.status, name: leads.name })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);
    if (!current || current.status === parsed.data) return { ok: true };

    await db
      .update(leads)
      .set({ status: parsed.data, updatedAt: new Date() })
      .where(eq(leads.id, leadId));
    await db.insert(leadEvents).values({
      leadId,
      type: parsed.data === "contacted" ? "contacted" : "status_change",
      actor: admin.email,
      payload: { from: current.status, to: parsed.data },
    });
    await logActivity({
      actor: admin.email,
      action: "lead.status",
      entityType: "lead",
      entityId: leadId,
      summary: `${current.name} : ${current.status} → ${parsed.data}`,
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("[updateLeadStatusAction]", err);
    return { ok: false };
  }
}

/** Action groupée : changer le statut de plusieurs leads. */
export async function bulkUpdateStatusAction(
  ids: string[],
  status: string,
): Promise<{ ok: boolean; count: number }> {
  const admin = await requireAdmin();
  const parsed = STATUS.safeParse(status);
  const validIds = ids.filter((id) => z.string().uuid().safeParse(id).success);
  if (!parsed.success || validIds.length === 0) {
    return { ok: false, count: 0 };
  }
  try {
    const db = getDb();
    await db
      .update(leads)
      .set({ status: parsed.data, updatedAt: new Date() })
      .where(inArray(leads.id, validIds));
    await db.insert(leadEvents).values(
      validIds.map((leadId) => ({
        leadId,
        type:
          parsed.data === "contacted"
            ? ("contacted" as const)
            : ("status_change" as const),
        actor: admin.email,
        payload: { to: parsed.data, bulk: true },
      })),
    );
    await logActivity({
      actor: admin.email,
      action: "lead.bulk_status",
      entityType: "lead",
      summary: `${validIds.length} leads → ${parsed.data}`,
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true, count: validIds.length };
  } catch (err) {
    console.error("[bulkUpdateStatusAction]", err);
    return { ok: false, count: 0 };
  }
}
