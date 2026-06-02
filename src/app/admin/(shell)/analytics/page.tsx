import { Clock, Target, TrendingUp } from "lucide-react";
import { Card, PageHeader, StatCard } from "@/components/admin/primitives";
import { getAnalytics } from "@/lib/admin/analytics";
import type { LeadSource, LeadStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Nouveaux",
  contacted: "Contactés",
  qualified: "Qualifiés",
  won: "Gagnés",
  lost: "Perdus",
};
const STATUS_COLOR: Record<LeadStatus, string> = {
  new: "#E85D2C",
  contacted: "#60A5FA",
  qualified: "#FBBF24",
  won: "#34D399",
  lost: "#6B7280",
};
const SOURCE_LABEL: Record<LeadSource, string> = {
  devis: "Devis",
  contact: "Contact",
  guide: "Guide",
  abandoned: "Abandon",
  other: "Autre",
};

export default async function AnalyticsPage() {
  const a = await getAnalytics();
  const monthDelta = a.monthCount - a.prevMonthCount;
  const maxMonthly = Math.max(1, ...a.monthly.map((m) => m.count));
  // Funnel ordering
  const funnelOrder: LeadStatus[] = ["new", "contacted", "qualified", "won"];

  return (
    <>
      <PageHeader
        eyebrow="Pilotage"
        title="Analytics"
        description="Funnel de conversion, tendance sur 12 mois, performance par source et délai de réponse."
      />

      <div className="space-y-6 px-8 py-7">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard label="Leads — total" value={a.total} hint="depuis le lancement" />
          <StatCard
            label="Ce mois"
            value={a.monthCount}
            delta={monthDelta}
            hint={`vs mois précédent (${a.prevMonthCount})`}
            accent={a.monthCount > 0}
          />
          <StatCard
            label="Conversion"
            value={`${a.conversionRate}%`}
            hint="leads gagnés / total"
          />
          <StatCard
            label="Délai 1er contact"
            value={a.avgFirstContactHours == null ? "—" : `${a.avgFirstContactHours} h`}
            hint="moyenne reçu → contacté"
          />
        </div>

        {/* Funnel + win rate */}
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Card title="Funnel de conversion" hint="du lead reçu au gagné">
            <div className="space-y-3 px-5 py-5">
              {funnelOrder.map((status) => {
                const count = a.funnel[status];
                const pct = a.total ? Math.round((count / a.total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="mb-1 flex items-baseline justify-between text-sm">
                      <span className="flex items-center gap-2 text-white/80">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: STATUS_COLOR[status] }}
                        />
                        {STATUS_LABEL[status]}
                      </span>
                      <span className="tabular-nums text-white/55">
                        {count}{" "}
                        <span className="text-white/30">· {pct}%</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: STATUS_COLOR[status],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 pt-1 text-[12px] text-white/40">
                <span className="h-2 w-2 rounded-full bg-[#6B7280]" />
                Perdus : {a.funnel.lost}
              </div>
            </div>
          </Card>

          <Card title="Taux clés">
            <div className="grid grid-cols-1 divide-y divide-white/[0.05]">
              <RateRow
                icon={<Target className="h-4 w-4" />}
                label="Qualification"
                value={`${a.qualificationRate}%`}
                hint="qualifiés + gagnés / total"
              />
              <RateRow
                icon={<TrendingUp className="h-4 w-4" />}
                label="Win rate"
                value={`${a.winRate}%`}
                hint="gagnés / (gagnés + perdus)"
              />
              <RateRow
                icon={<Clock className="h-4 w-4" />}
                label="Délai contact"
                value={
                  a.avgFirstContactHours == null
                    ? "—"
                    : `${a.avgFirstContactHours} h`
                }
                hint="moyenne de réactivité"
              />
            </div>
          </Card>
        </div>

        {/* Monthly trend */}
        <Card title="Évolution sur 12 mois" hint="leads reçus (et gagnés) par mois">
          <div className="px-5 pb-5 pt-4">
            <div className="flex h-[180px] items-end gap-2">
              {a.monthly.map((m) => {
                const h = (m.count / maxMonthly) * 100;
                const wonH = m.count ? (m.won / m.count) * h : 0;
                return (
                  <div
                    key={m.month}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end"
                  >
                    <div className="pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2 py-1 text-[10px] tabular-nums text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {m.count} reçus · {m.won} gagnés
                    </div>
                    <div
                      className="relative w-full overflow-hidden rounded-t-md bg-white/[0.06]"
                      style={{ height: `${Math.max(h, 3)}%` }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#C84818] to-[#FF9A5C]"
                        style={{ height: m.count ? "100%" : "0" }}
                      />
                      <div
                        className="absolute bottom-0 w-full bg-[#34D399]/80"
                        style={{ height: `${(wonH / Math.max(h, 1)) * 100}%` }}
                      />
                    </div>
                    <span className="mt-2 text-[10px] uppercase tracking-wide text-white/30">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-4 text-[11px] text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-gradient-to-t from-[#C84818] to-[#FF9A5C]" />
                Reçus
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-[#34D399]/80" />
                Gagnés
              </span>
            </div>
          </div>
        </Card>

        {/* Source performance */}
        <Card title="Performance par source" hint="volume + taux de conversion">
          {a.bySource.length === 0 ? (
            <div className="px-5 py-10 text-center text-[12px] text-white/35">
              Pas encore de données.
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] text-left text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  <th className="px-5 py-3 font-semibold">Source</th>
                  <th className="px-3 py-3 font-semibold">Total</th>
                  <th className="px-3 py-3 font-semibold">Gagnés</th>
                  <th className="px-5 py-3 font-semibold">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {a.bySource.map((s) => (
                  <tr
                    key={s.source}
                    className="border-b border-white/[0.03] last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-white">
                      {SOURCE_LABEL[s.source]}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-white/70">
                      {s.total}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-emerald-300">
                      {s.won}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#FF9A5C] to-[#E85D2C]"
                            style={{ width: `${s.conversion}%` }}
                          />
                        </div>
                        <span className="tabular-nums text-[12px] text-white/55">
                          {s.conversion}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}

function RateRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E85D2C]/[0.1] text-[#FFB780]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">
          {label}
        </p>
        <p className="text-[11px] text-white/35">{hint}</p>
      </div>
      <p className="font-display text-2xl font-black tabular-nums text-white">
        {value}
      </p>
    </div>
  );
}
