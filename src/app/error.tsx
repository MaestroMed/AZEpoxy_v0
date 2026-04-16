"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { SITE } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {

      console.error(error);
    }
  }, [error]);

  return (
    <section className="relative isolate min-h-[80vh] overflow-hidden bg-brand-night text-white">
      <div className="absolute inset-0 bg-gradient-night" />
      <div className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
      <div className="container-wide relative flex min-h-[80vh] flex-col items-start justify-center pt-40 pb-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
          <AlertTriangle className="h-3 w-3" />
          Erreur inattendue
        </span>
        <h1 className="heading-display mt-6 max-w-3xl text-balance text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
          Quelque chose s&apos;est mal passé.
        </h1>
        <p className="mt-6 max-w-xl text-balance text-lg text-white/70">
          Désolé, une erreur s&apos;est produite côté serveur. Vous pouvez réessayer
          ou nous contacter directement par téléphone — nous répondons sous 24h.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs font-mono text-white/40">
            Référence : {error.digest}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <button onClick={() => reset()} className="btn-primary" type="button">
            <RotateCcw className="h-4 w-4" />
            Réessayer
          </button>
          <Link href="/" className="btn-ghost-light">
            Retour à l&apos;accueil
          </Link>
          <a href={SITE.phoneHref} className="btn-ghost-light">
            Appeler {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
