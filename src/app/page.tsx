import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Flame,
  Palette,
  Sparkles,
  ShieldCheck,
  Wrench,
  Target,
  Award,
  Users,
} from "lucide-react";
import { POPULAR_RAL } from "@/lib/ral-colors";
import { getServices } from "@/lib/services-data";
import { PROCESS_STEPS } from "@/lib/process-data";
import { getSpecialties } from "@/lib/specialites-data";
import { getTestimonials } from "@/lib/testimonials-data";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StatCounter } from "@/components/ui/stat-counter";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { ProcessStep } from "@/components/ui/process-step";
import { CtaBand } from "@/components/ui/cta-band";
import { HomepageSwarmTimeline } from "@/components/nuee/homepage-swarm-timeline";
import { RalRecommender } from "@/components/ui/ral-recommender";
import { ReviewsCarousel } from "@/components/ui/reviews-carousel";
import { SectionHeader } from "@/components/ui/section-header";
import { averageRating, getReviews } from "@/lib/reviews-data";

export const metadata = buildMetadata({
  title:
    "AZ Époxy — Thermolaquage Poudre Époxy Professionnel | 200+ Couleurs RAL",
  description:
    "Thermolaquage poudre époxy professionnel à Bruyères-sur-Oise (95). 200+ couleurs RAL, cabine 7m, service express 48h, 0 COV. Devis gratuit sous 24h.",
  path: "/",
});

/** Icon map for service cards */
const SERVICE_ICONS: Record<string, typeof Flame> = {
  thermolaquage: Flame,
  sablage: Wrench,
  metallisation: ShieldCheck,
  finitions: Palette,
};

/** Background colours for specialty cards */
const SPECIALTY_BG: string[] = [
  "bg-brand-night",
  "bg-brand-charcoal",
  "bg-brand-orange/10",
  "bg-[#12121F]",
];

