import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/primitives";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewAvisPage() {
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
        title="Nouvel avis"
      />
      <div className="px-8 py-7">
        <TestimonialForm />
      </div>
    </>
  );
}
