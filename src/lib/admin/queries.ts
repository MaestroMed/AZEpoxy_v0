import "server-only";
import { desc, eq, gte, sql } from "drizzle-orm";
import {
  getDb,
  leads,
  leadEvents,
  type Lead,
  type LeadEvent,
  type LeadSource,
  type LeadStatus,
} from "@/lib/db";

/**
 * Aggregated read helpers for the backoffice. Co-located so the dashboard,
 * leads list, and detail view can all import from one place.
 */

export interface DashboardStats {
  total: number;
  newCount: number;
  weekCount: number;
  prevWeekCount: number;
  conversionRate: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  /** Last 7 days, oldest → newest. */
  last7Days: { date: string; count: number }[];
  recent: Lead[];
}

const ALL_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
];
const ALL_SOURCES: LeadSource[] = [
  "devis",
  "contact",
  "guide",
  "abandoned",
  "other",
];

function emptyMap<K extends string>(keys: readonly K[]): Record<K, number> {
  return Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
}

function dayKey(d: Date): string {
  // YYYY-MM-DD in UTC — matches Postgres' date::text format
  return d.toISOString().slice(0, 10);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = getDb();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    totalRows,
    statusRows,
    sourceRows,
    last7Rows,
    weekRows,
    prevWeekRows,
    recentRows,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(leads),

    db
      .select({
        status: leads.status,
        count: sql<number>`count(*)::int`,
      })
      .from(leads)
      .groupBy(leads.status),

    db
      .select({
        source: leads.source,
        count: sql<number>`count(*)::int`,
      })
      .from(leads)
      .groupBy(leads.source),

    db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${leads.createdAt}), 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(leads)
      .where(gte(leads.createdAt, weekAgo))
      .groupBy(sql`date_trunc('day', ${leads.createdAt})`)
      .orderBy(sql`date_trunc('day', ${leads.createdAt})`),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(gte(leads.createdAt, weekAgo)),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(
        sql`${leads.createdAt} >= ${twoWeeksAgo.toISOString()} AND ${leads.createdAt} < ${weekAgo.toISOString()}`,
      ),

    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6),
  ]);

  const total = totalRows[0]?.count ?? 0;

  const byStatus = emptyMap(ALL_STATUSES);
  for (const r of statusRows) byStatus[r.status] = r.count;

  const bySource = emptyMap(ALL_SOURCES);
  for (const r of sourceRows) bySource[r.source] = r.count;

  // Backfill last 7 days with zeroes for missing days, oldest → newest
  const dayCounts = new Map(last7Rows.map((r) => [r.date, r.count]));
  const last7Days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = dayKey(d);
    last7Days.push({ date: key, count: dayCounts.get(key) ?? 0 });
  }

  const conversionRate =
    total === 0
      ? 0
      : Math.round(((byStatus.won + byStatus.qualified) / total) * 100);

  return {
    total,
    newCount: byStatus.new,
    weekCount: weekRows[0]?.count ?? 0,
    prevWeekCount: prevWeekRows[0]?.count ?? 0,
    conversionRate,
    byStatus,
    bySource,
    last7Days,
    recent: recentRows,
  };
}

/* ─── Leads list (with optional filters) ──────────────────────────── */

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  q?: string;
  limit?: number;
  offset?: number;
}

export async function listLeads(
  filters: LeadFilters = {},
): Promise<{ rows: Lead[]; total: number }> {
  const db = getDb();
  const conditions: ReturnType<typeof sql>[] = [];

  if (filters.status) {
    conditions.push(sql`${leads.status} = ${filters.status}`);
  }
  if (filters.source) {
    conditions.push(sql`${leads.source} = ${filters.source}`);
  }
  if (filters.q && filters.q.trim().length > 0) {
    const pattern = `%${filters.q.trim()}%`;
    conditions.push(
      sql`(${leads.name} ILIKE ${pattern} OR ${leads.email} ILIKE ${pattern} OR ${leads.phone} ILIKE ${pattern} OR ${leads.message} ILIKE ${pattern})`,
    );
  }

  const whereClause =
    conditions.length === 0
      ? undefined
      : conditions.reduce((acc, cur, i) =>
          i === 0 ? cur : sql`${acc} AND ${cur}`,
        );

  const [rows, countRows] = await Promise.all([
    whereClause
      ? db
          .select()
          .from(leads)
          .where(whereClause)
          .orderBy(desc(leads.createdAt))
          .limit(filters.limit ?? 50)
          .offset(filters.offset ?? 0)
      : db
          .select()
          .from(leads)
          .orderBy(desc(leads.createdAt))
          .limit(filters.limit ?? 50)
          .offset(filters.offset ?? 0),

    whereClause
      ? db
          .select({ count: sql<number>`count(*)::int` })
          .from(leads)
          .where(whereClause)
      : db.select({ count: sql<number>`count(*)::int` }).from(leads),
  ]);

  return { rows, total: countRows[0]?.count ?? 0 };
}

/* ─── Single lead + its events ────────────────────────────────────── */

export async function getLeadById(
  id: string,
): Promise<{ lead: Lead; events: LeadEvent[] } | null> {
  const db = getDb();
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) return null;

  const events = await db
    .select()
    .from(leadEvents)
    .where(eq(leadEvents.leadId, id))
    .orderBy(desc(leadEvents.createdAt));

  return { lead, events };
}
