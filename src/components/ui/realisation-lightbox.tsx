"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { cn } from "@/lib/utils";
import { MouseTilt } from "@/components/nuee/mouse-tilt";

export interface LightboxImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Optional caption rendered in the lightbox footer. */
  caption?: string;
}

interface RealisationLightboxProps {
  images: LightboxImage[];
  /** Tailwind class for the grid wrapper; defaults to a 3-col responsive grid. */
  gridClassName?: string;
}

/**
 * Accessible lightbox for realisation galleries. Keyboard navigation,
 * focus trap and Escape-to-close are provided by the underlying library;
 * we add semantic labels and ensure thumbnails are tab-reachable.
 */
export function RealisationLightbox({
  images,
  gridClassName,
}: RealisationLightboxProps) {
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  const slides: Slide[] = images.map((img) => ({
    src: img.src,
    alt: img.alt,
    width: img.width,
    height: img.height,
    description: img.caption,
  }));

  return (
    <>
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
          gridClassName
        )}
      >
        {images.map((img, i) => (
          <MouseTilt key={`${img.src}-${i}`} intensity={6} hoverScale={1.015}>
            <button
              type="button"
              data-cursor="view"
              onClick={() => setIndex(i)}
              className="group relative block h-full w-full overflow-hidden rounded-2xl border border-brand-night/10 bg-brand-cream shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_18px_40px_-24px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              aria-label={`Agrandir : ${img.alt}`}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                {/* Sheen diagonal */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-br from-transparent via-white/18 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                {/* Zoom corner indicator */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                    <path d="M11 8v6" />
                    <path d="M8 11h6" />
                  </svg>
                </span>
              </div>
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-brand-night via-brand-night/75 to-transparent p-4 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-white">{img.caption}</p>
                </div>
              )}
            </button>
          </MouseTilt>
        ))}
      </div>

      <Lightbox
        open={open}
        index={index < 0 ? 0 : index}
        close={() => setIndex(-1)}
        slides={slides}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(15, 15, 26, 0.95)", backdropFilter: "blur(12px)" },
          slide: { padding: "4vh 4vw" },
          button: { filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" },
        }}
        animation={{ fade: 400, swipe: 350 }}
        carousel={{ finite: false, preload: 2 }}
      />
    </>
  );
}
