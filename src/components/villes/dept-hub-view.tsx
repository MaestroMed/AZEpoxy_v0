import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Flame,
  MapPin,
  Palette,
  Shield,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { INDUSTRY_LABEL, type Ville } from "@/lib/villes-data";
import { SITE } from "@/lib/utils";
import { getDeptOverview } from "@/lib/villes/departments";
import { DEPT_LONGFORM } from "@/lib/villes/dept-copy";
import type { DepartmentCode } from "@/lib/villes-data";

interface DeptHubViewProps {
  code: DepartmentCode;
}

/**
 * Hub page d'un département — agrège toutes les villes de ce département
 * et propose un point d'entrée unique pour la zone, avec maillage interne
 * vers chaque page ville.
 */
export function DeptHubView({ code }: DeptHubViewProps) {
  const dept = getDeptOverview(code);
  const heroImage = `/images/villes/${code}.webp`;
  const longform = DEPT_LONGFORM[code];

  // BreadcrumbList émis par PageHero depuis `breadcrumbs` (source unique).
  // LocalBusiness #business émis globalement (layout). Service le
  // référence par @id.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Thermolaquage poudre époxy en ${dept.name} (${dept.code})`,
    serviceType: "Thermolaquage industriel poudre époxy",
    provider: { "@id": `${SITE.url}#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: dept.name,
    },
    description: `AZ Époxy intervient dans ${dept.count} communes du ${dept.name} pour le thermolaquage poudre époxy professionnel.`,
  };

  /* ItemList — signale à Google que cette page est un index/listing
     des villes du département. Aide le snippet riche en SERP. */
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Communes desservies en ${dept.name}`,
    numberOfItems: dept.villes.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: dept.villes.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/thermolaquage-${v.slug}`,
      name: v.name,
    })),
  };

  // Group villes by drive tier (proche / moyen / loin)
  const proches = dept.villes.filter((v) => v.driveTimeMin <= 25);
  const moyens = dept.villes.filter(
    (v) => v.driveTimeMin > 25 && v.driveTimeMin <= 55,
  );
  const loins = dept.villes.filter((v) => v.driveTimeMin > 55);

  return (
    <>
      <JsonLd id={`ld-service-dept-${dept.slug}`} data={serviceLd} />
      <JsonLd id={`ld-itemlist-dept-${dept.slug}`} data={itemListLd} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <PageHero
        label={`Département ${dept.code}`}
        title={
          <>
            Thermolaquage en{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              {dept.name}
            </span>
          </>
        }
        description={`AZ Époxy intervient dans ${dept.count} communes du ${dept.name}. Accès rapide depuis notre atelier de Bruyères-sur-Oise — entre ${dept.minDistanceMin} et ${dept.maxDistanceMin} minutes selon la commune.`}
        variant="transparent"
        image={heroImage}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: `Thermolaquage ${dept.name}` },
        ]}
      />

      {/* ── Intro + KPIs ─────────────────────────────────── */}
      <section className="bg-brand-cream py-20">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl">
              <div className="mb-10 grid gap-4 sm:grid-cols-3">
                <StatBox
                  icon={<MapPin className="h-5 w-5" />}
                  label="Communes desservies"
                  value={String(dept.count)}
                />
                <StatBox
                  icon={<Clock className="h-5 w-5" />}
                  label="Plus proche"
                  value={`${dept.minDistanceMin} min`}
                />
                <StatBox
                  icon={<Building2 className="h-5 w-5" />}
                  label="Cabine XXL"
                  value="7 × 3 × 4 m"
                />
              </div>

              <div className="rounded-2xl border border-brand-night/10 bg-white p-8 shadow-sm lg:p-10">
                <h2 className="heading-display text-2xl text-brand-night sm:text-3xl">
                  Thermolaquage poudre époxy en{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {dept.name}
                  </span>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-brand-charcoal/80">
                  Depuis notre atelier de 1 800 m² à Bruyères-sur-Oise, AZ Époxy
                  couvre l&apos;ensemble du département {dept.name} ({dept.code})
                  pour le thermolaquage poudre époxy professionnel. {dept.count}{" "}
                  communes accessibles, avec un service d&apos;enlèvement et
                  livraison adapté à chaque projet — du portail unitaire à la
                  série industrielle.
                </p>
                {dept.topIndustries.length > 0 && (
                  <p className="mt-4 text-brand-charcoal/70 leading-relaxed">
                    Les principaux profils que nous accompagnons sur ce
                    territoire :{" "}
                    {dept.topIndustries
                      .map(
                        (i) =>
                          INDUSTRY_LABEL[i as keyof typeof INDUSTRY_LABEL] ??
                          i,
                      )
                      .map((label, i, arr) => (
                        <span
                          key={label}
                          className="font-semibold text-brand-night"
                        >
                          {label}
                          {i < arr.length - 1 ? ", " : "."}
                        </span>
                      ))}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Liste des villes (groupées par proximité) ──── */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Communes desservies"
              labelIcon={<MapPin className="h-3 w-3" />}
              title={
                <>
                  Toutes nos pages dédiées en{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {dept.name}
                  </span>
                </>
              }
              description={`Cliquez sur une commune pour accéder à sa page dédiée — distance, accès, profil local, FAQ et devis.`}
            />
          </ScrollReveal>

          <div className="mx-auto mt-12 max-w-6xl space-y-10">
            <VilleGroup
              title="Drive ≤ 25 min — proximité immédiate"
              villes={proches}
              tone="ember"
            />
            <VilleGroup
              title="Drive 25-55 min — accès rapide"
              villes={moyens}
              tone="neutral"
            />
            <VilleGroup
              title="Drive ≥ 55 min — service organisé"
              villes={loins}
              tone="neutral"
            />
          </div>
        </div>
      </section>

      {/* ── Long-form copy — éditorial unique par dept ─── */}
      {longform && (
        <section className="bg-white py-20">
          <div className="container-wide">
            <ScrollReveal>
              <div className="mx-auto max-w-3xl">
                <SectionHeader
                  label="Contexte local"
                  title={
                    <>
                      <span className="bg-gradient-ember bg-clip-text text-transparent">
                        {longform.sectionTitle}
                      </span>
                    </>
                  }
                />
                <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-brand-charcoal/80">
                  {longform.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {longform.useCases.length > 0 && (
                  <div className="mt-10">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                      Cas d&apos;usage typiques
                    </p>
                    <ul className="space-y-3">
                      {longform.useCases.map((uc) => (
                        <li
                          key={uc.title}
                          className="rounded-xl border border-brand-night/10 bg-brand-cream/40 p-4"
                        >
                          <p className="text-sm font-semibold text-brand-night">
                            {uc.title}
                          </p>
                          <p className="mt-1 text-[14px] leading-relaxed text-brand-charcoal/70">
                            {uc.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Services rappel ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-20 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Nos services"
              labelIcon={<Flame className="h-3 w-3" />}
              title={
                <>
                  Ce que nous proposons dans le{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {dept.name}
                  </span>
                </>
              }
              description="Thermolaquage, sablage et finitions spéciales — l'ensemble de nos prestations est disponible pour toutes les communes du département."
            />
          </ScrollReveal>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
            {[
              {
                icon: <Flame className="h-5 w-5" />,
                title: "Thermolaquage",
                desc: "200+ couleurs RAL & NCS, finition durable, anti-UV, anti-corrosion.",
                href: "/services/thermolaquage",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Sablage & grenaillage",
                desc: "Décapage SA 2.5, cabine 7 × 3 × 4 m pour les grandes pièces.",
                href: "/services/sablage",
              },
              {
                icon: <Palette className="h-5 w-5" />,
                title: "Finitions spéciales",
                desc: "Effets Corten, Métalliques, Irisés, Anodisés.",
                href: "/services/finitions",
              },
            ].map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="
                  group rounded-2xl border border-white/10 bg-white/[0.02] p-5
                  transition-colors hover:border-white/25 hover:bg-white/[0.05]
                "
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange">
                  {s.icon}
                </div>
                <h3 className="heading-display text-lg text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {s.desc}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-orange/85 transition-colors group-hover:text-brand-orange">
                  Détails
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <CtaBand
        title={`Devis gratuit pour le ${dept.name}`}
        description={`Photos + dimensions → chiffrage sous 24 h pour toutes les communes du ${dept.name}.`}
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-brand-night/10 bg-white p-5 shadow-sm">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal/50">
          {label}
        </p>
        <p className="heading-display text-xl text-brand-night">{value}</p>
      </div>
    </div>
  );
}

function VilleGroup({
  title,
  villes,
  tone,
}: {
  title: string;
  villes: Ville[];
  tone: "ember" | "neutral";
}) {
  if (villes.length === 0) return null;

  return (
    <div>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-charcoal/55">
        {title} · {villes.length} commune{villes.length > 1 ? "s" : ""}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {villes.map((v) => (
          <Link
            key={v.slug}
            href={`/thermolaquage-${v.slug}`}
            className={`
              group flex items-center gap-3 rounded-xl border bg-white p-3.5
              transition-all hover:border-brand-orange/40 hover:bg-brand-orange/[0.03]
              ${tone === "ember" ? "border-brand-orange/15" : "border-brand-night/10"}
            `}
          >
            <CheckCircle2
              className={`h-4 w-4 shrink-0 ${tone === "ember" ? "text-brand-orange" : "text-brand-charcoal/35"}`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-night">
                {v.name}
              </p>
              <p className="text-[11px] text-brand-charcoal/55">
                {v.distance} · {v.driveTime}
              </p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-brand-charcoal/30 transition-all group-hover:translate-x-0.5 group-hover:text-brand-orange" />
          </Link>
        ))}
      </div>
    </div>
  );
}
