import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  PROJECTS,
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategoryKey,
  getProjectBySlug,
  getProjectSlug,
  getRelatedProjects,
  catalogNumber,
} from "@/lib/realisations-data";
import { RAL_COLORS } from "@/lib/ral-colors";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";

/* ── Static params ────────────────────────────────────────────────── */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: getProjectSlug(p) }));
}

/* ── Metadata ─────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Pièce introuvable" };

  return buildMetadata({
    title: `${project.title} — Catalogue N°${catalogNumber(project)}`,
    description: project.description,
    path: `/realisations/${slug}`,
  });
}

/* ── Helpers ──────────────────────────────────────────────────────── */
function ralToHex(code: string): string | undefined {
  return RAL_COLORS.find((c) => c.code === code)?.hex;
}

function ralToName(code: string): string | undefined {
  return RAL_COLORS.find((c) => c.code === code)?.name;
}

function categoryLabel(k: ProjectCategoryKey | Project["category"]): string {
  return PROJECT_CATEGORIES.find((c) => c.key === k)?.label ?? String(k);
}

/** Fabricate an internal reference if the project doesn't have one. */
function internalReference(p: Project): string {
  if (p.reference) return p.reference;
  const cat = p.category.slice(0, 2).toUpperCase();
  const ral = p.colors[0]?.replace(/\D/g, "").slice(0, 4) ?? "0000";
  return `AZ-${cat}-${ral}-${String(p.id).padStart(2, "0")}`;
}

