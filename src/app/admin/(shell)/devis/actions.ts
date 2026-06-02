"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createQuote,
  updateQuote,
  setQuoteStatus,
  deleteQuote,
  getQuote,
  type QuoteInput,
} from "@/lib/admin/quotes";
import { requireAdmin } from "@/lib/admin/session";
import { logActivity } from "@/lib/admin/activity";
import type { QuoteStatus } from "@/lib/db";

const ItemSchema = z.object({
  label: z.string().trim().min(1),
  description: z.string().optional(),
  quantity: z.number().min(0),
  unit: z.string().trim().min(1).default("u"),
  unitPrice: z.number().min(0),
});

const QuoteSchema = z.object({
  leadId: z.string().uuid().nullish(),
  clientName: z.string().trim().min(1, "Nom client requis"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientPhone: z.string().optional(),
  clientCompany: z.string().optional(),
  clientAddress: z.string().optional(),
  taxRate: z.number().min(0).max(100),
  notes: z.string().optional(),
  validUntil: z.string().optional(),
  items: z.array(ItemSchema).min(1, "Au moins une ligne"),
});

function parsePayload(formData: FormData): QuoteInput | { error: string } {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return { error: "Données manquantes" };
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { error: "JSON invalide" };
  }
  const parsed = QuoteSchema.safeParse(json);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }
  const d = parsed.data;
  return {
    leadId: d.leadId ?? null,
    clientName: d.clientName,
    clientEmail: d.clientEmail || undefined,
    clientPhone: d.clientPhone,
    clientCompany: d.clientCompany,
    clientAddress: d.clientAddress,
    taxRate: d.taxRate,
    notes: d.notes,
    validUntil: d.validUntil ? new Date(d.validUntil) : null,
    items: d.items,
  };
}

export async function createQuoteAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = parsePayload(formData);
  if ("error" in input) {
    return { ok: false as const, error: input.error };
  }
  const id = await createQuote(input, admin.email);
  await logActivity({
    actor: admin.email,
    action: "quote.created",
    entityType: "quote",
    entityId: id,
    summary: `Devis créé pour ${input.clientName}`,
  });
  revalidatePath("/admin/devis");
  redirect(`/admin/devis/${id}`);
}

export async function updateQuoteAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const input = parsePayload(formData);
  if ("error" in input) {
    return { ok: false as const, error: input.error };
  }
  await updateQuote(id, input);
  await logActivity({
    actor: admin.email,
    action: "quote.updated",
    entityType: "quote",
    entityId: id,
    summary: `Devis modifié — ${input.clientName}`,
  });
  revalidatePath(`/admin/devis/${id}`);
  revalidatePath("/admin/devis");
  redirect(`/admin/devis/${id}`);
}

export async function setQuoteStatusAction(id: string, status: string) {
  const admin = await requireAdmin();
  const valid = z
    .enum(["draft", "sent", "accepted", "rejected", "expired"])
    .safeParse(status);
  if (!valid.success) return { ok: false };
  await setQuoteStatus(id, valid.data as QuoteStatus);
  const q = await getQuote(id);
  await logActivity({
    actor: admin.email,
    action: "quote.status",
    entityType: "quote",
    entityId: id,
    summary: `${q?.quote.number ?? "Devis"} → ${valid.data}`,
  });
  revalidatePath(`/admin/devis/${id}`);
  revalidatePath("/admin/devis");
  return { ok: true };
}

export async function deleteQuoteAction(id: string) {
  const admin = await requireAdmin();
  const q = await getQuote(id);
  await deleteQuote(id);
  await logActivity({
    actor: admin.email,
    action: "quote.deleted",
    entityType: "quote",
    entityId: id,
    summary: `Devis supprimé ${q?.quote.number ?? ""}`,
  });
  revalidatePath("/admin/devis");
  redirect("/admin/devis");
}
