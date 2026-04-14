import type { Metadata } from "next";
import {
  Layers,
  ShieldCheck,
  Droplets,
  Flame,
  Wind,
  Thermometer,
  Anchor,
  Factory,
  Mountain,
  Check,
  X,
  Minus,
} from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { getServiceBySlug } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Métallisation",
  description:
    "Métallisation zinc et aluminium par projection thermique. Protection anti-corrosion extrême pour milieux marins, industriels et enterrés. Conforme ISO 2063. AZ Époxy, Bruyères-sur-Oise.",
};

/* When to use metallisation — 4 use-case cards */
const USE_CASES = [
  {
    icon: <Anchor className="h-6 w-6" />,
    title: "Environnement marin",
    description:
      "Structures portuaires, plateformes offshore, ponts côtiers, bouées et balises. La métallisation zinc-aluminium résiste aux embruns salins et à l'immersion partielle en catégorie de corrosivité C5-M.",
  },
  {
    icon: <Mountain className="h-6 w-6" />,
    title: "Structures enterrées",
    description:
      "Pieux de fondation, palplanches, conduites et regards. Le dépôt de zinc assure une protection cathodique sacrificielle qui protège le métal même en contact direct avec un sol agressif.",
  },
  {
    icon: <Factory className="h-6 w-6" />,
    title: "Exposition chimique",
    description:
      "Cuves, réacteurs, tuyauteries et charpentes d'usines chimiques. L'aluminium projeté résiste aux vapeurs acides et aux atmosphères industrielles lourdes classées C4 à C5-I.",
  },
  {
    icon: <Thermometer className="h-6 w-6" />,
    title: "Zones climatiques extrêmes",
    description:
      "Structures exposées à de fortes amplitudes thermiques, gels répétés ou rayonnement UV intense. Le système duplex métallisation + thermolaquage offre une durée de vie de 40 ans et plus.",
  },
];

/* Comparison table data */
const COMPARISON_CRITERIA = [
  {
    criterion: "Épaisseur de protection",
    metallisation: "150 – 300 µm",
    galvanisation: "50 – 150 µm",
    thermolaquage: "60 – 80 µm",
  },
  {
    criterion: "Durée de vie estimée",
    metallisation: "25+ ans",
    galvanisation: "20+ ans",
    thermolaquage: "10+ ans",
  },
  {
    criterion: "Protection cathodique",
    metallisation: "check",
    galvanisation: "check",
    thermolaquage: "cross",
  },
  {
    criterion: "Taille des pièces",
    metallisation: "Illimitée",
    galvanisation: "Limitée au bain",
    thermolaquage: "Limitée au four",
  },
  {
    criterion: "Application sur site",
    metallisation: "check",
    galvanisation: "cross",
    thermolaquage: "cross",
  },
  {
    criterion: "Rendu esthétique",
    metallisation: "Brut / à recouvrir",
    galvanisation: "Brillant puis mat",
    thermolaquage: "200+ couleurs RAL",
  },
  {
    criterion: "Coût relatif",
    metallisation: "€€€",
    galvanisation: "€€",
    thermolaquage: "€",
  },
  {
    criterion: "Combinable (duplex)",
    metallisation: "check",
    galvanisation: "minus",
    thermolaquage: "check",
  },
];

function CellIcon({ value }: { value: string }) {
  if (value === "check")
    return <Check className="mx-auto h-5 w-5 text-green-600" />;
  if (value === "cross")
    return <X className="mx-auto h-5 w-5 text-red-400" />;
  if (value === "minus")
    return <Minus className="mx-auto h-5 w-5 text-brand-charcoal/30" />;
  return <span>{value}</span>;
}

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Métallisation",
  description:
    "Métallisation zinc et aluminium par projection thermique. Protection anti-corrosion extrême pour milieux marins, industriels et enterrés. Conforme ISO 2063. AZ Époxy, Bruyères-sur-Oise.",
  provider: {
    "@type": "LocalBusiness",
    name: "AZ Époxy",
    telephone: "+33971357496",
    address: {
      "@type": "PostalAddress",
      streetAddress: "23 Chemin du Bac des Aubins",
      addressLocality: "Bruyères-sur-Oise",
      postalCode: "95820",
      addressCountry: "FR",
    },
  },
  areaServed: "Île-de-France",
  serviceType: "Métallisation",
};

