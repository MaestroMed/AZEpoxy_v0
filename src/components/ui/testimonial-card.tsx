import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  name: string;
  company?: string;
  quote: string;
  rating: number;
  dark?: boolean;
}

export function TestimonialCard({
  name,
  company,
  quote,
  rating,
  dark = false,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-l-4 border-brand-orange p-6",
        dark
          ? "bg-white/[0.04] border border-white/10 border-l-4 border-l-brand-orange"
          : "bg-white shadow-md"
      )}
    >
      {/* Star rating */}
      <div className="mb-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating
                ? "fill-brand-orange text-brand-orange"
                : dark
                  ? "text-white/20"
                  : "text-brand-charcoal/20"
            )}
          />
        ))}
      </div>

      {/* Quote */}
      <p
        className={cn(
          "italic leading-relaxed",
          dark ? "text-white/80" : "text-brand-charcoal/80"
        )}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-4">
        <p
          className={cn(
            "font-semibold",
            dark ? "text-white" : "text-brand-night"
          )}
        >
          {name}
        </p>
        {company && (
          <p
            className={cn(
              "text-sm",
              dark ? "text-white/50" : "text-brand-charcoal/50"
            )}
          >
            {company}
          </p>
        )}
      </div>
    </div>
  );
}
