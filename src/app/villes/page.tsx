import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { SectionHeader } from "@/components/ui/section-header";
import { SITE } from "@/lib/utils";
import {
  DEPARTMENT_NAMES,
  VILLES_FALLBACK,
  type DepartmentCode,
} from "@/lib/villes-data";
import { DEPT_HUB_SLUG } from "@/lib/villes/departments";

/* ── Metadata ────────────────────────────────────────────────────── */

export const metadata: Metadata = buildMetadata({
  title: "Villes desservies — Thermolaquage Île-de-France",
  description: `${VILLES_FALLBACK.length} communes d'Île-de-France et de l'Oise desservies en thermolaquage poudre époxy. Trouvez votre ville : distance, accès, profil local, devis.`,
  path: "/villes",
  keywords: [
    "thermolaquage Île-de-France",
    "villes desservies thermolaquage",
    "thermolaquage 95",
    "thermolaquage 92",
    "thermolaquage 93",
    "thermolaquage 94",
    "thermolaquage 78",
    "thermolaquage 91",
    "thermolaquage 77",
    "AZ Époxy zones",
  ],
});

const DEPT_ORDER: DepartmentCode[] = [
  "95",
  "92",
  "93",
  "94",
  "78",
  "91",
  "77",
  "75",
  "60",
];

/* ── Page ──────────────────────────────────────────────────────── */

export default function VillesIndexPage() {
  const total = VILLES_FALLBACK.length;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Toutes les villes" },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Communes desservies par AZ Époxy",
    description: `Liste complète des ${total} communes d'Île-de-France et limitrophes où AZ Époxy intervient pour le thermolaquage poudre époxy.`,
    url: `${SITE.url}/villes`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: VILLES_FALLBACK.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/thermolaquage-${v.slug}`,
        name: `Thermolaquage à ${v.name}`,
      })),
    },
  };

  return (
    <>
      <JsonLd id="ld-breadcrumb-villes-index" data={breadcrumbLd} />
      <JsonLd id="ld-collection-villes-index" data={collectionLd} />

      <PageHero
        label={`${total} communes desservies`}
        title={
          <>
            Toutes nos{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              zones d&apos;intervention
            </span>
          </>
        }
        description={`AZ Époxy thermolaque dans toute l'Île-de-France et l'Oise limitrophe — ${total} communes avec une page dédiée par ville. Trouvez la vôtre ci-dessous.`}
        variant="transparent"
        image="/images/villes/95.webp"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Toutes les villes" },
        ]}
      />

      {/* Dept hubs row */}
      <section className="bg-brand-cream py-16">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Hubs départementaux"
              labelIcon={<MapPin className="h-3 w-3" />}
              title={
                <>
                  Démarrez par{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    votre département
                  </span>
                </>
              }
              description="9 départements couverts. Cliquez pour accéder à la page hub avec toutes les communes du territoire."
            />
          </ScrollReveal>

          <div className="mx-auto mt-10 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEPT_ORDER.map((code) => {
              const villesInDept = VILLES_FALLBACK.filter(
                (v) => v.departmentCode === code,
              );
              if (villesInDept.length === 0) return null;
              const deptSlug = DEPT_HUB_SLUG[code];
              const href = deptSlug
                ? `/thermolaquage-${deptSlug}`
                : `/thermolaquage-paris`; // fallback Paris uses the ville page
              return (
                <Link
                  key={code}
                  href={href}
                  className="
                    group relative overflow-hidden rounded-2xl border border-brand-night/10
                    bg-white p-6 transition-all hover:border-brand-orange/40 hover:shadow-md
                  "
                >
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-xl font-black text-brand-night">
                      {DEPARTMENT_NAMES[code]}
                    </p>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                      {code}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-brand-charcoal/55">
                    {villesInDept.length} communes
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-orange transition-colors group-hover:text-brand-orange-dark">
                    Voir le hub
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full ville list, grouped by dept */}
      <section className="bg-white py-20">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Index complet"
              title={
                <>
                  Les{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    {total} communes
                  </span>{" "}
                  desservies
                </>
              }
              description="Cliquez sur une commune pour ouvrir sa page dédiée : profil local, distance, accès, FAQ, devis."
            />
          </ScrollReveal>

          <div className="mx-auto mt-12 max-w-6xl space-y-10">
            {DEPT_ORDER.map((code) => {
              const villes = VILLES_FALLBACK.filter(
                (v) => v.departmentCode === code,
              ).sort((a, b) => a.name.localeCompare(b.name, "fr"));
              if (villes.length === 0) return null;
              const deptSlug = DEPT_HUB_SLUG[code];
              return (
                <div key={code}>
                  <div className="mb-4 flex items-baseline justify-between border-b border-brand-night/10 pb-3">
                    <h2 className="font-display text-lg font-black text-brand-night">
                      {DEPARTMENT_NAMES[code]}{" "}
                      <span className="font-mono text-sm text-brand-charcoal/45">
                        ({code})
                      </span>
                    </h2>
                    {deptSlug && (
                      <Link
                        href={`/thermolaquage-${deptSlug}`}
                        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange transition-colors hover:text-brand-orange-dark"
                      >
                        Hub département →
                      </Link>
                    )}
                  </div>
                  <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {villes.map((v) => (
                      <li key={v.slug}>
                        <Link
                          href={`/thermolaquage-${v.slug}`}
                          className="
                            flex items-baseline justify-between gap-2 py-1
                            text-sm text-brand-night
                            transition-colors hover:text-brand-orange
                          "
                        >
                          <span className="truncate">{v.name}</span>
                          <span className="shrink-0 font-mono text-[11px] text-brand-charcoal/40">
                            {v.distance}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        title="Votre commune n'est pas listée ?"
        description="On intervient au-delà des pages dédiées. Envoyez votre demande, on revient sous 24h avec un devis et une logistique adaptée."
        primaryHref="/devis"
        primaryLabel="Demander un devis"
      />
    </>
  );
}
