import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Card, PageHeader, StatCard } from "@/components/admin/primitives";
import { formatRelativeFr, formatDateTimeFr } from "@/lib/admin/format";
import {
  getLatestQaRun,
  getRecentQaRuns,
} from "@/lib/admin/seo-queries";
import { getVilles } from "@/lib/villes-data";
import { triggerQaRunAction } from "./actions";
import type { SeoQaPageResult } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const [latest, history, villes] = await Promise.all([
    getLatestQaRun(),
    getRecentQaRuns(8),
    getVilles(),
  ]);

  const totalPages = latest ? latest.totalPages : 0;
  const ok = latest ? latest.okCount : 0;
  const ko = latest ? latest.koCount : 0;
  const successRate = totalPages > 0 ? Math.round((ok / totalPages) * 100) : 0;

  const koPages = latest
    ? Object.entries(latest.pages as Record<string, SeoQaPageResult>).filter(
        ([, r]) => !r.ok,
      )
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Santé SEO"
        title="Quality Check"
        description={`${villes.length} pages villes, ${ok} OK / ${ko} KO sur le dernier passage. Cron hebdo + bouton "Re-run" pour les contrôles ad-hoc.`}
        actions={
          <form action={triggerQaRunAction}>
            <button
              type="submit"
              className="
                inline-flex items-center gap-1.5 rounded-full border border-[#E85D2C]/35 bg-[#E85D2C]/[0.1] px-3.5 py-1.5
                text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FFB780]
                transition-colors hover:border-[#E85D2C]/55 hover:bg-[#E85D2C]/[0.18]
              "
            >
              <RefreshCcw className="h-3 w-3" />
              Re-run QA
            </button>
          </form>
        }
      />

      <div className="space-y-6 px-8 py-7">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            label="Pages auditées"
            value={totalPages}
            hint={`+ ${villes.length} villes`}
          />
          <StatCard
            label="Pages OK"
            value={ok}
            hint={`${successRate}% de succès`}
          />
          <StatCard
            label="Pages KO"
            value={ko}
            hint={ko === 0 ? "Aucun défaut" : "à corriger"}
            accent={ko > 0}
          />
          <StatCard
            label="Dernier run"
            value={
              latest
                ? formatRelativeFr(latest.ranAt)
                : "Jamais"
            }
            hint={
              latest
                ? `${latest.durationMs / 1000}s · ${latest.trigger}`
                : "Lance un premier passage"
            }
          />
        </div>

        {/* Pages KO list */}
        <Card
          title="Pages avec défaut"
          hint={
            ko === 0
              ? "Aucune page en échec"
              : `${ko} pages à inspecter`
          }
        >
          {koPages.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06]">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">
                Toutes les pages passent les contrôles.
              </p>
              <p className="mt-1 text-[12px] text-white/40">
                {latest
                  ? `Dernier passage il y a ${formatRelativeFr(latest.ranAt)} — ${ok}/${totalPages} OK.`
                  : "Lance un premier QA pour voir les résultats."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {koPages.map(([path, result]) => (
                <li
                  key={path}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-300" />
                  <div className="min-w-0 flex-1">
                    <a
                      href={path}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-center gap-1.5 truncate font-mono text-[13px] text-white transition-colors hover:text-[#FFB780]"
                    >
                      {path}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                    <p className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                      {result.issues.map((iss) => (
                        <span
                          key={iss}
                          className="inline-flex items-center rounded-md bg-amber-300/[0.1] px-1.5 py-0.5 font-mono font-medium text-amber-200"
                        >
                          {iss}
                        </span>
                      ))}
                    </p>
                  </div>
                  {result.wordCount !== undefined && (
                    <span className="shrink-0 text-[11px] tabular-nums text-white/40">
                      {result.wordCount} mots
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* History */}
        <Card title="Historique des passages" hint={`${history.length} runs`}>
          {history.length === 0 ? (
            <div className="px-5 py-10 text-center text-[12px] text-white/35">
              Aucun passage enregistré pour le moment.
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {history.map((run) => {
                const total = run.totalPages;
                const runOk = run.okCount;
                const runKo = run.koCount;
                const rate = total > 0 ? Math.round((runOk / total) * 100) : 0;
                return (
                  <li
                    key={run.id}
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    <Globe className="h-4 w-4 shrink-0 text-white/40" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-white">
                        {formatDateTimeFr(run.ranAt)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/40">
                        {runOk}/{total} OK · {runKo} KO ·{" "}
                        {run.durationMs / 1000}s · {run.trigger}
                      </p>
                    </div>
                    <span
                      className={`
                        inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]
                        ${
                          rate >= 95
                            ? "bg-emerald-400/[0.1] text-emerald-300"
                            : rate >= 80
                              ? "bg-amber-300/[0.1] text-amber-200"
                              : "bg-red-400/[0.1] text-red-200"
                        }
                      `}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {rate}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Help */}
        <Card title="Cadence & monitoring">
          <div className="space-y-3 px-5 py-4 text-[13px] leading-relaxed text-white/65">
            <p>
              Le job <code className="text-[#FFB780]">/api/cron/qa-villes</code>{" "}
              tourne automatiquement <strong>chaque lundi à 3h UTC</strong> via
              Vercel Cron. Il visite les ~{villes.length + 9} pages clés en
              HTTP, vérifie le statut, la présence des balises critiques
              (title, H1, canonical, JSON-LD LocalBusiness / FAQPage /
              BreadcrumbList) et le word count minimum.
            </p>
            <p>
              Pour une vérification visuelle (regression UI), brancher Chrome
              MCP + Vision pour screenshot chaque page et comparer aux
              baselines — phase 2.
            </p>
            <p className="text-white/40">
              Sécurisé par <code>CRON_SECRET</code> en header
              <code className="ml-1">Authorization: Bearer …</code>. Le bouton
              ci-dessus le passe automatiquement côté serveur.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
