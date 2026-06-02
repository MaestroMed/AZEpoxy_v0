import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/primitives";
import { QuoteForm } from "@/components/admin/quote-form";
import { getQuote } from "@/lib/admin/quotes";

export const dynamic = "force-dynamic";

interface EditQuoteProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuotePage({ params }: EditQuoteProps) {
  const { id } = await params;
  const result = await getQuote(id);
  if (!result) notFound();
  const { quote, items } = result;

  const initial = {
    leadId: quote.leadId,
    clientName: quote.clientName,
    clientEmail: quote.clientEmail ?? "",
    clientPhone: quote.clientPhone ?? "",
    clientCompany: quote.clientCompany ?? "",
    clientAddress: quote.clientAddress ?? "",
    taxRate: Number(quote.taxRate),
    notes: quote.notes ?? "",
    validUntil: quote.validUntil
      ? new Date(quote.validUntil).toISOString().slice(0, 10)
      : "",
    items: items.map((it) => ({
      label: it.label,
      description: it.description ?? "",
      quantity: Number(it.quantity),
      unit: it.unit,
      unitPrice: Number(it.unitPrice),
    })),
  };

  return (
    <>
      <PageHeader
        eyebrow={
          <Link
            href={`/admin/devis/${id}`}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> {quote.number}
          </Link>
        }
        title="Éditer le devis"
        description={`${quote.number} — ${quote.clientName}`}
      />
      <div className="px-8 py-7">
        <QuoteForm mode="edit" quoteId={id} initial={initial} />
      </div>
    </>
  );
}
