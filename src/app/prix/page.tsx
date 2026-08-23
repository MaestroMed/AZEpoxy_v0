import Link from "next/link";
import {
  Euro,
  Ruler,
  Layers,
  Sparkles,
  Boxes,
  Clock,
  FileText,
  ArrowRight,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { serviceLd, faqPageLd, breadcrumbLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { PIECE_TYPES, OPTIONS } from "@/lib/pricing-data";
import { getFaqs } from "@/lib/faq-data";
import { SITE } from "@/lib/utils";

/**
 * Page tarifs — /prix
 *
 * Reconstruite le 24/08/2026. L'URL /prix était encore positionnée dans Google
 * (172 impressions / 28 j, position 20) alors qu'elle renvoyait un 404 depuis
 * le 15/08. Le champ lexical « prix / tarif / coût / au m² » est le plus gros
 * gisement d'intention commerciale du site d'après la Search Console.
 *
 * Toutes les fourchettes affichées viennent de `@/lib/pricing-data` — la MÊME
 * source que l'estimateur du wizard de devis. Aucun prix n'est saisi en dur
 * ici : si la grille bouge, la page suit, et les deux ne peuvent pas diverger.
 */

const PAGE_DESCRIPTION =
  "Prix du thermolaquage : jantes dès 80 €, portail dès 25 €/m², garde-corps dès 20 €/ml, cadre moto dès 200 €. Grille tarifaire détaillée, ce qui fait varier le prix et devis gratuit sous 24 h en Île-de-France et dans l'Oise.";

export const metadata = buildMetadata({
  title: "Prix du Thermolaquage — Tarifs 2026",
  description: PAGE_DESCRIPTION,
  path: "/prix",
  image: "/og-image.jpg",
  keywords: [
    "prix thermolaquage",
    "tarif thermolaquage",
    "prix thermolaquage au m2",
    "coût thermolaquage",
    "prix thermolaquage jantes",
    "prix thermolaquage portail",
    "prix thermolaquage garde-corps",
    "prix thermolaquage cadre moto",
    "devis thermolaquage",
  ],
});

/** Icône par type de pièce — mêmes slugs que PIECE_TYPES. */
const PIECE_ICONS: Record<string, React.ReactNode> = {
  jantes: <Boxes className="h-5 w-5" />,
  moto: <Sparkles className="h-5 w-5" />,
  portail: <Ruler className="h-5 w-5" />,
  "garde-corps": <Ruler className="h-5 w-5" />,
  cadres: <Layers className="h-5 w-5" />,
  mobilier: <Layers className="h-5 w-5" />,
  autre: <Euro className="h-5 w-5" />,
};

/** Ce que couvre chaque ligne de la grille — évite le tarif hors contexte. */
const PIECE_NOTES: Record<string, string> = {
  jantes:
    "Sablage à nu, primaire d'accrochage époxy, poudre teinte unie et cuisson four. Prix par jante, selon le diamètre.",
  moto: "Cadre nu, démonté et dégraissé. Sablage, primaire et cuisson comprises.",
  portail: "Prix au mètre carré de surface développée, sablage compris.",
  "garde-corps": "Prix au mètre linéaire, barreaudage standard.",
  cadres:
    "Châssis, supports, pièces de chaudronnerie. Prix à la pièce selon encombrement.",
  mobilier:
    "Piètements de table, chaises, étagères, mobilier d'extérieur. Prix à la pièce.",
  autre:
    "Toute pièce métallique entrant dans la cabine 7 × 3 × 4 m. Prix au mètre carré.",
};

/** Exemples chiffrés — calculés depuis PIECE_TYPES, pas saisis en dur. */
const jantes = PIECE_TYPES.find((p) => p.slug === "jantes")!;
const portail = PIECE_TYPES.find((p) => p.slug === "portail")!;
const moto = PIECE_TYPES.find((p) => p.slug === "moto")!;

const EXEMPLES = [
  {
    titre: "Un jeu de 4 jantes de 17 pouces",
    detail: "Teinte unie RAL, sablage et cuisson compris.",
    calcul: `4 × ${jantes.sizes![0].range.min} à ${jantes.sizes![0].range.max} €`,
    total: `${jantes.sizes![0].range.min * 4} à ${jantes.sizes![0].range.max * 4} €`,
  },
  {
    titre: "Un portail battant barreaudé de 3 m",
    detail: "Environ 6 m² de surface développée, sablage compris.",
    calcul: `6 m² × ${portail.baseRange!.min} à ${portail.baseRange!.max} €/m²`,
    total: `${portail.baseRange!.min * 6} à ${portail.baseRange!.max * 6} €`,
  },
  {
    titre: "Un cadre de moto nu",
    detail: "Cadre démonté et dégraissé, finition teinte unie.",
    calcul: "Forfait à la pièce",
    total: `${moto.baseRange!.min} à ${moto.baseRange!.max} €`,
  },
];

const VARIABLES = [
  {
    icon: <Layers className="h-6 w-6" />,
    title: "L'état initial de la pièce",
    description:
      "Une pièce neuve part directement au dégraissage. Une pièce déjà peinte, rouillée ou galvanisée demande un décapage complet, qui se facture à part.",
  },
  {
    icon: <Ruler className="h-6 w-6" />,
    title: "La surface à traiter",
    description:
      "La poudre et le temps de cabine se comptent au mètre carré développé — pas à l'encombrement. Un portail barreaudé développe plus de surface qu'un portail plein de même largeur.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "La finition choisie",
    description: `Une teinte RAL unie est au tarif de base. ${OPTIONS.premium.label} : comptez environ ${Math.round((OPTIONS.premium.multiplier - 1) * 100)} % de plus.`,
  },
  {
    icon: <Boxes className="h-6 w-6" />,
    title: "Le volume et la régularité",
    description:
      "Les professionnels — serruriers, métalliers, architectes, préparateurs auto — bénéficient d'une grille dégressive et d'une facturation à 30 jours sur présentation d'un Kbis.",
  },
];

export default async function PrixPage() {
  const faqs = await getFaqs();
  const faqsTarifs = faqs.filter((f) => f.category === "tarifs");

  const prixMin = Math.min(
    ...PIECE_TYPES.map((p) => p.baseRange?.min ?? p.sizes![0].range.min),
  );
  const prixMax = Math.max(
    ...PIECE_TYPES.map(
      (p) => p.baseRange?.max ?? p.sizes![p.sizes!.length - 1].range.max,
    ),
  );

  return (
    <>
      <JsonLd
        id="ld-service-prix"
        data={{
          ...serviceLd({
            name: "Thermolaquage poudre époxy — tarifs",
            description: PAGE_DESCRIPTION,
            serviceType: "Thermolaquage",
            url: "/prix",
          }),
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: prixMin,
            highPrice: prixMax,
            offerCount: PIECE_TYPES.length,
            availability: "https://schema.org/InStock",
            areaServed: "Île-de-France",
          },
        }}
      />
      <JsonLd
        id="ld-breadcrumb-prix"
        // « Accueil » est ajouté automatiquement ; le dernier item est la page
        // courante et ne porte donc pas de href.
        data={breadcrumbLd([{ label: "Prix du thermolaquage" }])}
      />
      {faqsTarifs.length > 0 && (
        <JsonLd id="ld-faq-prix" data={faqPageLd(faqsTarifs)} />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        label="Tarifs"
        title={
          <>
            Prix du{" "}
            <span className="block bg-gradient-ember bg-clip-text text-transparent">
              thermolaquage
            </span>
          </>
        }
        description="Les fourchettes réelles de l'atelier, par type de pièce. Pas de prix d'appel : ce sont les mêmes chiffres que ceux de notre estimateur de devis."
        variant="transparent"
        image="/images/heros/services-thermolaquage.webp"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Prix du thermolaquage" },
        ]}
      />

      {/* ── Réponse directe ──────────────────────────────────────────── */}
      <section className="bg-brand-cream py-20">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-md sm:p-12">
              <span className="section-label">
                <Euro className="h-3 w-3" />
                En résumé
              </span>
              <p className="mt-6 text-lg leading-relaxed text-brand-charcoal/85">
                Chez AZ Époxy, le thermolaquage d&apos;une pièce métallique
                revient <strong className="text-brand-night">entre 20 et 45 € du mètre carré</strong>{" "}
                pour les pièces facturées à la surface (portail, garde-corps,
                tôlerie), et <strong className="text-brand-night">entre 80 et 200 € par jante</strong>{" "}
                selon le diamètre. Un cadre de moto nu se situe{" "}
                <strong className="text-brand-night">entre 200 et 400 €</strong>. Ces
                montants comprennent le sablage, le primaire d&apos;accrochage,
                l&apos;application de la poudre et la cuisson au four. Le devis
                est gratuit et vous parvient sous 24 heures.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/devis" className="btn-primary">
                  Devis gratuit sous 24 h
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-night/15 px-6 py-3 text-sm font-semibold text-brand-night transition-colors hover:bg-brand-cream"
                >
                  {SITE.phone}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Grille tarifaire ─────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Grille tarifaire"
              labelIcon={<FileText className="h-3 w-3" />}
              title={
                <>
                  Le tarif, par{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    type de pièce.
                  </span>
                </>
              }
              description="Fourchettes indicatives TTC, sablage et cuisson compris. Le devis reste établi pièce par pièce."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-14 overflow-x-auto rounded-2xl border border-brand-night/10">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">
                  Tarifs indicatifs du thermolaquage par type de pièce chez AZ
                  Époxy
                </caption>
                <thead>
                  <tr className="bg-brand-cream">
                    <th scope="col" className="px-6 py-4 text-sm font-semibold text-brand-night">
                      Type de pièce
                    </th>
                    <th scope="col" className="px-6 py-4 text-sm font-semibold text-brand-night">
                      Tarif indicatif
                    </th>
                    <th scope="col" className="px-6 py-4 text-sm font-semibold text-brand-night">
                      Ce qui est compris
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PIECE_TYPES.map((piece) => (
                    <tr
                      key={piece.slug}
                      className="border-t border-brand-night/8 align-top"
                    >
                      <th
                        scope="row"
                        className="px-6 py-5 text-left font-display text-base font-semibold text-brand-night"
                      >
                        <span className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange">
                            {PIECE_ICONS[piece.slug] ?? <Euro className="h-5 w-5" />}
                          </span>
                          {piece.label}
                        </span>
                      </th>
                      <td className="px-6 py-5 text-sm text-brand-charcoal/85">
                        {piece.sizes ? (
                          <ul className="space-y-1">
                            {piece.sizes.map((s) => (
                              <li key={s.label}>
                                <span className="font-semibold text-brand-night">
                                  {s.range.min} – {s.range.max} €
                                </span>{" "}
                                <span className="text-brand-charcoal/60">
                                  / {piece.unit} ({s.label})
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <>
                            <span className="font-semibold text-brand-night">
                              {piece.baseRange!.min} – {piece.baseRange!.max} €
                            </span>{" "}
                            <span className="text-brand-charcoal/60">
                              / {piece.unit}
                            </span>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-5 text-sm leading-relaxed text-brand-charcoal/70">
                        {PIECE_NOTES[piece.slug]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="mt-6 text-sm text-brand-charcoal/60">
              Le décapage d&apos;une pièce déjà peinte ou corrodée et
              l&apos;application d&apos;un {OPTIONS.primaire.label.toLowerCase()}{" "}
              se facturent en supplément (environ{" "}
              {Math.round((OPTIONS.primaire.multiplier - 1) * 100)} %). Nous ne
              facturons pas au kilo : le thermolaquage se compte à la surface
              traitée, pas au poids de la pièce.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Exemples chiffrés ────────────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Trois cas concrets"
              labelIcon={<Euro className="h-3 w-3" />}
              title={
                <>
                  Ce que ça donne{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    en vrai.
                  </span>
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {EXEMPLES.map((ex, i) => (
              <ScrollReveal key={ex.titre} delay={0.1 + i * 0.05}>
                <div className="h-full rounded-2xl bg-white p-8 shadow-md">
                  <p className="font-display text-lg font-semibold text-brand-night">
                    {ex.titre}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/70">
                    {ex.detail}
                  </p>
                  <p className="mt-6 text-xs uppercase tracking-[0.14em] text-brand-charcoal/50">
                    {ex.calcul}
                  </p>
                  <p className="mt-1 heading-display text-2xl text-brand-night">
                    {ex.total}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce qui fait varier le prix ───────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Les variables"
              labelIcon={<Layers className="h-3 w-3" />}
              title={
                <>
                  Quatre choses font bouger{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    la facture.
                  </span>
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {VARIABLES.map((v, i) => (
              <ScrollReveal key={v.title} delay={0.1 + i * 0.05}>
                <FeatureCard
                  icon={v.icon}
                  title={v.title}
                  description={v.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ tarifs ───────────────────────────────────────────────── */}
      {faqsTarifs.length > 0 && (
        <section className="bg-brand-cream py-24">
          <div className="container-wide">
            <ScrollReveal>
              <SectionHeader
                label="Questions sur les tarifs"
                labelIcon={<Clock className="h-3 w-3" />}
                title={
                  <>
                    Ce qu&apos;on nous demande{" "}
                    <span className="bg-gradient-ember bg-clip-text text-transparent">
                      le plus souvent.
                    </span>
                  </>
                }
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="mx-auto mt-14 max-w-3xl">
                <FAQAccordion items={faqsTarifs} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <CtaBand
        title="Envoyez-nous des photos, on vous chiffre."
        description="Devis gratuit et sans engagement, réponse sous 24 heures ouvrées."
        primaryHref="/devis"
        primaryLabel="Demander un devis"
      />
    </>
  );
}
