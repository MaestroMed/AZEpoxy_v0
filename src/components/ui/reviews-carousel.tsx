"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Review } from "@/lib/reviews-data";
import { cn } from "@/lib/utils";

interface ReviewsCarouselProps {
  reviews: Review[];
  /** Average rating (0-5) rendered in the header. */
  average?: number | null;
}

/**
 * Horizontal scroll carousel for Google / synced reviews. Falls back
 * gracefully when no reviews have been synced yet.
 */
export function ReviewsCarousel({ reviews, average }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!reviews.length) return null;

  const scroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-review]");
    const step = (card?.offsetWidth ?? 320) + 16;
    track.scrollBy({ left: direction === "right" ? step : -step, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {average != null && (
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl font-bold text-brand-night">
                {average.toFixed(1)}
              </span>
              <Stars rating={Math.round(average)} size="lg" />
              <span className="text-sm text-brand-charcoal/60">
                ({reviews.length} avis)
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <CarouselButton direction="left" onClick={() => scroll("left")} />
          <CarouselButton direction="right" onClick={() => scroll("right")} />
        </div>
      </div>

      <div
        ref={trackRef}
        className="mask-fade-x -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scroll-smooth [&>*]:snap-start"
      >
        {reviews.map((r, i) => (
          <article
            key={r._id ?? `${r.author}-${i}`}
            data-review
            className="flex w-[320px] flex-shrink-0 flex-col gap-4 rounded-2xl border border-brand-night/10 bg-white p-6 shadow-sm"
          >
            <Stars rating={r.rating} />
            {r.body && (
              <p className="flex-1 text-sm leading-relaxed text-brand-charcoal/80 line-clamp-6">
                « {r.body} »
              </p>
            )}
            <div className="flex items-center justify-between border-t border-brand-night/5 pt-3">
              <div>
                <p className="font-semibold text-brand-night">{r.author}</p>
                {r.publishedAt && (
                  <p className="text-xs text-brand-charcoal/50">
                    {new Date(r.publishedAt).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              {r.source === "google" && (
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40">
                  Google
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Stars({ rating, size = "md" }: { rating: number; size?: "md" | "lg" }) {
  const dim = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            dim,
            i < rating ? "fill-brand-orange text-brand-orange" : "text-brand-charcoal/20"
          )}
        />
      ))}
    </div>
  );
}

function CarouselButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Avis précédents" : "Avis suivants"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-night/15 bg-white text-brand-night transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
