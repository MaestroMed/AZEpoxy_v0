import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/utils";

interface CTABandProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}

export function CtaBand({
  title = "Un projet ? Devis gratuit sous 24h.",
  description,
  primaryHref = "/devis",
  primaryLabel = "Demander un devis",
}: CTABandProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-ember py-24 text-white">
      <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />

      <div className="container-tight relative text-center">
        <h2 className="heading-display text-4xl text-balance sm:text-5xl">
          {title}
        </h2>

        {description && (
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            {description}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand-night px-8 py-4 font-semibold text-white shadow-xl transition-all hover:bg-brand-night-deep hover:-translate-y-0.5"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={SITE.phoneHref}
            className="btn-ghost-light"
          >
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
