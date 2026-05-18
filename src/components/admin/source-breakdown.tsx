import type { LeadSource } from "@/lib/db";

interface SourceBreakdownProps {
  data: Record<LeadSource, number>;
}

const SOURCE_LABELS: Record<LeadSource, string> = {
  devis: "Devis",
  contact: "Contact",
  guide: "Guide téléchargé",
  abandoned: "Devis abandonné",
  other: "Autre",
};

const SOURCE_DOT: Record<LeadSource, string> = {
  devis: "#E85D2C",
  contact: "#FF9A5C",
  guide: "#FFB780",
  abandoned: "#6E6E80",
  other: "#444452",
};

export function SourceBreakdown({ data }: SourceBreakdownProps) {
  const total = Object.values(data).reduce((acc, n) => acc + n, 0);
  const entries = (Object.entries(data) as [LeadSource, number][])
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  if (total === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-[12px] text-white/35">
          Aucune donnée à afficher pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5 pt-4">
      <ul className="flex flex-col gap-3">
        {entries.map(([source, count]) => {
          const pct = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <li key={source} className="flex items-center gap-3 text-sm">
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: SOURCE_DOT[source] }}
              />
              <span className="flex-1 truncate text-white/80">
                {SOURCE_LABELS[source]}
              </span>
              <span className="tabular-nums text-white/45">{count}</span>
              <span className="w-9 text-right tabular-nums text-[11px] text-white/30">
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
