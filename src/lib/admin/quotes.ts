import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import {
  getDb,
  quotes,
  quoteItems,
  type Quote,
  type QuoteItem,
  type QuoteStatus,
} from "@/lib/db";

/**
 * Couche d'accès aux devis. Montants stockés en numeric (string décimal)
 * pour la précision ; les calculs se font en centimes côté JS.
 */

export interface QuoteItemInput {
  label: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface QuoteInput {
  leadId?: string | null;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientAddress?: string;
  taxRate: number;
  notes?: string;
  validUntil?: Date | null;
  items: QuoteItemInput[];
}

export interface QuoteTotals {
  subtotal: number;
  taxAmount: number;
  total: number;
}

/** Calcule les totaux à partir des lignes + taux de TVA. */
export function computeTotals(
  items: QuoteItemInput[],
  taxRate: number,
): QuoteTotals & { lineTotals: number[] } {
  const lineTotals = items.map(
    (i) => Math.round(i.quantity * i.unitPrice * 100) / 100,
  );
  const subtotal = Math.round(lineTotals.reduce((s, x) => s + x, 0) * 100) / 100;
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { subtotal, taxAmount, total, lineTotals };
}

/** Génère le prochain numéro AZ-YYYY-NNNN. */
async function nextQuoteNumber(): Promise<string> {
  const db = getDb();
  const year = new Date().getFullYear();
  const prefix = `AZ-${year}-`;
  // MAX(number) plutôt que count(*)+1 : après suppression d'un devis le
  // compteur ne recule pas, donc pas de numéro réattribué ni de collision
  // sur l'année. Le suffixe étant zero-paddé à largeur fixe, l'ordre
  // lexicographique DESC équivaut à l'ordre numérique.
  const [row] = await db
    .select({ number: quotes.number })
    .from(quotes)
    .where(sql`${quotes.number} LIKE ${prefix + "%"}`)
    .orderBy(desc(quotes.number))
    .limit(1);
  const lastSuffix = row ? Number.parseInt(row.number.slice(prefix.length), 10) : 0;
  const n = (Number.isFinite(lastSuffix) ? lastSuffix : 0) + 1;
  return `${prefix}${String(n).padStart(4, "0")}`;
}

export async function listQuotes(filter?: {
  status?: QuoteStatus;
}): Promise<Quote[]> {
  const db = getDb();
  if (filter?.status) {
    return db
      .select()
      .from(quotes)
      .where(eq(quotes.status, filter.status))
      .orderBy(desc(quotes.createdAt));
  }
  return db.select().from(quotes).orderBy(desc(quotes.createdAt));
}

export interface QuoteStats {
  total: number;
  byStatus: Record<QuoteStatus, number>;
  acceptedValue: number;
  pendingValue: number;
}

export async function getQuoteStats(): Promise<QuoteStats> {
  const db = getDb();
  const rows = await db
    .select({
      status: quotes.status,
      c: sql<number>`count(*)::int`,
      sum: sql<string>`coalesce(sum(${quotes.total}), 0)`,
    })
    .from(quotes)
    .groupBy(quotes.status);

  const byStatus: Record<QuoteStatus, number> = {
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    expired: 0,
  };
  let total = 0;
  let acceptedValue = 0;
  let pendingValue = 0;
  for (const r of rows) {
    byStatus[r.status] = r.c;
    total += r.c;
    if (r.status === "accepted") acceptedValue += Number(r.sum);
    if (r.status === "sent") pendingValue += Number(r.sum);
  }
  return { total, byStatus, acceptedValue, pendingValue };
}

export async function getQuote(
  id: string,
): Promise<{ quote: Quote; items: QuoteItem[] } | null> {
  const db = getDb();
  const [quote] = await db
    .select()
    .from(quotes)
    .where(eq(quotes.id, id))
    .limit(1);
  if (!quote) return null;
  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, id))
    .orderBy(quoteItems.sortOrder);
  return { quote, items };
}

export async function createQuote(
  input: QuoteInput,
  createdBy: string,
): Promise<string> {
  const db = getDb();
  const number = await nextQuoteNumber();
  const totals = computeTotals(input.items, input.taxRate);

  const [created] = await db
    .insert(quotes)
    .values({
      number,
      status: "draft",
      leadId: input.leadId ?? null,
      clientName: input.clientName,
      clientEmail: input.clientEmail || null,
      clientPhone: input.clientPhone || null,
      clientCompany: input.clientCompany || null,
      clientAddress: input.clientAddress || null,
      taxRate: String(input.taxRate),
      subtotal: String(totals.subtotal),
      taxAmount: String(totals.taxAmount),
      total: String(totals.total),
      notes: input.notes || null,
      validUntil: input.validUntil ?? null,
      createdBy,
    })
    .returning({ id: quotes.id });

  const quoteId = created.id;
  if (input.items.length > 0) {
    await db.insert(quoteItems).values(
      input.items.map((it, i) => ({
        quoteId,
        label: it.label,
        description: it.description || null,
        quantity: String(it.quantity),
        unit: it.unit,
        unitPrice: String(it.unitPrice),
        lineTotal: String(totals.lineTotals[i]),
        sortOrder: i,
      })),
    );
  }
  return quoteId;
}

export async function updateQuote(
  id: string,
  input: QuoteInput,
): Promise<void> {
  const db = getDb();
  const totals = computeTotals(input.items, input.taxRate);

  await db
    .update(quotes)
    .set({
      leadId: input.leadId ?? null,
      clientName: input.clientName,
      clientEmail: input.clientEmail || null,
      clientPhone: input.clientPhone || null,
      clientCompany: input.clientCompany || null,
      clientAddress: input.clientAddress || null,
      taxRate: String(input.taxRate),
      subtotal: String(totals.subtotal),
      taxAmount: String(totals.taxAmount),
      total: String(totals.total),
      notes: input.notes || null,
      validUntil: input.validUntil ?? null,
      updatedAt: new Date(),
    })
    .where(eq(quotes.id, id));

  // Remplace les lignes.
  await db.delete(quoteItems).where(eq(quoteItems.quoteId, id));
  if (input.items.length > 0) {
    await db.insert(quoteItems).values(
      input.items.map((it, i) => ({
        quoteId: id,
        label: it.label,
        description: it.description || null,
        quantity: String(it.quantity),
        unit: it.unit,
        unitPrice: String(it.unitPrice),
        lineTotal: String(totals.lineTotals[i]),
        sortOrder: i,
      })),
    );
  }
}

export async function setQuoteStatus(
  id: string,
  status: QuoteStatus,
): Promise<void> {
  const db = getDb();
  const patch: Record<string, unknown> = { status, updatedAt: new Date() };
  if (status === "sent") patch.sentAt = new Date();
  if (status === "accepted") patch.acceptedAt = new Date();
  await db.update(quotes).set(patch).where(eq(quotes.id, id));
}

export async function deleteQuote(id: string): Promise<void> {
  const db = getDb();
  await db.delete(quotes).where(eq(quotes.id, id));
}

/** Format EUR. */
export function eur(value: string | number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value));
}
