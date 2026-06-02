"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Send, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import {
  setQuoteStatusAction,
  deleteQuoteAction,
} from "@/app/admin/(shell)/devis/actions";
import type { QuoteStatus } from "@/lib/db";

const TRANSITIONS: {
  to: QuoteStatus;
  label: string;
  icon: typeof Check;
  tone: string;
}[] = [
  { to: "sent", label: "Marquer envoyé", icon: Send, tone: "text-blue-300" },
  { to: "accepted", label: "Accepté", icon: ThumbsUp, tone: "text-emerald-300" },
  { to: "rejected", label: "Refusé", icon: ThumbsDown, tone: "text-red-300" },
];

export function QuoteActions({
  quoteId,
  current,
}: {
  quoteId: string;
  current: QuoteStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const change = (to: QuoteStatus) =>
    startTransition(async () => {
      await setQuoteStatusAction(quoteId, to);
      router.refresh();
    });

  const remove = () =>
    startTransition(async () => {
      await deleteQuoteAction(quoteId);
    });

  return (
    <div className="space-y-1.5">
      {TRANSITIONS.filter((t) => t.to !== current).map((t) => (
        <button
          key={t.to}
          type="button"
          disabled={pending}
          onClick={() => change(t.to)}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
        >
          <t.icon className={`h-3.5 w-3.5 ${t.tone}`} />
          {t.label}
        </button>
      ))}
      {current !== "draft" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => change("draft")}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <Check className="h-3.5 w-3.5 text-white/40" />
          Repasser en brouillon
        </button>
      )}

      <div className="!mt-3 border-t border-white/[0.06] pt-2">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="flex-1 rounded-lg bg-red-500/15 px-3 py-2 text-[12px] font-semibold text-red-200 hover:bg-red-500/25"
            >
              {pending ? (
                <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
              ) : (
                "Confirmer la suppression"
              )}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg px-3 py-2 text-[12px] text-white/50 hover:text-white"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-white/40 transition-colors hover:bg-red-500/[0.08] hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" /> Supprimer le devis
          </button>
        )}
      </div>
    </div>
  );
}