export default function MetallisationPage() {
  const service = getServiceBySlug("metallisation")!;

  return (
    <>
      {/* ── Service Schema ───────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label="Métallisation"
        title={
          <>
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Métallisation
            </span>
          </>
        }
        description="Projection thermique de zinc ou d'aluminium fondu pour une protection anti-corrosion extrême. Conforme ISO 2063, applicable sur des pièces de toute dimension, combinable avec le thermolaquage pour une durée de vie de 40 ans."
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Métallisation" },
        ]}
      />

      {/* ── Section 2 — Explanation ──────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Le procédé"
              labelIcon={<Layers className="h-3 w-3" />}
              title={
                <>
                  La protection{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    anti-corrosion ultime.
                  </span>
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal delay={0.1}>
              <div className="space-y-6 text-brand-charcoal/80 leading-relaxed">
                <p>
                  La métallisation, ou projection thermique, est un procédé de
                  traitement de surface qui consiste à fondre un fil de zinc ou
                  d&apos;aluminium dans un pistolet à arc électrique ou à
                  flamme, puis à projeter les gouttelettes métalliques fondues
                  sur le support préalablement sablé. Le dépôt, d&apos;une
                  épaisseur de 150 à 300 µm, forme une couche protectrice
                  continue qui adhère mécaniquement au substrat.
                </p>
                <p>
                  Le zinc projeté fonctionne comme une anode sacrificielle : en
                  cas de rayure ou d&apos;écaillage local, c&apos;est le zinc
                  qui se corrode en priorité, protégeant cathodiquement
                  l&apos;acier sous-jacent. Cette protection galvanique est
                  identique à celle de la galvanisation à chaud, mais sans les
                  contraintes de taille de bain ni de température.
                </p>
                <p>
                  Combinée à une couche de finition en poudre époxy
                  (système duplex), la métallisation offre la durabilité
                  maximale : 40 ans et plus en environnement C5-M (marin ou
                  industriel sévère). C&apos;est la solution de référence pour
                  les charpentes de pont, les structures offshore, les
                  pylônes et les infrastructures critiques.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-brand-night/5">
                <div className="text-center">
                  <Layers className="mx-auto h-12 w-12 text-brand-orange/40" />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-charcoal/40">
                    Pistolet de métallisation
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 3 — When to use (night) ──────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Cas d'usage"
              labelIcon={<ShieldCheck className="h-3 w-3" />}
              title={
                <>
                  Quand la métallisation est{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    indispensable.
                  </span>
                </>
              }
              description="Les environnements les plus agressifs exigent la protection la plus robuste. Voici les cas où la métallisation s'impose."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((uc, index) => (
              <ScrollReveal key={uc.title} delay={index * 0.1}>
                <FeatureCard
                  dark
                  icon={uc.icon}
                  title={uc.title}
                  description={uc.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Comparison Table ─────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              centered
              label="Comparatif"
              labelIcon={<Layers className="h-3 w-3" />}
              title={
                <>
                  Métallisation vs Galvanisation vs{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    Thermolaquage
                  </span>
                </>
              }
              description="Chaque procédé a ses forces. Comparez pour choisir la meilleure solution — ou combinez-les en système duplex."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mx-auto mt-14 max-w-5xl overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b-2 border-brand-night/10 p-4 text-left text-sm font-semibold text-brand-charcoal/60">
                      Critère
                    </th>
                    <th className="border-b-2 border-brand-orange/30 bg-brand-orange/5 p-4 text-center text-sm font-semibold text-brand-night">
                      <Layers className="mx-auto mb-1 h-5 w-5 text-brand-orange" />
                      Métallisation
                    </th>
                    <th className="border-b-2 border-brand-night/10 p-4 text-center text-sm font-semibold text-brand-night">
                      <Droplets className="mx-auto mb-1 h-5 w-5 text-brand-charcoal/40" />
                      Galvanisation
                    </th>
                    <th className="border-b-2 border-brand-night/10 p-4 text-center text-sm font-semibold text-brand-night">
                      <Flame className="mx-auto mb-1 h-5 w-5 text-brand-charcoal/40" />
                      Thermolaquage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_CRITERIA.map((row, index) => (
                    <tr
                      key={row.criterion}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-brand-cream"
                      }
                    >
                      <td className="border-b border-brand-night/5 p-4 text-sm font-medium text-brand-night">
                        {row.criterion}
                      </td>
                      <td className="border-b border-brand-night/5 bg-brand-orange/5 p-4 text-center text-sm text-brand-charcoal/80">
                        <CellIcon value={row.metallisation} />
                      </td>
                      <td className="border-b border-brand-night/5 p-4 text-center text-sm text-brand-charcoal/80">
                        <CellIcon value={row.galvanisation} />
                      </td>
                      <td className="border-b border-brand-night/5 p-4 text-center text-sm text-brand-charcoal/80">
                        <CellIcon value={row.thermolaquage} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 5 — Technical Specs ──────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Données techniques"
              labelIcon={<Wind className="h-3 w-3" />}
              title="Spécifications techniques"
              description="Les paramètres clés de notre procédé de métallisation, conformes à la norme ISO 2063."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.specs.map((spec, index) => (
              <ScrollReveal key={spec.label} delay={index * 0.08}>
                <div className="rounded-xl border border-brand-night/10 bg-brand-cream p-6">
                  <p className="text-sm text-brand-charcoal/60">
                    {spec.label}
                  </p>
                  <p className="heading-display mt-2 text-2xl text-brand-night">
                    {spec.value}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6 — FAQs ─────────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-tight">
          <ScrollReveal>
            <SectionHeader
              centered
              label="FAQ"
              title="Questions fréquentes"
              description="Tout ce que vous devez savoir sur la métallisation par projection thermique."
            />
          </ScrollReveal>

          <div className="mt-14">
            <ScrollReveal delay={0.1}>
              <FAQAccordion items={service.faqs} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 7 — CTA ──────────────────────────────────────────── */}
      <CtaBand
        title="Un projet en milieu corrosif ?"
        description="Métallisation zinc, aluminium ou système duplex — décrivez votre projet et recevez un devis gratuit sous 24h."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
