import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { COLLECTIONS, getCollectionBySlug } from "@/lib/collections-data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { CollectionHeroMosaic } from "@/components/ui/collection-hero-mosaic";
import { CollectionFinishesGrid } from "@/components/ui/collection-finishes-grid";
import { CollectionSwarmBinding } from "@/components/nuee/collection-swarm-binding";

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
    title: `Collection ${col.name} — Adaptacolor`,
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

  const others = COLLECTIONS.filter((c) => c.slug !== collection.slug);

  return (
    <>
      <JsonLd
        id={`ld-breadcrumb-${collection.slug}`}
        data={breadcrumbLd([
          { label: "Couleurs RAL", href: "/couleurs-ral" },
          { label: `Collection ${collection.name}` },
        ])}
      />

      {/* Declare the narrative swarm phase for this page — particles form
          the collection name in its accent color. The morph starts as
          soon as the route mounts, carrying the user's previous phase
          (AZ/Galaxy/whatever) smoothly into this one. */}
      <CollectionSwarmBinding
        name={collection.name}
        accentHex={collection.accentColor}
      />

      {/* ── Hero cinématique ─────────────────────────────────────── */}
      <CollectionHeroMosaic
        name={collection.name}
        subtitle={collection.subtitle}
        description={collection.description}
        tags={collection.tags}
        finishes={collection.finishes}
        accentColor={collection.accentColor}
        bgGradient={collection.bgGradient}
        catalogueUrl={collection.url}
      />

      {/* ── About ────────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-tight">
          <ScrollReveal>
            <div className="max-w-3xl">
              <span className="section-label">
                <Sparkles className="h-3 w-3" />
                L&apos;histoire de la collection
              </span>
              <h2 className="heading-display mt-6 text-balance text-4xl text-brand-night sm:text-5xl">
                {collection.subtitle}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-brand-charcoal/80">
                {collection.longDescription}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-12 rounded-2xl border border-brand-night/10 bg-brand-cream/50 p-6">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal/60">
                    Disponible sur demande
                  </p>
                  <p className="mt-1 text-sm text-brand-charcoal/80">
                    Délai de livraison : <strong>{collection.leadTime}</strong>{" "}
                    — échantillon test disponible sur demande.
                  </p>
                </div>
                <Link
                  href="/devis"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-night px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange"
                >
                  Demander un devis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Finitions grid ───────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Finitions"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={
                <>
                  Toutes les finitions{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${collection.accentColor} 0%, #1a1a1a 100%)`,
                    }}
                  >
                    {collection.name}
                  </span>
                </>
              }
              description={`${collection.finishes.length} finitions exclusives. Cliquez sur une finition pour la sélectionner et la demander directement.`}
            />
          </ScrollReveal>

          <div className="mt-12">
            <CollectionFinishesGrid
              collectionName={collection.name}
              accentColor={collection.accentColor}
              finishes={collection.finishes}
              subCollections={collection.subCollections}
            />
          </div>
        </div>
      </section>

      {/* ── Characteristics ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-gradient-night" />
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />

        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              label="Spécifications"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={<>Ce qui rend {collection.name} unique</>}
              description={`Les propriétés techniques et esthétiques de la collection ${collection.name}.`}
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

      {/* ── Applications ─────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Usages"
              title={
                <>
                  Applications{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    idéales
                  </span>
                </>
              }
              description={`Les domaines où la collection ${collection.name} excelle.`}
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {collection.applications.map((app, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex items-center gap-4 rounded-2xl border border-brand-night/10 bg-brand-cream/50 p-6 transition-all hover:shadow-md">
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

      {/* ── Other collections ────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Collections Adaptacolor"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={<>Explorez les autres collections</>}
              description="Trois autres univers Adaptacolor à découvrir."
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {others.map((other, i) => {
              const preview = other.finishes.find((f) => f.imageUrl);
              return (
                <ScrollReveal key={other.slug} delay={i * 0.08}>
                  <Link
                    href={`/couleurs-ral/${other.slug}`}
                    className="group relative block overflow-hidden rounded-2xl border border-brand-night/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div
                      className="relative aspect-[4/3] w-full overflow-hidden"
                      style={{ backgroundColor: other.accentColor }}
                    >
                      {preview?.imageUrl && (
                        <Image
                          src={preview.imageUrl}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 360px, 100vw"
                          quality={70}
                          loading="lazy"
                          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    </div>
                    <div className="p-6">
                      <div
                        className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-charcoal/60"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: other.accentColor }}
                        />
                        {other.subtitle}
                      </div>
                      <h3 className="heading-display text-2xl text-brand-night">
                        {other.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/70">
                        {other.finishes.length} finitions · {other.leadTime}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange transition-transform group-hover:translate-x-0.5">
                        Découvrir <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Back ─────────────────────────────────────────────────── */}
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

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <CtaBand
        title={`Cette collection vous inspire ?`}
        description={`Demandez un échantillon gratuit de la collection ${collection.name}. Nous préparons un test sur métal pour valider votre choix.`}
        primaryLabel="Demander un échantillon"
        primaryHref="/devis"
      />
    </>
  );
}
