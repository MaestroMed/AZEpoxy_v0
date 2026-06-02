import Link from "next/link";
import { MessageSquareQuote, Pencil, Plus, Star } from "lucide-react";
import { Card, PageHeader } from "@/components/admin/primitives";
import { listTestimonials } from "@/lib/admin/content";

export const dynamic = "force-dynamic";

export default async function AvisAdminPage() {
  const rows = await listTestimonials();

  return (
    <>
      <PageHeader
        eyebrow="Contenu"
        title="Avis clients"
        description="Témoignages affichés sur le site et utilisés pour la note agrégée. Vide = dataset intégré."
        actions={
          <Link
            href="/admin/contenu/avis/nouveau"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#FF7A40] to-[#C84818] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(232,93,44,0.7)] transition-transform hover:-translate-y-px"
          >
            <Plus className="h-3.5 w-3.5" /> Nouvel avis
          </Link>
        }
      />

      <div className="px-8 py-7">
        {rows.length === 0 ? (
          <Card>
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                <MessageSquareQuote className="h-5 w-5 text-white/40" />
              </div>
              <p className="mt-5 font-display text-lg font-black text-white">
                Aucun avis en base
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
                Le site utilise les témoignages intégrés. Ajoutez-en ici pour
                les gérer.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {rows.map((t) => (
              <Link
                key={t.id}
                href={`/admin/contenu/avis/${t.id}`}
                className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/15"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{t.name}</p>
                    {t.company && (
                      <span className="text-[12px] text-white/40">
                        · {t.company}
                      </span>
                    )}
                    {!t.published && (
                      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white/40">
                        Masqué
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] text-white/55">
                    « {t.quote} »
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < t.rating ? "fill-[#FBBF24] text-[#FBBF24]" : "text-white/15"
                      }`}
                    />
                  ))}
                </div>
                <Pencil className="h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-[#FFB780]" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
