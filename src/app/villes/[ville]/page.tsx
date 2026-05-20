import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Clock,
  Flame,
  Leaf,
  MapPin,
  Palette,
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { localBusinessLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import {
  getVilles,
  getVilleBySlugAsync,
  DEPARTMENT_NAMES,
} from "@/lib/villes-data";
import {
  composeIntroParagraph,
  composeClientArchetypes,
  composeLocalFaq,
  composeProcessSteps,
  composeFaqJsonLd,
} from "@/lib/villes/copy";
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
  const ville = await getVilleBySlugAsync(slug);

  if (!ville) {
    return { title: "Ville introuvable" };
  }

  return buildMetadata({
    title: `Thermolaquage à ${ville.name} (${ville.departmentCode}) — Poudre Époxy`,
    description: `Thermolaquage poudre époxy professionnel à ${ville.name} (${ville.department}). ${ville.distance} de notre atelier de Bruyères-sur-Oise, ${ville.driveTime} de trajet via ${ville.access}. 200+ couleurs RAL & NCS, sablage, finitions spéciales, express 48h. Devis gratuit.`,
    path: `/thermolaquage-${ville.slug}`,
    keywords: [
      `thermolaquage ${ville.name}`,
      `poudre époxy ${ville.name}`,
      `sablage ${ville.name}`,
      `finitions spéciales ${ville.name}`,
      `thermolaquage ${ville.department}`,
      `peintre poudre ${ville.name}`,
      "AZ Époxy",
    ],
  });
}

/* -------------------------------------------------------------------------- */
/*  Static params                                                              */
/* -------------------------------------------------------------------------- */

/**
 * 76 villes prerenderées au build, revalidation ISR 24h.
 * URL publique : `/thermolaquage-{slug}` (rewrite dans next.config.mjs).
 */
export const revalidate = 86400;

export async function generateStaticParams() {
  const villes = await getVilles();
  return villes.map((v) => ({ ville: v.slug }));
}

/* -------------------------------------------------------------------------- */
/*  Services data (shared across all city pages)                               */
/* -------------------------------------------------------------------------- */

