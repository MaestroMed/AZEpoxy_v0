"use client";

import { useState } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PROJECT_CATEGORIES,
  catalogNumber,
  getProjectSlug,
  type Project,
  type ProjectCategoryKey,
} from "@/lib/realisations-data";
import { track } from "@/lib/analytics/events";
import { RAL_COLORS } from "@/lib/ral-colors";

/**
 * CATALOGUE RAISONNÉ INDEX.
 *
 * Replaces the former Pinterest-style grid with a dense typographic
 * row-based index, modelled on museum / auction-house catalogue layouts.
 * Each realisation is a numbered entry (N°01 → N°16) with a tiny RAL
 * swatch strip, a pure text title, the category label, the RAL code in
 * mono, and an arrow pointing to its detail page.
 *
 * Editorial intent : treat each piece as a catalog reference, not a
 * product tile. The dense list rhythm + huge numbers echo the Patina
 * collection page the audit praised as the site's strongest moment.
 */

/* ── Helpers ──────────────────────────────────────────────────────── */
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

  // Featured piece — the first featured match in current filter, falls
  // back to the first item. Becomes the "CATALOGUE · EN COURS" spotlight.
  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = featured
    ? filtered.filter((p) => p.id !== featured.id)
    : filtered;

  return (
    <section className="relative overflow-hidden bg-brand-cream py-24">
      <div aria-hidden className="absolute inset-0 bg-industrial-grid opacity-25" />

      <div className="container-wide relative">
        {/* ── Index header ──────────────────────────────────────── */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="section-label">Catalogue raisonné</span>
            <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
              Index des pièces.
            </h2>
          </div>

          {/* Counter — museum-inventory vibe */}
          <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-charcoal/55">
            <span className="font-bold text-brand-night">
              {String(filtered.length).padStart(2, "0")}
            </span>
            <span>pièces{activeCategory !== "all" ? " · " + activeCategory : " · exposées"}</span>
          </div>
        </div>

        {/* ── Filter pills ──────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Filtrer par catégorie"
          className="mb-14 flex flex-wrap gap-2"
        >
          {PROJECT_CATEGORIES.map((cat) => {
            const key = cat.key as ProjectCategoryKey;
            const active = activeCategory === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => handleCategoryChange(key)}
                className={cn(
                  "rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300",
                  active
                    ? "bg-brand-night text-white shadow-[0_6px_20px_-8px_rgba(26,26,46,0.5)] ring-1 ring-offset-2 ring-offset-brand-cream ring-brand-orange/30"
                    : "border border-brand-night/12 bg-white/60 text-brand-charcoal/65 hover:border-brand-night/25 hover:-translate-y-0.5 hover:text-brand-night",
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── FEATURE ROW — N° en grand, pièce spotlight ───────── */}
        <AnimatePresence mode="popLayout" initial={false}>
          {featured && (
            <m.div
              key={`feature-${featured.id}`}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-14"
            >
              <FeatureRow project={featured} />
            </m.div>
          )}
        </AnimatePresence>

        {/* ── Index rows ────────────────────────────────────────── */}
        <ul className="relative border-y border-brand-night/12">
          <AnimatePresence mode="popLayout" initial={false}>
            {rest.map((p, i) => (
              <m.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: i * 0.015, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-brand-night/12 last:border-b-0"
              >
                <IndexRow project={p} />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* ── Empty state ───────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-brand-charcoal/50">
              Aucune pièce dans cette section du catalogue.
            </p>
          </div>
        )}

        {/* ── Colophon — museum-card footer ─────────────────────── */}
        <p className="mt-14 max-w-xl text-sm leading-relaxed text-brand-charcoal/55">
          Chaque pièce ci-dessus est une réalisation réelle passée par notre
          atelier de Bruyères-sur-Oise. Les numéros de catalogue sont stables —
          une pièce conserve sa référence à vie.
        </p>
      </div>
    </section>
  );
}

/* ── FEATURE ROW — large editorial block for spotlight piece ──── */
function FeatureRow({ project }: { project: Project }) {
  const num = catalogNumber(project);
  const primaryHex = project.colors[0] ? ralToHex(project.colors[0]) : undefined;
  const catLabel =
    PROJECT_CATEGORIES.find((c) => c.key === project.category)?.label ??
    project.category;

  return (
    <Link
      href={`/realisations/${getProjectSlug(project)}`}
      data-magnetic
      className="group relative block overflow-hidden rounded-2xl border border-brand-night/10 bg-white transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-night/20 hover:shadow-[0_24px_60px_-32px_rgba(26,26,46,0.35)]"
    >
      {/* Giant RAL watermark */}
      {project.colors[0] && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-4 select-none font-display text-[clamp(6rem,14vw,12rem)] font-black leading-[0.8] tracking-tighter text-brand-night/[0.04] transition-colors duration-500 group-hover:text-brand-night/[0.07]"
        >
          {project.colors[0].replace("RAL ", "")}
        </span>
      )}

      {/* Accent bar */}
      {primaryHex && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ backgroundColor: primaryHex }}
        />
      )}

      <div className="relative grid gap-8 p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-12 lg:p-12">
        {/* N° en grand */}
        <div className="flex items-baseline gap-4 lg:flex-col lg:items-start lg:gap-1">
          <span className="font-display text-[clamp(3rem,8vw,5rem)] font-black leading-[0.85] tracking-tighter text-brand-night">
            N°{num}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-orange">
            En vedette
          </span>
        </div>

        {/* Middle — title + description */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-charcoal/55">
              <span aria-hidden className="h-1 w-1 rounded-full bg-brand-orange" />
              {catLabel}
            </span>
            {project.colors.length > 0 && (
              <span className="font-mono text-[11px] text-brand-charcoal/45">
                {project.colors.join(" · ")}
              </span>
            )}
          </div>
          <h3 className="mt-3 font-display text-2xl font-black leading-tight text-brand-night sm:text-3xl lg:text-4xl">
            {project.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-charcoal/70 sm:text-base">
            {project.description}
          </p>
        </div>

        {/* Right — swatch + arrow */}
        <div className="flex items-center gap-4">
          {primaryHex && (
            <span
              aria-hidden
              className="h-16 w-16 shrink-0 rounded-sm ring-1 ring-brand-night/10 transition-transform duration-500 group-hover:scale-110 sm:h-20 sm:w-20"
              style={{ backgroundColor: primaryHex }}
            />
          )}
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-night text-white transition-all duration-300 group-hover:bg-brand-orange group-hover:shadow-[0_10px_24px_-8px_rgba(232,93,44,0.55)]">
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── INDEX ROW — dense typographic row ─────────────────────────── */
function IndexRow({ project }: { project: Project }) {
  const num = catalogNumber(project);
  const primaryHex = project.colors[0] ? ralToHex(project.colors[0]) : undefined;
  const catLabel =
    PROJECT_CATEGORIES.find((c) => c.key === project.category)?.label ??
    project.category;

  return (
    <Link
      href={`/realisations/${getProjectSlug(project)}`}
      data-magnetic
      className="group relative flex items-center gap-4 py-6 transition-colors duration-300 hover:bg-white/50 sm:gap-6 sm:py-7"
    >
      {/* Hover accent line */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[70%] w-[3px] -translate-y-1/2 origin-bottom scale-y-0 bg-brand-orange transition-transform duration-500 group-hover:scale-y-100"
      />

      {/* Number */}
      <span className="w-12 shrink-0 font-mono text-sm font-bold uppercase tracking-wider text-brand-night/40 transition-colors duration-300 group-hover:text-brand-orange sm:w-16 sm:text-base">
        N°{num}
      </span>

      {/* Color strip — up to 2 RALs */}
      <span className="flex shrink-0 gap-1">
        {project.colors.slice(0, 2).map((code) => {
          const hex = ralToHex(code);
          return (
            <span
              key={code}
              aria-hidden
              className="h-10 w-2.5 rounded-sm ring-1 ring-brand-night/10 transition-all duration-500 group-hover:h-12"
              style={{ backgroundColor: hex ?? "#999" }}
            />
          );
        })}
        {project.colors.length === 0 && (
          <span
            aria-hidden
            className="h-10 w-2.5 rounded-sm bg-brand-charcoal/30 ring-1 ring-brand-night/10"
          />
        )}
      </span>

      {/* Title + category */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-charcoal/55 transition-colors duration-300 group-hover:text-brand-orange">
            {catLabel}
          </span>
          {project.featured && (
            <span className="rounded-full border border-brand-orange/30 bg-brand-orange/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-orange">
              Signature
            </span>
          )}
        </div>
        <h3 className="mt-1 font-display text-base font-bold leading-tight text-brand-night transition-colors duration-300 group-hover:text-brand-orange sm:text-lg">
          {project.title}
        </h3>
      </div>

      {/* RAL code mono — desktop only */}
      {project.colors[0] && (
        <span className="hidden font-mono text-xs text-brand-charcoal/45 sm:inline sm:text-sm">
          {project.colors[0]}
        </span>
      )}

      {/* Hex — xl only */}
      {primaryHex && (
        <span className="hidden font-mono text-xs text-brand-charcoal/35 xl:inline">
          {primaryHex.toUpperCase()}
        </span>
      )}

      {/* Arrow */}
      <span className="shrink-0 text-brand-charcoal/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-orange">
        <ArrowUpRight className="h-5 w-5" />
      </span>
    </Link>
  );
}
