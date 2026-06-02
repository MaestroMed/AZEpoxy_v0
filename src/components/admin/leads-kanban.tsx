"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { GripVertical, Loader2 } from "lucide-react";
import { updateLeadStatusAction } from "@/app/admin/(shell)/leads/actions";
import { SourceBadge } from "@/components/admin/primitives";
import { formatRelativeFr } from "@/lib/admin/format";
import type { Lead, LeadStatus } from "@/lib/db";

const COLUMNS: { status: LeadStatus; label: string; tone: string }[] = [
  { status: "new", label: "Nouveaux", tone: "border-t-[#E85D2C]" },
  { status: "contacted", label: "Contactés", tone: "border-t-[#60A5FA]" },
  { status: "qualified", label: "Qualifiés", tone: "border-t-[#FBBF24]" },
  { status: "won", label: "Gagnés", tone: "border-t-[#34D399]" },
  { status: "lost", label: "Perdus", tone: "border-t-[#6B7280]" },
];

export function LeadsKanban({ leads: initial }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);
  const [pending, startTransition] = useTransition();

  const move = (id: string, to: LeadStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === to) return;
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: to } : l)),
    );
    startTransition(async () => {
      const res = await updateLeadStatusAction(id, to);
      if (!res.ok) {
        // Revert
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: lead.status } : l)),
        );
      }
    });
  };

  return (
    <div className="relative">
      {pending && (
        <div className="absolute right-0 -top-9 flex items-center gap-1.5 text-[11px] text-white/40">
          <Loader2 className="h-3 w-3 animate-spin" /> Mise à jour…
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.status);
          return (
            <div
              key={col.status}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.status);
              }}
              onDragLeave={() => setOverCol((c) => (c === col.status ? null : c))}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) move(dragId, col.status);
                setDragId(null);
                setOverCol(null);
              }}
              className={`
                rounded-xl border border-t-2 border-white/[0.06] bg-white/[0.015] ${col.tone}
                transition-colors
                ${overCol === col.status ? "bg-white/[0.04] ring-1 ring-white/10" : ""}
              `}
            >
              <div className="flex items-center justify-between px-3 py-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
                  {col.label}
                </span>
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-bold tabular-nums text-white/70">
                  {colLeads.length}
                </span>
              </div>
              <div className="flex max-h-[calc(100svh-260px)] flex-col gap-2 overflow-y-auto px-2 pb-2">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                    className={`
                      group cursor-grab rounded-lg border border-white/[0.06] bg-[#12121C] p-3
                      transition-all hover:border-white/15 active:cursor-grabbing
                      ${dragId === lead.id ? "opacity-40" : ""}
                    `}
                  >
                    <div className="flex items-start gap-1.5">
                      <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/20" />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="block truncate text-[13px] font-semibold text-white hover:text-[#FFB780]"
                        >
                          {lead.name}
                        </Link>
                        <p className="mt-0.5 truncate text-[11px] text-white/40">
                          {lead.email ?? lead.phone ?? "—"}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <SourceBadge source={lead.source} />
                          <span className="text-[10px] tabular-nums text-white/30">
                            {formatRelativeFr(lead.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <p className="px-2 py-6 text-center text-[11px] text-white/20">
                    Glissez un lead ici
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
