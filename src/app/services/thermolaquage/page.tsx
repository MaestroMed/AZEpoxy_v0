import type { Metadata } from "next";
import {
  Flame,
  ShieldCheck,
  Sparkles,
  Paintbrush,
  Target,
  Droplets,
  Zap,
  Leaf,
  Layers,
  Sun,
} from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { ProcessStep } from "@/components/ui/process-step";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { getServiceBySlug } from "@/lib/services-data";
import { PROCESS_STEPS } from "@/lib/process-data";

export const metadata: Metadata = {
  title: "Thermolaquage Poudre Époxy",
  description:
    "Thermolaquage par poudre époxy professionnel : application électrostatique, cuisson à 200 °C, 200+ couleurs RAL, 0 COV. Depuis notre atelier de 1 800 m² à Bruyères-sur-Oise.",
};

/* Map feature titles to appropriate icons */
const FEATURE_ICONS = [
  <Leaf key="leaf" className="h-6 w-6" />,
  <Paintbrush key="paintbrush" className="h-6 w-6" />,
  <Sun key="sun" className="h-6 w-6" />,
  <Target key="target" className="h-6 w-6" />,
  <Layers key="layers" className="h-6 w-6" />,
  <Droplets key="droplets" className="h-6 w-6" />,
];

export default function ThermolaquagePage() {
  const service = getServiceBySlug("thermolaquage")!;

  return (
    <>
      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label="Thermolaquage"
        title={
          <>
            Thermolaquage
            <br />
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Poudre Époxy
            </span>
          </>
        }
        description="Le revêtement poudre époxy par charge électrostatique : une finition ultra-durable, sans solvant, disponible en plus de 200 teintes RAL et effets spéciaux. Le standard industriel pour une protection à vie."
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Thermolaquage" },
        ]}
      />

      {/* ── Section 2 — What Is It ───────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Le procédé"
              labelIcon={<Flame className="h-3 w-3" />}
              title={
                <>
                  Le standard industriel de la{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    finition métal.
                  </span>
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            {/* Rich text explanation */}
            <ScrollReveal delay={0.1}>
              <div className="space-y-6 text-brand-charcoal/80 leading-relaxed">
                <p>
                  Le thermolaquage, aussi appelé peinture poudre ou powder
                  coating, est un procédé de revêtement de surface qui repose
                  sur l&apos;application électrostatique d&apos;une poudre
                  thermodurcissable sur un support métallique. La poudre, chargée
                  négativement par un pistolet corona, est attirée par la pièce
                  mise à la terre et se dépose uniformément sur l&apos;ensemble
                  de la surface, y compris dans les recoins difficiles
                  d&apos;accès.
                </p>
                <p>
                  La pièce revêtue est ensuite placée dans un four de
                  polymérisation à 200 °C pendant 15 minutes. Sous l&apos;effet
                  de la chaleur, les particules de poudre fondent, se lient
                  chimiquement entre elles et au substrat, puis forment un film
                  continu d&apos;une épaisseur de 60 à 80 µm. Ce processus de
                  réticulation confère au revêtement ses propriétés mécaniques
                  exceptionnelles : résistance aux chocs supérieure à 50 kg/cm,
                  adhérence de classe 0 au test de quadrillage, et excellente
                  tenue aux UV.
                </p>
                <p>
                  Le résultat est une finition parfaitement uniforme, sans
                  coulure ni différence d&apos;épaisseur, offrant une durabilité
                  de 10 ans et plus en extérieur. Contrairement à la peinture
                  liquide, le thermolaquage n&apos;émet aucun composé organique
                  volatil (0 % COV), et les surplus de poudre sont intégralement
                  recyclés dans le circuit d&apos;application.
                </p>
              </div>
            </ScrollReveal>

            {/* Visual placeholder */}
            <ScrollReveal delay={0.2}>
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-brand-night/5">
                <div className="text-center">
                  <Flame className="mx-auto h-12 w-12 text-brand-orange/40" />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-charcoal/40">
                    Cabine de thermolaquage
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 3 — 6-Step Process ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Notre procédé"
              labelIcon={<Zap className="h-3 w-3" />}
              title={
                <>
                  6 étapes,{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    0 compromis.
                  </span>
                </>
              }
              description="Chaque pièce confiée à AZ Époxy suit un protocole de traitement industriel en 6 étapes, du contrôle de réception à l'expédition finale."
            />
          </ScrollReveal>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <ScrollReveal key={step.step} delay={index * 0.1}>
                <ProcessStep
                  step={step.step}
                  title={step.title}
                  description={step.description}
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
              description="Les paramètres clés de notre procédé de thermolaquage, conformes aux normes ISO 12944 et QUALICOAT."
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

      {/* ── Section 5 — Advantages ───────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Avantages"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={
                <>
                  Pourquoi le{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    thermolaquage ?
                  </span>
                </>
              }
              description="Un procédé qui combine durabilité, esthétique et respect de l'environnement."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.08}>
                <FeatureCard
                  icon={FEATURE_ICONS[index] ?? <Sparkles className="h-6 w-6" />}
                  title={feature.title}
                  description={feature.description}
                />
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
              description="Tout ce que vous devez savoir sur le thermolaquage poudre époxy."
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
        title="Prêt à thermolaquer vos pièces ?"
        description="Envoyez-nous vos photos et dimensions pour recevoir un devis gratuit sous 24h. Plus de 200 couleurs RAL disponibles."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
