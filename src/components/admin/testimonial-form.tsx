"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Star, Trash2 } from "lucide-react";
import {
  saveTestimonialAction,
  deleteTestimonialAction,
} from "@/app/admin/(shell)/contenu/actions";
import { Field, Toggle } from "@/components/admin/realisation-form";

interface Props {
  id?: string;
  initial?: {
    name: string;
    company: string;
    role: string;
    quote: string;
    rating: number;
    service: string;
    source: string;
    published: boolean;
    sortOrder: number;
  };
}

export function TestimonialForm({ id, initial }: Props) {
  const [f, setF] = useState({
    name: initial?.name ?? "",
    company: initial?.company ?? "",
    role: initial?.role ?? "",
    quote: initial?.quote ?? "",
    rating: initial?.rating ?? 5,
    service: initial?.service ?? "",
    source: initial?.source ?? "manual",
    published: initial?.published ?? true,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [delPending, startDel] = useTransition();

  const submit = () => {
    setError(null);
    if (!f.name.trim()) return setError("Le nom est requis.");
    if (!f.quote.trim()) return setError("L'avis est requis.");
    const fd = new FormData();
    fd.set(
      "payload",
      JSON.stringify({
        name: f.name,
        company: f.company || undefined,
        role: f.role || undefined,
        quote: f.quote,
        rating: Number(f.rating),
        service: f.service || undefined,
        source: f.source,
        published: f.published,
        sortOrder: Number(f.sortOrder) || 0,
      }),
    );
    startTransition(async () => {
      const res = await saveTestimonialAction(id ?? null, fd);
      if (res && !res.ok) setError(res.error);
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom *" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <Field label="Entreprise" value={f.company} onChange={(v) => setF({ ...f, company: v })} />
        <Field label="Rôle / fonction" value={f.role} onChange={(v) => setF({ ...f, role: v })} />
        <Field label="Service concerné" value={f.service} onChange={(v) => setF({ ...f, service: v })} />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
          Avis *
        </span>
        <textarea
          value={f.quote}
          onChange={(e) => setF({ ...f, quote: e.target.value })}
          rows={4}
          className="resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-[#E85D2C]/50 focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Note
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setF({ ...f, rating: n })}
                aria-label={`${n} étoiles`}
              >
                <Star
                  className={`h-6 w-6 ${
                    n <= f.rating ? "fill-[#FBBF24] text-[#FBBF24]" : "text-white/20"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="w-28">
          <Field
            label="Ordre"
            type="number"
            value={String(f.sortOrder)}
            onChange={(v) => setF({ ...f, sortOrder: Number(v) })}
          />
        </div>
        <Toggle label="Publié" checked={f.published} onChange={(v) => setF({ ...f, published: v })} />
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-[13px] text-red-200">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        {id ? (
          <button
            type="button"
            disabled={delPending}
            onClick={() => startDel(async () => { await deleteTestimonialAction(id); })}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-white/40 transition-colors hover:bg-red-500/[0.08] hover:text-red-300"
          >
            {delPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Supprimer
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#FF7A40] to-[#C84818] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(232,93,44,0.7)] transition-transform hover:-translate-y-px disabled:opacity-70"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {id ? "Enregistrer" : "Créer"}
        </button>
      </div>
    </div>
  );
}
