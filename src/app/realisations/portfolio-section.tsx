"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PROJECTS, PROJECT_CATEGORIES, type ProjectCategoryKey } from "@/lib/realisations-data";
import { trackEvent } from "@/components/analytics/ga4";
import { RAL_COLORS } from "@/lib/ral-colors";

/** Resolve a RAL code to its hex color */
function ralToHex(code: string): string | undefined {
  return RAL_COLORS.find((c) => c.code === code)?.hex;
}

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategoryKey>("all");

  const handleCategoryChange = (category: ProjectCategoryKey) => {
    setActiveCategory(category);
    trackEvent("realisation_filter", { category });
  };

  const filtered =
    activeCategory === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section className="bg-brand-cream py-24">
      <div className="container-wide">
        {/* ── Filter bar ──────────────────────────────────────────────── */}
        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {PROJECT_CATEGORIES.map((cat) => {
            const key = cat.key as ProjectCategoryKey;
            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={cn(
                  "flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
                  activeCategory === key
                    ? "bg-brand-orange text-white shadow-md"
                    : "border border-brand-night/15 bg-white text-brand-night hover:bg-brand-cream"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Project grid ────────────────────────────────────────────── */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const primaryHex =
                (project.colors[0] && ralToHex(project.colors[0])) ??
                "#3D3D3D";

              // Find category label
              const categoryLabel =
                PROJECT_CATEGORIES.find((c) => c.key === project.category)
                  ?.label ?? project.category;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                  style={{ backgroundColor: primaryHex }}
                >
                  {/* Noise texture */}
                  <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/80 group-hover:via-black/30" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    {/* Category badge */}
                    <span className="mb-2 inline-flex w-fit rounded-full bg-brand-orange/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                      {categoryLabel}
                    </span>

                    {/* Title */}
                    <h3 className="font-semibold text-white leading-snug">
                      {project.title}
                    </h3>

                    {/* Colors used */}
                    {project.colors.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        {project.colors.map((code) => {
                          const hex = ralToHex(code);
                          return (
                            <div
                              key={code}
                              className="flex items-center gap-1.5"
                            >
                              <div
                                className="h-3 w-3 rounded-full border border-white/30"
                                style={{
                                  backgroundColor: hex ?? "#888",
                                }}
                              />
                              <span className="font-mono text-[10px] text-white/70">
                                {code}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-brand-charcoal/50">
              Aucune réalisation dans cette catégorie pour le moment.
            </p>
          </div>
        )}

        {/* ── Result count ────────────────────────────────────────────── */}
        <p className="mt-8 text-center text-sm text-brand-charcoal/50">
          {filtered.length} réalisation{filtered.length !== 1 ? "s" : ""}{" "}
          {activeCategory !== "all" ? "dans cette catégorie" : "au total"}
        </p>
      </div>
    </section>
  );
}
