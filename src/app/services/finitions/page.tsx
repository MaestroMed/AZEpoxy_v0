import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Paintbrush,
  Palette,
  Eye,
  Sun,
  Layers,
  ShieldCheck,
  Droplets,
  ArrowRight,
} from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaBand } from "@/components/ui/cta-band";
import { getServiceBySlug } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Finitions Spéciales",
  description:
    "Finitions thermolaquage spéciales : mat, satiné, brillant, texturé, moucheté, anti-graffiti. Collections premium Adaptacolor : Patina, Polaris, Dichroic, Sfera. AZ Époxy, Bruyères-sur-Oise.",
};

/* Finish types for the gallery */
const FINISH_TYPES = [
  {
    name: "Mat",
    gloss: "< 10 gloss",
    description:
      "Aspect velouté et contemporain, sans aucun reflet. Le mat profond est idéal pour le mobilier design, les luminaires et les éléments architecturaux minimalistes. Excellente capacité à masquer les micro-imperfections de surface.",
    bg: "bg-brand-night",
    textColor: "text-white",
    labelColor: "text-white/60",
    icon: <Eye className="h-6 w-6 text-white/40" />,
  },
  {
    name: "Satiné",
    gloss: "30 – 50 gloss",
    description:
      "Le juste milieu entre mat et brillant. Le satiné offre un reflet doux et élégant, très prisé pour les portails, garde-corps et menuiseries métalliques. Facile à entretenir, il ne retient pas les traces de doigts.",
    bg: "bg-gradient-to-br from-slate-400 to-slate-600",
    textColor: "text-white",
    labelColor: "text-white/60",
    icon: <Sun className="h-6 w-6 text-white/40" />,
  },
  {
    name: "Brillant",
    gloss: "> 85 gloss",
    description:
      "Finition miroir à haute brillance pour un impact visuel maximal. Idéal pour les jantes, les pièces moto, le mobilier premium et les éléments de signalétique. La brillance renforce la profondeur de la teinte RAL.",
    bg: "bg-gradient-to-br from-brand-orange to-amber-500",
    textColor: "text-white",
    labelColor: "text-white/70",
    icon: <Sparkles className="h-6 w-6 text-white/40" />,
  },
  {
    name: "Texturé",
    gloss: "Grain fin",
    description:
      "Texture « cuir » ou « sable » qui apporte du relief tactile et masque les petites imperfections. Particulièrement utilisé pour le mobilier urbain, les coffrets électriques et les éléments de façade soumis à un usage intensif.",
    bg: "bg-gradient-to-br from-stone-500 to-stone-700",
    textColor: "text-white",
    labelColor: "text-white/60",
    icon: <Layers className="h-6 w-6 text-white/40" />,
  },
  {
    name: "Moucheté",
    gloss: "Multi-tons",
    description:
      "Superposition de micro-particules de couleurs contrastées pour un effet granite ou pierre naturelle. Esthétique et ultra-résistant à l'usure, le moucheté est le choix de prédilection des espaces publics et commerciaux.",
    bg: "bg-gradient-to-br from-zinc-600 via-stone-500 to-zinc-700",
    textColor: "text-white",
    labelColor: "text-white/60",
    icon: <Droplets className="h-6 w-6 text-white/40" />,
  },
  {
    name: "Anti-graffiti",
    gloss: "Transparent",
    description:
      "Surcouche protectrice invisible qui empêche la pénétration des peintures et marqueurs. Le nettoyage s'effectue simplement à l'eau chaude, sans solvant agressif. Peut être appliqué sur toute finition thermolaquée.",
    bg: "bg-gradient-to-br from-sky-500 to-indigo-600",
    textColor: "text-white",
    labelColor: "text-white/70",
    icon: <ShieldCheck className="h-6 w-6 text-white/40" />,
  },
];

