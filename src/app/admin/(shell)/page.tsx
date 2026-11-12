import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Inbox } from "lucide-react";
import {
  Card,
  PageHeader,
  SourceBadge,
  StatCard,
  StatusBadge,
} from "@/components/admin/primitives";
import { SevenDayChart } from "@/components/admin/seven-day-chart";
import { SourceBreakdown } from "@/components/admin/source-breakdown";
import {
  countLeadsWithEmailFailure,
  getDashboardStats,
} from "@/lib/admin/queries";
import { formatRelativeFr } from "@/lib/admin/format";

export default async function AdminDashboardPage() {
  const [stats, emailFailures] = await Promise.all([
    getDashboardStats(),
    countLeadsWithEmailFailure(),
  ]);

  // Empty state — first run, no leads yet
  if (stats.total === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Tableau de bord"
          title="Bienvenue"
          description="Vue d'ensemble des demandes entrantes — devis, contact, guide téléchargé."
        />
        <div className="px-8 py-10">
          <EmptyDashboard />
        </div>
      </>
    );
  }

  const weekDelta = stats.weekCount - stats.prevWeekCount;

  return (
    <>
      <PageHeader
        eyebrow="Tableau de bord"
        title="Vue d'ensemble"
        description="Activité des 7 derniers jours, répartition par source et statut, derniers leads reçus."
      />

      <div className="space-y-6 px-8 py-7">
        {emailFailures > 0 && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.08] px-5 py-4 text-sm text-amber-100"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            <p className="leading-relaxed">
              <strong>
                {emailFailures} {emailFailures === 1 ? "demande" : "demandes"}{" "}
                des 30 derniers jours
              </strong>{" "}
              {emailFailures === 1 ? "n'a" : "n'ont"} pas pu être
              {emailFailures === 1 ? " notifiée" : " notifiées"} par email : elles
              ne sont visibles qu&apos;ici. Le motif exact figure sur chaque
              fiche ; le bouton de test des{" "}
              <Link href="/admin/settings" className="font-semibold underline">
                Paramètres
              </Link>{" "}
              indique si l&apos;envoi fonctionne à nouveau.
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            label="Leads — total"
            value={stats.total}
            hint="depuis le lancement"
          />
          <StatCard
            label="Nouveaux"
            value={stats.newCount}
            hint="à traiter"
            accent={stats.newCount > 0}
          />
          <StatCard
            label="Cette semaine"
            value={stats.weekCount}
            delta={weekDelta}
            hint={`vs semaine précédente (${stats.prevWeekCount})`}
          />
          <StatCard
            label="Conversion"
            value={`${stats.conversionRate}%`}
            hint="qualifié + gagné"
          />
        </div>

        {/* Chart + breakdown */}
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Card title="Évolution sur 7 jours" hint="Leads par jour">
            <SevenDayChart data={stats.last7Days} />
          </Card>
          <Card title="Par source" hint={`${stats.total} au total`}>
            <SourceBreakdown data={stats.bySource} />
          </Card>
        </div>

        {/* Recent leads */}
        <Card
          title="Leads récents"
          hint={
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/55 transition-colors hover:text-white"
            >
              Voir tous
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
        >
          <ul className="divide-y divide-white/[0.04]">
            {stats.recent.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {lead.name}
                      </p>
                      <SourceBadge source={lead.source} />
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-white/45">
                      {lead.email ?? lead.phone ?? "—"}
                      {lead.projectType && ` · ${lead.projectType}`}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                  <span className="ml-2 hidden text-[11px] tabular-nums text-white/30 sm:inline">
                    {formatRelativeFr(lead.createdAt)}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

/* ─── Empty dashboard ─────────────────────────────────────────────── */

function EmptyDashboard() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-10 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(232,93,44,0.22), transparent 75%)",
            filter: "blur(20px)",
          }}
        />

        <div
          aria-hidden
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]"
        >
          <Inbox className="h-6 w-6 text-[#FFB780]" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-black tracking-tight text-white">
          Aucun lead pour l&apos;instant
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
          Les soumissions des formulaires apparaîtront ici, avec leur source,
          statut et timeline. La table est branchée et prête.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 text-left">
          <SourceHint label="Devis" href="/devis" />
          <SourceHint label="Contact" href="/contact" />
          <SourceHint label="Guide" href="/" />
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
        Système opérationnel · En attente de la première soumission
      </p>
    </div>
  );
}

function SourceHint({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="
        group rounded-xl border border-white/[0.05] bg-black/[0.2] px-3 py-2.5
        text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55
        transition-all hover:border-white/15 hover:text-white
      "
    >
      <span className="flex items-center justify-between">
        <span>{label}</span>
        <ArrowUpRight className="h-3 w-3 text-white/25 transition-colors group-hover:text-[#FFB780]" />
      </span>
    </Link>
  );
}
