"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Loader2, X } from "lucide-react";
import { SourceBadge, StatusBadge } from "@/components/admin/primitives";
import { formatRelativeFr } from "@/lib/admin/format";
import { bulkUpdateStatusAction } from "@/app/admin/(shell)/leads/actions";
import type { Lead, LeadStatus } from "@/lib/db";

const BULK_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "contacted", label: "Contacté" },
  { value: "qualified", label: "Qualifié" },
  { value: "won", label: "Gagné" },
  { value: "lost", label: "Perdu" },
];

export function LeadsTable({ rows }: { rows: Lead[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));

  const applyBulk = (status: LeadStatus) =>
    startTransition(async () => {
      await bulkUpdateStatusAction([...selected], status);
      setSelected(new Set());
      router.refresh();
    });

  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05] text-left text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Tout sélectionner"
                  className="h-3.5 w-3.5 cursor-pointer accent-[#E85D2C]"
                />
              </th>
              <th className="px-3 py-3 font-semibold">Lead</th>
              <th className="px-3 py-3 font-semibold">Source</th>
              <th className="px-3 py-3 font-semibold">Contact</th>
              <th className="px-3 py-3 font-semibold">Projet</th>
              <th className="px-3 py-3 font-semibold">Statut</th>
              <th className="px-3 py-3 font-semibold">Reçu</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => {
              const isSel = selected.has(lead.id);
              return (
                <tr
                  key={lead.id}
                  className={`group border-b border-white/[0.03] last:border-0 transition-colors ${
                    isSel ? "bg-[#E85D2C]/[0.06]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(lead.id)}
                      aria-label={`Sélectionner ${lead.name}`}
                      className="h-3.5 w-3.5 cursor-pointer accent-[#E85D2C]"
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-semibold text-white hover:text-[#FFB780]"
                    >
                      {lead.name}
                    </Link>
                    {lead.message && (
                      <p className="mt-0.5 line-clamp-1 text-[12px] text-white/40">
                        {lead.message}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3.5">
                    <SourceBadge source={lead.source} />
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex flex-col text-[12px]">
                      {lead.email && <span className="text-white/75">{lead.email}</span>}
                      {lead.phone && <span className="text-white/45">{lead.phone}</span>}
                      {!lead.email && !lead.phone && <span className="text-white/25">—</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-[12px] text-white/55">
                    {lead.projectType || lead.ralCode ? (
                      <div className="flex flex-col">
                        {lead.projectType && <span>{lead.projectType}</span>}
                        {lead.ralCode && (
                          <span className="font-mono text-[11px] text-white/35">
                            RAL {lead.ralCode}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-white/25">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap text-[12px] tabular-nums text-white/40">
                    {formatRelativeFr(lead.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/40 transition-colors group-hover:text-[#FFB780]"
                    >
                      Ouvrir <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating bulk bar */}
      {selected.size > 0 && (
        <div className="sticky bottom-4 z-20 mx-4 mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#15151F] px-4 py-2.5 shadow-2xl">
          <span className="text-[12px] font-semibold text-white">
            {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
          </span>
          <span className="text-[12px] text-white/40">→ marquer</span>
          {BULK_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              disabled={pending}
              onClick={() => applyBulk(s.value)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/75 transition-colors hover:border-white/25 hover:text-white disabled:opacity-50"
            >
              {s.label}
            </button>
          ))}
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-white/40" />}
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            aria-label="Désélectionner"
            className="ml-auto rounded-md p-1 text-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