const CITY_SERVICES = [
  {
    icon: <Flame className="h-6 w-6" />,
    title: "Thermolaquage",
    description:
      "Application de poudre époxy par pistolet électrostatique, cuisson en four. Finition durable, résistante aux UV, aux chocs et à la corrosion. Nuanciers RAL et NCS au complet.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Sablage & Grenaillage",
    description:
      "Décapage intégral par projection d'abrasif. Élimination de la rouille, des anciennes peintures et des impuretés pour une adhérence parfaite avant thermolaquage.",
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Finitions spéciales",
    description:
      "Au-delà du nuancier RAL et NCS : effets texturés, satinés, mats, mouchetés et collections architecturales (Effets Corten, Métalliques, Irisés, Anodisés). Personnalisation sur mesure.",
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
  const allVilles = await getVilles();
  const ville = allVilles.find((v) => v.slug === slug);

  if (!ville) {
    notFound();
  }

  const villeBySlug = new Map(allVilles.map((v) => [v.slug, v]));
  const nearbyVilles = ville.nearbyVilles
    .map((s) => villeBySlug.get(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof villeBySlug.get>>[];

  /* ── Composed copy (unique per city) ──────────────────────── */
  const introCopy = composeIntroParagraph(ville);
  const archetypes = composeClientArchetypes(ville);
  const faq = composeLocalFaq(ville);
  const processSteps = composeProcessSteps(ville);

  /* ── Schema.org payloads ──────────────────────────────────── */
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: ville.department,
        item: `${SITE.url}/thermolaquage-${ville.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Thermolaquage à ${ville.name}`,
      },
    ],
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Thermolaquage poudre époxy à ${ville.name}`,
    serviceType: "Thermolaquage industriel poudre époxy",
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bruyères-sur-Oise",
        postalCode: "95820",
        addressCountry: "FR",
      },
    },
    areaServed: {
      "@type": "City",
      name: ville.name,
      containedIn: ville.department,
    },
    description: introCopy,
  };

  const faqLd = composeFaqJsonLd(faq);

  return (
    <>
      <JsonLd
        id={`ld-business-${ville.slug}`}
        data={localBusinessLd({
          areaServed: [
            { type: "City", name: ville.name, containedIn: ville.department },
            { type: "AdministrativeArea", name: ville.department },
          ],
        })}
      />
      <JsonLd id={`ld-breadcrumb-${ville.slug}`} data={breadcrumbLd} />
      <JsonLd id={`ld-service-${ville.slug}`} data={serviceLd} />
      <JsonLd id={`ld-faq-${ville.slug}`} data={faqLd} />

      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label={`${ville.department} · ${ville.departmentCode}`}
        title={
          <>
            Thermolaquage époxy{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              à {ville.name}
            </span>
          </>
        }
        description={`Service professionnel de thermolaquage poudre époxy pour ${ville.name} et ses environs. ${ville.distance} de notre atelier de Bruyères-sur-Oise, ${ville.driveTime} de trajet via ${ville.access}.`}
        variant="transparent"
        image="/images/heros/ville-generic.webp"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: `Thermolaquage à ${ville.name}` },
        ]}
      />

      {/* ── Section 2 — Intro local + distance cards ───────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl">
              {/* Distance info cards */}
              <div className="mb-12 grid gap-4 sm:grid-cols-3">
                <DistanceCard
                  icon={<MapPin className="h-6 w-6" />}
                  label="Distance"
                  value={ville.distance}
                />
                <DistanceCard
                  icon={<Clock className="h-6 w-6" />}
                  label="Trajet"
                  value={ville.driveTime}
                />
                <DistanceCard
                  icon={<Car className="h-6 w-6" />}
                  label="Accès"
                  value={ville.access}
                />
              </div>

              {/* Local context — unique paragraph per city */}
              <div className="rounded-2xl border border-brand-night/10 bg-white p-8 shadow-sm lg:p-10">
                <h2 className="heading-display text-2xl text-brand-night sm:text-3xl">
                  Thermolaquage professionnel pour{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {ville.name}
                  </span>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-brand-charcoal/80">
                  {introCopy}
                </p>
                {ville.landmarks && ville.landmarks.length > 0 && (
                  <p className="mt-4 text-brand-charcoal/70 leading-relaxed">
                    Repères locaux : {ville.landmarks.join(", ")}. Notre rayon
                    d&apos;intervention couvre l&apos;ensemble de la commune et
                    ses zones d&apos;activités, avec service d&apos;enlèvement
                    et livraison disponible pour les volumes importants.
                  </p>
                )}
                {ville.neighborhoods && ville.neighborhoods.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-charcoal/45 mr-1 self-center">
                      Quartiers desservis :
                    </span>
                    {ville.neighborhoods.map((q) => (
                      <span
                        key={q}
                        className="inline-flex items-center rounded-md bg-brand-orange/[0.08] px-2 py-1 text-[12px] font-medium text-brand-orange"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 3 — Pour qui à X ? (archétypes client) ─────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Pour qui à"
              labelIcon={<Users className="h-3 w-3" />}
              title={
                <>
                  Les pros & particuliers de{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {ville.name}
                  </span>
                </>
              }
              description={`Selon le tissu économique local de ${ville.name}, voici les clients que nous accompagnons en thermolaquage.`}
            />
          </ScrollReveal>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
            {archetypes.map((a, i) => (
              <ScrollReveal key={a.title} delay={i * 0.08}>
                <article className="h-full rounded-2xl border border-brand-night/10 bg-brand-cream/40 p-6 transition-colors hover:border-brand-orange/40">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/12 text-brand-orange">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="heading-display text-lg text-brand-night">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/70">
                    {a.desc}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Services ─────────────────────────────────────── */}
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
              description={`Thermolaquage, sablage et finitions spéciales — l'ensemble de nos prestations est disponible pour les clients de ${ville.name}.`}
            />
          </ScrollReveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
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

      {/* ── Section 5 — Comment ça se passe (process locality) ─────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Comment ça se passe"
              labelIcon={<Settings className="h-3 w-3" />}
              title={
                <>
                  De {ville.name}{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    à l&apos;atelier
                  </span>
                </>
              }
              description={`5 étapes simples — collecte, traitement et restitution, avec un suivi adapté à votre projet à ${ville.name}.`}
            />
          </ScrollReveal>

          <div className="mx-auto mt-12 max-w-4xl">
            <ol className="space-y-3">
              {processSteps.map((step, i) => (
                <ScrollReveal key={step.label} delay={i * 0.06}>
                  <li className="flex gap-4 rounded-2xl border border-brand-night/10 bg-white p-5">
                    <span className="font-display text-2xl font-black text-brand-orange leading-none w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-night">
                        {step.label.replace(/^\d+\s—\s/, "")}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-brand-charcoal/75">
                        {step.description}
                      </p>
                    </div>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Section 6 — Why AZ Époxy stats ─────────────────────────── */}
      <section className="bg-white py-20">
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

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { icon: <Palette className="h-6 w-6" />, value: "200+", label: "Couleurs RAL & NCS" },
              { icon: <Shield className="h-6 w-6" />, value: "7×3×4", label: "Cabine XXL (m)" },
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

      {/* ── Section 7 — FAQ locale ─────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="FAQ locale"
              title={
                <>
                  Questions fréquentes —{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {ville.name}
                  </span>
                </>
              }
              description={`Les réponses précises aux questions des particuliers et professionnels de ${ville.name}.`}
              centered
            />
          </ScrollReveal>

          <div className="mx-auto mt-12 max-w-3xl">
            <FAQAccordion
              items={faq.map((f) => ({
                question: f.question,
                answer: f.answer,
              }))}
            />
          </div>
        </div>
      </section>

      {/* ── Section 8 — Nearby cities (mesh) ───────────────────────── */}
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
              {nearbyVilles.map((nearby) => (
                <Link
                  key={nearby.slug}
                  href={`/thermolaquage-${nearby.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-night/10 bg-brand-cream/60 px-5 py-3 text-sm font-semibold text-brand-night transition-all hover:border-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Thermolaquage à {nearby.name}
                  <span className="text-xs font-normal text-brand-charcoal/45">
                    ({nearby.distance})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 9 — CTA ────────────────────────────────────────── */}
      <CtaBand
        title={`Devis gratuit pour ${ville.name}`}
        description={`Envoyez vos photos et recevez un chiffrage sous 24h. Collecte et livraison possibles sur ${ville.name} et ses environs (${ville.driveTime} depuis notre atelier).`}
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function DistanceCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-brand-night/10 bg-white p-6 shadow-sm">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal/50">
          {label}
        </p>
        <p className="heading-display text-xl text-brand-night">{value}</p>
      </div>
    </div>
  );
}
