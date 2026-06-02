"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import {
  saveRealisationAction,
  deleteRealisationAction,
} from "@/app/admin/(shell)/contenu/actions";
import type { RealisationCategory } from "@/lib/db";

const CATEGORIES: { value: RealisationCategory; label: string }[] = [
  { value: "jantes", label: "Jantes" },
  { value: "moto", label: "Moto" },
  { value: "mobilier", label: "Mobilier" },
  { value: "industriel", label: "Industriel" },
  { value: "portail", label: "Portail" },
];

interface Props {
  id?: string;
  initial?: {
    title: string;
    category: RealisationCategory;
    description: string;
    colors: string[];
    image: string;
    featured: boolean;
    published: boolean;
    sortOrder: number;
  };
}

export function RealisationForm({ id, initial }: Props) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? ("portail" as RealisationCategory),
    description: initial?.description ?? "",
    colorsStr: (initial?.colors ?? []).join(", "),
    image: initial?.image ?? "",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [delPending, startDel] = useTransition();

  const submit = () => {
    setError(null);
    if (!f.title.trim()) return setError("Le titre est requis.");
    const payload = {
      title: f.title,
      category: f.category,
      description: f.description,
      colors: f.colorsStr
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      image: f.image || undefined,
      featured: f.featured,
      published: f.published,
      sortOrder: Number(f.sortOrder) || 0,
    };
    const fd = new FormData();
    fd.set("payload", JSON.stringify(payload));
    startTransition(async () => {
      const res = await saveRealisationAction(id ?? null, fd);
      if (res && !res.ok) setError(res.error);
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Field label="Titre *" value={f.title} onChange={(v) => setF({ ...f, title: v })} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Catégorie
          </span>
          <select
            value={f.category}
            onChange={(e) =>
              setF({ ...f, category: e.target.value as RealisationCategory })
            }
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-[#E85D2C]/50 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#12121C]">
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Ordre d'affichage"
          type="number"
          value={String(f.sortOrder)}
          onChange={(v) => setF({ ...f, sortOrder: Number(v) })}
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
          Description
        </span>
        <textarea
          value={f.description}
          onChange={(e) => setF({ ...f, description: e.target.value })}
          rows={3}
          className="resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-[#E85D2C]/50 focus:outline-none"
        />
      </label>

      <Field
        label="Couleurs (RAL, séparés par virgule)"
        value={f.colorsStr}
        onChange={(v) => setF({ ...f, colorsStr: v })}
        placeholder="RAL 9005, RAL 7016"
      />
      <Field
        label="Image (chemin /images/realisations/…)"
        value={f.image}
        onChange={(v) => setF({ ...f, image: v })}
        placeholder="/images/realisations/01-bmw-m4-noir.webp"
      />

      <div className="flex flex-wrap gap-5 pt-1">
        <Toggle label="Mise en avant" checked={f.featured} onChange={(v) => setF({ ...f, featured: v })} />
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
            onClick={() =>
              startDel(async () => {
                await deleteRealisationAction(id);
              })
            }
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

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-[#E85D2C]/50 focus:outline-none"
      />
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-[#E85D2C]" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-white/70">{label}</span>
    </button>
  );
}
