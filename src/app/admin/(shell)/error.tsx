"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] route error", error);
  }, [error]);

  return (
    <div className="flex min-h-[60svh] items-center justify-center px-8 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.08]">
          <AlertTriangle className="h-6 w-6 text-red-300" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-black text-white">
          Une erreur est survenue
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Cette section n&apos;a pas pu se charger. Réessayez, ou revenez au
          tableau de bord.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[11px] text-white/25">
            Réf. {error.digest}
          </p>
        )}
        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#FF7A40] to-[#C84818] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(232,93,44,0.7)] transition-transform hover:-translate-y-px"
          >
            <RotateCw className="h-4 w-4" /> Réessayer
          </button>
          <Link
            href="/admin"
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
