"use client";

import { useEffect, useRef } from "react";
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

export function StatCounter({ value, label, dark = false }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { num, suffix } = parseValue(value);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 30,
  });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, num, { duration: 1.5, ease: "easeOut" });
    }
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
    <div>
      <span
        ref={ref}
        className={cn(
          "heading-display text-4xl sm:text-5xl",
          dark ? "text-white" : "text-brand-night"
        )}
      >
        0{suffix}
      </span>
      <div
        className={cn(
          "mt-2 text-xs font-semibold uppercase tracking-[0.2em]",
          dark ? "text-white/50" : "text-brand-charcoal/50"
        )}
      >
        {label}
      </div>
    </div>
  );
}
