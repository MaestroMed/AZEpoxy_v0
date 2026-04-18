import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Check,
  Flame,
  Layers,
  Settings,
  Sparkles,
} from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { ProcessStep } from "@/components/ui/process-step";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { MouseTilt } from "@/components/nuee/mouse-tilt";
import { getServices } from "@/lib/services-data";
import { PROCESS_STEPS } from "@/lib/process-data";

export const metadata = buildMetadata({
  title: "Nos Services",
  description:
    "Thermolaquage poudre époxy, sablage, grenaillage, métallisation et finitions spéciales. Découvrez l'ensemble de nos prestations industrielles depuis notre atelier de 1 800 m² à Bruyères-sur-Oise.",
  path: "/services",
});

/* Visual accents per service card for the alternating color blocks */
const SERVICE_ACCENTS = [
  "bg-brand-night",
  "bg-brand-orange/10",
  "bg-gradient-to-br from-slate-600 to-slate-800",
  "bg-gradient-to-br from-amber-500 via-rose-500 to-purple-900",
] as const;

const SERVICE_ICONS = [
  <Flame key="flame" className="h-8 w-8 text-brand-orange" />,
  <Sparkles key="sparkles" className="h-8 w-8 text-brand-orange" />,
  <Layers key="layers" className="h-8 w-8 text-brand-orange" />,
  <Settings key="settings" className="h-8 w-8 text-brand-orange" />,
];

const SERVICE_LABELS = [
  "Cabine de thermolaquage",
  "Cabine de sablage",
  "Pistolet de métallisation",
  "Finitions & effets spéciaux",
];

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label="Services"
        title={
          <>
            Nos{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Services
            </span>
          </>
        }
        description="De la préparation de surface à la finition finale, AZ Époxy maîtrise l'ensemble de la chaîne du revêtement industriel. Thermolaquage, sablage, métallisation, finitions spéciales — chaque prestation suit un protocole rigoureux pour une qualité irréprochable."
        variant="transparent"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Services" },
        ]}
      />

      {/* ── Section 2 — Services Grid ────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Nos prestations"
              labelIcon={<Flame className="h-3 w-3" />}
              title={
                <>
                  4 métiers.{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    1 exigence.
                  </span>
                </>
              }
              description="Chaque service est exécuté dans notre atelier de 1 800 m², avec des équipements professionnels et un contrôle qualité systématique."
            />
          </ScrollReveal>

          <div className="mt-16 space-y-12">
            {services.map((service, index) => {
              const isOdd = index % 2 === 0;
              return (
                <ScrollReveal key={service.slug} delay={0.08} variant="rise">
                  <MouseTilt intensity={4} hoverScale={1.008}>
                    <div
                      className={`grid overflow-hidden rounded-2xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.25)] lg:grid-cols-2 ${
                        isOdd ? "" : "direction-rtl"
                      }`}
                    >
                      {/* Visual block */}
                      <div
                        className={`group/visual relative flex min-h-[300px] items-center justify-center overflow-hidden p-10 ${
                          SERVICE_ACCENTS[index] ?? "bg-brand-night"
                        } ${isOdd ? "lg:order-1" : "lg:order-2"}`}
                      >
                        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
                        {/* Sheen on hover */}
                        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-white/12 to-transparent transition-transform duration-700 group-hover/visual:translate-x-full" />
                        <div className="relative text-center">
                          <div className="transition-transform duration-500 group-hover/visual:scale-110">
                            {SERVICE_ICONS[index]}
                          </div>
                          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                            {SERVICE_LABELS[index]}
                          </p>
                        </div>
                      </div>

                      {/* Content block */}
                      <div
                        className={`flex flex-col justify-center bg-white p-10 lg:p-14 ${
                          isOdd ? "lg:order-2" : "lg:order-1"
                        }`}
                      >
                        <h3 className="heading-display text-2xl text-brand-night sm:text-3xl">
                          {service.shortTitle}
                        </h3>
                        <p className="mt-4 text-brand-charcoal/70 leading-relaxed">
                          {service.description.slice(0, 200)}…
                        </p>

                        {/* Feature bullets */}
                        <ul className="mt-6 space-y-3">
                          {service.features.slice(0, 3).map((feature) => (
                            <li
                              key={feature.title}
                              className="flex items-start gap-3 text-sm text-brand-charcoal/80"
                            >
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                              <span>{feature.title}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-8">
                          <Link
                            href={`/services/${service.slug}`}
                            className="group/cta inline-flex items-center gap-2 rounded-full border border-brand-night/15 bg-white px-6 py-3 text-sm font-semibold text-brand-night transition-all hover:border-brand-night hover:bg-brand-night hover:text-white"
                          >
                            Découvrir
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </MouseTilt>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 3 — Process Timeline ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Notre procédé"
              labelIcon={<Settings className="h-3 w-3" />}
              title={
                <>
                  6 étapes.{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    Zéro compromis.
                  </span>
                </>
              }
              description="Du contrôle de réception à l'expédition finale, chaque pièce suit un protocole industriel précis pour garantir une finition irréprochable."
            />
          </ScrollReveal>

          <div className="mx-auto mt-16 grid max-w-5xl gap-10 md:grid-cols-2 lg:grid-cols-3">
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

      {/* ── Section 4 — Stats Band ───────────────────────────────────── */}
      <section className="bg-brand-cream py-16">
        <div className="container-wide">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { value: "1 800 m²", label: "Atelier" },
                { value: "200+", label: "Couleurs RAL" },
                { value: "10+", label: "Années de durabilité" },
                { value: "48h", label: "Service express" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="heading-display text-4xl text-brand-night sm:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-charcoal/50">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 5 — CTA ──────────────────────────────────────────── */}
      <CtaBand
        title="Un projet ? Devis gratuit sous 24h."
        description="Jantes, moto, portails, mobilier, pièces industrielles — envoyez vos photos, on vous rappelle avec un chiffrage."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
