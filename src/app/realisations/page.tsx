import { ChevronRight, MessageSquareQuote, Sparkles, Star } from "lucide-react";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { SectionHeader } from "@/components/ui/section-header";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { ReviewsCarousel } from "@/components/ui/reviews-carousel";
import { getTestimonials } from "@/lib/testimonials-data";
import { getProjects } from "@/lib/realisations-data";
import { averageRating, getReviews } from "@/lib/reviews-data";
import { PortfolioSection } from "./portfolio-section";

export const metadata = buildMetadata({
  title: "Nos Réalisations",
  description:
    "Découvrez nos projets de thermolaquage, sablage et métallisation. Jantes, moto, mobilier, portails et pièces industrielles.",
  path: "/realisations",
});

export default async function RealisationsPage() {
  const [projects, testimonials, reviews] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getReviews(),
  ]);
  const reviewsAvg = averageRating(reviews);

  return (
    <>
      <JsonLd
        id="ld-breadcrumb-realisations"
        data={breadcrumbLd([{ label: "Réalisations" }])}
      />

      {/* ── Section 1 — Hero (transparent, swarm galactique perce) ─── */}
      <section className="relative min-h-[68vh] overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-night via-brand-night/60 to-brand-night/15 hidden md:block"
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-night/55 md:hidden" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-night/85 via-transparent to-transparent"
          aria-hidden
        />

        <div className="container-wide relative flex min-h-[68vh] flex-col justify-center pt-40 pb-20">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
            <span aria-current="page" className="text-white/90">Réalisations</span>
          </nav>

          <div className="max-w-4xl">
            <span className="section-label-light">
              <Sparkles className="h-3 w-3" />
              Portfolio
            </span>
            <h1 className="heading-display mt-6 text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-[clamp(4rem,8vw,7rem)]">
              Chaque pièce,{" "}
              <span className="block bg-gradient-ember bg-clip-text text-transparent">
                une histoire.
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-balance text-lg text-white/75 sm:text-xl">
              Jantes, moto, pièces auto, portails, mobilier et structures
              métalliques — chaque réalisation témoigne de notre exigence
              qualité et de la précision du thermolaquage 200°C.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2 — Portfolio Grid with Filters ──────────────────── */}
      <PortfolioSection projects={projects} />

      {/* ── Section 2b — Google Reviews ──────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-wide">
            <ScrollReveal>
              <SectionHeader
                centered
                label="Avis Google"
                labelIcon={<Star className="h-3 w-3" />}
                title={
                  <>
                    Ce qu&apos;en disent{" "}
                    <span className="bg-gradient-ember bg-clip-text text-transparent">
                      nos clients
                    </span>
                  </>
                }
                description="Avis synchronisés automatiquement depuis notre fiche Google Business."
              />
            </ScrollReveal>
            <div className="mx-auto mt-14 max-w-6xl">
              <ReviewsCarousel reviews={reviews} average={reviewsAvg} />
            </div>
          </div>
        </section>
      )}

      {/* ── Section 3 — Testimonials ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Témoignages"
              labelIcon={<MessageSquareQuote className="h-3 w-3" />}
              title={
                <>
                  Ce que disent{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    nos clients
                  </span>
                </>
              }
              description="La satisfaction de nos clients est notre meilleure carte de visite. Découvrez leurs retours d'expérience."
            />
          </ScrollReveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, i) => (
              <ScrollReveal key={testimonial.name} delay={i * 0.1}>
                <TestimonialCard
                  name={testimonial.name}
                  company={testimonial.company}
                  quote={testimonial.quote}
                  rating={testimonial.rating}
                  dark
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — CTA Band ─────────────────────────────────────── */}
      <CtaBand
        title="Un projet ? Devis gratuit sous 24h."
        description="Jantes, moto, portails, mobilier, pièces industrielles — envoyez vos photos, on vous rappelle avec un chiffrage."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
