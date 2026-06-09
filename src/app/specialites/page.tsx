import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bike,
  Car,
  CircleDot,
  Factory,
  Fence,
  SprayCan,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { getSpecialties } from "@/lib/specialites-data";

export const metadata = buildMetadata({
  title: "Nos Spécialités — Thermolaquage par type de pièce",
  description:
    "Jantes auto, moto, pièces auto, portail & ferronnerie, pièces métalliques, sablage & aérogommage : 6 spécialités thermolaquage traitées dans notre atelier de 1 800 m² à Bruyères-sur-Oise (95). Devis gratuit sous 24 h.",
  path: "/specialites",
});

/** Photographies des cartes spécialités — mêmes visuels que la home.
 * portail et sablage-aerogommage n'ont pas (encore) de photo de carte :
 * elles utilisent le fallback graphique ci-dessous. */
const SPECIALTY_IMAGES: Record<string, string> = {
  jantes: "/images/specialites/jantes.webp",
  moto: "/images/specialites/moto.webp",
  voiture: "/images/specialites/voiture.webp",
  pieces: "/images/specialites/pieces.webp",
};

/** Fallback élégant sans photo : fond nuit + grille industrielle + halo ember. */
const SPECIALTY_FALLBACK_BG: Record<string, string> = {
  portail: "bg-gradient-to-br from-brand-night via-brand-charcoal to-brand-night",
  "sablage-aerogommage":
    "bg-gradient-to-br from-brand-charcoal via-brand-night to-[#12121F]",
};

/** Icône lucide par slug (le champ `icon` des data est une string). */
const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
  jantes: <CircleDot className="h-10 w-10 text-brand-orange" />,
  moto: <Bike className="h-10 w-10 text-brand-orange" />,
  voiture: <Car className="h-10 w-10 text-brand-orange" />,
  pieces: <Factory className="h-10 w-10 text-brand-orange" />,
  portail: <Fence className="h-10 w-10 text-brand-orange" />,
  "sablage-aerogommage": <SprayCan className="h-10 w-10 text-brand-orange" />,
};

/** Description courte pour la carte — tronquée à la fin de mot. */
function shortDescription(text: string, max = 150): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export default async function SpecialitesIndexPage() {
  const specialties = await getSpecialties();

  return (
    <>
      <PageHero
        label="Spécialités"
        title={
          <>
            Nos{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Spécialités
            </span>
          </>
        }
        description="Jantes alliage, pièces moto, étriers et caches moteur, portails et ferronnerie, structures métalliques, décapage par sablage ou aérogommage : chaque type de pièce a ses contraintes — et sa page dédiée avec prix, délais et conseils."
        variant="transparent"
        image="/images/heros/specialites-jantes.webp"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Spécialités" },
        ]}
      />

      {/* ── Grille des 6 spécialités ─────────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="6 expertises"
              labelIcon={<Award className="h-3 w-3" />}
              title={
                <>
                  Chaque pièce{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    mérite l&apos;excellence.
                  </span>
                </>
              }
              description="Du jeu de jantes au portail coulissant grand format, notre atelier de 1 800 m² adapte préparation, poudre et cuisson à chaque famille de pièces. Choisissez votre spécialité pour les détails, tarifs et délais."
            />
          </ScrollReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((spec, i) => {
              const image = SPECIALTY_IMAGES[spec.slug];
              return (
                <ScrollReveal key={spec.slug} delay={0.08 * i}>
                  <Link
                    href={`/specialites/${spec.slug}`}
                    className="group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-2xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.25)]"
                  >
                    {image ? (
                      <>
                        <Image
                          src={image}
                          alt={spec.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                      </>
                    ) : (
                      <>
                        <div
                          className={`absolute inset-0 ${
                            SPECIALTY_FALLBACK_BG[spec.slug] ?? "bg-brand-night"
                          } transition-transform duration-700 group-hover:scale-105`}
                        />
                        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
                        <div
                          aria-hidden
                          className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-orange/20 blur-[90px]"
                        />
                        <div className="absolute left-6 top-6 transition-transform duration-500 group-hover:scale-110">
                          {SPECIALTY_ICONS[spec.slug]}
                        </div>
                      </>
                    )}

                    {/* Contenu */}
                    <div className="relative mt-auto flex flex-col p-6 text-white">
                      <h2 className="heading-display text-2xl">{spec.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {shortDescription(spec.description)}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                          À partir de {spec.priceFrom}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-orange transition-colors group-hover:text-white">
                          Découvrir
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bande de réassurance ─────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container-wide">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { value: "1 800 m²", label: "Atelier à Bruyères-sur-Oise" },
                { value: "7 × 3 × 4 m", label: "Cabine grande capacité" },
                { value: "RAL & NCS", label: "Nuancier complet + effets" },
                { value: "24h", label: "Devis gratuit" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="heading-display text-3xl text-brand-night sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-charcoal/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <CtaBand
        title="Votre pièce n'entre dans aucune case ?"
        description="Envoyez-nous quelques photos et les dimensions : on vous dit ce qui est faisable, à quel prix et sous quel délai — réponse sous 24 h."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
