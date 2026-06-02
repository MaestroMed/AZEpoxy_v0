"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { saveSettingsAction } from "@/app/admin/(shell)/contenu/actions";
import { Field, Toggle } from "@/components/admin/realisation-form";
import type { SiteSettingsData } from "@/lib/db";

export function SettingsForm({ initial }: { initial: SiteSettingsData }) {
  const [f, setF] = useState<SiteSettingsData>({
    businessName: initial.businessName ?? "",
    phone: initial.phone ?? "",
    email: initial.email ?? "",
    addressStreet: initial.addressStreet ?? "",
    addressZip: initial.addressZip ?? "",
    addressCity: initial.addressCity ?? "",
    openingHours: initial.openingHours ?? "",
    notifyOnLead: initial.notifyOnLead ?? false,
    notifyEmail: initial.notifyEmail ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    setSaved(false);
    const fd = new FormData();
    fd.set("payload", JSON.stringify(f));
    startTransition(async () => {
      const res = await saveSettingsAction(fd);
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Section title="Identité">
        <Field label="Nom commercial" value={f.businessName ?? ""} onChange={(v) => setF({ ...f, businessName: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Téléphone" value={f.phone ?? ""} onChange={(v) => setF({ ...f, phone: v })} />
          <Field label="Email" value={f.email ?? ""} onChange={(v) => setF({ ...f, email: v })} />
        </div>
      </Section>

      <Section title="Adresse atelier">
        <Field label="Rue" value={f.addressStreet ?? ""} onChange={(v) => setF({ ...f, addressStreet: v })} />
        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
          <Field label="Code postal" value={f.addressZip ?? ""} onChange={(v) => setF({ ...f, addressZip: v })} />
          <Field label="Ville" value={f.addressCity ?? ""} onChange={(v) => setF({ ...f, addressCity: v })} />
        </div>
        <Field label="Horaires" value={f.openingHours ?? ""} onChange={(v) => setF({ ...f, openingHours: v })} placeholder="Lun-Ven 8h-18h" />
      </Section>

      <Section title="Notifications">
        <Toggle
          label="M'alerter par email à chaque nouveau lead"
          checked={f.notifyOnLead ?? false}
          onChange={(v) => setF({ ...f, notifyOnLead: v })}
        />
        {f.notifyOnLead && (
          <Field label="Email de notification" value={f.notifyEmail ?? ""} onChange={(v) => setF({ ...f, notifyEmail: v })} />
        )}
      </Section>

      {error && (
        <p className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-[13px] text-red-200">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-[13px] text-emerald-300">
            <Check className="h-4 w-4" /> Enregistré
          </span>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#FF7A40] to-[#C84818] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(232,93,44,0.7)] transition-transform hover:-translate-y-px disabled:opacity-70"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
        {title}
      </p>
      {children}
    </div>
  );
}
