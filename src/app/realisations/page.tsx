import { MessageSquareQuote, Star } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
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
      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label="Portfolio"
        title={
          <>
            Nos
            <br />
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Réalisations
            </span>
          </>
        }
        description="Thermolaquage, sablage, métallisation — découvrez nos projets récents. Jantes, moto, pièces auto, portails, mobilier et structures métalliques, chaque réalisation témoigne de notre exigence qualité."
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Réalisations" },
        ]}
      />

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
