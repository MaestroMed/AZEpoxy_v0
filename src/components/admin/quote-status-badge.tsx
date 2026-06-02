import type { QuoteStatus } from "@/lib/db";

const STYLES: Record<QuoteStatus, { label: string; classes: string }> = {
  draft: { label: "Brouillon", classes: "border-white/15 bg-white/[0.04] text-white/55" },
  sent: { label: "Envoyé", classes: "border-blue-400/25 bg-blue-400/[0.08] text-blue-300" },
  accepted: { label: "Accepté", classes: "border-emerald-400/30 bg-emerald-400/[0.1] text-emerald-300" },
  rejected: { label: "Refusé", classes: "border-red-400/25 bg-red-400/[0.08] text-red-300" },
  expired: { label: "Expiré", classes: "border-amber-300/25 bg-amber-300/[0.08] text-amber-200" },
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const m = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${m.classes}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "currentColor" }} />
      {m.label}
    </span>
  );
}

export function quoteStatusLabel(status: QuoteStatus): string {
  return STYLES[status].label;
}
