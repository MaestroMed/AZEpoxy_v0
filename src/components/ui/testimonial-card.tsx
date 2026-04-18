import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  name: string;
  company?: string;
  quote: string;
  rating: number;
  dark?: boolean;
}

/**
 * TestimonialCard — témoignage style editorial.
 *
 * Design : grand guillemet ouvrant en gradient ember en haut à gauche
 * (décoratif, aria-hidden), citation en italique avec un micro-indent,
 * séparateur orange width 8 au-dessus de l'auteur (motif récurrent
 * footer/pull-quote).
 * Au hover : translate -1 + shadow ember sur la card light / border
 * orange sur la card dark + sheen diagonal subtle.
 */
export function TestimonialCard({
  name,
  company,
  quote,
  rating,
  dark = false,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl p-7 transition-all duration-400",
        dark
          ? "border border-white/10 bg-white/[0.04] hover:border-brand-orange/40 hover:bg-white/[0.07]"
          : "bg-white shadow-md hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_rgba(232,93,44,0.35)]"
      )}
    >
      {/* Sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-brand-orange/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
      />
      {/* Decorative quote mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-2 left-5 select-none bg-gradient-ember bg-clip-text font-display text-[5rem] font-black leading-[0.8] text-transparent"
      >
        “
      </span>

      <div className="relative pt-10">
        {/* Star rating */}
        <div className="mb-4 flex items-center gap-0.5" aria-label={`Note : ${rating} sur 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4 transition-all duration-300",
                i < rating
                  ? "fill-brand-orange text-brand-orange group-hover:scale-110"
                  : dark
                    ? "text-white/20"
                    : "text-brand-charcoal/20"
              )}
              style={{ transitionDelay: i < rating ? `${i * 40}ms` : "0ms" }}
            />
          ))}
        </div>

        {/* Quote */}
        <p
          className={cn(
            "leading-relaxed",
            dark ? "text-white/85" : "text-brand-charcoal/85"
          )}
        >
          {quote}
        </p>

        {/* Separator + author */}
        <footer className="mt-6 flex items-center gap-3">
          <span className="h-px w-8 bg-brand-orange" aria-hidden />
          <div>
            <p
              className={cn(
                "font-display font-semibold",
                dark ? "text-white" : "text-brand-night"
              )}
            >
              {name}
            </p>
            {company && (
              <p
                className={cn(
                  "text-xs uppercase tracking-[0.14em]",
                  dark ? "text-white/50" : "text-brand-charcoal/50"
                )}
              >
                {company}
              </p>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
