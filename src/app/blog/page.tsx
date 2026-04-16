import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BLOG_ARTICLES } from "@/lib/blog-data";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "Blog — Articles techniques sur le thermolaquage",
  description:
    "Guides, tutoriels et conseils d'experts sur le thermolaquage, le sablage, la métallisation et la protection anticorrosion.",
  path: "/blog",
});

export default function BlogPage() {
  const sorted = [...BLOG_ARTICLES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <PageHero
        label="Blog"
        title={
          <>
            Nos articles{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              techniques
            </span>
          </>
        }
        description="Guides, tutoriels et conseils d'experts pour comprendre nos métiers et faire les bons choix."
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Blog" },
        ]}
      />

      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Articles"
              title={
                <>
                  Ressources &{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    expertise
                  </span>
                </>
              }
              description="Découvrez nos articles rédigés par nos techniciens pour vous aider dans vos projets."
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((article, i) => (
              <ScrollReveal key={article.slug} delay={i * 0.05}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-night/10 bg-white transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-3 inline-block w-fit rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange">
                      {article.category}
                    </span>
                    <h2 className="mb-2 text-lg font-bold text-brand-night leading-snug group-hover:text-brand-orange transition-colors">
                      {article.title}
                    </h2>
                    <p className="mb-4 flex-1 text-sm text-brand-charcoal/60 leading-relaxed">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-brand-charcoal/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(article.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-brand-night/5 px-6 py-3 flex items-center gap-2 text-sm font-semibold text-brand-orange">
                    Lire l&apos;article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Un projet en tête ?"
        description="Contactez-nous pour un devis gratuit sous 24h."
        primaryHref="/devis"
        primaryLabel="Demander un devis"
      />
    </>
  );
}
