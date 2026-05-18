"use client";

import { useMemo } from "react";

interface SevenDayChartProps {
  data: { date: string; count: number }[];
}

const WEEKDAY_FR = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

/**
 * Lightweight SVG bar chart for the "last 7 days" leads stat. No chart
 * library — just hand-tuned bars + tooltips on hover.
 */
export function SevenDayChart({ data }: SevenDayChartProps) {
  const { max, bars } = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.count));
    const bars = data.map((d) => {
      const date = new Date(`${d.date}T00:00:00Z`);
      const label = WEEKDAY_FR[date.getUTCDay()];
      return { ...d, label, height: (d.count / max) * 100 };
    });
    return { max, bars };
  }, [data]);

  return (
    <div className="px-5 pb-5 pt-4">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">
          Pic à <span className="font-semibold text-white/55">{max}</span>{" "}
          {max > 1 ? "leads" : "lead"} / jour
        </p>
      </div>

      <div className="flex h-[160px] items-end gap-1.5">
        {bars.map((b, i) => (
          <div
            key={b.date}
            className="group relative flex h-full flex-1 flex-col items-center justify-end"
          >
            {/* Tooltip on hover */}
            <div
              className="
                pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-md
                border border-white/10 bg-black/85 px-2 py-1 text-[10px] font-medium tabular-nums text-white
                opacity-0 transition-opacity group-hover:opacity-100
              "
            >
              {b.count} {b.count === 1 ? "lead" : "leads"}
            </div>

            <div
              className={`
                w-full rounded-t-md transition-all duration-200
                ${
                  b.count === 0
                    ? "bg-white/[0.04]"
                    : "bg-gradient-to-t from-[#C84818] via-[#E85D2C] to-[#FF9A5C] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                }
                group-hover:from-[#E85D2C] group-hover:via-[#FF7A40] group-hover:to-[#FFB780]
              `}
              style={{
                height: b.count === 0 ? "8%" : `${Math.max(b.height, 6)}%`,
                animationDelay: `${i * 60}ms`,
              }}
            />
            <span className="mt-2 text-[10px] uppercase tracking-[0.1em] text-white/30">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
