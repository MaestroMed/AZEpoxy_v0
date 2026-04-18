"use client";

/**
 * ReadingProgress — thin bar at the top of the viewport that tracks
 * how far the user has scrolled through the main article content.
 *
 * Implementation : observes a target element (passed via selector or
 * attribute), maps scroll progress inside its bounds to 0..1, renders
 * a scaleX transform on a fixed bar. Zero layout thrashing.
 *
 * Mount inside an article page (e.g. /blog/[slug]). Pass
 * `targetSelector` to narrow the progress scope to the <article>
 * rather than the full document.
 */

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ReadingProgressProps {
  /**
   * CSS selector for the element whose scroll progress we track. If
   * omitted, tracks the full document. For an article, pass something
   * like `article` or `[data-reading-target]`.
   */
  targetSelector?: string;
  /** Bar color (default brand orange). */
  color?: string;
  /** Bar height in px (default 3). */
  height?: number;
}

export function ReadingProgress({
  targetSelector,
  color = "#E85D2C",
  height = 3,
}: ReadingProgressProps) {
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 160, damping: 26, mass: 0.35 });
  const scaleX = useTransform(smooth, (v) => v);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function compute() {
      let top: number, bottom: number;
      if (targetSelector) {
        const el = document.querySelector(targetSelector);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        top = window.scrollY + rect.top;
        bottom = top + rect.height;
      } else {
        const doc = document.documentElement;
        top = 0;
        bottom = doc.scrollHeight;
      }
      const viewBottom = window.scrollY + window.innerHeight;
      const total = Math.max(1, bottom - top - window.innerHeight);
      const elapsed = Math.max(0, Math.min(total, viewBottom - top - window.innerHeight));
      const pct = elapsed / total;
      progress.set(Math.max(0, Math.min(1, pct)));
      // Show only once the reader has actually entered the article.
      setVisible(window.scrollY > (top - window.innerHeight * 0.2));
    }

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [progress, targetSelector]);

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] origin-left"
      style={{
        width: "100%",
        height,
        background: color,
        scaleX,
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms ease-out",
        boxShadow: `0 0 12px ${color}66, 0 0 2px ${color}`,
      }}
    />
  );
}
