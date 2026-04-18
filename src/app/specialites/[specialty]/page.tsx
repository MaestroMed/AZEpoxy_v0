import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { serviceLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Euro,
  FileText,
  Package,
  Paintbrush,
  Search,
  Shield,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SpecialtySwarmBinding } from "@/components/nuee/specialty-swarm-binding";
import {
  getSpecialties,
  getSpecialtyBySlugAsync,
} from "@/lib/specialites-data";
import { RAL_COLORS } from "@/lib/ral-colors";
import {
  getProjects,
  getProjectSlug,
  catalogNumber,
  PROJECT_CATEGORIES,
  type Project,
} from "@/lib/realisations-data";
import { ArrowUpRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  "Résistance à la poussière de frein": <Shield className="h-6 w-6" />,
  "Protection contre le sel de déneigement": <Shield className="h-6 w-6" />,
  "Résistance aux projections de graviers": <Shield className="h-6 w-6" />,
  "Tenue UV et brillance durable": <Sparkles className="h-6 w-6" />,
  "Design custom sur mesure": <Paintbrush className="h-6 w-6" />,
  "Résistance à la chaleur moteur": <Shield className="h-6 w-6" />,
  "Couleurs vibrantes et durables": <Sparkles className="h-6 w-6" />,
  "Protection intégrale du châssis": <Shield className="h-6 w-6" />,
  "Résistance à la chaleur du compartiment moteur": <Shield className="h-6 w-6" />,
  "Esthétique et personnalisation": <Paintbrush className="h-6 w-6" />,
  "Protection anti-corrosion renforcée": <Shield className="h-6 w-6" />,
  "Capacité grande dimension — cabine 7 m": <Package className="h-6 w-6" />,
  "Protection anti-corrosion longue durée": <Shield className="h-6 w-6" />,
  "Production en série et répétabilité": <CheckCircle2 className="h-6 w-6" />,
};

function getBenefitIcon(title: string): React.ReactNode {
  return BENEFIT_ICONS[title] ?? <Sparkles className="h-6 w-6" />;
}

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Réception",
    description:
      "Inspection visuelle, identification de la teinte et validation du devis. Chaque pièce est photographiée à son arrivée.",
  },
  {
    num: "02",
    title: "Préparation (sablage)",
    description:
      "Décapage intégral par projection d'abrasif. Élimination de la rouille, des anciennes peintures et des impuretés pour un métal parfaitement sain.",
  },
  {
    num: "03",
    title: "Thermolaquage",
    description:
      "Application de la poudre époxy par pistolet électrostatique, puis cuisson en four à 200 °C pendant 15 minutes. Le film atteint 60-80 µm d'épaisseur.",
  },
  {
    num: "04",
    title: "Contrôle & expédition",
    description:
      "Mesure d'épaisseur, contrôle visuel sous éclairage LED, test d'adhérence si requis. Emballage protecteur et notification de retrait.",
  },
];

/** Map specialty slugs to project category keys for gallery filtering */
const SLUG_TO_CATEGORY: Record<string, string> = {
  jantes: "jantes",
  moto: "moto",
  voiture: "jantes", // auto parts share jantes gallery as fallback
  pieces: "industriel", // pieces maps to industriel category
};

/* buildGalleryItems was removed — specialty pages now surface real
   realisations from the catalogue raisonné as dense index rows. */

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialty: string }>;
}): Promise<Metadata> {
  const { specialty: slug } = await params;
  const specialty = await getSpecialtyBySlugAsync(slug);

  if (!specialty) {
    return { title: "Spécialité introuvable" };
  }

  return buildMetadata({
    title: `${specialty.title} — Thermolaquage`,
    description: specialty.description.slice(0, 160),
    path: `/specialites/${specialty.slug}`,
  });
}

