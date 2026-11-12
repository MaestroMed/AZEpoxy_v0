"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Send, XCircle } from "lucide-react";
import {
  sendTestEmailAction,
  type TestEmailResult,
} from "@/app/admin/(shell)/settings/actions";

export function EmailTestButton() {
  const [result, setResult] = useState<TestEmailResult | null>(null);
  const [pending, startTransition] = useTransition();

  const run = () => {
    setResult(null);
    startTransition(async () => {
      try {
        setResult(await sendTestEmailAction());
      } catch (err) {
        setResult({
          ok: false,
          error: err instanceof Error ? err.message : "Erreur inconnue",
        });
      }
    });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="
          inline-flex items-center gap-2 rounded-full border border-[#E85D2C]/35 bg-[#E85D2C]/[0.1] px-4 py-1.5
          text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FFB780]
          transition-colors hover:border-[#E85D2C]/55 hover:bg-[#E85D2C]/[0.18] disabled:opacity-60
        "
      >
        {pending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Send className="h-3 w-3" />
        )}
        Envoyer un email de test
      </button>

      {result?.ok && (
        <p className="flex items-start gap-2 text-[13px] text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Resend a accepté l&apos;envoi vers {result.to}. Vérifiez la boîte de
          réception (et les spams).
        </p>
      )}
      {result && !result.ok && (
        <p className="flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-[13px] text-red-200">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Resend a refusé l&apos;envoi :{" "}
            <span className="font-mono">{result.error}</span>
          </span>
        </p>
      )}
    </div>
  );
}
