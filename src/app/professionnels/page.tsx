import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Factory,
  HardHat,
  Wrench,
  Car,
  Hammer,
  FileText,
  Truck,
  Clock,
  Percent,
  ShieldCheck,
  Receipt,
  CalendarCheck,
  Users,
  Phone,
  Mail,
  Check,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { StatCounter } from "@/components/ui/stat-counter";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { ReviewsCarousel } from "@/components/ui/reviews-carousel";
import { SITE } from "@/lib/utils";
import { averageRating, getReviews } from "@/lib/reviews-data";

export const metadata = buildMetadata({
  title: "Professionnels — Partenariat B2B & Comptes Pros",
  description:
    "AZ Époxy accompagne métalliers, serruriers, architectes, bureaux d'études, industriels et carrossiers. Tarifs dégressifs, planning dédié, devis cadre, facturation mensuelle. Devis pro sous 24h.",
  path: "/professionnels",
});

const SEGMENTS = [
  {
    icon: <Hammer className="h-6 w-6" />,
    title: "Métalliers & Serruriers",
    description:
      "Garde-corps, portails, escaliers, verrières, structures soudées. Cadences hebdomadaires, grandes longueurs jusqu'à 7 mètres.",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Architectes & Bureaux d'études",
    description:
      "Conseil technique amont, fiches RAL détaillées, échantillons sur demande, suivi de chantier et conformité Qualicoat.",
  },
  {
    icon: <Factory className="h-6 w-6" />,
    title: "Industriels & Fabricants",
    description:
      "Séries moyennes à grandes, sous-traitance de finition, contrats cadres, délais tenus, qualité constante lot après lot.",
  },
  {
    icon: <HardHat className="h-6 w-6" />,
    title: "Constructeurs & Promoteurs",
    description:
      "Menuiseries aluminium, ferronnerie de bâtiment, mobilier urbain. Intervention sur chantier possible pour pièces non démontables.",
  },
  {
    icon: <Car className="h-6 w-6" />,
    title: "Carrossiers & Préparateurs",
    description:
      "Jantes, pièces carrosserie, accessoires moto. Collections premium (Patina, Polaris, Dichroic, Sfera) et finitions textures.",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "Mobilier & Agencement",
    description:
      "Mobilier design, agencement commercial, signalétique. Finitions mates, satinées, métallisées, effets texturés et sablés.",
  },
];

const ADVANTAGES = [
  {
    icon: <Percent className="h-6 w-6" />,
    title: "Tarifs dégressifs",
    description:
      "Grille tarifaire B2B avec remises sur volumes, conditions privilégiées pour comptes récurrents et forfaits séries.",
  },
  {
    icon: <CalendarCheck className="h-6 w-6" />,
    title: "Planning dédié",
    description:
      "Créneaux réservés, délais contractuels, priorité en cabine pour partenaires. Express 48h disponible.",
  },
  {
    icon: <Receipt className="h-6 w-6" />,
    title: "Facturation mensuelle",
    description:
      "Compte client ouvert, facturation groupée en fin de mois, règlement 30 jours net. Devis cadre annuel possible.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Devis cadre",
    description:
      "Grille tarifaire négociée sur l'année, remise automatique à chaque commande, process simplifié sans re-devis.",
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Enlèvement & livraison",
    description:
      "Service de collecte et restitution sur site en Île-de-France. Conditionnement soigné, transport sécurisé.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Garantie qualité",
    description:
      "Procédure en 6 étapes conforme Qualicoat, poudres certifiées (Interpon, IGP, AkzoNobel), contrôle d'épaisseur systématique.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Prise de contact",
    description:
      "Échange sur votre activité, vos volumes, vos contraintes de planning. Visite d'atelier possible pour qualifier le partenariat.",
  },
  {
    step: "02",
    title: "Devis cadre",
    description:
      "Grille tarifaire personnalisée selon typologie de pièces, volumes annuels estimés, finitions et exigences qualité.",
  },
  {
    step: "03",
    title: "Ouverture de compte",
    description:
      "Dossier administratif (KBIS, RIB, attestations), validation des conditions de paiement, compte client actif sous 5 jours ouvrés.",
  },
  {
    step: "04",
    title: "Production régulière",
    description:
      "Commandes par bon simplifié, créneaux réservés, enlèvements groupés, factures mensuelles, reporting qualité sur demande.",
  },
];

const CAPACITIES = [
  "Cabine thermolaquage 7 m × 2,5 m × 2,5 m",
  "Four de polymérisation jusqu'à 220 °C",
  "Sableuse industrielle grande capacité",
  "Pont roulant 3 tonnes",
  "Accès complet RAL 213 couleurs",
  "Collections Qualicoat, Interpon, IGP",
  "Finitions texturées, sablées, métallisées",
  "Service express 48h sur demande",
  "Traitement anti-corrosion C5 disponible",
  "Zone de contrôle qualité dédiée",
];