/* -------------------------------------------------------------------------- */
/*  Static params                                                              */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams() {
  const specialties = await getSpecialties();
  return specialties.map((s) => ({ specialty: s.slug }));
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty: slug } = await params;
  const [specialty, projects, allSpecialties] = await Promise.all([
    getSpecialtyBySlugAsync(slug),
    getProjects(),
    getSpecialties(),
  ]);

  if (!specialty) {
    notFound();
  }

  // Chapter numbering — each specialty is a chapter of the catalogue
  // raisonné. Uses the order from getSpecialties() so when specialties
  // reorder, chapter numbers follow. Stable within a single build.
  const chapterIndex = Math.max(
    0,
    allSpecialties.findIndex((s) => s.slug === specialty.slug),
  );
  const chapterNumber = String(chapterIndex + 1).padStart(2, "0");
  const chapterTotal = String(allSpecialties.length).padStart(2, "0");

  // Build catalogue rows from real /realisations projects matching
  // this specialty's category. This ties the specialty page directly
  // to the catalogue raisonné — each chapter exposes real pieces
  // instead of generic gallery tiles.
  const projectCategory = SLUG_TO_CATEGORY[specialty.slug] ?? specialty.slug;
  const catalogueRows = projects
    .filter((p) => p.category === projectCategory)
    .slice(0, 6);
  const projectCategoryLabel =
    PROJECT_CATEGORIES.find((c) => c.key === projectCategory)?.label ??
    projectCategory;

  // Resolve popular colors from RAL catalog
  const popularRalColors = specialty.popularColors
    .map((code) => RAL_COLORS.find((c) => c.code === code))
    .filter(Boolean);

  return (
    <>
      <SpecialtySwarmBinding slug={specialty.slug} />
      <JsonLd
        id={`ld-service-${specialty.slug}`}
        data={serviceLd({
          name: `Thermolaquage ${specialty.title}`,
          description: specialty.description.slice(0, 220),
          serviceType: specialty.title,
          url: `/specialites/${specialty.slug}`,
        })}
      />

      {/* ── Section 1 — Hero (chapitre du catalogue) ────────────────── */}
      <PageHero
        label={`Chapitre · ${chapterNumber} / ${chapterTotal}`}
        title={
          <>
            Thermolaquage{" "}
            <span className="block bg-gradient-ember bg-clip-text text-transparent">
              {specialty.title}.
            </span>
          </>
        }
        description={specialty.tagline}
        variant="transparent"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Spécialités", href: "/specialites" },
          { label: specialty.title },
        ]}
      />

      {/* ── Section 2 — Why Section ──────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Avantages"
              labelIcon={<Shield className="h-3 w-3" />}
              title={
                <>
                  Pourquoi le thermolaquage pour vos{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {specialty.title.toLowerCase()}
                  </span>{" "}
                  ?
                </>
              }
              description={specialty.description}
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {specialty.benefits.map((benefit, i) => (
              <ScrollReveal key={benefit.title} delay={i * 0.1}>
                <FeatureCard
                  icon={getBenefitIcon(benefit.title)}
                  title={benefit.title}
                  description={benefit.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 — Process ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Notre procédé"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={
                <>
                  4 étapes pour des{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {specialty.title.toLowerCase()}
                  </span>{" "}
                  impeccables
                </>
              }
              description={`De la réception à l'expédition, chaque ${specialty.title.toLowerCase()} suit un protocole rigoureux pour garantir une finition irréprochable.`}
            />
          </ScrollReveal>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1}>
                <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-brand-orange/40 hover:bg-white/[0.04]">
                  <span className="heading-display text-4xl text-brand-orange/60">
                    {step.num}
                  </span>
                  <h3 className="heading-display mt-4 text-xl text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Catalogue (pièces voisines de ce chapitre) ─── */}
      <section className="relative overflow-hidden bg-brand-cream py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-industrial-grid opacity-25"
        />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="flex flex-wrap items-baseline justify-between gap-6">
              <div>
                <span className="section-label">Catalogue · Chapitre {chapterNumber}</span>
                <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                  Pièces{" "}
                  <span className="block bg-gradient-ember bg-clip-text text-transparent">
                    exposées.
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-brand-charcoal/70">
                  {catalogueRows.length} réalisation
                  {catalogueRows.length !== 1 ? "s" : ""} dans le
                  catalogue raisonné pour ce chapitre. Chaque pièce a
                  sa propre fiche éditoriale.
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-charcoal/55">
                {String(catalogueRows.length).padStart(2, "0")} pièces · {projectCategoryLabel.toLowerCase()}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ul className="mt-14 divide-y divide-brand-night/10 border-y border-brand-night/10">
              {catalogueRows.map((p) => {
                const pHex = p.colors[0]
                  ? RAL_COLORS.find((c) => c.code === p.colors[0])?.hex
                  : undefined;
                const pCat =
                  PROJECT_CATEGORIES.find((c) => c.key === p.category)?.label ??
                  p.category;
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
                      {pHex && (
                        <span
                          aria-hidden
                          className="h-10 w-2.5 shrink-0 rounded-sm ring-1 ring-brand-night/10 transition-all duration-500 group-hover:h-12"
                          style={{ backgroundColor: pHex }}
                        />
                      )}
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
                      {p.colors[0] && (
                        <span className="hidden font-mono text-xs text-brand-charcoal/45 sm:inline sm:text-sm">
                          {p.colors[0]}
                        </span>
                      )}
                      <span className="shrink-0 text-brand-charcoal/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-orange">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex justify-center">
              <Link
                href="/realisations"
                className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.22em] text-brand-night/80 transition-colors hover:text-brand-night"
              >
                <span>Voir tout le catalogue raisonné</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-night/20 transition-all duration-300 group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 5 — Popular Colors ───────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container-wide">
          <ScrollReveal>
            <h2 className="heading-display text-2xl text-brand-night sm:text-3xl">
              Couleurs populaires pour vos{" "}
              <span className="bg-gradient-ember bg-clip-text text-transparent">
                {specialty.title.toLowerCase()}
              </span>
            </h2>
            <p className="mt-3 text-brand-charcoal/70">
              Les teintes les plus demandées par nos clients. Plus de 200
              couleurs RAL disponibles sur commande.
            </p>
          </ScrollReveal>

          <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {popularRalColors.map((color) =>
              color ? (
                <div
                  key={color.code}
                  className="flex flex-shrink-0 items-center gap-4 rounded-xl border border-brand-night/10 bg-brand-cream/60 px-5 py-4 transition-all hover:shadow-md"
                >
                  <div
                    className="h-12 w-12 flex-shrink-0 rounded-xl shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-charcoal/70">
                      {color.code}
                    </p>
                    <p className="text-sm font-semibold text-brand-night">
                      {color.name}
                    </p>
                  </div>
                </div>
              ) : null
            )}
          </div>

          <p className="mt-6 text-sm text-brand-charcoal/50">
            <Link
              href="/couleurs-ral"
              className="inline-flex items-center gap-1 font-semibold text-brand-orange hover:underline"
            >
              Explorer le nuancier complet
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </section>

      {/* ── Section 6 — Pricing ──────────────────────────────────────── */}
      <section className="bg-brand-cream py-16">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl rounded-2xl border border-brand-night/10 bg-white p-10 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                  <Euro className="h-7 w-7" />
                </div>

                <h2 className="heading-display text-3xl text-brand-night">
                  À partir de{" "}
                  <span className="text-brand-orange">
                    {specialty.priceFrom}
                  </span>
                </h2>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-brand-charcoal/70">
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-orange" />
                    Délai moyen : {specialty.turnaround}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-orange" />
                    Devis gratuit et personnalisé
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Truck className="h-4 w-4 text-brand-orange" />
                    Retrait sur place ou expédition
                  </span>
                </div>

                <p className="mt-6 text-sm text-brand-charcoal/60">
                  Le tarif final dépend de la taille, de l&apos;état initial et
                  de la finition souhaitée. Envoyez-nous vos photos pour un
                  chiffrage précis sous 24h.
                </p>

                <Link href="/devis" className="btn-primary mt-8">
                  Demander un devis gratuit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 7 — FAQs ─────────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Questions fréquentes"
              labelIcon={<Tag className="h-3 w-3" />}
              title={
                <>
                  Tout savoir sur le thermolaquage{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {specialty.title.toLowerCase()}
                  </span>
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-14 max-w-3xl">
            <ScrollReveal delay={0.1}>
              <FAQAccordion items={specialty.faqs} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 8 — CTA Band ─────────────────────────────────────── */}
      <CtaBand
        title="Envoyez vos photos pour un devis immédiat"
        description={`Jantes, moto, pièces auto, mobilier, portails — envoyez-nous vos photos et recevez un chiffrage sous 24h.`}
        primaryHref="/devis"
        primaryLabel="Demander un devis"
      />
    </>
  );
}
