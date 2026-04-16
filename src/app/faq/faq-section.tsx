"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { FAQ_CATEGORIES, type FAQ } from "@/lib/faq-data";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  items: FAQ[];
}

export function FaqSection({ items }: FaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "question", weight: 0.7 },
          { name: "answer", weight: 0.3 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 3,
      }),
    [items]
  );

  const filteredFaqs = useMemo(() => {
    const trimmed = query.trim();
    const byCategory =
      activeCategory === "all"
        ? items
        : items.filter((faq) => faq.category === activeCategory);
    if (trimmed.length < 3) return byCategory;
    const matches = fuse.search(trimmed).map((r) => r.item);
    return matches.filter((faq) =>
      activeCategory === "all" ? true : faq.category === activeCategory
    );
  }, [fuse, items, query, activeCategory]);

  return (
    <section className="bg-brand-cream bg-industrial-grid py-24">
      <div className="container-wide">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 className="heading-display text-3xl md:text-4xl text-brand-night mb-4">
              Trouvez votre réponse
            </h2>
            <p className="text-brand-charcoal/70 text-lg">
              Recherchez par mot-clé ou parcourez par catégorie.
            </p>
          </div>
        </ScrollReveal>

        {/* Search bar */}
        <ScrollReveal delay={0.05}>
          <div className="mx-auto mb-8 flex max-w-xl items-center gap-2 rounded-full border border-brand-night/10 bg-white px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-orange">
            <Search className="h-4 w-4 text-brand-charcoal/50" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une question (ex: délai, jantes, tarif)…"
              aria-label="Rechercher dans la FAQ"
              className="flex-1 bg-transparent text-sm text-brand-night placeholder:text-brand-charcoal/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche"
                className="rounded-full p-1 text-brand-charcoal/60 transition-colors hover:bg-brand-cream hover:text-brand-night"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                activeCategory === "all"
                  ? "bg-brand-night text-white shadow-lg"
                  : "bg-white text-brand-charcoal/70 border border-brand-night/10 hover:border-brand-night/30 hover:text-brand-night"
              )}
            >
              Toutes les questions
            </button>
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  activeCategory === cat.key
                    ? "bg-brand-night text-white shadow-lg"
                    : "bg-white text-brand-charcoal/70 border border-brand-night/10 hover:border-brand-night/30 hover:text-brand-night"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Accordion */}
        <ScrollReveal delay={0.15}>
          <div className="mx-auto max-w-3xl">
            {filteredFaqs.length > 0 ? (
              <FAQAccordion items={filteredFaqs} />
            ) : (
              <div className="rounded-2xl border border-brand-night/10 bg-white p-8 text-center">
                <p className="text-brand-charcoal/70">
                  Aucune question ne correspond à votre recherche. Contactez-nous
                  directement, nous répondons sous 24h.
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
