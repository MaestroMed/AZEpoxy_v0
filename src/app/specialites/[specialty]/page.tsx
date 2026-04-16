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
import { GalleryGrid } from "@/components/ui/gallery-grid";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  getSpecialties,
  getSpecialtyBySlugAsync,
} from "@/lib/specialites-data";
import { RAL_COLORS } from "@/lib/ral-colors";
import { getProjects, type Project } from "@/lib/realisations-data";

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

/** Build gallery items from matching projects, padding with generic items if needed */
function buildGalleryItems(
  categorySlug: string,
  specialtyTitle: string,
  popularColors: string[],
  projects: Project[]
) {
  const projectCategory = SLUG_TO_CATEGORY[categorySlug] ?? categorySlug;
  const matching = projects.filter((p) => p.category === projectCategory);
  const items = matching.slice(0, 6).map((p) => ({
    title: p.title,
    category: categorySlug,
    colors: p.colors,
  }));

  // Pad to 6 items if not enough
  let colorIdx = 0;
  while (items.length < 6) {
    const color = popularColors[colorIdx % popularColors.length];
    items.push({
      title: `Projet ${specialtyTitle} — ${color}`,
      category: categorySlug,
      colors: [color],
    });
    colorIdx++;
  }

  return items;
}

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
  const [specialty, projects] = await Promise.all([
    getSpecialtyBySlugAsync(slug),
    getProjects(),
  ]);

  if (!specialty) {
    notFound();
  }

  const galleryItems = buildGalleryItems(
    specialty.slug,
    specialty.title,
    specialty.popularColors,
    projects
  );

  // Resolve popular colors from RAL catalog
  const popularRalColors = specialty.popularColors
    .map((code) => RAL_COLORS.find((c) => c.code === code))
    .filter(Boolean);

  return (
    <>
      <JsonLd
        id={`ld-service-${specialty.slug}`}
        data={serviceLd({
          name: `Thermolaquage ${specialty.title}`,
          description: specialty.description.slice(0, 220),
          serviceType: specialty.title,
          url: `/specialites/${specialty.slug}`,
        })}
      />

      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label="Spécialités"
        title={
          <>
            Thermolaquage{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              {specialty.title}
            </span>
          </>
        }
        description={specialty.tagline}
        variant="night"
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

      {/* ── Section 4 — Gallery ──────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Portfolio"
              labelIcon={<Search className="h-3 w-3" />}
              title={
                <>
                  Nos réalisations{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {specialty.title.toLowerCase()}
                  </span>
                </>
              }
              description={`Découvrez quelques-uns de nos projets de thermolaquage ${specialty.title.toLowerCase()}. Chaque pièce est traitée selon le même protocole industriel exigeant.`}
              ctaLabel="Voir toutes nos réalisations"
              ctaHref="/realisations"
            />
          </ScrollReveal>

          <div className="mt-14">
            <ScrollReveal delay={0.1}>
              <GalleryGrid items={galleryItems} columns={3} />
            </ScrollReveal>
          </div>
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
