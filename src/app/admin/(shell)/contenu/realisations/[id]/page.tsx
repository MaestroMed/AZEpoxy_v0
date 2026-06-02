import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/primitives";
import { RealisationForm } from "@/components/admin/realisation-form";
import { getRealisation } from "@/lib/admin/content";

export const dynamic = "force-dynamic";

export default async function EditRealisationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await getRealisation(id);
  if (!r) notFound();

  return (
    <>
      <PageHeader
        eyebrow={
          <Link
            href="/admin/contenu/realisations"
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Réalisations
          </Link>
        }
        title="Éditer la réalisation"
        description={r.title}
      />
      <div className="px-8 py-7">
        <RealisationForm
          id={r.id}
          initial={{
            title: r.title,
            category: r.category,
            description: r.description,
            colors: r.colors,
            image: r.image ?? "",
            featured: r.featured,
            published: r.published,
            sortOrder: r.sortOrder,
          }}
        />
      </div>
    </>
  );
}
