import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/primitives";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getTestimonial } from "@/lib/admin/content";

export const dynamic = "force-dynamic";

export default async function EditAvisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTestimonial(id);
  if (!t) notFound();

  return (
    <>
      <PageHeader
        eyebrow={
          <Link
            href="/admin/contenu/avis"
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Avis
          </Link>
        }
        title="Éditer l'avis"
        description={t.name}
      />
      <div className="px-8 py-7">
        <TestimonialForm
          id={t.id}
          initial={{
            name: t.name,
            company: t.company ?? "",
            role: t.role ?? "",
            quote: t.quote,
            rating: t.rating,
            service: t.service ?? "",
            source: t.source,
            published: t.published,
            sortOrder: t.sortOrder,
          }}
        />
      </div>
    </>
  );
}
