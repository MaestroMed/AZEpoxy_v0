import Link from "next/link";
import {
  Download,
  Inbox,
  KanbanSquare,
  List,
  Search,
  X,
} from "lucide-react";
import { Card, PageHeader } from "@/components/admin/primitives";
import { LeadsKanban } from "@/components/admin/leads-kanban";
import { LeadsTable } from "@/components/admin/leads-table";
import { listLeads } from "@/lib/admin/queries";
import type { LeadSource, LeadStatus } from "@/lib/db";

interface LeadsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: LeadStatus;
    source?: LeadSource;
    view?: string;
  }>;
}

const STATUS_PILLS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "new", label: "Nouveaux" },
  { value: "contacted", label: "Contactés" },
  { value: "qualified", label: "Qualifiés" },
  { value: "won", label: "Gagnés" },
  { value: "lost", label: "Perdus" },
];

const SOURCE_PILLS: { value: LeadSource | "all"; label: string }[] = [
  { value: "all", label: "Toutes sources" },
  { value: "devis", label: "Devis" },
  { value: "contact", label: "Contact" },
  { value: "guide", label: "Guide" },
  { value: "abandoned", label: "Abandons" },
];

function buildQs(
  current: { q?: string; status?: string; source?: string; view?: string },
  patch: Partial<{ q?: string; status?: string; source?: string; view?: string }>,
): string {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.status && next.status !== "all") params.set("status", next.status);
  if (next.source && next.source !== "all") params.set("source", next.source);
  if (next.view) params.set("view", next.view);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export default async function LeadsListPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const { q, status, source, view } = params;
  const isKanban = view === "kanban";

  const { rows, total } = await listLeads({
    q,
    status,
    source,
    limit: isKanban ? 500 : 200,
  });

  const hasFilters = Boolean(q || status || source);
  const exportQs = buildQs(params, {});

  return (
    <>
      <PageHeader
        eyebrow="Leads"
        title={total === 0 ? "Leads" : `${total} ${total === 1 ? "lead" : "leads"}`}
        description="Demandes entrantes — formulaires devis, contact, guide téléchargé."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5">
              <Link
                href={`/admin/leads${buildQs(params, {})}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  !isKanban
                    ? "bg-white/[0.1] text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <List className="h-3.5 w-3.5" /> Liste
              </Link>
              <Link
                href={`/admin/leads${buildQs({ ...params, view: "kanban" }, {})}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  isKanban
                    ? "bg-white/[0.1] text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <KanbanSquare className="h-3.5 w-3.5" /> Pipeline
              </Link>
            </div>
            <a
              href={`/admin/leads/export${exportQs}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </a>
          </div>
        }
      />

      <div className="space-y-4 px-8 py-7">
        {/* Filters */}
        <Card>
          <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:gap-4">
            {/* Search */}
            <form
              method="GET"
              className="relative flex-1"
              action="/admin/leads"
            >
              {status && <input type="hidden" name="status" value={status} />}
              {source && <input type="hidden" name="source" value={source} />}
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
              />
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Rechercher nom, email, téléphone, message…"
                className="
                  w-full rounded-xl border border-white/[0.08] bg-black/30 py-2.5 pl-10 pr-10
                  text-sm text-white placeholder:text-white/30
                  focus:border-[#E85D2C]/55 focus:outline-none focus:ring-2 focus:ring-[#E85D2C]/15
                "
              />
              {q && (
                <Link
                  href={`/admin/leads${buildQs(params, { q: undefined })}`}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Link>
              )}
            </form>

            {/* Status pills */}
            <div className="flex flex-wrap items-center gap-1">
              {STATUS_PILLS.map((pill) => {
                const active =
                  pill.value === "all"
                    ? !status
                    : status === pill.value;
                return (
                  <Link
                    key={pill.value}
                    href={`/admin/leads${buildQs(params, { status: pill.value === "all" ? undefined : pill.value })}`}
                    aria-current={active ? "page" : undefined}
                    className={`
                      rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors
                      ${
                        active
                          ? "bg-white/[0.1] text-white"
                          : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"
                      }
                    `}
                  >
                    {pill.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Source row */}
          <div className="flex flex-wrap items-center gap-1 border-t border-white/[0.04] bg-black/15 px-5 py-3">
            {SOURCE_PILLS.map((pill) => {
              const active =
                pill.value === "all" ? !source : source === pill.value;
              return (
                <Link
                  key={pill.value}
                  href={`/admin/leads${buildQs(params, { source: pill.value === "all" ? undefined : pill.value })}`}
                  className={`
                    inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium transition-colors
                    ${
                      active
                        ? "bg-[#E85D2C]/[0.12] text-[#FFB780]"
                        : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"
                    }
                  `}
                >
                  {pill.label}
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Results */}
        {rows.length === 0 ? (
          <EmptyResults hasFilters={hasFilters} />
        ) : isKanban ? (
          <LeadsKanban leads={rows} />
        ) : (
          <LeadsTable rows={rows} />
        )}
      </div>
    </>
  );
}

function EmptyResults({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-16 text-center">
      <div
        aria-hidden
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]"
      >
        <Inbox className="h-5 w-5 text-white/40" />
      </div>
      <h2 className="mt-5 font-display text-lg font-black text-white">
        {hasFilters ? "Aucun résultat" : "Aucun lead pour l'instant"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
        {hasFilters
          ? "Essayez d'élargir les filtres ou de modifier la recherche."
          : "Les soumissions des formulaires apparaîtront ici dès la première demande."}
      </p>
      {hasFilters && (
        <Link
          href="/admin/leads"
          className="
            mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2
            text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70
            transition-colors hover:border-white/30 hover:text-white
          "
        >
          Réinitialiser les filtres
        </Link>
      )}
    </div>
  );
}
