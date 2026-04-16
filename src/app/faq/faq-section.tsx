"use client";

import { useState } from "react";
import { FAQ_CATEGORIES, type FAQ } from "@/lib/faq-data";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  items: FAQ[];
}

export function FaqSection({ items }: FaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFaqs =
    activeCategory === "all"
      ? items
      : items.filter((faq) => faq.category === activeCategory);

  return (
    <section className="bg-brand-cream bg-industrial-grid py-24">
      <div className="container-wide">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="heading-display text-3xl md:text-4xl text-brand-night mb-4">
              Trouvez votre réponse
            </h2>
            <p className="text-brand-charcoal/70 text-lg">
              Parcourez nos questions par catégorie ou explorez l&apos;ensemble
              de notre FAQ.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
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
        <ScrollReveal delay={0.2}>
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={filteredFaqs} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
