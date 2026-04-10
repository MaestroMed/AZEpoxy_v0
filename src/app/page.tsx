import Link from "next/link";
import { ArrowRight, Flame, Palette, Phone, Sparkles, ShieldCheck } from "lucide-react";
import { POPULAR_RAL } from "@/lib/ral-colors";
import { SITE } from "@/lib/utils";

/**
 * NOTE: This is the homepage scaffold. The full 9-section immersive
 * homepage described in the brief is tracked in ULTRAPLAN.md. This
 * scaffold ships the hero, the RAL marquee, the stats band, and a CTA
 * footer — enough to validate the design system and let the rest of the
 * pages be built on top of a consistent look.
 */
export default function HomePage() {
  return (
    <>
      {/* ── Section 1 — Hero ─────────────────────────────────────────── */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-brand-night text-white">
        {/* Background: gradient night + ember glow + grid */}
        <div className="absolute inset-0 bg-gradient-night" />
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
        <div className="absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-brand-orange/25 blur-[140px]" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-brand-orange/15 blur-[120px]" />

        {/* Subtle heat shimmer overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-orange/10 via-transparent to-transparent" />

        <div className="container-wide relative flex min-h-[100svh] flex-col justify-center pt-32 pb-20">
          <div className="max-w-4xl">
            <span className="section-label-light">
              <Flame className="h-3 w-3" />
              Thermolaquage poudre époxy · Île-de-France
            </span>

            <h1 className="heading-display mt-6 text-balance text-5xl leading-[0.95] sm:text-6xl lg:text-[clamp(3.5rem,7vw,7rem)]">
              200°C.
              <br />
              <span className="bg-gradient-ember bg-clip-text text-transparent">
                15 minutes.
              </span>
              <br />
              Une protection à vie.
            </h1>

            <p className="mt-8 max-w-2xl text-balance text-lg text-white/70 sm:text-xl">
              Finition premium par thermolaquage poudre époxy. 200+ couleurs
              RAL, cabine 7 mètres, service express 48h, 0 COV.
              Depuis notre atelier de 1 800 m² à Bruyères-sur-Oise.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/devis" className="btn-primary">
                Demander un devis gratuit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/couleurs-ral" className="btn-ghost-light">
                Voir nos 200+ couleurs
              </Link>
            </div>
          </div>

          {/* Stats overlay */}
          <div className="relative mt-20 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
            {[
              { value: "200+", label: "Couleurs RAL" },
              { value: "7m", label: "Cabine max" },
              { value: "48h", label: "Express" },
              { value: "0 COV", label: "Sans solvant" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="heading-display text-4xl text-white sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2 — RAL Marquee (placeholder for full picker) ────── */}
      <section className="relative overflow-hidden bg-brand-cream py-24">
        <div className="container-wide">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="section-label">
                <Palette className="h-3 w-3" />
                Nuancier RAL
              </span>
              <h2 className="heading-display mt-4 text-4xl text-brand-night sm:text-5xl">
                Plus de 200 teintes.
                <br />
                Et 4 collections signature.
              </h2>
              <p className="mt-4 max-w-xl text-brand-charcoal/70">
                Nuancier RAL Classic complet, plus les collections premium
                Adaptacolor : Patina (effets corten), Polaris (métalliques),
                Dichroic (reflets irisés) et Sfera (anodisés cosmos).
              </p>
            </div>
            <Link
              href="/couleurs-ral"
              className="inline-flex items-center gap-2 rounded-full border border-brand-night/15 bg-white px-6 py-3 text-sm font-semibold text-brand-night transition-all hover:border-brand-night hover:bg-brand-night hover:text-white"
            >
              Explorer le nuancier
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Marquee */}
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-marquee gap-3">
              {[...POPULAR_RAL, ...POPULAR_RAL, ...POPULAR_RAL].map(
                (color, i) => (
                  <div
                    key={`${color.code}-${i}`}
                    className="group relative flex h-32 w-56 flex-shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-5 shadow-lg transition-transform hover:-translate-y-1"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent"
                      aria-hidden
                    />
                    <div className="relative">
                      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-white/90">
                        {color.code}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {color.name}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Collections cards */}
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
                tagline: "Métalliques structurés",
                gradient: "from-slate-500 via-zinc-400 to-slate-700",
              },
              {
                slug: "dichroic",
                label: "Dichroic",
                tagline: "Reflets irisés",
                gradient: "from-fuchsia-500 via-cyan-400 to-indigo-600",
              },
              {
                slug: "sfera",
                label: "Sfera",
                tagline: "Cosmos anodisé",
                gradient: "from-amber-500 via-rose-500 to-purple-900",
              },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/couleurs-ral/${c.slug}`}
                className="group relative h-48 overflow-hidden rounded-2xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}
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
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 — Feature band (placeholder teaser) ────────────── */}
      <section className="relative overflow-hidden bg-brand-night py-24 text-white">
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-30" />
        <div className="container-wide relative">
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                icon: Flame,
                title: "Procédé 6 étapes",
                desc: "Dégraissage, primaire 80µ, cuisson 180°C, finition polyester 60µ, cuisson 200°C, contrôle qualité. Protocole industriel pro.",
              },
              {
                icon: ShieldCheck,
                title: "Durabilité 10+ ans",
                desc: "Résistance UV, résistance chocs, résistance à la corrosion. Procédé sans solvant, 0 COV. Garantie possible 10 ans.",
              },
              {
                icon: Sparkles,
                title: "Finitions signature",
                desc: "Au-delà du RAL Classic : collections Patina, Polaris, Dichroic, Sfera du partenaire Adaptacolor.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-brand-orange/40 hover:bg-white/[0.04]"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="heading-display text-xl text-white">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9 — Final CTA (shortened) ────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-ember py-24 text-white">
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
        <div className="container-tight relative text-center">
          <h2 className="heading-display text-4xl text-balance sm:text-5xl">
            Un projet ? Devis gratuit sous 24h.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Jantes, moto, portails, mobilier, pièces industrielles — envoyez
            vos photos, on vous rappelle avec un chiffrage.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 rounded-full bg-brand-night px-8 py-4 font-semibold text-white shadow-xl transition-all hover:bg-brand-night-deep hover:-translate-y-0.5"
            >
              Demander un devis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
