import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/primitives";
import { RealisationForm } from "@/components/admin/realisation-form";

export default function NewRealisationPage() {
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
        title="Nouvelle réalisation"
      />
      <div className="px-8 py-7">
        <RealisationForm />
      </div>
    </>
  );
}
