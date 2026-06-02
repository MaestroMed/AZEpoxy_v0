"use client";

import { useMemo, useState, useTransition } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import {
  createQuoteAction,
  updateQuoteAction,
} from "@/app/admin/(shell)/devis/actions";

interface Item {
  label: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

interface QuoteFormProps {
  mode: "create" | "edit";
  quoteId?: string;
  initial?: {
    leadId?: string | null;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    clientCompany?: string;
    clientAddress?: string;
    taxRate: number;
    notes?: string;
    validUntil?: string;
    items: Item[];
  };
}

const eur = (v: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    v,
  );

const EMPTY_ITEM: Item = {
  label: "",
  description: "",
  quantity: 1,
  unit: "u",
  unitPrice: 0,
};

export function QuoteForm({ mode, quoteId, initial }: QuoteFormProps) {
  const [client, setClient] = useState({
    clientName: initial?.clientName ?? "",
    clientEmail: initial?.clientEmail ?? "",
    clientPhone: initial?.clientPhone ?? "",
    clientCompany: initial?.clientCompany ?? "",
    clientAddress: initial?.clientAddress ?? "",
  });
  const [taxRate, setTaxRate] = useState(initial?.taxRate ?? 20);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [validUntil, setValidUntil] = useState(initial?.validUntil ?? "");
  const [items, setItems] = useState<Item[]>(
    initial?.items?.length ? initial.items : [{ ...EMPTY_ITEM }],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const totals = useMemo(() => {
    const lineTotals = items.map((i) => i.quantity * i.unitPrice);
    const subtotal = lineTotals.reduce((s, x) => s + x, 0);
    const taxAmount = subtotal * (taxRate / 100);
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  }, [items, taxRate]);

  const updateItem = (idx: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const submit = () => {
    setError(null);
    if (!client.clientName.trim()) {
      setError("Le nom du client est requis.");
      return;
    }
    if (items.some((i) => !i.label.trim())) {
      setError("Chaque ligne doit avoir un libellé.");
      return;
    }
    const payload = {
      leadId: initial?.leadId ?? null,
      ...client,
      taxRate,
      notes,
      validUntil: validUntil || undefined,
      items,
    };
    const fd = new FormData();
    fd.set("payload", JSON.stringify(payload));
    startTransition(async () => {
      const res =
        mode === "create"
          ? await createQuoteAction(fd)
          : await updateQuoteAction(quoteId!, fd);
      if (res && !res.ok) setError(res.error);
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* LEFT — client + items */}
      <div className="space-y-6 min-w-0">
        <Section title="Client">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom / Raison sociale *" value={client.clientName} onChange={(v) => setClient({ ...client, clientName: v })} />
            <Field label="Entreprise" value={client.clientCompany} onChange={(v) => setClient({ ...client, clientCompany: v })} />
            <Field label="Email" type="email" value={client.clientEmail} onChange={(v) => setClient({ ...client, clientEmail: v })} />
            <Field label="Téléphone" value={client.clientPhone} onChange={(v) => setClient({ ...client, clientPhone: v })} />
            <div className="sm:col-span-2">
              <Field label="Adresse" value={client.clientAddress} onChange={(v) => setClient({ ...client, clientAddress: v })} />
            </div>
          </div>
        </Section>

        <Section title="Lignes du devis">
          <div className="space-y-2">
            <div className="hidden grid-cols-[1fr_70px_60px_90px_90px_32px] gap-2 px-1 text-[10px] font-bold uppercase tracking-wide text-white/35 sm:grid">
              <span>Désignation</span>
              <span>Qté</span>
              <span>Unité</span>
              <span>PU HT</span>
              <span className="text-right">Total</span>
              <span />
            </div>
            {items.map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2 rounded-lg border border-white/[0.06] bg-white/[0.015] p-2 sm:grid-cols-[1fr_70px_60px_90px_90px_32px] sm:items-center sm:border-0 sm:bg-transparent sm:p-1"
              >
                <input
                  value={it.label}
                  onChange={(e) => updateItem(idx, { label: e.target.value })}
                  placeholder="Thermolaquage portail…"
                  className="col-span-2 sm:col-span-1 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm text-white placeholder:text-white/25 focus:border-[#E85D2C]/50 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.01"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                  className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm tabular-nums text-white focus:border-[#E85D2C]/50 focus:outline-none"
                />
                <input
                  value={it.unit}
                  onChange={(e) => updateItem(idx, { unit: e.target.value })}
                  className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white focus:border-[#E85D2C]/50 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.01"
                  value={it.unitPrice}
                  onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
                  className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-sm tabular-nums text-white focus:border-[#E85D2C]/50 focus:outline-none"
                />
                <span className="self-center text-right text-sm font-semibold tabular-nums text-white/80">
                  {eur(it.quantity * it.unitPrice)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                  className="justify-self-end rounded-md p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 text-[12px] font-semibold text-white/55 transition-colors hover:border-white/30 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter une ligne
            </button>
          </div>
        </Section>

        <Section title="Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Conditions, délais, mentions particulières…"
            className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#E85D2C]/50 focus:outline-none"
          />
        </Section>
      </div>

      {/* RIGHT — totals + meta */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
            Récapitulatif
          </p>
          <Row label="Sous-total HT" value={eur(totals.subtotal)} />
          <div className="my-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-white/55">
              TVA
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-14 rounded border border-white/10 bg-black/30 px-1.5 py-0.5 text-[12px] tabular-nums text-white focus:border-[#E85D2C]/50 focus:outline-none"
              />
              %
            </span>
            <span className="tabular-nums text-white/70">{eur(totals.taxAmount)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="font-semibold text-white">Total TTC</span>
            <span className="font-display text-xl font-black tabular-nums text-[#FFB780]">
              {eur(totals.total)}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
            Valable jusqu&apos;au
          </label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-[#E85D2C]/50 focus:outline-none"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-[13px] text-red-200">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#FF7A40] to-[#C84818] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(232,93,44,0.7)] transition-transform hover:-translate-y-px disabled:opacity-70"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {mode === "create" ? "Créer le devis" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-[#E85D2C]/50 focus:outline-none"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/55">{label}</span>
      <span className="tabular-nums text-white/80">{value}</span>
    </div>
  );
}
