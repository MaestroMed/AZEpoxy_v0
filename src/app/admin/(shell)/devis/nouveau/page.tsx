import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/primitives";
import { QuoteForm } from "@/components/admin/quote-form";
import { getLeadById } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

interface NewQuotePageProps {
  searchParams: Promise<{ lead?: string }>;
}

export default async function NewQuotePage({ searchParams }: NewQuotePageProps) {
  const { lead: leadId } = await searchParams;

  let initial = undefined;
  if (leadId) {
    const res = await getLeadById(leadId);
    if (res) {
      const l = res.lead;
      initial = {
        leadId: l.id,
        clientName: l.name,
        clientEmail: l.email ?? "",
        clientPhone: l.phone ?? "",
        clientCompany: l.company ?? "",
        clientAddress: "",
        taxRate: 20,
        notes: l.message ?? "",
        items: [
          {
            label: l.projectType
              ? `Thermolaquage — ${l.projectType}`
              : "Thermolaquage poudre époxy",
            description: l.ralCode ? `Teinte RAL ${l.ralCode}` : "",
            quantity: 1,
            unit: "u",
            unitPrice: 0,
          },
        ],
      };
    }
  }

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
        title="Nouveau devis"
        description={
          leadId ? "Pré-rempli depuis un lead." : "Créer un devis client."
        }
      />
      <div className="px-8 py-7">
        <QuoteForm mode="create" initial={initial} />
      </div>
    </>
  );
}
