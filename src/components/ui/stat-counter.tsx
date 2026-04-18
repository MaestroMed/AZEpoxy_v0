"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: string;
  label: string;
  dark?: boolean;
}

/**
 * Extracts the leading numeric part and the trailing suffix from a value string.
 * Examples: "200+" -> [200, "+"], "1800" -> [1800, ""], "48h" -> [48, "h"], "0 COV" -> [0, " COV"]
 */
function parseValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

/**
 * Animated stat counter avec reveal polish award-tier :
 *   • Thin gradient underline qui scale-x 0 → 1 sur 900ms quand le
 *     counter atterrit, signale la fin du compte
 *   • Pulse flash brief à l'atterrissage (scale 1.08 → 1) — reward
 *   • Tabular-nums pour que le counter ne "saute" pas pendant la
 *     progression (largeur des chiffres fixe)
 *   • Label qui s'éclaircit un peu après le pulse (delay 120ms)
 */
export function StatCounter({ value, label, dark = false }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const { num, suffix } = parseValue(value);
  const [landed, setLanded] = useState(false);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 70,
    damping: 26,
  });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, num, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1], // ease-out-expo, award-grade smooth stop
    });
    // Mark landed after the tween resolves — triggers the underline
    // scale-in and the label fade-up.
    controls.then(() => setLanded(true));
    return () => controls.stop();
  }, [isInView, motionValue, num]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, suffix]);

  return (
    <div ref={containerRef} className="group">
      <div className="relative inline-block">
        <span
          ref={ref}
          className={cn(
            "heading-display text-4xl tabular-nums sm:text-5xl transition-transform duration-300",
            dark ? "text-white" : "text-brand-night",
            // Subtle flash pop when landed — scale briefly, then ease back.
            landed && "motion-safe:animate-[stat-pop_420ms_cubic-bezier(0.22,1,0.36,1)_1]"
          )}
        >
          0{suffix}
        </span>
        {/* Gradient underline — scale-in au landed. */}
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-ember transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            landed ? "scale-x-100" : "scale-x-0"
          )}
        />
      </div>
      <div
        className={cn(
          "mt-2 text-xs font-semibold uppercase tracking-[0.2em] transition-opacity duration-500",
          dark ? "text-white/50" : "text-brand-charcoal/50",
          landed && (dark ? "text-white/70" : "text-brand-charcoal/70")
        )}
        style={{ transitionDelay: landed ? "120ms" : "0ms" }}
      >
        {label}
      </div>
    </div>
  );
}