export default async function ProfessionnelsPage() {
  const reviews = await getReviews();
  const reviewsAvg = averageRating(reviews);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <PageHero
        label="Espace Pro"
        title={
          <>
            Votre partenaire{" "}
            <span className="block bg-gradient-ember bg-clip-text text-transparent">
              thermolaquage
            </span>
          </>
        }
        description="AZ Époxy accompagne les professionnels de la métallerie, de l'architecture, de l'industrie et de la carrosserie avec des conditions dédiées : tarifs dégressifs, planning réservé, facturation mensuelle et qualité constante."
        variant="transparent"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Professionnels" },
        ]}
      >
        <div className="flex flex-wrap gap-4">
          <Link
            href="/devis"
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-4 font-semibold text-white shadow-xl shadow-brand-orange/30 transition-all hover:bg-brand-orange-dark hover:-translate-y-0.5"
          >
            Ouvrir un compte pro
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
        </div>
      </PageHero>

      {/* ── Segments ─────────────────────────────────────── */}
      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Qui nous accompagnons"
              labelIcon={<Users className="h-3 w-3" />}
              title={
                <>
                  Une offre pensée pour les{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    professionnels
                  </span>
                </>
              }
              description="De la métallerie artisanale au fabricant industriel, nous adaptons nos processus, nos délais et nos tarifs à votre activité."
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SEGMENTS.map((segment, i) => (
              <ScrollReveal key={segment.title} delay={0.1 + i * 0.05}>
                <FeatureCard
                  icon={segment.icon}
                  title={segment.title}
                  description={segment.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Capacités"
              title={
                <>
                  Un outil industriel{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    dimensionné
                  </span>
                </>
              }
              description="1 800 m² d'atelier, une cabine de 7 mètres, un four professionnel et une équipe formée aux exigences les plus strictes."
              dark
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            <ScrollReveal delay={0.1}>
              <StatCounter value="1800" label="m² d'atelier" dark />
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <StatCounter value="7" label="m en cabine" dark />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <StatCounter value="2000+" label="projets / an" dark />
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
              <StatCounter value="48" label="h en express" dark />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Advantages ──────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Avantages partenaires"
              labelIcon={<Percent className="h-3 w-3" />}
              title={
                <>
                  Des conditions{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    dédiées
                  </span>
                </>
              }
              description="Tarifs, délais, facturation, logistique — nous structurons la relation B2B pour fluidifier votre production."
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADVANTAGES.map((advantage, i) => (
              <ScrollReveal key={advantage.title} delay={0.1 + i * 0.05}>
                <FeatureCard
                  icon={advantage.icon}
                  title={advantage.title}
                  description={advantage.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ─────────────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Onboarding"
              labelIcon={<Clock className="h-3 w-3" />}
              title={
                <>
                  Devenir partenaire en{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    4 étapes
                  </span>
                </>
              }
              description="De la prise de contact à la production régulière, un processus simple et cadré."
              dark
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item, i) => (
              <ScrollReveal key={item.step} delay={0.1 + i * 0.1}>
                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-brand-orange/40 hover:bg-white/[0.04]">
                  <span className="heading-display block text-5xl text-brand-orange/80">
                    {item.step}
                  </span>
                  <h3 className="heading-display mt-4 text-xl text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capacities list ─────────────────────────────── */}
      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <SectionHeader
                label="Équipements"
                title={
                  <>
                    Une infrastructure{" "}
                    <span className="bg-gradient-ember bg-clip-text text-transparent">
                      complète
                    </span>
                  </>
                }
                description="Tout est concentré sur un seul site, de la préparation de surface au contrôle final."
              />
              <p className="mt-6 text-brand-charcoal/70 leading-relaxed">
                Nous maîtrisons l&apos;intégralité de la chaîne : dégraissage,
                sablage, accrochage, application poudre, polymérisation four,
                contrôle d&apos;épaisseur et emballage. Pas de sous-traitance,
                pas d&apos;intermédiaire — une seule responsabilité qualité.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Voir tous nos services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/realisations"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Nos réalisations
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {CAPACITIES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-brand-night/10 bg-white p-4 shadow-sm"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/15">
                      <Check className="h-3.5 w-3.5 text-brand-orange" />
                    </div>
                    <span className="text-sm font-medium text-brand-night">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Reviews (only when synced from Sanity) ─────── */}
      {reviews.length > 0 && (
        <section className="bg-white py-24">
          <div className="container-wide">
            <ScrollReveal>
              <SectionHeader
                label="Avis clients"
                title={
                  <>
                    Ils nous font{" "}
                    <span className="bg-gradient-ember bg-clip-text text-transparent">
                      confiance
                    </span>
                  </>
                }
                description="Des retours authentiques de métalliers, architectes et industriels qui travaillent avec nous."
                centered
              />
            </ScrollReveal>
            <div className="mt-16">
              <ReviewsCarousel reviews={reviews} average={reviewsAvg} />
            </div>
          </div>
        </section>
      )}

      {/* ── Contact Pro ─────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl rounded-2xl border border-brand-night/10 bg-white p-8 shadow-sm md:p-12">
              <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
                <div>
                  <span className="section-label inline-block">
                    Contact direct
                  </span>
                  <h3 className="heading-display mt-4 text-3xl text-brand-night">
                    Parlons de votre activité
                  </h3>
                  <p className="mt-4 text-brand-charcoal/70 leading-relaxed">
                    Notre équipe commerciale revient vers vous sous 24 heures
                    ouvrées pour comprendre vos volumes, vos exigences qualité
                    et construire une grille tarifaire adaptée.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 text-sm">
                    <a
                      href={SITE.phoneHref}
                      className="inline-flex items-center gap-3 font-semibold text-brand-night transition-colors hover:text-brand-orange"
                    >
                      <Phone className="h-4 w-4 text-brand-orange" />
                      {SITE.phone}
                    </a>
                    <a
                      href={SITE.emailHref}
                      className="inline-flex items-center gap-3 font-semibold text-brand-night transition-colors hover:text-brand-orange"
                    >
                      <Mail className="h-4 w-4 text-brand-orange" />
                      {SITE.email}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/devis"
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    Demander un devis pro
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <CtaBand
        title="Un volume récurrent à thermolaquer ?"
        description="Ouvrez un compte pro et bénéficiez de tarifs dégressifs, créneaux réservés et facturation mensuelle."
        primaryHref="/devis"
        primaryLabel="Ouvrir un compte pro"
      />
    </>
  );
}
