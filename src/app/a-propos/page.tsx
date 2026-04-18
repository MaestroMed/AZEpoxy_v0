import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { StatCounter } from "@/components/ui/stat-counter";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MouseTilt } from "@/components/nuee/mouse-tilt";
import { getTestimonials } from "@/lib/testimonials-data";
import {
  ShieldCheck,
  Leaf,
  Zap,
  Award,
  Check,
  ExternalLink,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "À Propos",
  description:
    "Découvrez AZ Époxy, spécialiste du thermolaquage et du traitement de surface à Bruyères-sur-Oise. 1 800 m² d'atelier, 15+ ans d'expérience.",
  path: "/a-propos",
});

const EQUIPMENT = [
  "Cabine de thermolaquage 7 mètres",
  "Four de cuisson professionnel",
  "Sableuse industrielle",
  "Pistolet électrostatique haute précision",
  "Pont roulant 3 tonnes",
  "Zone de contrôle qualité",
];

export default async function AProposPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <PageHero
        label="Entreprise"
        title={
          <>
            L&apos;excellence{" "}
            <span className="block bg-gradient-ember bg-clip-text text-transparent">
              industrielle
            </span>
          </>
        }
        description="Depuis notre atelier de 1 800 m² à Bruyères-sur-Oise, nous apportons une finition premium à chaque pièce."
        variant="transparent"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "À propos" },
        ]}
      />

      {/* ── Story ──────────────────────────────────────────── */}
      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <SectionHeader
                label="Qui sommes-nous"
                title={
                  <>
                    Notre{" "}
                    <span className="bg-gradient-ember bg-clip-text text-transparent">
                      Histoire
                    </span>
                  </>
                }
                description="Une expertise forgée dans l'exigence industrielle."
              />
              <div className="mt-8 space-y-5 text-brand-charcoal/80 leading-relaxed">
                <p>
                  AZ Époxy est née comme la division revêtement d&apos;AZ
                  Construction, notre maison mère spécialisée en métallerie et
                  serrurerie. Face à la demande croissante de finitions de qualité
                  supérieure, nous avons fait le choix de créer une entité dédiée,
                  entièrement consacrée au thermolaquage et au traitement de surface
                  des métaux.
                </p>
                <p>
                  Au fil des années, nous avons investi dans un atelier de pointe,
                  équipé des technologies les plus récentes en matière
                  d&apos;application de poudre électrostatique. Notre équipe
                  s&apos;est formée aux exigences les plus strictes de
                  l&apos;industrie, du bâtiment et de la décoration, pour offrir une
                  prestation irréprochable à chaque projet.
                </p>
                <p>
                  Aujourd&apos;hui, AZ Époxy dispose d&apos;un atelier de 1 800 m²,
                  d&apos;une cabine de thermolaquage de 7 mètres, d&apos;un accès
                  complet à la gamme RAL ainsi qu&apos;aux collections premium
                  (Qualicoat, Interpon, IGP), et d&apos;un service express 48h pour
                  les urgences. Nous traitons plus de 2 000 projets par an, pour des
                  professionnels et des particuliers exigeants.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-night via-brand-night to-brand-charcoal p-10 flex flex-col justify-end">
                <div aria-hidden className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
                <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 select-none font-display text-[11rem] leading-[0.85] font-black tracking-tighter text-white/[0.055]">
                  1800
                </div>
                <div aria-hidden className="absolute -left-16 top-1/3 h-64 w-64 rounded-full bg-brand-orange/25 blur-[120px]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">
                    Notre atelier
                  </span>
                  <p className="mt-5 font-display text-3xl font-black leading-[1.1] text-white">
                    1 800 m² dédiés{" "}
                    <span className="block bg-gradient-ember bg-clip-text text-transparent">
                      à votre pièce.
                    </span>
                  </p>
                  <p className="mt-5 text-sm text-white/55">
                    Cabine 7 m · Four pro 200°C · Sableuse · Pont 3 t · 2 000 projets/an.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCounter value="1800" label="m² d'atelier" dark />
              <StatCounter value="200+" label="couleurs RAL" dark />
              <StatCounter value="15+" label="années d'expérience" dark />
              <StatCounter value="2000+" label="projets par an" dark />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────── */}
      <section className="bg-brand-cream bg-industrial-grid py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="ADN"
              title={
                <>
                  Nos{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    Valeurs
                  </span>
                </>
              }
              description="Les principes qui guident chaque projet, chaque finition, chaque interaction."
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <MouseTilt intensity={6} hoverScale={1.01}>
                <FeatureCard
                  icon={<ShieldCheck className="h-6 w-6" />}
                  title="Qualité sans compromis"
                  description="Chaque pièce passe par un processus en 6 étapes — du dégraissage au contrôle final — conforme aux normes ISO les plus exigeantes."
                />
              </MouseTilt>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <MouseTilt intensity={6} hoverScale={1.01}>
                <FeatureCard
                  icon={<Leaf className="h-6 w-6" />}
                  title="Engagement écologique"
                  description="0 COV, poudre 100 % recyclable, zéro solvant. Le thermolaquage est le procédé de finition le plus respectueux de l'environnement."
                />
              </MouseTilt>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <MouseTilt intensity={6} hoverScale={1.01}>
                <FeatureCard
                  icon={<Zap className="h-6 w-6" />}
                  title="Réactivité"
                  description="Service express 48h disponible, devis envoyé sous 24 heures. Nous nous adaptons à vos contraintes de planning."
                />
              </MouseTilt>
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
              <MouseTilt intensity={6} hoverScale={1.01}>
                <FeatureCard
                  icon={<Award className="h-6 w-6" />}
                  title="Savoir-faire"
                  description="Plus de 15 ans d'expertise industrielle, des finitions premium (texturé, sablé, métallisé) et un conseil personnalisé."
                />
              </MouseTilt>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Workshop ───────────────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Équipements"
              title={
                <>
                  Notre{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    Atelier
                  </span>
                </>
              }
              description="Un outil de production dimensionné pour les projets les plus ambitieux."
              dark
            />
          </ScrollReveal>

          <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-brand-charcoal p-10 flex flex-col justify-between">
                <div aria-hidden className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
                <div aria-hidden className="pointer-events-none absolute -right-8 -bottom-10 select-none font-display text-[14rem] leading-[0.8] font-black tracking-tighter text-white/[0.045]">
                  7m
                </div>
                <div aria-hidden className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-orange/15 blur-[100px]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">
                    Cabine principale
                  </span>
                  <p className="mt-5 font-display text-2xl sm:text-3xl font-black leading-[1.1] text-white">
                    Thermolaquage{" "}
                    <span className="block bg-gradient-ember bg-clip-text text-transparent">
                      7 mètres.
                    </span>
                  </p>
                </div>
                <div className="relative flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  <span><span className="mr-2 font-display text-xl font-black text-brand-orange">200°C</span>cuisson</span>
                  <span><span className="mr-2 font-display text-xl font-black text-brand-orange">3 t</span>pont roulant</span>
                  <span><span className="mr-2 font-display text-xl font-black text-brand-orange">15&apos;</span>polymérisation</span>
                </div>
              </div>
            </ScrollReveal>

            <ul className="space-y-4">
              {EQUIPMENT.map((item, i) => (
                <ScrollReveal key={item} delay={0.2 + i * 0.08} variant="slide" direction="left">
                  <li className="group flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 transition-transform duration-300 group-hover:scale-110">
                      <Check className="h-3.5 w-3.5 text-brand-orange transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-white/80 text-lg transition-colors duration-300 group-hover:text-white">
                      {item}
                    </span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── AZ Construction ────────────────────────────────── */}
      <section className="bg-brand-cream py-16">
        <div className="container-wide">
          <ScrollReveal>
            <div className="rounded-2xl border border-brand-night/10 bg-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-1">
                <span className="section-label mb-3 inline-block">
                  Groupe AZ
                </span>
                <h3 className="heading-display text-2xl text-brand-night mb-3">
                  AZ Construction — Métallerie &amp; Serrurerie
                </h3>
                <p className="text-brand-charcoal/70 leading-relaxed max-w-xl">
                  Notre maison mère, AZ Construction, est spécialisée en
                  métallerie, serrurerie et construction métallique. Garde-corps,
                  escaliers, portails, structures sur mesure — découvrez
                  l&apos;ensemble de nos savoir-faire.
                </p>
              </div>
              <a
                href="https://azconstruction.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 shrink-0"
              >
                Visiter azconstruction.fr
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="bg-gradient-night bg-noise py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Témoignages"
              title={
                <>
                  Ce que disent{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    nos clients
                  </span>
                </>
              }
              description="La satisfaction de nos clients est notre meilleure référence."
              dark
              centered
            />
          </ScrollReveal>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, i) => (
              <ScrollReveal key={t.name} delay={0.1 + i * 0.1}>
                <TestimonialCard
                  name={t.name}
                  company={t.company}
                  quote={t.quote}
                  rating={t.rating}
                  dark
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <CtaBand
        title="Prêt à travailler avec nous ?"
        description="Demandez un devis gratuit et découvrez la qualité AZ Époxy."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
