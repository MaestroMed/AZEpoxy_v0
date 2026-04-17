"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategoryKey,
} from "@/lib/realisations-data";
import { track } from "@/lib/analytics/events";
import { RAL_COLORS } from "@/lib/ral-colors";
import { MouseTilt } from "@/components/nuee/mouse-tilt";

/** Resolve a RAL code to its hex color */
function ralToHex(code: string): string | undefined {
  return RAL_COLORS.find((c) => c.code === code)?.hex;
}

interface PortfolioSectionProps {
  projects: Project[];
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategoryKey>("all");

  const handleCategoryChange = (category: ProjectCategoryKey) => {
    setActiveCategory(category);
    track("realisation_filter", { category });
  };

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

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
        <m.div
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
                <m.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <MouseTilt className="h-full" intensity={8} hoverScale={1.015}>
                    <div
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_20px_50px_-20px_rgba(0,0,0,0.45)]"
                      style={{ backgroundColor: primaryHex }}
                    >
                      {/* Noise texture */}
                      <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />

                      {/* Gradient overlay — subtle deepen on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

                      {/* Sheen — diagonal light beam sweep on hover */}
                      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        {/* Category badge */}
                        <span className="mb-2 inline-flex w-fit rounded-full bg-brand-orange/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
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
                    </div>
                  </MouseTilt>
                </m.div>
              );
            })}
          </AnimatePresence>
        </m.div>

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
