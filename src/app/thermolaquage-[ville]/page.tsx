import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Car,
  Clock,
  Flame,
  Layers,
  MapPin,
  Palette,
  Settings,
  Shield,
  Sparkles,
  Leaf,
} from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { VILLES, getVilleBySlug } from "@/lib/villes-data";
import { SITE } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string }>;
}): Promise<Metadata> {
  const { ville: slug } = await params;
  const ville = getVilleBySlug(slug);

  if (!ville) {
    return { title: "Ville introuvable" };
  }

  return {
    title: `Thermolaquage à ${ville.name} (${ville.departmentCode}) — Poudre Époxy`,
    description: `Thermolaquage poudre époxy professionnel à ${ville.name} (${ville.department}). ${ville.distance} de notre atelier, ${ville.driveTime} de trajet. 200+ couleurs RAL, sablage, métallisation, express 48h. Devis gratuit.`,
    alternates: {
      canonical: `${SITE.url}/thermolaquage-${ville.slug}`,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Static params                                                              */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
  return VILLES.map((v) => ({ ville: v.slug }));
}

/* -------------------------------------------------------------------------- */
/*  Services data for the cards                                                */
/* -------------------------------------------------------------------------- */

const CITY_SERVICES = [
  {
    icon: <Flame className="h-6 w-6" />,
    title: "Thermolaquage",
    description:
      "Application de poudre époxy par pistolet électrostatique et cuisson à 200 °C. Finition durable, résistante aux UV, aux chocs et à la corrosion. Plus de 200 couleurs RAL disponibles.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Sablage & Grenaillage",
    description:
      "Décapage intégral par projection d'abrasif. Élimination de la rouille, des anciennes peintures et des impuretés pour une adhérence parfaite avant thermolaquage.",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Métallisation",
    description:
      "Projection thermique de zinc ou zinc-aluminium pour une protection cathodique de longue durée. Idéal pour les pièces exposées en milieu agressif (humidité, sel, chimie).",
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Finitions spéciales",
    description:
      "Effets texturés, satinés, mats, métallisés ou nacrés grâce à nos collections Adaptacolor exclusives (Patina, Polaris, Dichroic, Sfera). Personnalisation sur mesure.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function VillePage({
  params,
}: {
  params: Promise<{ ville: string }>;
}) {
  const { ville: slug } = await params;
  const ville = getVilleBySlug(slug);

  if (!ville) {
    notFound();
  }

  const nearbyVilles = ville.nearbyVilles
    .map((s) => getVilleBySlug(s))
    .filter(Boolean);

  /* JSON-LD LocalBusiness with areaServed */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}#business`,
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.zip,
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 49.147,
      longitude: 2.327,
    },
    areaServed: {
      "@type": "City",
      name: ville.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: ville.department,
      },
    },
    priceRange: "€€",
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label="Zone desservie"
        title={
          <>
            Thermolaquage époxy{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              à {ville.name}
            </span>
          </>
        }
        description={`Service professionnel de thermolaquage poudre époxy pour ${ville.name} et ses environs. À seulement ${ville.distance} de notre atelier de Bruyères-sur-Oise.`}
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: `Thermolaquage à ${ville.name}` },
        ]}
      />

      {/* ── Section 2 — Intro / Distance ─────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl">
              {/* Distance info cards */}
              <div className="mb-12 grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-4 rounded-2xl border border-brand-night/10 bg-white p-6 shadow-sm">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal/50">
                      Distance
                    </p>
                    <p className="heading-display text-xl text-brand-night">
                      {ville.distance}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-brand-night/10 bg-white p-6 shadow-sm">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal/50">
                      Trajet
                    </p>
                    <p className="heading-display text-xl text-brand-night">
                      {ville.driveTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-brand-night/10 bg-white p-6 shadow-sm">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal/50">
                      Accès
                    </p>
                    <p className="heading-display text-xl text-brand-night">
                      {ville.access}
                    </p>
                  </div>
                </div>
              </div>

              {/* Local context */}
              <div className="rounded-2xl border border-brand-night/10 bg-white p-8 shadow-sm lg:p-10">
                <h2 className="heading-display text-2xl text-brand-night sm:text-3xl">
                  Thermolaquage professionnel pour{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {ville.name}
                  </span>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-brand-charcoal/80">
                  {ville.localContext}
                </p>
                <p className="mt-4 text-brand-charcoal/70 leading-relaxed">
                  Depuis notre atelier de 1 800 m² à Bruyères-sur-Oise,
                  AZ Époxy dessert {ville.name} ({ville.department},{" "}
                  {ville.departmentCode}) en{" "}
                  {ville.driveTime} de trajet via {ville.access}. Nous proposons
                  la collecte et la livraison pour les volumes importants.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 3 — Services ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Nos services"
              labelIcon={<Flame className="h-3 w-3" />}
              title={
                <>
                  Ce que nous proposons à{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {ville.name}
                  </span>
                </>
              }
              description={`Thermolaquage, sablage, métallisation et finitions spéciales — l'ensemble de nos prestations est disponible pour les clients de ${ville.name}.`}
            />
          </ScrollReveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2">
            {CITY_SERVICES.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <FeatureCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  dark
                />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                Découvrir tous nos services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 4 — Why AZ Époxy ─────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              centered
              label="Pourquoi AZ Époxy"
              labelIcon={<Shield className="h-3 w-3" />}
              title={
                <>
                  La référence du thermolaquage{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    en Île-de-France
                  </span>
                </>
              }
            />
          </ScrollReveal>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { icon: <Palette className="h-6 w-6" />, value: "200+", label: "Couleurs RAL" },
              { icon: <Shield className="h-6 w-6" />, value: "7m", label: "Cabine XXL" },
              { icon: <Clock className="h-6 w-6" />, value: "48h", label: "Service express" },
              { icon: <Leaf className="h-6 w-6" />, value: "0 COV", label: "Zéro solvant" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                    {stat.icon}
                  </div>
                  <div className="heading-display text-3xl text-brand-night sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-charcoal/50">
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 — Nearby Cities ────────────────────────────────── */}
      {nearbyVilles.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-wide">
            <ScrollReveal>
              <h2 className="heading-display text-2xl text-brand-night sm:text-3xl">
                Nous desservons aussi{" "}
                <span className="bg-gradient-ember bg-clip-text text-transparent">
                  les environs
                </span>
              </h2>
              <p className="mt-3 text-brand-charcoal/70">
                AZ Époxy intervient dans toute l&apos;Île-de-France et l&apos;Oise.
                Découvrez nos pages dédiées aux villes voisines de {ville.name}.
              </p>
            </ScrollReveal>

            <div className="mt-8 flex flex-wrap gap-3">
              {nearbyVilles.map(
                (nearby) =>
                  nearby && (
                    <Link
                      key={nearby.slug}
                      href={`/thermolaquage-${nearby.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-night/10 bg-brand-cream/60 px-5 py-3 text-sm font-semibold text-brand-night transition-all hover:border-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      Thermolaquage à {nearby.name}
                    </Link>
                  )
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 6 — CTA Band ─────────────────────────────────────── */}
      <CtaBand
        title={`Devis gratuit pour ${ville.name}`}
        description={`Envoyez vos photos et recevez un chiffrage sous 24h. Collecte et livraison possibles sur ${ville.name} et ses environs.`}
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
