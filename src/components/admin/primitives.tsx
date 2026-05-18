import type { ReactNode } from "react";
import type { LeadSource, LeadStatus } from "@/lib/db";

/* ─── Page header ─────────────────────────────────────────────────── */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-white/[0.05] px-8 py-7 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFB780]/80">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[28px] font-black leading-tight tracking-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-sm text-white/45">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ─── Stat card ───────────────────────────────────────────────────── */

export function StatCard({
  label,
  value,
  delta,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  /** Delta vs previous period. Positive = up, negative = down. */
  delta?: number;
  hint?: string;
  /** Adds a subtle ember glow on the corner — for KPIs that matter most. */
  accent?: boolean;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border bg-white/[0.02] p-5
        ${accent ? "border-[#E85D2C]/25" : "border-white/[0.06]"}
        transition-colors hover:border-white/[0.12]
      `}
    >
      {accent && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(232,93,44,0.28), transparent 75%)",
            filter: "blur(8px)",
          }}
        />
      )}
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>
      <p className="mt-3 font-display text-[34px] font-black leading-none tabular-nums tracking-tight text-white">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-2 text-[11px]">
        {typeof delta === "number" && delta !== 0 && (
          <span
            className={`
              inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold tabular-nums
              ${
                delta > 0
                  ? "bg-emerald-500/[0.12] text-emerald-300"
                  : "bg-red-500/[0.12] text-red-300"
              }
            `}
          >
            {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}
          </span>
        )}
        {hint && <span className="text-white/35">{hint}</span>}
      </div>
    </div>
  );
}

/* ─── Status badge ────────────────────────────────────────────────── */

const STATUS_STYLES: Record<LeadStatus, { label: string; classes: string }> = {
  new: {
    label: "Nouveau",
    classes: "border-[#E85D2C]/30 bg-[#E85D2C]/[0.1] text-[#FFB780]",
  },
  contacted: {
    label: "Contacté",
    classes: "border-blue-400/25 bg-blue-400/[0.08] text-blue-300",
  },
  qualified: {
    label: "Qualifié",
    classes: "border-amber-300/25 bg-amber-300/[0.08] text-amber-200",
  },
  won: {
    label: "Gagné",
    classes: "border-emerald-400/30 bg-emerald-400/[0.1] text-emerald-300",
  },
  lost: {
    label: "Perdu",
    classes: "border-white/15 bg-white/[0.04] text-white/40",
  },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_STYLES[status];
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase tracking-[0.12em]
        ${meta.classes}
      `}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "currentColor" }}
      />
      {meta.label}
    </span>
  );
}

export function statusLabel(status: LeadStatus): string {
  return STATUS_STYLES[status].label;
}

/* ─── Source badge ────────────────────────────────────────────────── */

const SOURCE_STYLES: Record<LeadSource, { label: string; classes: string }> = {
  devis: {
    label: "Devis",
    classes: "bg-white/[0.04] text-white/80",
  },
  contact: {
    label: "Contact",
    classes: "bg-white/[0.04] text-white/80",
  },
  guide: {
    label: "Guide",
    classes: "bg-white/[0.04] text-white/80",
  },
  abandoned: {
    label: "Abandon",
    classes: "bg-white/[0.04] text-white/55",
  },
  other: {
    label: "Autre",
    classes: "bg-white/[0.04] text-white/55",
  },
};

export function SourceBadge({ source }: { source: LeadSource }) {
  const meta = SOURCE_STYLES[source];
  return (
    <span
      className={`
        inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide
        ${meta.classes}
      `}
    >
      {meta.label}
    </span>
  );
}

/* ─── Card ─────────────────────────────────────────────────────────── */

export function Card({
  title,
  hint,
  children,
  className,
}: {
  title?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`
        rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden
        ${className ?? ""}
      `}
    >
      {(title || hint) && (
        <div className="flex items-baseline justify-between border-b border-white/[0.05] px-5 py-4">
          {title && (
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
              {title}
            </h2>
          )}
          {hint && <p className="text-[11px] text-white/30">{hint}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
