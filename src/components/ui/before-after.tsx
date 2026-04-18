"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterProps {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  /** Caption shown below the slider. */
  label?: string;
  className?: string;
}

/**
 * Accessible before/after image slider. Keyboard support: arrow keys move
 * the handle in 2% steps, Home/End jump to the extremes. ARIA slider role
 * + aria-valuenow / aria-valuetext announce the current position to screen
 * readers.
 */
export function BeforeAfter({
  before,
  after,
  label,
  className,
}: BeforeAfterProps) {
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const next = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    setPct(next);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const x =
        "touches" in e ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX;
      updateFromClientX(x);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updateFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPct(0);
    else if (e.key === "End") setPct(100);
    else return;
    e.preventDefault();
  };

  return (
    <figure className={cn("w-full", className)}>
      <div
        ref={trackRef}
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-brand-night"
        onMouseDown={(e) => {
          setDragging(true);
          updateFromClientX(e.clientX);
        }}
        onTouchStart={(e) => {
          setDragging(true);
          updateFromClientX(e.touches[0]?.clientX ?? 0);
        }}
      >
        {/* After (full, underneath) */}
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 95vw"
          className="object-cover"
        />
        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        >
          <div className="relative h-full" style={{ width: `${100 * (100 / Math.max(pct, 0.001))}%` }}>
            <Image
              src={before.src}
              alt={before.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 95vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Labels — design plus architectural + indicator dot */}
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-opacity duration-300",
            pct < 10 ? "opacity-0" : "opacity-100"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          Avant
        </span>
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-brand-orange/40 transition-opacity duration-300",
            pct > 90 ? "opacity-0" : "opacity-100"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Après
        </span>

        {/* Percentage indicator — affiche le pourcentage actuel
            discrètement en bas du handle. */}
        <span
          aria-hidden
          className={cn(
            "absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-brand-night shadow-sm backdrop-blur-sm transition-opacity duration-200",
            dragging ? "opacity-100" : "opacity-0"
          )}
        >
          {Math.round(pct)}%
        </span>

        {/* Divider + handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Comparer avant/après ${label ? `— ${label}` : ""}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${Math.round(pct)} % avant`}
          onKeyDown={onKeyDown}
          className={cn(
            "group absolute inset-y-0 flex w-0.5 items-center justify-center bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange",
            dragging ? "cursor-grabbing" : "cursor-ew-resize"
          )}
          style={{ left: `calc(${pct}% - 1px)` }}
        >
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-night shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] transition-transform duration-200",
              dragging ? "scale-110" : "scale-100 group-hover:scale-105",
            )}
          >
            {/* Decorative inner ring brand orange */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute h-12 w-12 rounded-full border-2 transition-all duration-300",
                dragging
                  ? "border-brand-orange/60 scale-125 opacity-80"
                  : "border-brand-orange/0 scale-100 opacity-0"
              )}
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                dragging && "scale-90"
              )}
              aria-hidden="true"
            >
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
      {label && (
        <figcaption className="mt-3 text-sm text-brand-charcoal/70">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
