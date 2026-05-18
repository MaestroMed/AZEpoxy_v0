"use client";

import { useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { changeStatusAction } from "./actions";
import type { LeadStatus } from "@/lib/db";

const STATUSES: { value: LeadStatus; label: string; tone: string }[] = [
  { value: "new", label: "Nouveau", tone: "from-[#FF9A5C] to-[#E85D2C]" },
  { value: "contacted", label: "Contacté", tone: "from-blue-400 to-blue-600" },
  {
    value: "qualified",
    label: "Qualifié",
    tone: "from-amber-300 to-amber-500",
  },
  { value: "won", label: "Gagné", tone: "from-emerald-400 to-emerald-600" },
  { value: "lost", label: "Perdu", tone: "from-white/30 to-white/50" },
];

export function StatusPicker({
  leadId,
  current,
}: {
  leadId: string;
  current: LeadStatus;
}) {
  const [pending, startTransition] = useTransition();

  const submit = (status: LeadStatus) => {
    if (status === current) return;
    const fd = new FormData();
    fd.set("leadId", leadId);
    fd.set("status", status);
    startTransition(async () => {
      await changeStatusAction(fd);
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      {STATUSES.map((s) => {
        const active = current === s.value;
        return (
          <button
            key={s.value}
            type="button"
            disabled={pending}
            onClick={() => submit(s.value)}
            className={`
              group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200
              ${
                active
                  ? "bg-white/[0.06] text-white ring-1 ring-white/10"
                  : "text-white/60 hover:bg-white/[0.03] hover:text-white"
              }
              disabled:opacity-60 disabled:cursor-wait
            `}
          >
            <span
              aria-hidden
              className={`
                h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${s.tone}
                ${active ? "shadow-[0_0_0_3px_rgba(255,255,255,0.05)]" : "opacity-60"}
              `}
            />
            <span className="flex-1 text-[13px] font-medium">{s.label}</span>
            {active && (
              <Check className="h-3.5 w-3.5 text-[#FFB780]" aria-hidden />
            )}
            {pending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white/40" />
            )}
          </button>
        );
      })}
    </div>
  );
}
