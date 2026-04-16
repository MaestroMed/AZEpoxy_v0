import {
  Wind,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  Wrench,
  Paintbrush,
  CircleDot,
  Layers,
  Check,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { serviceLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { getServiceBySlug } from "@/lib/services-data";

const SERVICE_DESCRIPTION =
  "Sablage et grenaillage professionnel : décapage, préparation de surface SA 2.5, cabine 7 mètres. Indispensable avant thermolaquage ou peinture. AZ Époxy, Bruyères-sur-Oise.";

export const metadata = buildMetadata({
  title: "Sablage & Grenaillage",
  description: SERVICE_DESCRIPTION,
  path: "/services/sablage",
});

/* Types of blasting techniques */
const BLASTING_TYPES = [
  {
    icon: <Wind className="h-6 w-6" />,
    title: "Sablage à sec",
    description:
      "Projection de corindon ou d'oxyde d'aluminium par air comprimé à haute pression (6-8 bars). Technique de référence pour le décapage agressif des aciers épais, charpentes et structures soudées. Propreté SA 2.5 à SA 3 garantie.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Grenaillage",
    description:
      "Projection de grenaille d'acier angulaire par turbine centrifuge. Idéal pour les grandes séries et les pièces lourdes. Le grenaillage crée un profil d'ancrage très homogène et génère un effet de martelage bénéfique (contraintes résiduelles de compression).",
  },
  {
    icon: <CircleDot className="h-6 w-6" />,
    title: "Microbillage",
    description:
      "Projection de microbilles de verre ou de céramique à basse pression. Technique de finition qui satine uniformément la surface sans modifier la géométrie. Particulièrement adaptée à l'aluminium, l'inox et les alliages légers.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Aérogommage",
    description:
      "Variante douce du sablage utilisant un abrasif fin projeté à très basse pression (1-3 bars). Permet de décaper les surfaces sensibles comme le bois, la pierre ou les métaux minces sans les endommager. Idéal pour la restauration.",
  },
];

/* Applications list */
const APPLICATIONS = [
  {
    material: "Acier & acier galvanisé",
    examples:
      "Charpentes métalliques, portails, clôtures, garde-corps, escaliers, structures soudées, réservoirs, citernes.",
  },
  {
    material: "Aluminium & alliages légers",
    examples:
      "Jantes, châssis moto, pièces aéronautiques, menuiseries aluminium, profilés, dissipateurs thermiques.",
  },
  {
    material: "Fonte & acier moulé",
    examples:
      "Pièces de fonderie, blocs moteur, carters, éléments de machines-outils, mobilier urbain en fonte.",
  },
  {
    material: "Pierre, béton & brique",
    examples:
      "Façades, monuments historiques, escaliers en pierre, terrasses, dalles béton — par aérogommage uniquement.",
  },
  {
    material: "Bois",
    examples:
      "Volets, poutres, colombages, mobilier ancien, parquets — décapage doux par aérogommage à basse pression.",
  },
  {
    material: "Inox & métaux non ferreux",
    examples:
      "Cuves inox, équipements agroalimentaires, pièces en cuivre, laiton ou bronze. Microbillage recommandé.",
  },
];

export default function SablagePage() {
  const service = getServiceBySlug("sablage")!;

  return (
    <>
      <JsonLd
        id="ld-service-sablage"
        data={serviceLd({
          name: "Sablage & Grenaillage",
          description: SERVICE_DESCRIPTION,
          serviceType: "Sablage",
          url: "/services/sablage",
        })}
      />

      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label="Sablage"
        title={
          <>
            Sablage &amp;
            <br />
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Grenaillage
            </span>
          </>
        }
        description="La préparation de surface est la clé de la tenue du revêtement. Notre cabine de sablage de 7 mètres accueille des pièces de grande dimension pour un décapage conforme à la norme ISO 8501-1."
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Sablage" },
        ]}
      />

      {/* ── Section 2 — Explanation ──────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Le procédé"
              labelIcon={<Wind className="h-3 w-3" />}
              title={
                <>
                  Préparer la surface,{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    c&apos;est tout garantir.
                  </span>
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal delay={0.1}>
              <div className="space-y-6 text-brand-charcoal/80 leading-relaxed">
                <p>
                  Aucun revêtement, aussi performant soit-il, ne peut compenser
                  une mauvaise préparation de surface. Le sablage et le
                  grenaillage sont les techniques de référence pour éliminer la
                  rouille, la calamine de laminage, les anciennes peintures et
                  toute contamination superficielle avant l&apos;application
                  d&apos;un revêtement de protection.
                </p>
                <p>
                  Le principe est simple : un abrasif — corindon, grenaille
                  d&apos;acier, microbilles de verre ou sable spécial — est
                  projeté à haute vitesse sur la surface à traiter. L&apos;impact
                  des particules décape le métal et crée simultanément un profil
                  de rugosité contrôlé (25 à 75 µm) indispensable à
                  l&apos;adhérence mécanique de la couche suivante, qu&apos;il
                  s&apos;agisse de peinture, de poudre époxy ou de métallisation.
                </p>
                <p>
                  Notre cabine de sablage de 7 mètres de long permet de traiter
                  des pièces de grande dimension : charpentes métalliques,
                  portails, escaliers complets, éléments de façade. Pour les
                  pièces sensibles, nous proposons le microbillage et
                  l&apos;aérogommage, des variantes douces adaptées à
                  l&apos;aluminium, au bois et à la pierre.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-brand-night/5">
                <div className="text-center">
                  <Wind className="mx-auto h-12 w-12 text-brand-orange/40" />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-charcoal/40">
                    Cabine de sablage 7 m
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 3 — Blasting Types (night) ───────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Techniques"
              labelIcon={<Target className="h-3 w-3" />}
              title={
                <>
                  4 techniques,{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    1 objectif.
                  </span>
                </>
              }
              description="Nous adaptons la technique, l'abrasif et la pression à chaque type de pièce pour un résultat optimal sans altération du support."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BLASTING_TYPES.map((type, index) => (
              <ScrollReveal key={type.title} delay={index * 0.1}>
                <FeatureCard
                  dark
                  icon={type.icon}
                  title={type.title}
                  description={type.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Technical Specs ──────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Données techniques"
              labelIcon={<ShieldCheck className="h-3 w-3" />}
              title="Spécifications techniques"
              description="Les paramètres de notre équipement de sablage professionnel, conformes à la norme ISO 8501-1."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.specs.map((spec, index) => (
              <ScrollReveal key={spec.label} delay={index * 0.08}>
                <div className="rounded-xl border border-brand-night/10 bg-white p-6">
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

      {/* ── Section 5 — Applications ─────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Applications"
              labelIcon={<Wrench className="h-3 w-3" />}
              title={
                <>
                  Que peut-on{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    sabler ?
                  </span>
                </>
              }
              description="Du métal le plus épais au bois le plus délicat, nous adaptons la technique et les paramètres pour chaque matériau."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {APPLICATIONS.map((app, index) => (
              <ScrollReveal key={app.material} delay={index * 0.08}>
                <div className="rounded-2xl border border-brand-night/10 bg-brand-cream p-8 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-brand-orange" />
                    <h3 className="heading-display text-lg text-brand-night">
                      {app.material}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
                    {app.examples}
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
              description="Tout ce que vous devez savoir sur le sablage et le grenaillage."
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
        title="Besoin d'un décapage professionnel ?"
        description="Envoyez-nous vos photos pour un devis gratuit sous 24h. Cabine 7 mètres, tous métaux, bois et pierre."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
