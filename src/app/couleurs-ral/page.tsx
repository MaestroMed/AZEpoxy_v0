import { ChevronRight, Palette, Sparkles } from "lucide-react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/ui/section-header";
import { CtaBand } from "@/components/ui/cta-band";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { POPULAR_RAL } from "@/lib/ral-colors";
import { getRalEditorial } from "@/lib/ral-editorial";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { RalPickerSection } from "./ral-picker-section";
import { CouleursRalSwarmBinding } from "@/components/nuee/couleurs-ral-binding";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";

export const metadata = buildMetadata({
  title: "Nuancier RAL — 200+ Couleurs",
  description:
    "Plus de 200 teintes RAL Classic et 4 collections premium Adaptacolor. Trouvez la couleur parfaite pour votre projet de thermolaquage.",
  path: "/couleurs-ral",
});

export default function CouleursRalPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-couleurs-ral"
        data={breadcrumbLd([{ label: "Couleurs RAL" }])}
      />
      {/* Swarm binding — active la phase RAL Cascade sur cette route. */}
      <CouleursRalSwarmBinding />

      {/* ── Section 1 — Hero (transparent, la cascade RAL perce) ───── */}
      <section className="relative min-h-[72vh] overflow-hidden text-white">
        {/* Light overlay — content readable, swarm still sings through.
            Desktop gets a left-biased gradient (text zone), mobile a
            uniform dim so the cascade stays visible behind the text. */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-night via-brand-night/55 to-brand-night/20 hidden md:block"
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-night/55 md:hidden" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-night/85 via-transparent to-transparent"
          aria-hidden
        />

        <div className="container-wide relative flex min-h-[72vh] flex-col justify-center pt-40 pb-20">
          {/* Breadcrumbs */}
          <nav
            aria-label="Fil d'Ariane"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
            <span aria-current="page" className="text-white/90">Couleurs RAL</span>
          </nav>

          <div className="max-w-4xl">
            <span className="section-label-light">
              <Palette className="h-3 w-3" />
              Couleurs
            </span>
            <h1 className="heading-display mt-6 text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-[clamp(4rem,8vw,7.5rem)]">
              Un nuancier{" "}
              <span className="block bg-gradient-ember bg-clip-text text-transparent">
                qui respire.
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-balance text-lg text-white/75 sm:text-xl">
              213 teintes RAL Classic et 4 collections premium Adaptacolor.
              Chaque particule que vous voyez derrière est une couleur possible —
              nous pouvons toutes les réaliser sur votre pièce.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2 — Interactive Picker ──────────────────────────── */}
      <RalPickerSection />

      {/* ── Section 3 — Popular Colors ──────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Tendances"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={
                <>
                  Les plus{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    demandées
                  </span>
                </>
              }
              description="Les teintes RAL les plus choisies par nos clients. Les plus iconiques ont droit à une ligne éditoriale — une couleur n'est jamais seulement une couleur, elle cite déjà quelque chose."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {POPULAR_RAL.map((color, i) => (
              <ScrollReveal key={color.code} delay={i * 0.05}>
                <ColorSwatch
                  code={color.code}
                  name={color.name}
                  hex={color.hex}
                  size="lg"
                  quote={getRalEditorial(color.code)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Collections Premium ─────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-gradient-night" />
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />

        <div className="container-wide relative">
          <ScrollReveal>
            <SectionHeader
              dark
              label="Premium"
              labelIcon={<Sparkles className="h-3 w-3" />}
              title={
                <>
                  Collections Signature{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    Adaptacolor
                  </span>
                </>
              }
              description="Au-dela du RAL Classic, 4 collections d'effets speciaux haut de gamme pour des projets d'exception."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                slug: "patina",
                label: "Patina",
                tagline: "Effets corten & oxyde",
                gradient: "from-amber-800 via-orange-700 to-red-900",
              },
              {
                slug: "polaris",
                label: "Polaris",
                tagline: "Metalliques structures",
                gradient: "from-slate-500 via-zinc-400 to-slate-700",
              },
              {
                slug: "dichroic",
                label: "Dichroic",
                tagline: "Reflets irises",
                gradient: "from-fuchsia-500 via-cyan-400 to-indigo-600",
              },
              {
                slug: "sfera",
                label: "Sfera",
                tagline: "Cosmos anodise",
                gradient: "from-amber-500 via-rose-500 to-purple-900",
              },
            ].map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 0.1}>
                <Link
                  href={`/couleurs-ral/${c.slug}`}
                  className="group relative block h-48 overflow-hidden rounded-2xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${c.gradient} transition-transform duration-500 group-hover:scale-110`}
                  />
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-6 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                      Collection
                    </p>
                    <p className="heading-display text-3xl">{c.label}</p>
                    <p className="mt-1 text-sm text-white/80">{c.tagline}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 — How to Choose ───────────────────────────────── */}
      <section className="bg-brand-cream py-24">
        <div className="container-wide">
          <ScrollReveal>
            <SectionHeader
              label="Guide"
              labelIcon={<Palette className="h-3 w-3" />}
              title={
                <>
                  Comment choisir{" "}
                  <span className="bg-gradient-ember bg-clip-text text-transparent">
                    votre teinte ?
                  </span>
                </>
              }
              description="Trois criteres essentiels pour un resultat parfait."
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Eclairage",
                description:
                  "La lumiere naturelle et artificielle affecte considerablement la perception des couleurs. Une teinte peut paraitre plus chaude sous un eclairage tungstene et plus froide en lumiere LED. Testez toujours avec un echantillon dans les conditions reelles du lieu.",
                icon: "sun",
              },
              {
                title: "Materiau support",
                description:
                  "L'aspect du metal de base influence le rendu final. L'aluminium, l'acier ou la fonte ne reagissent pas de la meme maniere. La preparation de surface (sablage, degraissage) joue aussi un role cle dans la fidelite de la teinte.",
                icon: "layers",
              },
              {
                title: "Finition",
                description:
                  "Mat, satine ou brillant : le choix de la finition change radicalement l'apparence d'une meme teinte RAL. Le brillant intensifie les couleurs, le mat les adoucit. Les textures ajoutent de la profondeur et masquent les imperfections.",
                icon: "sparkles",
              },
            ].map((tip, i) => (
              <ScrollReveal key={tip.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-brand-night/10 bg-white p-8 transition-all hover:shadow-lg">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                    {tip.icon === "sun" && (
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        />
                      </svg>
                    )}
                    {tip.icon === "layers" && (
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0l4.179 2.25L12 22.5 2.25 17.25l4.179-2.25"
                        />
                      </svg>
                    )}
                    {tip.icon === "sparkles" && (
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                    )}
                  </div>
                  <h3 className="heading-display text-xl text-brand-night">
                    {tip.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
                    {tip.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6 — CTA Band ────────────────────────────────────── */}
      <CtaBand
        title="Besoin d'aide pour choisir ?"
        description="Echantillons gratuits sur demande. Envoyez-nous votre reference RAL ou decrivez l'effet souhaite, nous preparons un echantillon test sur metal."
        primaryLabel="Demander un echantillon"
        primaryHref="/devis"
      />
    </>
  );
}
