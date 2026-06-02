import "server-only";
import { sql } from "drizzle-orm";
import { getDb, leads, type LeadSource, type LeadStatus } from "@/lib/db";

/**
 * Analytics avancées — agrégations sur leads + lead_events pour le
 * dashboard /admin/analytics.
 */

export interface AnalyticsData {
  total: number;
  monthCount: number;
  prevMonthCount: number;
  funnel: Record<LeadStatus, number>;
  conversionRate: number; // (won) / total
  qualificationRate: number; // (qualified + won) / total
  winRate: number; // won / (won + lost)
  /** Délai médian/moyen de premier contact en heures. */
  avgFirstContactHours: number | null;
  bySource: {
    source: LeadSource;
    total: number;
    won: number;
    conversion: number;
  }[];
  /** 12 derniers mois, oldest → newest. */
  monthly: { month: string; label: string; count: number; won: number }[];
}

const ALL_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
];
const MONTHS_FR = [
  "jan", "fév", "mar", "avr", "mai", "juin",
  "juil", "août", "sep", "oct", "nov", "déc",
];

export async function getAnalytics(): Promise<AnalyticsData> {
  const db = getDb();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twelveAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalRows,
    statusRows,
    monthRows,
    prevMonthRows,
    sourceRows,
    sourceWonRows,
    monthlyRows,
    monthlyWonRows,
    firstContactRes,
  ] = await Promise.all([
    db.select({ c: sql<number>`count(*)::int` }).from(leads),
    db
      .select({ status: leads.status, c: sql<number>`count(*)::int` })
      .from(leads)
      .groupBy(leads.status),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(leads)
      .where(sql`${leads.createdAt} >= ${monthStart.toISOString()}`),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(leads)
      .where(
        sql`${leads.createdAt} >= ${prevMonthStart.toISOString()} AND ${leads.createdAt} < ${monthStart.toISOString()}`,
      ),
    db
      .select({ source: leads.source, c: sql<number>`count(*)::int` })
      .from(leads)
      .groupBy(leads.source),
    db
      .select({ source: leads.source, c: sql<number>`count(*)::int` })
      .from(leads)
      .where(sql`${leads.status} = 'won'`)
      .groupBy(leads.source),
    db
      .select({
        m: sql<string>`to_char(date_trunc('month', ${leads.createdAt}), 'YYYY-MM')`,
        c: sql<number>`count(*)::int`,
      })
      .from(leads)
      .where(sql`${leads.createdAt} >= ${twelveAgo.toISOString()}`)
      .groupBy(sql`date_trunc('month', ${leads.createdAt})`),
    db
      .select({
        m: sql<string>`to_char(date_trunc('month', ${leads.createdAt}), 'YYYY-MM')`,
        c: sql<number>`count(*)::int`,
      })
      .from(leads)
      .where(
        sql`${leads.createdAt} >= ${twelveAgo.toISOString()} AND ${leads.status} = 'won'`,
      )
      .groupBy(sql`date_trunc('month', ${leads.createdAt})`),
    // Délai moyen jusqu'au 1er event "contacted" par lead — requête brute.
    db.execute(sql`
      SELECT avg(extract(epoch from (e.first_contact - l.created_at)) / 3600.0) AS avg_hours
      FROM leads l
      JOIN (
        SELECT lead_id, min(created_at) AS first_contact
        FROM lead_events
        WHERE type = 'contacted'
        GROUP BY lead_id
      ) e ON e.lead_id = l.id
    `),
  ]);

  const total = totalRows[0]?.c ?? 0;
  const funnel = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, 0]),
  ) as Record<LeadStatus, number>;
  for (const r of statusRows) funnel[r.status] = r.c;

  const won = funnel.won;
  const lost = funnel.lost;
  const conversionRate = total ? Math.round((won / total) * 100) : 0;
  const qualificationRate = total
    ? Math.round(((funnel.qualified + won) / total) * 100)
    : 0;
  const winRate = won + lost ? Math.round((won / (won + lost)) * 100) : 0;

  const wonBySource = new Map(sourceWonRows.map((r) => [r.source, r.c]));
  const bySource = sourceRows
    .map((r) => {
      const w = wonBySource.get(r.source) ?? 0;
      return {
        source: r.source,
        total: r.c,
        won: w,
        conversion: r.c ? Math.round((w / r.c) * 100) : 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  // Backfill 12 months
  const wonByMonth = new Map(monthlyWonRows.map((r) => [r.m, r.c]));
  const countByMonth = new Map(monthlyRows.map((r) => [r.m, r.c]));
  const monthly: AnalyticsData["monthly"] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthly.push({
      month: key,
      label: MONTHS_FR[d.getMonth()],
      count: countByMonth.get(key) ?? 0,
      won: wonByMonth.get(key) ?? 0,
    });
  }

  // db.execute renvoie soit un array, soit { rows } selon le driver.
  const fcRows = (Array.isArray(firstContactRes)
    ? firstContactRes
    : (firstContactRes as { rows?: unknown[] }).rows) as
    | { avg_hours: string | number | null }[]
    | undefined;
  const avgRaw = fcRows?.[0]?.avg_hours;
  const avgFirstContactHours =
    avgRaw == null ? null : Math.round(Number(avgRaw) * 10) / 10;

  return {
    total,
    monthCount: monthRows[0]?.c ?? 0,
    prevMonthCount: prevMonthRows[0]?.c ?? 0,
    funnel,
    conversionRate,
    qualificationRate,
    winRate,
    avgFirstContactHours,
    bySource,
    monthly,
  };
}