export default async function HomePage() {
  const [reviews, services, specialties, testimonials] = await Promise.all([
    getReviews(),
    getServices(),
    getSpecialties(),
    getTestimonials(),
  ]);
  const reviewsAvg = averageRating(reviews);
  return (
    <>
      {/* ExitIntentModal désactivé pour l'instant — popup trop intrusif
          pendant la phase de design. À réactiver au lancement. */}
      {/* <ExitIntentModal /> */}
      {/* Narrative swarm timeline — drives the persistent particle canvas
          through phases as the user scrolls this page. */}
      <HomepageSwarmTimeline />

      {/* ── Section 1 — Hero (AZ + ÉPOXY via narrative swarm, dynamic RAL) ─ */}
      <section className="relative h-[100svh] overflow-hidden text-white">
        {/* Text-readability overlays — responsive :
            • Desktop / landscape : left-biased (swarm shines on the right)
            • Mobile / portrait : uniform dimming + bottom fade (text
              wraps across the full width, and the swarm lives behind
              the whole content) */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-night via-brand-night/70 to-transparent hidden md:block" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-night/80 via-transparent to-transparent hidden md:block" aria-hidden />
        {/* Mobile / portrait overlay */}
        <div className="absolute inset-0 bg-brand-night/65 md:hidden" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-night/90 via-brand-night/30 to-transparent md:hidden" aria-hidden />

        {/* Layer 1: HTML content (above canvas) */}
        <div className="container-wide relative z-10 flex h-[100svh] flex-col justify-center pt-32 pb-20 pointer-events-none">
          <ScrollReveal>
            <div className="max-w-4xl">
              <span className="section-label-light">
                <Flame className="h-3 w-3" />
                Thermolaquage poudre époxy · Île-de-France
              </span>

              <h1 className="heading-display mt-6 text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-[clamp(3.5rem,7vw,7rem)]">
                200°C.
                <br />
                <span className="bg-gradient-ember bg-clip-text text-transparent">
                  15 minutes.
                </span>
                <br />
                Une protection à vie.
              </h1>

              <p className="mt-8 max-w-2xl text-balance text-lg text-white/70 sm:text-xl">
                Finition premium par thermolaquage poudre époxy. 200+ couleurs
                RAL, cabine 7 mètres, service express 48h, 0 COV. Depuis notre
                atelier de 1 800 m² à Bruyères-sur-Oise.
              </p>

              <div className="mt-10 flex flex-wrap gap-4 pointer-events-auto">
                <Link href="/devis" className="btn-primary">
                  Demander un devis gratuit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/couleurs-ral" className="btn-ghost-light">
                  Voir nos 200+ couleurs
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Hero quick stats — animated counters */}
          <ScrollReveal delay={0.3}>
            <div className="relative mt-auto grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
              <StatCounter value="200+" label="Couleurs RAL" dark />
              <StatCounter value="7" label="Mètres — cabine max" dark />
              <StatCounter value="48" label="Heures — express" dark />
              <StatCounter value="0" label="COV — sans solvant" dark />
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll hint — subtle nudge at the bottom of the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50"
          style={{ animation: "scroll-nudge 2.4s ease-in-out infinite" }}
        >
          <span>Scroll</span>
          <span className="h-6 w-px bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </section>

      {/* ── Section 2 — Services Preview (cream bg) ────────────────────── */}
      <section className="relative overflow-hidden bg-brand-cream py-24">
        <div className="absolute inset-0 bg-industrial-grid opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="mb-14 max-w-2xl">
              <span className="section-label">
                <Target className="h-3 w-3" />
                Services
              </span>
              <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                4 expertises.
                <br />
                <span className="bg-gradient-ember bg-clip-text text-transparent">
                  Un seul atelier.
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service, i) => {
              const Icon = SERVICE_ICONS[service.slug] ?? Flame;
              return (
                <ScrollReveal key={service.slug} delay={0.1 * i}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block rounded-2xl border border-brand-night/10 bg-white p-8 transition-all hover:shadow-lg"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="heading-display text-xl text-brand-night">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/70">
                      {service.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange transition-colors group-hover:text-brand-night">
                      En savoir plus
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 3 — RAL Marquee + Collections (night bg) ───────────── */}
      <section className="relative overflow-hidden bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="section-label">
                  <Palette className="h-3 w-3" />
                  Nuancier RAL
                </span>
                <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                  Plus de 200 teintes.
                  <br />
                  Et 4 collections signature.
                </h2>
                <p className="mt-4 max-w-xl text-brand-charcoal/70">
                  Nuancier RAL Classic complet, plus les collections premium
                  Adaptacolor : Patina (effets corten), Polaris (métalliques),
                  Dichroic (reflets irisés) et Sfera (anodisés cosmos).
                </p>
              </div>
              <Link
                href="/couleurs-ral"
                className="inline-flex items-center gap-2 rounded-full border border-brand-night/15 bg-white px-6 py-3 text-sm font-semibold text-brand-night transition-all hover:border-brand-night hover:bg-brand-night hover:text-white"
              >
                Explorer le nuancier
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Marquee */}
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-marquee gap-3">
              {[...POPULAR_RAL, ...POPULAR_RAL, ...POPULAR_RAL].map(
                (color, i) => (
                  <div
                    key={`${color.code}-${i}`}
                    className="group relative flex h-32 w-56 flex-shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-5 shadow-lg transition-transform hover:-translate-y-1"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent"
                      aria-hidden
                    />
                    <div className="relative">
                      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-white/90">
                        {color.code}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {color.name}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Collections cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                slug: "patina",
                label: "Patina",
                tagline: "Effets corten & oxyde",
                gradient: "from-amber-800 via-orange-700 to-red-900",
              },
              {
                slug: "polaris",
                label: "Polaris",
                tagline: "Métalliques structurés",
                gradient: "from-slate-500 via-zinc-400 to-slate-700",
              },
              {
                slug: "dichroic",
                label: "Dichroic",
                tagline: "Reflets irisés",
                gradient: "from-fuchsia-500 via-cyan-400 to-indigo-600",
              },
              {
                slug: "sfera",
                label: "Sfera",
                tagline: "Cosmos anodisé",
                gradient: "from-amber-500 via-rose-500 to-purple-900",
              },
            ].map((c) => (
              <ScrollReveal key={c.slug} delay={0.05}>
                <Link
                  href={`/couleurs-ral/${c.slug}`}
                  className="group relative block h-48 overflow-hidden rounded-2xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}
                  />
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      Collection
                    </p>
                    <p className="heading-display text-3xl">{c.label}</p>
                    <p className="mt-1 text-sm text-white/80">{c.tagline}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Process 6 Steps (night bg) ─────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="section-label-light">
                <Wrench className="h-3 w-3" />
                Notre procédé
              </span>
              <h2 className="heading-display mx-auto mt-4 max-w-2xl text-4xl text-white sm:text-5xl">
                6 étapes.
                <br />
                <span className="bg-gradient-ember bg-clip-text text-transparent">
                  Zéro compromis.
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((ps, i) => (
              <ScrollReveal key={ps.step} delay={0.1 * i}>
                {/* Dark-mode override wrapper for ProcessStep */}
                <div className="[&_h3]:text-white [&_p]:text-white/60 [&_span]:text-brand-orange/30">
                  <ProcessStep
                    step={ps.step}
                    title={ps.title}
                    description={ps.description}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 — Specialties Showcase (cream bg) ────────────────── */}
      <section className="relative overflow-hidden bg-brand-cream py-24">
        <div className="absolute inset-0 bg-industrial-grid opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="mb-14 max-w-2xl">
              <span className="section-label">
                <Award className="h-3 w-3" />
                Spécialités
              </span>
              <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                Chaque pièce
                <br />
                <span className="bg-gradient-ember bg-clip-text text-transparent">
                  mérite l&apos;excellence.
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.map((spec, i) => (
              <ScrollReveal key={spec.slug} delay={0.1 * i}>
                <Link
                  href={`/specialites/${spec.slug}`}
                  className="group relative block h-56 overflow-hidden rounded-2xl"
                >
                  {/* Card background */}
                  <div
                    className={`absolute inset-0 ${SPECIALTY_BG[i % SPECIALTY_BG.length]} transition-transform duration-500 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="relative flex h-full flex-col justify-end p-6 text-white">
                    <h3 className="heading-display text-2xl">{spec.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{spec.tagline}</p>
                    <span className="mt-3 inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                      À partir de {spec.priceFrom}
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6 — Feature Band (night bg) ────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                icon: Flame,
                title: "Procédé 6 étapes",
                desc: "Dégraissage, primaire 80µ, cuisson 180°C, finition polyester 60µ, cuisson 200°C, contrôle qualité. Protocole industriel pro.",
              },
              {
                icon: ShieldCheck,
                title: "Durabilité 10+ ans",
                desc: "Résistance UV, résistance chocs, résistance à la corrosion. Procédé sans solvant, 0 COV. Garantie possible 10 ans.",
              },
              {
                icon: Sparkles,
                title: "Finitions signature",
                desc: "Au-delà du RAL Classic : collections Patina, Polaris, Dichroic, Sfera du partenaire Adaptacolor.",
              },
            ].map((f, i) => (
              <ScrollReveal key={f.title} delay={0.15 * i}>
                <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-brand-orange/40 hover:bg-white/[0.04]">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="heading-display text-xl text-white">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {f.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7 — Stats Band (cream bg) ──────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-cream py-24">
        <div className="absolute inset-0 bg-industrial-grid opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="section-label">
                <Users className="h-3 w-3" />
                En chiffres
              </span>
              <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                Notre atelier,
                <br />
                <span className="bg-gradient-ember bg-clip-text text-transparent">
                  en quelques chiffres.
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              <StatCounter value="1800" label="m² d'atelier" />
              <StatCounter value="200+" label="couleurs RAL" />
              <StatCounter value="15+" label="années d'expérience" />
              <StatCounter value="2000+" label="projets réalisés" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 7.5 — RAL recommender (cream bg) ────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <RalRecommender />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 8 — Reviews + Testimonials (night bg) ───────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="mb-14 text-center">
              <span className="section-label-light">
                <Users className="h-3 w-3" />
                Témoignages
              </span>
              <h2 className="heading-display mx-auto mt-4 max-w-2xl text-4xl text-white sm:text-5xl">
                Ils nous font
                <br />
                confiance.
              </h2>
            </div>
          </ScrollReveal>

          {reviews.length > 0 && (
            <ScrollReveal>
              <div className="mb-12 rounded-3xl bg-white p-6 text-brand-night sm:p-8">
                <SectionHeader
                  label="Avis Google"
                  title="Ce qu'en disent nos clients"
                  description="Avis synchronisés automatiquement depuis notre fiche Google."
                />
                <div className="mt-8">
                  <ReviewsCarousel reviews={reviews} average={reviewsAvg} />
                </div>
              </div>
            </ScrollReveal>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <ScrollReveal key={t.name} delay={0.15 * i}>
                <TestimonialCard
                  name={t.name}
                  company={t.company}
                  quote={t.quote}
                  rating={t.rating}
                  dark
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9 — Final CTA ──────────────────────────────────────── */}
      <ScrollReveal>
        <CtaBand
          title="Un projet ? Devis gratuit sous 24h."
          description="Jantes, moto, portails, mobilier, pièces industrielles — envoyez vos photos, on vous rappelle avec un chiffrage."
        />
      </ScrollReveal>
    </>
  );
}
