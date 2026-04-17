"use client";

/**
 * CustomCursor — award-tier pointer.
 *
 * Two elements: a small dot that tracks the mouse 1:1 (precision) + a
 * larger ring that lags behind via spring (smooth trail). When hovering
 * an interactive element ([data-magnetic], [href], button) the ring
 * grows and softens, and the interactive element is slightly pulled
 * toward the cursor (magnetic feel).
 *
 * Disabled on touch devices (pointer:coarse) — they have the native
 * platform cursor which is the right call.
 *
 * Respects prefers-reduced-motion by skipping the lag/spring entirely.
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, m, useReducedMotion } from "framer-motion";

const MAGNETIC_ATTRACTORS = "a, button, [role='button'], [data-magnetic]";
const MAGNETIC_RANGE = 120; // px — how close the cursor needs to be for pull

export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Raw mouse pos (dot) + spring (ring).
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 320, damping: 28, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 320, damping: 28, mass: 0.4 });

  // Magnetic pull transform on the hovered element (CSS transform).
  const magneticTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Disable on coarse pointers (touch).
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      // Magnetic pull: check for interactive element near cursor.
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
      const el = (e.target as HTMLElement)?.closest(MAGNETIC_ATTRACTORS) as HTMLElement | null;
      if (!el) {
        setIsHovering(false);
        if (magneticTargetRef.current) {
          magneticTargetRef.current.style.transform = "";
          magneticTargetRef.current = null;
        }
        return;
      }
      setIsHovering(true);
      if (!prefersReduced && magneticTargetRef.current !== el) {
        if (magneticTargetRef.current) magneticTargetRef.current.style.transform = "";
        magneticTargetRef.current = el;
        el.style.transition = "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)";
      }
    };

    const onLeave = () => {
      setIsHovering(false);
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

  // Hide the native cursor globally once ours is mounted (reduces visual
  // clutter). Done via a body class so it's easy to undo in DevTools.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Precision dot (tracks 1:1). */}
      <m.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ x: prefersReduced ? dotX : dotX, y: prefersReduced ? dotY : dotY }}
      />
      {/* Trail ring (lags via spring). */}
      <m.div
        aria-hidden
        className={
          "pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 mix-blend-difference transition-[width,height,border-width] duration-200 ease-out"
        }
        style={{
          x: prefersReduced ? dotX : ringX,
          y: prefersReduced ? dotY : ringY,
          width: isHovering ? 56 : 32,
          height: isHovering ? 56 : 32,
          borderWidth: isHovering ? 2 : 1,
        }}
      />
    </>
  );
}
