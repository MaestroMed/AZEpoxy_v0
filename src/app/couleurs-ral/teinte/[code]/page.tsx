import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  RAL_COLORS,
  RAL_FAMILIES,
  type RALColor,
} from "@/lib/ral-colors";
import { getRalEditorial } from "@/lib/ral-editorial";
import {
  PROJECTS,
  PROJECT_CATEGORIES,
  getProjectSlug,
  catalogNumber,
  type Project,
} from "@/lib/realisations-data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";

/* ── Helpers ──────────────────────────────────────────────────────── */
/** Numeric slug → canonical "RAL 3020" code. */
function fromSlug(slug: string): string {
  return `RAL ${slug.trim()}`;
}
/** Canonical "RAL 3020" → URL slug "3020". */
function toSlug(code: string): string {
  return code.replace(/^RAL\s*/i, "").trim();
}
function getRalBySlug(slug: string): RALColor | undefined {
  const code = fromSlug(slug);
  return RAL_COLORS.find((c) => c.code === code);
}
function getProjectsByRal(code: string): Project[] {
  return PROJECTS.filter((p) => p.colors.includes(code));
}
/** Neighbors : same family, closest by numeric code, up to `n`. */
function getNeighbors(color: RALColor, n = 4): RALColor[] {
  const baseNum = parseInt(toSlug(color.code), 10);
  return RAL_COLORS.filter(
    (c) => c.family === color.family && c.code !== color.code,
  )
    .map((c) => ({
      c,
      d: Math.abs(parseInt(toSlug(c.code), 10) - baseNum),
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.c);
}

/* ── Static params ────────────────────────────────────────────────── */
export function generateStaticParams() {
  return RAL_COLORS.map((c) => ({ code: toSlug(c.code) }));
}

/* ── Metadata ─────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const color = getRalBySlug(code);
  if (!color) return { title: "Teinte introuvable" };
  const quote = getRalEditorial(color.code);
  return buildMetadata({
    title: `${color.code} — ${color.name}`,
    description:
      quote ??
      `${color.code} — ${color.name}. Thermolaquage professionnel dans cette teinte, disponible sous 10 à 15 jours. Fiche complète : hex, pièces réalisées, teintes voisines.`,
    path: `/couleurs-ral/teinte/${toSlug(color.code)}`,
  });
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default async function RalTeintePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: slug } = await params;
  const color = getRalBySlug(slug);
  if (!color) notFound();

  const quote = getRalEditorial(color.code);
  const projects = getProjectsByRal(color.code);
  const neighbors = getNeighbors(color, 4);
  const familyLabel =
    RAL_FAMILIES.find((f) => f.key === color.family)?.label ?? color.family;

  // Devis href carries the RAL as a query param so the wizard can
  // pre-fill the color field.
  const devisHref = `/devis?ral=${encodeURIComponent(color.code)}`;

  return (
    <>
      <JsonLd
        id={`ld-breadcrumb-ral-${slug}`}
        data={breadcrumbLd([
          { label: "Couleurs RAL", href: "/couleurs-ral" },
          { label: color.code },
        ])}
      />

      {/* ── HERO — the color is the hero ─────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        {/* Left panel : dense editorial meta. Right panel : the color. */}
        <div className="relative grid min-h-[90vh] grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
          {/* ── LEFT : meta ───────────────────────────────────── */}
          <div className="relative z-10 flex flex-col justify-between bg-brand-night px-6 pb-16 pt-32 text-white sm:px-10 lg:pt-40">
            <div aria-hidden className="absolute inset-0 bg-industrial-grid-dark opacity-25" />
            <div aria-hidden className="absolute -left-20 top-1/3 h-[500px] w-[500px] rounded-full bg-brand-orange/10 blur-[140px]" />

            <div className="relative">
              {/* Breadcrumb + family pill */}
              <nav aria-label="Fil d'Ariane" className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                <Link href="/" className="transition-colors hover:text-white">
                  Accueil
                </Link>
                <span aria-hidden className="mx-3">·</span>
                <Link href="/couleurs-ral" className="transition-colors hover:text-white">
                  Couleurs RAL
                </Link>
                <span aria-hidden className="mx-3">·</span>
                <span className="text-white/70">Teinte</span>
              </nav>

              {/* Catalog label */}
              <div className="mt-10 flex items-baseline gap-4">
                <span className="section-label-light">Fiche teinte</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Famille · {familyLabel}
                </span>
              </div>

              {/* Huge RAL code */}
              <h1 className="mt-6 font-display font-black leading-[0.85] tracking-tighter text-white">
                <span className="block text-[clamp(3rem,8vw,7rem)]">
                  {color.code}
                </span>
                <span className="mt-4 block bg-gradient-ember bg-clip-text text-[clamp(1.5rem,3vw,2.25rem)] text-transparent">
                  {color.name}.
                </span>
              </h1>

              {/* Editorial quote — if curated, shown as pull-quote */}
              {quote && (
                <figure className="relative mt-10 max-w-xl">
                  <span
                    aria-hidden
                    className="absolute -left-1 -top-6 select-none font-display text-[4rem] leading-none text-brand-orange/50"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="pl-6 font-display text-lg italic leading-relaxed text-white/85 sm:text-xl">
                    {quote}
                  </blockquote>
                  <figcaption className="mt-4 pl-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    — Note éditoriale
                  </figcaption>
                </figure>
              )}

              {/* Hex + quick actions */}
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-8 text-sm">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    Hex
                  </dt>
                  <dd className="mt-1 font-mono font-bold text-white/90">
                    {color.hex.toUpperCase()}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    Famille
                  </dt>
                  <dd className="mt-1 font-medium text-white/90">
                    {familyLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    Disponibilité
                  </dt>
                  <dd className="mt-1 font-medium text-white/90">10-15 j</dd>
                </div>
              </dl>
            </div>

            {/* CTA */}
            <div className="relative mt-12 flex flex-wrap items-center gap-3">
              <Link
                href={devisHref}
                data-magnetic
                className="group inline-flex items-center gap-3 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_-14px_rgba(232,93,44,0.55)] transition-all hover:scale-[1.02] hover:shadow-[0_18px_38px_-14px_rgba(232,93,44,0.75)]"
              >
                Devis dans cette teinte
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/couleurs-ral"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Nuancier complet
              </Link>
            </div>
          </div>

          {/* ── RIGHT : the color block ───────────────────────── */}
          <div
            aria-hidden
            className="relative flex items-end justify-end"
            style={{ backgroundColor: color.hex }}
          >
            {/* Giant RAL numeric watermark */}
            <span className="pointer-events-none select-none px-8 pb-8 font-display text-[clamp(6rem,18vw,16rem)] font-black leading-[0.8] tracking-tighter text-black/12 mix-blend-multiply sm:px-12 sm:pb-12">
              {toSlug(color.code)}
            </span>
          </div>
        </div>
      </section>

      {/* ── PIÈCES RÉALISÉES DANS CETTE TEINTE ───────────────────── */}
      {projects.length > 0 ? (
        <section className="relative overflow-hidden bg-brand-cream py-24">
          <div aria-hidden className="absolute inset-0 bg-industrial-grid opacity-25" />
          <div className="container-wide relative">
            <ScrollReveal>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <span className="section-label">Réalisées dans cette teinte</span>
                  <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                    {projects.length} pièce{projects.length !== 1 ? "s" : ""}{" "}
                    <span className="block bg-gradient-ember bg-clip-text text-transparent">
                      au catalogue.
                    </span>
                  </h2>
                </div>
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-brand-charcoal/55 md:inline">
                  {color.code}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <ul className="mt-14 divide-y divide-brand-night/10 border-y border-brand-night/10">
                {projects.map((p) => {
                  const pCat =
                    PROJECT_CATEGORIES.find((c) => c.key === p.category)
                      ?.label ?? p.category;
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/realisations/${getProjectSlug(p)}`}
                        data-magnetic
                        className="group relative flex items-center gap-5 py-6 transition-colors duration-300 hover:bg-white/60 sm:py-7"
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 origin-bottom scale-y-0 bg-brand-orange transition-transform duration-500 group-hover:scale-y-100"
                        />
                        <span className="w-12 shrink-0 font-mono text-sm font-bold text-brand-night/40 transition-colors duration-300 group-hover:text-brand-orange sm:w-16 sm:text-base">
                          N°{catalogNumber(p)}
                        </span>
                        <span
                          aria-hidden
                          className="h-10 w-2.5 shrink-0 rounded-sm ring-1 ring-brand-night/10 transition-all duration-500 group-hover:h-12"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-charcoal/55 transition-colors duration-300 group-hover:text-brand-orange">
                              {pCat}
                            </span>
                            {p.featured && (
                              <span className="rounded-full border border-brand-orange/30 bg-brand-orange/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                                Signature
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 font-display text-base font-bold leading-tight text-brand-night transition-colors duration-300 group-hover:text-brand-orange sm:text-lg">
                            {p.title}
                          </h3>
                        </div>
                        <span className="shrink-0 text-brand-charcoal/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-orange">
                          <ArrowUpRight className="h-5 w-5" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </ScrollReveal>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-brand-cream py-24">
          <div aria-hidden className="absolute inset-0 bg-industrial-grid opacity-25" />
          <div className="container-wide relative">
            <ScrollReveal>
              <div className="max-w-2xl">
                <span className="section-label">Réalisées dans cette teinte</span>
                <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                  Pas encore au catalogue{" "}
                  <span className="block bg-gradient-ember bg-clip-text text-transparent">
                    — soyez la première pièce.
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-brand-charcoal/70">
                  Le catalogue raisonné n&apos;a pas encore exposé de pièce dans {color.code}. Chaque nouvelle pièce rejoint l&apos;index avec sa référence à vie.
                </p>
                <Link
                  href={devisHref}
                  data-magnetic
                  className="mt-10 inline-flex items-center gap-3 rounded-full bg-brand-night px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-brand-orange"
                >
                  Ouvrir un chapitre dans cette teinte
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── TEINTES VOISINES ─────────────────────────────────────── */}
      {neighbors.length > 0 && (
        <section className="bg-brand-night py-24 text-white">
          <div className="container-wide">
            <ScrollReveal>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <span className="section-label-light">Palette</span>
                  <h2 className="heading-display mt-4 text-4xl sm:text-5xl">
                    Teintes voisines{" "}
                    <span className="block bg-gradient-ember bg-clip-text text-transparent">
                      dans la famille {familyLabel.toLowerCase()}.
                    </span>
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {neighbors.map((n, i) => (
                <ScrollReveal key={n.code} delay={i * 0.06}>
                  <li>
                    <Link
                      href={`/couleurs-ral/teinte/${toSlug(n.code)}`}
                      data-magnetic
                      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-orange/40"
                    >
                      {/* Color tile */}
                      <div
                        aria-hidden
                        className="relative h-32 transition-transform duration-500 group-hover:scale-[1.02]"
                        style={{ backgroundColor: n.hex }}
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute bottom-2 right-3 select-none font-mono text-[10px] font-bold uppercase tracking-wider text-black/45 mix-blend-multiply"
                        >
                          {n.hex.toUpperCase()}
                        </span>
                      </div>
                      {/* Meta */}
                      <div className="flex items-center justify-between p-5">
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-bold uppercase tracking-wider text-white/55">
                            {n.code}
                          </p>
                          <p className="mt-1 truncate font-display text-base font-bold text-white transition-colors group-hover:text-brand-orange">
                            {n.name}
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:text-brand-orange" />
                      </div>
                    </Link>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Back link ───────────────────────────────────────────── */}
      <section className="bg-brand-cream py-10">
        <div className="container-wide">
          <Link
            href="/couleurs-ral"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-night transition-colors hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au nuancier
          </Link>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <CtaBand
        title={`${color.code} sur votre pièce ?`}
        description={`Devis précis sous 24h pour du thermolaquage en ${color.name}. Le RAL est déjà sélectionné dans le formulaire.`}
        primaryLabel="Demander le devis"
        primaryHref={devisHref}
      />
    </>
  );
}
