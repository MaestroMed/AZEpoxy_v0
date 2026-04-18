import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/utils";
import { TextReveal } from "@/components/ui/text-reveal";

interface CTABandProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}

/**
 * CtaBand — bande de conversion finale. Gradient ember pleine largeur
 * avec :
 *  • TextReveal word-by-word sur le titre au scroll-in
 *  • Heat shimmer animé en fond (bas-haut) — signale la chaleur thermolaquage
 *  • Primary CTA : shift translate-y au hover + arrow avance + shadow ember
 *  • Secondary phone link : underline slide orange
 *  • Subtle parallax grid overlay
 */
export function CtaBand({
  title = "Un projet ? Devis gratuit sous 24h.",
  description,
  primaryHref = "/devis",
  primaryLabel = "Demander un devis",
}: CTABandProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-ember py-24 text-white">
      <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" aria-hidden />
      {/* Heat shimmer — vertical bands that slowly sweep up, evoking
          the radiant heat above a 200°C oven. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 motion-safe:animate-heat-shimmer"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,200,140,0.28), transparent 75%)",
        }}
      />
      {/* Grid overlay, very subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-industrial-grid-dark opacity-20 mix-blend-overlay"
      />

      <div className="container-tight relative text-center">
        <h2 className="heading-display text-balance text-4xl sm:text-5xl">
          <TextReveal>{title}</TextReveal>
        </h2>

        {description && (
          <p className="mx-auto mt-4 max-w-xl text-white/85">{description}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryHref}
            data-magnetic
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-brand-night px-8 py-4 font-semibold text-white shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40"
          >
            {/* Sheen diagonal au hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative">{primaryLabel}</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href={SITE.phoneHref}
            data-magnetic
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
          >
            <Phone className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
            <span className="relative">
              {SITE.phone}
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100"
              />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
