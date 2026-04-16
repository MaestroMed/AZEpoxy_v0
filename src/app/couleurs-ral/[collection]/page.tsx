import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, Sparkles, Droplets } from "lucide-react";
import { COLLECTIONS, getCollectionBySlug } from "@/lib/collections-data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";

/* ── Static params ────────────────────────────────────────────────── */
export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.slug }));
}

/* ── Dynamic metadata ─────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: slug } = await params;
  const col = getCollectionBySlug(slug);
  if (!col) return { title: "Collection introuvable" };
  return buildMetadata({
    title: `Collection ${col.name}`,
    description: col.description,
    path: `/couleurs-ral/${col.slug}`,
  });
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  return (
    <>
      <JsonLd
        id={`ld-breadcrumb-${collection.slug}`}
        data={breadcrumbLd([
          { label: "Couleurs RAL", href: "/couleurs-ral" },
          { label: `Collection ${collection.name}` },
        ])}
      />

      {/* ── Section 1 — Custom Hero ───────────────────────────────── */}
      <section className="relative isolate min-h-[50vh] overflow-hidden text-white">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${collection.gradient}`}
        />
        <div className="absolute inset-0 bg-noise opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        <div className="container-wide relative flex min-h-[50vh] flex-col justify-center pt-40 pb-20">
          {/* Breadcrumbs */}
          <nav
            aria-label="Fil d'Ariane"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            <Link
              href="/couleurs-ral"
              className="transition-colors hover:text-white"
            >
              Couleurs RAL
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            <span aria-current="page" className="text-white/90">
              Collection {collection.name}
            </span>
          </nav>

          <div className="max-w-3xl">
            <span className="section-label-light">
              <Sparkles className="h-3 w-3" />
              Collection Premium
            </span>

            <h1 className="heading-display mt-6 text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              {collection.name}
            </h1>

            <p className="mt-4 text-xl font-semibold text-white/90">
              {collection.tagline}
            </p>

            <p className="mt-6 max-w-2xl text-balance text-lg text-white/70">
              {collection.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2 — Colors Grid ───────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Teintes"
              labelIcon={<Droplets className="h-3 w-3" />}
              title={
                <>
                  Les teintes{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {collection.name}
                  </span>
                </>
              }
              description={`${collection.colors.length} teintes exclusives, chacune avec sa finition signature.`}
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {collection.colors.map((color, i) => (
              <ScrollReveal key={color.name} delay={i * 0.05}>
                <div className="group overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                  {/* Color swatch */}
                  <div
                    className="relative h-32 w-full"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  {/* Info */}
                  <div className="bg-white p-4">
                    <p className="font-semibold text-brand-night">
                      {color.name}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-brand-charcoal/60 capitalize">
                        {color.finish}
                      </span>
                      <span className="font-mono text-xs text-brand-charcoal/40 uppercase">
                        {color.hex}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 — Characteristics ───────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-gradient-night" />
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />

        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              label="Specifications"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={
                <>
                  Caracteristiques
                </>
              }
              description={`Ce qui rend la collection ${collection.name} unique.`}
            />
          </ScrollReveal>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:max-w-4xl">
            {collection.characteristics.map((char, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <li className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-brand-orange/30 hover:bg-white/[0.06]">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-orange/15">
                    <Check className="h-4 w-4 text-brand-orange" />
                  </div>
                  <span className="text-sm leading-relaxed text-white/80">
                    {char}
                  </span>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Section 4 — Applications ──────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Usages"
              title={
                <>
                  Applications{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    ideales
                  </span>
                </>
              }
              description={`Les domaines ou la collection ${collection.name} excelle.`}
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {collection.applications.map((app, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex items-center gap-4 rounded-2xl border border-brand-night/10 bg-white p-6 transition-all hover:shadow-lg">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
                    <Check className="h-5 w-5 text-brand-orange" />
                  </div>
                  <span className="font-medium text-brand-night">{app}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 — Order Info ────────────────────────────────── */}
      <section className="border-t border-brand-night/10 bg-brand-cream py-16">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl rounded-2xl border border-brand-night/10 bg-white p-8 text-center shadow-sm">
              <span className="section-label">
                <Sparkles className="h-3 w-3" />
                Commande
              </span>
              <h3 className="heading-display mt-4 text-2xl text-brand-night">
                Delai : {collection.leadTime}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/70">
                Les teintes de la collection {collection.name} sont preparees sur
                commande dans notre atelier de Bruyeres-sur-Oise. Envoyez-nous
                vos pieces et la reference souhaitee, nous nous occupons du reste.
                Echantillon test disponible sur demande.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Back Link ─────────────────────────────────────────────── */}
      <section className="bg-white py-8">
        <div className="container-wide">
          <Link
            href="/couleurs-ral"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-night transition-colors hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au nuancier complet
          </Link>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────────── */}
      <CtaBand
        title="Cette collection vous inspire ?"
        description={`Demandez un echantillon gratuit de la collection ${collection.name}. Nous preparons un test sur metal pour valider votre choix.`}
        primaryLabel="Demander un echantillon"
        primaryHref="/devis"
      />
    </>
  );
}
