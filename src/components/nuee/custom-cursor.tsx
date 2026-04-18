"use client";

/**
 * CustomCursor — award-tier pointer with contextual modes.
 *
 * Three elements :
 *   • precision dot (tracks 1:1)
 *   • trail ring (lags via spring)
 *   • contextual label INSIDE the ring — "→" on links, "VIEW" on
 *     images, a bigger filled variant on buttons, etc.
 *
 * Mode detection (in priority order) :
 *   data-cursor="…" → explicit override
 *   <img>, picture, [data-image]        → "VIEW"
 *   a[href^="/blog"]                     → "READ"
 *   button, [role=button]                → grow + filled tint
 *   a, [role=link]                       → "→"
 *   else                                  → default hover grow
 *
 * Adds magnetic pull on CTAs (buttons/links). Disabled on touch.
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, m, useReducedMotion } from "framer-motion";

const MAGNETIC_ATTRACTORS = "a, button, [role='button'], [data-magnetic]";
const MAGNETIC_RANGE = 120;

type CursorMode = "default" | "link" | "read" | "view" | "button" | "disabled";

interface CursorLook {
  size: number;
  border: number;
  fill: string; // tailwind-safe css bg
  label: string;
  labelColor: string;
}

function lookForMode(mode: CursorMode): CursorLook {
  switch (mode) {
    case "view":
      return { size: 80, border: 0, fill: "rgba(232,93,44,0.92)", label: "VIEW", labelColor: "#fff" };
    case "read":
      return { size: 72, border: 0, fill: "rgba(232,93,44,0.92)", label: "LIRE", labelColor: "#fff" };
    case "button":
      return { size: 60, border: 0, fill: "rgba(255,255,255,0.92)", label: "", labelColor: "#000" };
    case "link":
      return { size: 56, border: 2, fill: "transparent", label: "→", labelColor: "rgba(255,255,255,0.95)" };
    case "disabled":
      return { size: 28, border: 1, fill: "transparent", label: "", labelColor: "transparent" };
    default:
      return { size: 32, border: 1, fill: "transparent", label: "", labelColor: "transparent" };
  }
}

function detectMode(target: HTMLElement | null): CursorMode {
  if (!target) return "default";
  // Explicit override wins.
  const explicit = target.closest("[data-cursor]") as HTMLElement | null;
  if (explicit) {
    const v = explicit.getAttribute("data-cursor");
    if (v === "view" || v === "read" || v === "button" || v === "link" || v === "disabled") return v;
  }
  // Image-like.
  const img = target.closest("img, picture, [data-image]");
  if (img) return "view";
  // Blog / article links get "READ".
  const blogLink = target.closest('a[href^="/blog"]') as HTMLAnchorElement | null;
  if (blogLink) return "read";
  // Buttons (stronger visual than links).
  const btn = target.closest("button, [role='button']") as HTMLElement | null;
  if (btn) {
    if (btn.hasAttribute("disabled") || btn.getAttribute("aria-disabled") === "true") return "disabled";
    return "button";
  }
  // Plain links.
  const link = target.closest("a[href], [role='link']") as HTMLElement | null;
  if (link) return "link";
  return "default";
}

export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 320, damping: 28, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 320, damping: 28, mass: 0.4 });

  const magneticTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      if (prefersReduced) return;
      const target = magneticTargetRef.current;
      if (target) {
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < MAGNETIC_RANGE) {
          const strength = 1 - dist / MAGNETIC_RANGE;
          const pullX = dx * 0.18 * strength;
          const pullY = dy * 0.18 * strength;
          target.style.transform = `translate(${pullX}px, ${pullY}px)`;
        } else {
          target.style.transform = "";
          magneticTargetRef.current = null;
        }
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const detected = detectMode(t);
      setMode(detected);

      // Magnetic pull on interactive elements only.
      const magnetEl = t?.closest(MAGNETIC_ATTRACTORS) as HTMLElement | null;
      if (!magnetEl) {
        if (magneticTargetRef.current) {
          magneticTargetRef.current.style.transform = "";
          magneticTargetRef.current = null;
        }
        return;
      }
      if (!prefersReduced && magneticTargetRef.current !== magnetEl) {
        if (magneticTargetRef.current) magneticTargetRef.current.style.transform = "";
        magneticTargetRef.current = magnetEl;
        magnetEl.style.transition = "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)";
      }
    };

    const onLeave = () => {
      setMode("default");
      if (magneticTargetRef.current) {
        magneticTargetRef.current.style.transform = "";
        magneticTargetRef.current = null;
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, prefersReduced, dotX, dotY]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  if (!enabled) return null;

  const look = lookForMode(mode);
  // Label-bearing modes ditch mix-blend (the tinted fills need to
  // render their own contrast). Default/link/disabled keep difference
  // blend so they contrast with any background.
  const useBlendDifference = mode === "default" || mode === "link" || mode === "disabled";
  // Hide the precision dot when we're showing a big filled cursor
  // — otherwise it's a random dot in the middle of "VIEW".
  const hideDot = mode === "view" || mode === "read" || mode === "button";

  return (
    <>
      {/* Precision dot (tracks 1:1). */}
      <m.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-opacity duration-200"
        style={{
          x: dotX,
          y: dotY,
          opacity: hideDot ? 0 : 1,
        }}
      />
      {/* Trail ring (lags via spring) with contextual label. */}
      <m.div
        aria-hidden
        className={
          "pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-[width,height,border-width,background-color,color] duration-200 ease-out" +
          (useBlendDifference ? " mix-blend-difference" : "")
        }
        style={{
          x: prefersReduced ? dotX : ringX,
          y: prefersReduced ? dotY : ringY,
          width: look.size,
          height: look.size,
          borderWidth: look.border,
          borderColor: useBlendDifference ? "rgba(255,255,255,0.7)" : "transparent",
          borderStyle: "solid",
          backgroundColor: look.fill,
          color: look.labelColor,
          fontSize: look.label.length <= 2 ? 20 : 11,
          fontWeight: 700,
          letterSpacing: look.label.length > 2 ? "0.12em" : "0",
        }}
      >
        {look.label}
      </m.div>
    </>
  );
}