/** Canonical 6-step process — the audit praised this pattern on Patina. */
const PROCESS_STEPS = [
  {
    n: "01",
    label: "Décapage",
    note: "Dégraissage alcalin + rinçage",
  },
  {
    n: "02",
    label: "Sablage",
    note: "SA 2.5 · abrasif corindon",
  },
  {
    n: "03",
    label: "Primaire",
    note: "Anti-corrosion zinc (duplex)",
  },
  {
    n: "04",
    label: "Poudrage",
    note: "Pistolet électrostatique 70 kV",
  },
  {
    n: "05",
    label: "Cuisson",
    note: "200°C · 15 min · four pro",
  },
  {
    n: "06",
    label: "Contrôle",
    note: "Épaisseur Elcometer · tests qualité",
  },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default async function RealisationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project, 3);
  const cat = categoryLabel(project.category);
  const num = catalogNumber(project);
  const primaryRal = project.colors[0];
  const primaryHex = primaryRal ? ralToHex(primaryRal) : undefined;
  const ref = internalReference(project);

  return (
    <>
      <JsonLd
        id={`ld-breadcrumb-${slug}`}
        data={breadcrumbLd([
          { label: "Réalisations", href: "/realisations" },
          { label: project.title },
        ])}
      />

      {/* ── HERO — editorial catalog treatment ───────────────────── */}
      <section className="relative isolate min-h-[90vh] overflow-hidden bg-brand-night text-white">
        {/* Background layers — deep industrial with accent glow from RAL */}
        <div aria-hidden className="absolute inset-0 bg-gradient-night" />
        <div aria-hidden className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
        {primaryHex && (
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-1/4 h-[600px] w-[600px] rounded-full opacity-25 blur-[160px]"
            style={{ backgroundColor: primaryHex }}
          />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-brand-orange/15 blur-[140px]"
        />

        {/* Giant RAL code watermark — bottom-left, half-bled off canvas */}
        {primaryRal && (
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-4 select-none font-display text-[clamp(8rem,22vw,22rem)] font-black leading-[0.8] tracking-tighter text-white/[0.045]"
          >
            {primaryRal.replace("RAL ", "")}
          </span>
        )}

        <div className="container-wide relative flex min-h-[90vh] flex-col justify-center pt-40 pb-24">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-10 text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
            <Link href="/" className="transition-colors hover:text-white">
              Accueil
            </Link>
            <span aria-hidden className="mx-3">·</span>
            <Link href="/realisations" className="transition-colors hover:text-white">
              Catalogue
            </Link>
            <span aria-hidden className="mx-3">·</span>
            <span className="text-white/70">N°{num}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            {/* ── Left — title stack ────────────────────────────── */}
            <div>
              {/* Catalog label */}
              <div className="flex items-baseline gap-4">
                <span className="section-label-light">
                  Catalogue
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                  N°{num} / {String(PROJECTS.length).padStart(2, "0")}
                </span>
              </div>

              {/* Title — editorial display */}
              <h1 className="mt-6 font-display text-4xl font-black leading-[0.95] tracking-tight text-balance sm:text-5xl lg:text-[clamp(3rem,5.5vw,5.5rem)]">
                {project.title}
              </h1>

              {/* Category + meta */}
              <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-brand-orange"
                  />
                  <span className="font-bold uppercase tracking-[0.18em] text-white/75">
                    {cat}
                  </span>
                </span>
                {project.colors.length > 0 && (
                  <span className="font-mono text-[12px] text-white/45">
                    {project.colors.join(" · ")}
                  </span>
                )}
                {project.featured && (
                  <span className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                    Pièce signature
                  </span>
                )}
              </p>

              {/* Description lead */}
              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
                {project.description}
              </p>
            </div>

            {/* ── Right — FICHE spec card (Patina-style) ─────────── */}
            <aside className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-sm sm:p-8">
              {/* Accent bar top */}
              {primaryHex && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: primaryHex }}
                />
              )}

              {/* Reference header */}
              <div className="flex items-baseline justify-between gap-3">
                <span className="section-label-light">
                  Fiche
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Réf. {ref}
                </span>
              </div>

              <h2 className="mt-4 font-display text-[22px] font-black leading-tight text-white">
                Spécifications d&apos;atelier
              </h2>

              {/* Spec rows */}
              <dl className="mt-7 space-y-4 text-sm">
                <SpecRow label="Pièce" value={project.quantity ?? cat} />
                <SpecRow label="Origine" value={project.origin ?? "Commande client direct"} />
                <SpecRow label="Préparation" value={project.preparation ?? "Sablage SA 2.5 + primaire zinc"} />
                <SpecRow label="Finition" value={project.finish ?? "Thermolaquage poudre époxy"} />
                <SpecRow label="Four" value={project.ovenCycle ?? "200°C × 15 min"} />
                <SpecRow label="Atelier" value={project.ateliertIn ?? "Bruyères-sur-Oise"} />
              </dl>

              {/* Colors palette mini-strip */}
              {project.colors.length > 0 && (
                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">
                    Palette
                  </p>
                  <ul className="mt-3 space-y-2">
                    {project.colors.map((code) => {
                      const hex = ralToHex(code);
                      const name = ralToName(code);
                      return (
                        <li key={code} className="flex items-center gap-3 text-xs">
                          <span
                            aria-hidden
                            className="h-4 w-4 rounded-sm ring-1 ring-white/20"
                            style={{ backgroundColor: hex ?? "#555" }}
                          />
                          <span className="font-mono font-bold text-white/85">{code}</span>
                          {name && (
                            <span className="text-white/45">· {name}</span>
                          )}
                          {hex && (
                            <span className="ml-auto font-mono text-[10px] text-white/35">
                              {hex.toUpperCase()}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ── PROCESS TIMELINE ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-cream py-24">
        <div aria-hidden className="absolute inset-0 bg-industrial-grid opacity-25" />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="max-w-2xl">
              <span className="section-label">Procédé</span>
              <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                6 étapes.{" "}
                <span className="block bg-gradient-ember bg-clip-text text-transparent">
                  Zéro compromis.
                </span>
              </h2>
              <p className="mt-4 text-brand-charcoal/70">
                Cette pièce est passée par notre chaîne complète — du décapage au contrôle d&apos;épaisseur Elcometer.
              </p>
            </div>
          </ScrollReveal>

          <ol className="relative mt-14 grid gap-0 sm:grid-cols-2 lg:grid-cols-6">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.n} delay={i * 0.05}>
                <li className="group relative flex h-full flex-col border-t border-brand-night/15 pl-5 pt-6 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 lg:first:border-l-0">
                  {/* Number + dot */}
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_0_4px_rgba(232,93,44,0.18)] transition-transform duration-500 group-hover:scale-125"
                    />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                      {step.n}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-black leading-tight text-brand-night">
                    {step.label}
                  </h3>
                  <p className="mt-2 pr-4 text-sm leading-relaxed text-brand-charcoal/65">
                    {step.note}
                  </p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── PIÈCES VOISINES ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-brand-night py-24 text-white">
          <div className="container-wide">
            <ScrollReveal>
              <div className="flex items-end justify-between gap-8">
                <div>
                  <span className="section-label-light">Catalogue</span>
                  <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                    Pièces{" "}
                    <span className="bg-gradient-ember bg-clip-text text-transparent">
                      voisines.
                    </span>
                  </h2>
                </div>
                <Link
                  href="/realisations"
                  className="group hidden items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white md:inline-flex"
                >
                  Voir tout le catalogue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>

            <ul className="mt-14 divide-y divide-white/10 border-y border-white/10">
              {related.map((p, i) => {
                const pHex = p.colors[0] ? ralToHex(p.colors[0]) : undefined;
                return (
                  <ScrollReveal key={p.id} delay={i * 0.08}>
                    <li>
                      <Link
                        href={`/realisations/${getProjectSlug(p)}`}
                        data-magnetic
                        className="group flex items-center gap-6 py-6 transition-colors hover:bg-white/[0.02] sm:py-8"
                      >
                        <span className="font-mono text-sm font-bold text-white/30 sm:text-base">
                          N°{catalogNumber(p)}
                        </span>
                        {pHex && (
                          <span
                            aria-hidden
                            className="h-10 w-10 shrink-0 rounded-sm ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-110 sm:h-12 sm:w-12"
                            style={{ backgroundColor: pHex }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-lg font-bold leading-tight text-white transition-colors group-hover:text-brand-orange sm:text-xl">
                            {p.title}
                          </h3>
                          <p className="mt-1 truncate text-sm text-white/45">
                            {categoryLabel(p.category)}
                            {p.colors.length > 0 && (
                              <span className="font-mono"> · {p.colors.join(" · ")}</span>
                            )}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 shrink-0 text-white/35 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-orange" />
                      </Link>
                    </li>
                  </ScrollReveal>
                );
              })}
            </ul>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/realisations"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/70 hover:text-white"
              >
                Voir tout le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Back link ───────────────────────────────────────────── */}
      <section className="bg-brand-cream py-10">
        <div className="container-wide">
          <Link
            href="/realisations"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-night transition-colors hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </Link>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <CtaBand
        title={`Une pièce comme ${project.title.split("—")[0].trim()} ?`}
        description="Décrivez-nous votre projet — dimensions, état de surface, RAL souhaité. Nous vous répondons sous 24 heures avec un chiffrage précis."
        primaryLabel="Demander un devis"
        primaryHref="/devis"
      />
    </>
  );
}

/* ── Spec row component ───────────────────────────────────────────── */
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-b-0 last:pb-0">
      <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
        {label}
      </dt>
      <dd className="text-right font-medium text-white/85">{value}</dd>
    </div>
  );
}
