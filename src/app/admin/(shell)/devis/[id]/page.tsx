import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Mail,
  Pencil,
  Phone,
  User2,
} from "lucide-react";
import { Card, PageHeader } from "@/components/admin/primitives";
import { QuoteStatusBadge } from "@/components/admin/quote-status-badge";
import { QuoteActions } from "./quote-actions";
import { getQuote, eur } from "@/lib/admin/quotes";
import { formatDateTimeFr } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

interface QuoteDetailProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteDetailPage({ params }: QuoteDetailProps) {
  const { id } = await params;
  const result = await getQuote(id);
  if (!result) notFound();
  const { quote, items } = result;

  return (
    <>
      <PageHeader
        eyebrow={
          <Link
            href="/admin/devis"
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Devis
          </Link>
        }
        title={quote.number}
        description={
          <span className="inline-flex items-center gap-2">
            <QuoteStatusBadge status={quote.status} />
            <span className="text-white/30">·</span>
            <span>Créé le {formatDateTimeFr(quote.createdAt)}</span>
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <a
              href={`/admin/devis/${quote.id}/pdf`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold text-white/75 transition-colors hover:border-white/25 hover:text-white"
            >
              <Download className="h-3 w-3" /> PDF
            </a>
            <Link
              href={`/admin/devis/${quote.id}/editer`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E85D2C]/30 bg-[#E85D2C]/[0.08] px-3.5 py-1.5 text-[11px] font-semibold text-[#FFB780] transition-colors hover:bg-[#E85D2C]/[0.15]"
            >
              <Pencil className="h-3 w-3" /> Éditer
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 px-8 py-7 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4 min-w-0">
          <Card title="Client">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-5 py-4 sm:grid-cols-2">
              <Field label="Nom" value={quote.clientName} icon={<User2 className="h-3.5 w-3.5" />} />
              <Field label="Entreprise" value={quote.clientCompany ?? "—"} />
              <Field label="Email" value={quote.clientEmail ?? "—"} mono={!!quote.clientEmail} icon={quote.clientEmail ? <Mail className="h-3.5 w-3.5" /> : undefined} />
              <Field label="Téléphone" value={quote.clientPhone ?? "—"} mono={!!quote.clientPhone} icon={quote.clientPhone ? <Phone className="h-3.5 w-3.5" /> : undefined} />
              {quote.clientAddress && (
                <div className="sm:col-span-2">
                  <Field label="Adresse" value={quote.clientAddress} />
                </div>
              )}
            </dl>
          </Card>

          <Card title="Lignes" hint={`${items.length} ligne${items.length > 1 ? "s" : ""}`}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] text-left text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  <th className="px-5 py-3 font-semibold">Désignation</th>
                  <th className="px-3 py-3 font-semibold text-right">Qté</th>
                  <th className="px-3 py-3 font-semibold text-right">PU HT</th>
                  <th className="px-5 py-3 font-semibold text-right">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-white/[0.03] last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{it.label}</p>
                      {it.description && (
                        <p className="mt-0.5 text-[12px] text-white/45">
                          {it.description}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-white/70">
                      {Number(it.quantity)} {it.unit}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-white/70">
                      {eur(it.unitPrice)}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-white">
                      {eur(it.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-white/[0.05] px-5 py-4">
              <div className="ml-auto max-w-[260px] space-y-1.5">
                <TotalRow label="Sous-total HT" value={eur(quote.subtotal)} />
                <TotalRow label={`TVA ${Number(quote.taxRate)}%`} value={eur(quote.taxAmount)} />
                <div className="flex items-center justify-between border-t border-white/10 pt-2">
                  <span className="font-semibold text-white">Total TTC</span>
                  <span className="font-display text-xl font-black tabular-nums text-[#FFB780]">
                    {eur(quote.total)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {quote.notes && (
            <Card title="Notes">
              <p className="whitespace-pre-wrap px-5 py-4 text-[14px] leading-relaxed text-white/80">
                {quote.notes}
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card title="Actions">
            <div className="p-3">
              <QuoteActions quoteId={quote.id} current={quote.status} />
            </div>
          </Card>

          <Card title="Informations">
            <dl className="space-y-3 px-5 py-4 text-[12px]">
              <Meta label="Validité" value={quote.validUntil ? formatDateTimeFr(quote.validUntil) : "—"} />
              <Meta label="Envoyé le" value={quote.sentAt ? formatDateTimeFr(quote.sentAt) : "—"} />
              <Meta label="Accepté le" value={quote.acceptedAt ? formatDateTimeFr(quote.acceptedAt) : "—"} />
              <Meta label="Créé par" value={quote.createdBy} />
              {quote.leadId && (
                <Meta
                  label="Lead source"
                  value={
                    <Link href={`/admin/leads/${quote.leadId}`} className="text-[#FFB780] hover:underline">
                      Voir le lead →
                    </Link>
                  }
                />
              )}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}

function Field({ label, value, mono, icon }: { label: string; value: string; mono?: boolean; icon?: React.ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
        {icon} {label}
      </dt>
      <dd className={`mt-1 break-words text-sm text-white/85 ${mono ? "font-mono text-[13px]" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/55">{label}</span>
      <span className="tabular-nums text-white/80">{value}</span>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-white/40">{label}</dt>
      <dd className="text-right text-white/75">{value}</dd>
    </div>
  );
}
