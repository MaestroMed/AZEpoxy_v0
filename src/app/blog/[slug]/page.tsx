import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { articleLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  BLOG_ARTICLES_FALLBACK,
  getBlogArticleBySlug,
  getBlogArticles,
} from "@/lib/blog-data";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return BLOG_ARTICLES_FALLBACK.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${article.slug}`,
    type: "article",
    image: article.image,
    article: {
      publishedTime: article.date,
      section: article.category,
    },
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);
  if (!article) notFound();

  const all = await getBlogArticles();
  const sorted = [...all].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const idx = sorted.findIndex((a) => a.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  return (
    <>
      <JsonLd
        id={`ld-article-${slug}`}
        data={articleLd({
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          image: article.image,
          url: `/blog/${article.slug}`,
          section: article.category,
        })}
      />

      <PageHero
        label={article.category}
        title={article.title}
        description={article.description}
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: article.title },
        ]}
      />

      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-4 text-sm text-brand-charcoal/50 mb-8">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTime} de lecture
              </span>
              <span className="rounded-full bg-brand-orange/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-orange">
                {article.category}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <article
              className="prose prose-lg max-w-none prose-headings:font-outfit prose-headings:text-brand-night prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-brand-charcoal/80 prose-p:leading-relaxed prose-li:text-brand-charcoal/80 prose-strong:text-brand-night prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </ScrollReveal>

          {/* Navigation */}
          <ScrollReveal delay={0.15}>
            <div className="mt-16 grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-brand-night/10 bg-white p-5 transition hover:shadow-md"
                >
                  <ArrowLeft className="h-5 w-5 shrink-0 text-brand-orange transition-transform group-hover:-translate-x-1" />
                  <div className="min-w-0">
                    <p className="text-xs text-brand-charcoal/40 uppercase tracking-wider">
                      Précédent
                    </p>
                    <p className="truncate font-semibold text-brand-night text-sm">
                      {prev.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group flex items-center justify-end gap-3 rounded-xl border border-brand-night/10 bg-white p-5 transition hover:shadow-md text-right"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-brand-charcoal/40 uppercase tracking-wider">
                      Suivant
                    </p>
                    <p className="truncate font-semibold text-brand-night text-sm">
                      {next.title}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-brand-orange transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au blog
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CtaBand
        title="Ce sujet vous concerne ?"
        description="Contactez-nous pour discuter de votre projet avec un expert."
        primaryHref="/devis"
        primaryLabel="Demander un devis"
      />
    </>
  );
}
