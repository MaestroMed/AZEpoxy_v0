"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { cn } from "@/lib/utils";

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
          <button
            key={`${img.src}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative overflow-hidden rounded-2xl border border-brand-night/10 bg-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            aria-label={`Agrandir : ${img.alt}`}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-night/80 via-brand-night/40 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-semibold text-white">{img.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        index={index < 0 ? 0 : index}
        close={() => setIndex(-1)}
        slides={slides}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(15, 15, 26, 0.92)" },
        }}
        animation={{ fade: 300 }}
      />
    </>
  );
}