/* Premium collections */
const PREMIUM_COLLECTIONS = [
  {
    slug: "patina",
    label: "Patina",
    tagline: "Effets corten & oxyde",
    description:
      "Reproduisez l'aspect authentique de l'acier corten, de la rouille stabilisée et des patines naturelles — sans la corrosion réelle.",
    gradient: "from-amber-800 via-orange-700 to-red-900",
  },
  {
    slug: "polaris",
    label: "Polaris",
    tagline: "Métalliques structurés",
    description:
      "Finitions métallisées haut de gamme avec des reflets structurés : chrome satiné, bronze antique, anthracite perlé.",
    gradient: "from-slate-500 via-zinc-400 to-slate-700",
  },
  {
    slug: "dichroic",
    label: "Dichroic",
    tagline: "Reflets irisés",
    description:
      "Poudres à effet dichroïque qui changent de couleur selon l'angle de vue. Un rendu spectaculaire pour les projets signature.",
    gradient: "from-fuchsia-500 via-cyan-400 to-indigo-600",
  },
  {
    slug: "sfera",
    label: "Sfera",
    tagline: "Cosmos anodisé",
    description:
      "Teintes profondes inspirées du cosmos, avec un effet anodisé lisse et velouté. Parfait pour le luxe, l'automobile et l'architecture.",
    gradient: "from-amber-500 via-rose-500 to-purple-900",
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Finitions Spéciales",
  description:
    "Finitions thermolaquage spéciales : mat, satiné, brillant, texturé, moucheté, anti-graffiti. Collections premium Adaptacolor : Patina, Polaris, Dichroic, Sfera. AZ Époxy, Bruyères-sur-Oise.",
  provider: {
    "@type": "LocalBusiness",
    name: "AZ Époxy",
    telephone: "+33971357496",
    address: {
      "@type": "PostalAddress",
      streetAddress: "23 Chemin du Bac des Aubins",
      addressLocality: "Bruyères-sur-Oise",
      postalCode: "95820",
      addressCountry: "FR",
    },
  },
  areaServed: "Île-de-France",
  serviceType: "Finitions Spéciales",
};

export default function FinitionsPage() {
  const service = getServiceBySlug("finitions")!;

  return (
    <>
      {/* ── Service Schema ───────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <PageHero
        label="Finitions"
        title={
          <>
            Finitions{" "}
            <span className="bg-gradient-ember bg-clip-text text-transparent">
              Spéciales
            </span>
          </>
        }
        description="Au-delà du RAL standard : effets mat profond, satiné velouté, brillant miroir, texturé, moucheté granite et traitement anti-graffiti. Sublimez vos pièces avec des finitions uniques."
        variant="night"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Finitions" },
        ]}
      />

      {/* ── Section 2 — Finish Types Gallery ─────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Types de finitions"
              labelIcon={<Paintbrush className="h-3 w-3" />}
              title={
                <>
                  6 finitions.{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    Infinies possibilités.
                  </span>
                </>
              }
              description="Chaque finition apporte un caractère unique à vos réalisations. Contrôlez la brillance, la texture et les propriétés fonctionnelles de votre revêtement."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FINISH_TYPES.map((finish, index) => (
              <ScrollReveal key={finish.name} delay={index * 0.08}>
                <div className="group overflow-hidden rounded-2xl transition-all hover:shadow-lg">
                  {/* Colored header */}
                  <div
                    className={`relative flex h-44 items-center justify-center ${finish.bg}`}
                  >
                    <div className="absolute inset-0 bg-noise opacity-15 mix-blend-overlay" />
                    <div className="relative text-center">
                      {finish.icon}
                      <p
                        className={`mt-2 text-xs font-semibold uppercase tracking-[0.2em] ${finish.labelColor}`}
                      >
                        {finish.gloss}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-white p-6">
                    <h3 className="heading-display text-xl text-brand-night">
                      {finish.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
                      {finish.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 — Premium Collections (night) ──────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              centered
              label="Collections premium"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={
                <>
                  4 collections{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    Adaptacolor.
                  </span>
                </>
              }
              description="En partenariat avec Adaptacolor, nous proposons des gammes de poudres exclusives qui transcendent le nuancier RAL classique."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PREMIUM_COLLECTIONS.map((collection, index) => (
              <ScrollReveal key={collection.slug} delay={index * 0.1}>
                <Link
                  href={`/couleurs-ral/${collection.slug}`}
                  className="group relative block h-72 overflow-hidden rounded-2xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} transition-transform duration-500 group-hover:scale-110`}
                  />
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="relative flex h-full flex-col justify-end p-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                      Collection
                    </p>
                    <p className="heading-display text-3xl">
                      {collection.label}
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {collection.tagline}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-white/50">
                      {collection.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors group-hover:text-white">
                      Découvrir
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Custom Color Matching ────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Sur mesure"
              labelIcon={<Palette className="h-3 w-3" />}
              title={
                <>
                  Correspondance couleur{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    sur mesure.
                  </span>
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal delay={0.1}>
              <div className="space-y-6 text-brand-charcoal/80 leading-relaxed">
                <p>
                  Votre projet nécessite une teinte qui ne figure pas dans le
                  nuancier RAL Classic ? Nous proposons un service de
                  correspondance couleur sur mesure à partir des principaux
                  référentiels internationaux : <strong>RAL Classic</strong>,{" "}
                  <strong>RAL Design</strong>, <strong>NCS</strong>,{" "}
                  <strong>Pantone</strong> et <strong>BS</strong>.
                </p>
                <p>
                  Envoyez-nous un échantillon physique, une référence de
                  nuancier ou même une photo, et notre partenaire poudrier
                  formulera une poudre thermodurcissable à la teinte exacte. Le
                  processus inclut la fabrication d&apos;une plaquette
                  d&apos;échantillon pour validation visuelle avant la
                  production en série.
                </p>
                <p>
                  Pour les projets architecturaux et de design d&apos;intérieur,
                  nous réalisons également des développements colorimétriques
                  exclusifs : dégradés multi-couches, effets bicolores,
                  patines personnalisées et reproductions d&apos;aspects
                  naturels (bois, pierre, corten). Chaque formulation est
                  archivée pour une reproductibilité parfaite en cas de commande
                  complémentaire.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "RAL Classic",
                    count: "213 teintes",
                    bg: "bg-brand-night",
                  },
                  {
                    label: "RAL Design",
                    count: "1 825 teintes",
                    bg: "bg-gradient-to-br from-brand-orange to-amber-500",
                  },
                  {
                    label: "NCS",
                    count: "1 950 teintes",
                    bg: "bg-gradient-to-br from-slate-600 to-slate-800",
                  },
                  {
                    label: "Pantone",
                    count: "2 390 teintes",
                    bg: "bg-gradient-to-br from-fuchsia-500 to-purple-700",
                  },
                ].map((system) => (
                  <div
                    key={system.label}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl ${system.bg} text-white`}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-noise opacity-10 mix-blend-overlay" />
                    <div className="relative text-center">
                      <p className="heading-display text-2xl">
                        {system.count}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                        {system.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 5 — FAQs ─────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-tight">
          <ScrollReveal>
            <SectionHeader
              centered
              label="FAQ"
              title="Questions fréquentes"
              description="Tout ce que vous devez savoir sur nos finitions spéciales et collections premium."
            />
          </ScrollReveal>

          <div className="mt-14">
            <ScrollReveal delay={0.1}>
              <FAQAccordion items={service.faqs} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 6 — CTA ──────────────────────────────────────────── */}
      <CtaBand
        title="Envie d'une finition unique ?"
        description="Mat, brillant, texturé, moucheté ou couleur sur mesure — décrivez votre projet et recevez un devis gratuit sous 24h."
        primaryHref="/devis"
        primaryLabel="Demander un devis gratuit"
      />
    </>
  );
}
