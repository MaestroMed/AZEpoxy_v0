import Link from "next/link";
import { ArrowRight, BookOpen, Hash } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
} from "@/lib/glossaire-data";
import { SITE } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Glossaire — Lexique du Thermolaquage",
  description:
    "30 termes techniques expliqués : thermolaquage, polymérisation, RAL, Qualicoat, C5, métallisation, COV. Le lexique complet pour comprendre la finition poudre époxy.",
  path: "/glossaire",
});

export default function GlossairePage() {
  const byCategory: Record<GlossaryCategory, typeof GLOSSARY> =
    GLOSSARY_CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat.key] = GLOSSARY.filter((t) => t.category === cat.key).sort(
          (a, b) => a.term.localeCompare(b.term, "fr"),
        );
        return acc;
      },
      {} as Record<GlossaryCategory, typeof GLOSSARY>,
    );

  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glossaire AZ Époxy — Lexique du thermolaquage",
    url: `${SITE.url}/glossaire`,
    hasDefinedTerm: GLOSSARY.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      url: `${SITE.url}/glossaire#${t.slug}`,
      inDefinedTermSet: `${SITE.url}/glossaire`,
    })),
  };

  return (
    <>
      <JsonLd id="ld-glossary" data={definedTermSet} />

      <PageHero
        label="Glossaire"
        title={
          <>
            Le lexique du{" "}
            <span className="block bg-gradient-ember bg-clip-text text-transparent">
              thermolaquage
            </span>
          </>
        }
        description="30 termes techniques expliqués en clair — des procédés industriels aux normes anti-corrosion. Un repère utile avant de demander un devis."
        variant="transparent"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Glossaire" },
        ]}
      />

      {/* ── Category nav ──────────────────────────────── */}
      <section className="sticky top-20 z-30 border-b border-brand-night/10 bg-brand-cream/90 py-4 backdrop-blur-md md:top-29">
        <div className="container-wide">
          <nav
            aria-label="Catégories du glossaire"
            className="flex flex-wrap items-center gap-2"
          >
            <span className="mr-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal/60">
              Sauter à
            </span>
            {GLOSSARY_CATEGORIES.map((cat) => (
              <a
                key={cat.key}
                href={`#cat-${cat.key}`}
                className="rounded-full border border-brand-night/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-night transition-all hover:border-brand-orange hover:bg-brand-orange hover:text-white"
              >
                {cat.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── Intro ─────────────────────────────────────── */}
      <section className="bg-brand-cream bg-industrial-grid py-16">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-brand-charcoal/80 leading-relaxed">
            <div className="flex items-center gap-3 text-brand-orange">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Lexique technique
              </span>
            </div>
            <p className="mt-4 text-lg">
              Le thermolaquage est un procédé industriel exigeant, au
              vocabulaire précis. Ce glossaire regroupe les notions
              clés&nbsp;— procédés, poudres, normes, finitions&nbsp;— pour vous
              aider à dialoguer avec votre bureau d&apos;études, à rédiger un
              cahier des charges ou simplement à comprendre un devis.
            </p>
          </div>
        </div>
      </section>

      {/* ── Terms by category ─────────────────────────── */}
      <section className="bg-brand-cream pb-24">
        <div className="container-wide">
          <div className="mx-auto max-w-4xl space-y-20">
            {GLOSSARY_CATEGORIES.map((cat, catIndex) => {
              const terms = byCategory[cat.key];
              if (terms.length === 0) return null;
              return (
                <div
                  key={cat.key}
                  id={`cat-${cat.key}`}
                  className="scroll-mt-40"
                >
                  <ScrollReveal>
                    <div className="mb-10 border-b border-brand-night/10 pb-6">
                      <span className="section-label inline-block">
                        Catégorie {catIndex + 1}
                      </span>
                      <h2 className="heading-display mt-3 text-3xl text-brand-night sm:text-4xl">
                        {cat.label}
                      </h2>
                      <p className="mt-2 text-brand-charcoal/60">
                        {cat.description}
                      </p>
                    </div>
                  </ScrollReveal>

                  <div className="space-y-6">
                    {terms.map((term) => (
                      <ScrollReveal key={term.slug}>
                        <article
                          id={term.slug}
                          className="scroll-mt-40 rounded-2xl border border-brand-night/10 bg-white p-6 shadow-sm md:p-8"
                        >
                          <header className="flex flex-wrap items-start justify-between gap-3">
                            <h3 className="heading-display text-2xl text-brand-night">
                              {term.term}
                            </h3>
                            <a
                              href={`#${term.slug}`}
                              aria-label={`Lien permanent vers ${term.term}`}
                              className="inline-flex items-center gap-1 rounded-full border border-brand-night/10 bg-brand-cream px-3 py-1 text-xs font-mono text-brand-charcoal/60 transition-colors hover:border-brand-orange hover:text-brand-orange"
                            >
                              <Hash className="h-3 w-3" />
                              {term.slug}
                            </a>
                          </header>
                          <p className="mt-4 leading-relaxed text-brand-charcoal/80">
                            {term.definition}
                          </p>
                          {term.details && term.details.length > 0 && (
                            <ul className="mt-4 space-y-1.5 text-sm text-brand-charcoal/70">
                              {term.details.map((d) => (
                                <li key={d} className="flex gap-2">
                                  <span
                                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-orange"
                                    aria-hidden
                                  />
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {term.related && term.related.length > 0 && (
                            <div className="mt-5 flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-charcoal/50">
                                Voir aussi
                              </span>
                              {term.related.map((slug) => {
                                const ref = GLOSSARY.find(
                                  (t) => t.slug === slug,
                                );
                                if (!ref) return null;
                                return (
                                  <a
                                    key={slug}
                                    href={`#${slug}`}
                                    className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
                                  >
                                    {ref.term}
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </article>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Related resources ──────────────────────── */}
          <ScrollReveal>
            <div className="mx-auto mt-20 grid max-w-4xl gap-4 md:grid-cols-2">
              <Link
                href="/services/thermolaquage"
                className="group rounded-2xl border border-brand-night/10 bg-white p-6 transition-all hover:border-brand-orange hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-orange">
                  Pour aller plus loin
                </p>
                <p className="mt-2 heading-display text-xl text-brand-night">
                  Notre procédé thermolaquage
                </p>
                <p className="mt-1 text-sm text-brand-charcoal/70">
                  Toutes les étapes, de la préparation au contrôle final.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                  Voir la page service
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/faq"
                className="group rounded-2xl border border-brand-night/10 bg-white p-6 transition-all hover:border-brand-orange hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-orange">
                  Foire aux questions
                </p>
                <p className="mt-2 heading-display text-xl text-brand-night">
                  Les questions les plus fréquentes
                </p>
                <p className="mt-1 text-sm text-brand-charcoal/70">
                  Durée, prix, matériaux, délais — nos réponses concrètes.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                  Consulter la FAQ
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <CtaBand
        title="Un terme manque ? Une question technique ?"
        description="Notre équipe commerciale formée répond à vos interrogations sur les poudres, les finitions ou les normes de votre secteur."
        primaryHref="/contact"
        primaryLabel="Poser une question"
      />
    </>
  );
}
