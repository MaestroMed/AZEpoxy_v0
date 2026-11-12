"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, leads, leadEvents, type LeadStatus } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { logActivity } from "@/lib/admin/activity";

const StatusChangeInput = z.object({
  leadId: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]),
});

const NoteInput = z.object({
  leadId: z.string().uuid(),
  note: z.string().trim().min(1, "La note ne peut pas être vide").max(2000),
});

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

/* ─── Change status ───────────────────────────────────────────────── */

export async function changeStatusAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = StatusChangeInput.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Requête invalide" };
  }
  const { leadId, status } = parsed.data;

  try {
    const db = getDb();
    const [current] = await db
      .select({ status: leads.status })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!current) return { ok: false, error: "Lead introuvable" };
    if (current.status === status) return { ok: true };

    await db
      .update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.id, leadId));

    await db.insert(leadEvents).values({
      leadId,
      type: status === "contacted" ? "contacted" : "status_change",
      actor: admin.email,
      payload: { from: current.status, to: status },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("[changeStatusAction] failed", err);
    return { ok: false, error: "Erreur serveur" };
  }
}

/* ─── Add note ────────────────────────────────────────────────────── */

export async function addNoteAction(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = NoteInput.safeParse({
    leadId: formData.get("leadId"),
    note: formData.get("note"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Requête invalide",
    };
  }
  const { leadId, note } = parsed.data;

  try {
    const db = getDb();
    await db.insert(leadEvents).values({
      leadId,
      type: "note_added",
      actor: admin.email,
      payload: { note },
    });
    // Also update the lead's notes field (latest note overwrites the
    // summary — the timeline keeps the full history).
    await db
      .update(leads)
      .set({ notes: note, updatedAt: new Date() })
      .where(eq(leads.id, leadId));

    revalidatePath(`/admin/leads/${leadId}`);
    return { ok: true };
  } catch (err) {
    console.error("[addNoteAction] failed", err);
    return { ok: false, error: "Erreur serveur" };
  }
}

/* ─── Delete lead ─────────────────────────────────────────────────── */

const DeleteInput = z.object({ leadId: z.string().uuid() });

/**
 * Suppression définitive d'un lead (demande de test, doublon, droit à
 * l'effacement). L'historique part avec lui (cascade) ; un devis rattaché
 * est conservé, simplement détaché (lead_id passe à null). Le journal
 * d'activité garde la trace de qui a supprimé quoi, sans coordonnées.
 */
export async function deleteLeadAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = DeleteInput.safeParse({ leadId: formData.get("leadId") });
  if (!parsed.success) {
    return { ok: false, error: "Requête invalide" };
  }
  const { leadId } = parsed.data;

  try {
    const [deleted] = await getDb()
      .delete(leads)
      .where(eq(leads.id, leadId))
      .returning({ name: leads.name, source: leads.source });

    if (!deleted) return { ok: false, error: "Lead introuvable" };

    await logActivity({
      actor: admin.email,
      action: "lead.delete",
      entityType: "lead",
      entityId: leadId,
      summary: `Lead supprimé — ${deleted.name || "sans nom"} (${deleted.source})`,
    });
  } catch (err) {
    console.error("[deleteLeadAction] failed", err);
    return { ok: false, error: "Erreur serveur" };
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect("/admin/leads");
}
