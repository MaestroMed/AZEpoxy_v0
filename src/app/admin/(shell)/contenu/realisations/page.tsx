import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageOff, Pencil, Plus } from "lucide-react";
import { Card, PageHeader } from "@/components/admin/primitives";
import { listRealisations } from "@/lib/admin/content";

export const dynamic = "force-dynamic";

export default async function RealisationsAdminPage() {
  const rows = await listRealisations();

  return (
    <>
      <PageHeader
        eyebrow="Contenu"
        title="Réalisations"
        description="Portfolio géré en base. Tant qu'aucune réalisation n'est publiée ici, le site utilise le catalogue intégré."
        actions={
          <Link
            href="/admin/contenu/realisations/nouveau"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#FF7A40] to-[#C84818] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(232,93,44,0.7)] transition-transform hover:-translate-y-px"
          >
            <Plus className="h-3.5 w-3.5" /> Nouvelle réalisation
          </Link>
        }
      />

      <div className="px-8 py-7">
        {rows.length === 0 ? (
          <Card>
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                <ImageOff className="h-5 w-5 text-white/40" />
              </div>
              <p className="mt-5 font-display text-lg font-black text-white">
                Aucune réalisation en base
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
                Le site affiche actuellement le portfolio intégré au code.
                Ajoutez des réalisations ici pour prendre le contrôle.
              </p>
              <Link
                href="/admin/contenu/realisations/nouveau"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[#E85D2C]/35 bg-[#E85D2C]/[0.1] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FFB780] hover:bg-[#E85D2C]/[0.18]"
              >
                <Plus className="h-3.5 w-3.5" /> Créer
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r) => (
              <Link
                key={r.id}
                href={`/admin/contenu/realisations/${r.id}`}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/15"
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center rounded-md bg-[#E85D2C]/[0.1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFB780]">
                    {r.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {r.featured && (
                      <span className="rounded bg-amber-300/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-200">
                        Vedette
                      </span>
                    )}
                    {!r.published && (
                      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white/40">
                        Masqué
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-3 font-semibold text-white">{r.title}</p>
                <p className="mt-1 line-clamp-2 text-[12px] text-white/45">
                  {r.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-white/40 transition-colors group-hover:text-[#FFB780]">
                  <Pencil className="h-3 w-3" /> Éditer
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
