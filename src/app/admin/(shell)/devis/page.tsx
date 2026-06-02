import Link from "next/link";
import { ArrowUpRight, FilePlus2, FileText } from "lucide-react";
import { Card, PageHeader, StatCard } from "@/components/admin/primitives";
import { QuoteStatusBadge } from "@/components/admin/quote-status-badge";
import { listQuotes, getQuoteStats, eur } from "@/lib/admin/quotes";
import { formatRelativeFr } from "@/lib/admin/format";
import type { QuoteStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

interface DevisPageProps {
  searchParams: Promise<{ status?: QuoteStatus }>;
}

const PILLS: { value: QuoteStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "draft", label: "Brouillons" },
  { value: "sent", label: "Envoyés" },
  { value: "accepted", label: "Acceptés" },
  { value: "rejected", label: "Refusés" },
  { value: "expired", label: "Expirés" },
];

export default async function DevisPage({ searchParams }: DevisPageProps) {
  const { status } = await searchParams;
  const [rows, stats] = await Promise.all([
    listQuotes({ status }),
    getQuoteStats(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Devis"
        description="Création, suivi et génération PDF des devis clients."
        actions={
          <Link
            href="/admin/devis/nouveau"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#FF7A40] to-[#C84818] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(232,93,44,0.7)] transition-transform hover:-translate-y-px"
          >
            <FilePlus2 className="h-3.5 w-3.5" /> Nouveau devis
          </Link>
        }
      />

      <div className="space-y-6 px-8 py-7">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard label="Devis — total" value={stats.total} />
          <StatCard
            label="En attente"
            value={stats.byStatus.sent}
            hint={eur(stats.pendingValue)}
            accent={stats.byStatus.sent > 0}
          />
          <StatCard
            label="Acceptés"
            value={stats.byStatus.accepted}
            hint={eur(stats.acceptedValue)}
          />
          <StatCard label="Brouillons" value={stats.byStatus.draft} />
        </div>

        <Card>
          <div className="flex flex-wrap items-center gap-1 border-b border-white/[0.05] p-3">
            {PILLS.map((pill) => {
              const active =
                pill.value === "all" ? !status : status === pill.value;
              return (
                <Link
                  key={pill.value}
                  href={
                    pill.value === "all"
                      ? "/admin/devis"
                      : `/admin/devis?status=${pill.value}`
                  }
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? "bg-white/[0.1] text-white"
                      : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  {pill.label}
                </Link>
              );
            })}
          </div>

          {rows.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                <FileText className="h-5 w-5 text-white/40" />
              </div>
              <p className="mt-5 font-display text-lg font-black text-white">
                Aucun devis
              </p>
              <p className="mt-2 text-sm text-white/45">
                Créez votre premier devis ou convertissez un lead.
              </p>
              <Link
                href="/admin/devis/nouveau"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[#E85D2C]/35 bg-[#E85D2C]/[0.1] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FFB780] hover:bg-[#E85D2C]/[0.18]"
              >
                <FilePlus2 className="h-3.5 w-3.5" /> Nouveau devis
              </Link>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] text-left text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  <th className="px-5 py-3 font-semibold">Numéro</th>
                  <th className="px-3 py-3 font-semibold">Client</th>
                  <th className="px-3 py-3 font-semibold">Montant TTC</th>
                  <th className="px-3 py-3 font-semibold">Statut</th>
                  <th className="px-3 py-3 font-semibold">Créé</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((q) => (
                  <tr
                    key={q.id}
                    className="group border-b border-white/[0.03] last:border-0 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/devis/${q.id}`}
                        className="font-mono text-[13px] font-semibold text-white hover:text-[#FFB780]"
                      >
                        {q.number}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="font-medium text-white">{q.clientName}</p>
                      {q.clientCompany && (
                        <p className="text-[12px] text-white/40">
                          {q.clientCompany}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3.5 font-semibold tabular-nums text-white">
                      {eur(q.total)}
                    </td>
                    <td className="px-3 py-3.5">
                      <QuoteStatusBadge status={q.status} />
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-[12px] tabular-nums text-white/40">
                      {formatRelativeFr(q.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/devis/${q.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/40 transition-colors group-hover:text-[#FFB780]"
                      >
                        Ouvrir <ArrowUpRight className="h-3 w-3" />
                      </Link>
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
