import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, ShieldCheck, Euro, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { FeatureCard } from "@/components/ui/feature-card";
import { CtaBand } from "@/components/ui/cta-band";
import { COMBOS, getCombo } from "@/lib/combos-data";
import { getSpecialtyBySlug } from "@/lib/specialites-data";
import { getVilleBySlug } from "@/lib/villes-data";
import { SITE } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMBOS.map((c) => ({ service: c.service, ville: c.villeSlug }));
}

interface Props {
  params: Promise<{ service: string; ville: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service, ville } = await params;
  const combo = getCombo(service, ville);
  if (!combo) return { title: "Page introuvable" };
  const clean = combo.metaTitle.replace(/\s*[|–—-]\s*AZ\s*[ÉE]poxy\s*$/i, "");
  return buildMetadata({
    title: clean,
    description: combo.metaDescription,
    path: `/thermolaquage-${combo.service}-${combo.villeSlug}`,
  });
}

const SERVICE_LABEL: Record<string, string> = {
  jantes: "jantes",
  portail: "portail & ferronnerie",
};

export default async function ComboPage({ params }: Props) {
  const { service, ville } = await params;
  const combo = getCombo(service, ville);
  if (!combo) notFound();

  const specialty = getSpecialtyBySlug(combo.service);
  const villeData = getVilleBySlug(combo.villeSlug);
  const serviceLabel = SERVICE_LABEL[combo.service] ?? combo.service;
  const canonicalPath = `/thermolaquage-${combo.service}-${combo.villeSlug}`;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: combo.h1,
    serviceType: `Thermolaquage ${serviceLabel}`,
    provider: { "@id": `${SITE.url}#business` },
    areaServed: { "@type": "City", name: combo.villeName },
    description: combo.metaDescription,
    url: `${SITE.url}${canonicalPath}`,
  };

  return (
    <>
      <JsonLd id={`ld-service-${combo.slug}`} data={serviceLd} />

      <PageHero
        label={`Thermolaquage ${serviceLabel} · ${combo.villeName}`}
        title={combo.h1}
        description={combo.uniqueAngle.split(/(?<=\.)\s/)[0]}
        variant="transparent"
        image={`/images/heros/specialites-${combo.service}.webp`}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: specialty?.title ?? serviceLabel, href: `/specialites/${combo.service}` },
          { label: combo.villeName },
        ]}
      />

      {/* Intro locale unique */}
      <section className="bg-brand-cream py-20">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl">
              <p className="text-lg leading-relaxed text-brand-charcoal/80">
                {combo.uniqueAngle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/devis" className="btn-primary">
                  Devis {serviceLabel} gratuit à {combo.villeName}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-night/15 px-6 py-3 text-sm font-semibold text-brand-night transition-colors hover:border-brand-night/40"
                >
                  Appeler le {SITE.phone}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bénéfices du service (depuis la spécialité parente) */}
      {specialty && specialty.benefits.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-wide">
            <ScrollReveal>
              <SectionHeader
                label="Pourquoi le thermolaquage"
                labelIcon={<ShieldCheck className="h-3 w-3" />}
                title={
                  <>
                    Le thermolaquage de {serviceLabel} à{" "}
                    <span className="bg-gradient-ember bg-clip-text text-transparent">
                      {combo.villeName}
                    </span>
                  </>
                }
                description={specialty.description}
              />
            </ScrollReveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {specialty.benefits.slice(0, 3).map((b, i) => (
                <ScrollReveal key={b.title} delay={i * 0.1}>
                  <FeatureCard
                    icon={<ShieldCheck className="h-6 w-6" />}
                    title={b.title}
                    description={b.description}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prix indicatifs + local */}
      <section className="bg-brand-cream py-20">
        <div className="container-wide">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            {specialty?.pricingTiers && specialty.pricingTiers.length > 0 && (
              <ScrollReveal>
                <div className="rounded-2xl border border-brand-night/10 bg-white p-8 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                    <Euro className="h-6 w-6" />
                  </div>
                  <h2 className="heading-display text-2xl text-brand-night">
                    Tarifs indicatifs
                  </h2>
                  <div className="mt-4 space-y-3">
                    {specialty.pricingTiers.slice(0, 3).map((t) => (
                      <div key={t.label} className="flex items-baseline justify-between gap-3 border-b border-brand-night/5 pb-2">
                        <span className="text-sm text-brand-charcoal/80">{t.label}</span>
                        <span className="shrink-0 font-mono text-sm font-bold text-brand-orange-dark">
                          {t.priceFrom}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-brand-charcoal/60">
                    Fourchette indicative — devis personnalisé gratuit sous 24 h.
                  </p>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-brand-night/10 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                  <MapPin className="h-6 w-6" />
                </div>
                <h2 className="heading-display text-2xl text-brand-night">
                  Intervention à {combo.villeName}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/75">
                  Notre atelier de 1 800 m² à Bruyères-sur-Oise (95820) dessert{" "}
                  {combo.villeName}
                  {villeData ? ` (${combo.villeName === villeData.name ? villeData.department : ""})` : ""}{" "}
                  {villeData?.driveTimeMin
                    ? `— environ ${villeData.driveTimeMin} min de route.`
                    : "en Île-de-France et dans l'Oise."}{" "}
                  Enlèvement et livraison possibles. Cabine 7 × 3 × 4 m et four
                  grande capacité, teintes RAL &amp; NCS.
                </p>
                <div className="mt-5 flex flex-col gap-2 text-sm">
                  <Link
                    href={`/thermolaquage-${combo.villeSlug}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-orange-dark hover:underline"
                  >
                    Thermolaquage à {combo.villeName} — toutes prestations
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/specialites/${combo.service}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-orange-dark hover:underline"
                  >
                    En savoir plus sur le thermolaquage de {serviceLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="mt-1 inline-flex items-center gap-2 text-brand-charcoal/70">
                    <Clock className="h-4 w-4 text-brand-orange" />
                    Délai {specialty?.turnaround ?? "rapide"} · devis sous 24 h
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
