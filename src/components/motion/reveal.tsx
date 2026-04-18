"use client";

import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type RevealVariant = "fade" | "slide" | "scale" | "blur" | "rise";
export type RevealDirection = "up" | "down" | "left" | "right";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: RevealDirection;
  variant?: RevealVariant;
  duration?: number;
  className?: string;
  once?: boolean;
}

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  left: { x: -30, y: 0 },
  right: { x: 30, y: 0 },
};

// Award-tier easing — smooth stop without overshoot.
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * On-scroll reveal. Five variants :
 *   • "slide" (default, back-compat) — offset slide + fade
 *   • "fade"  — pure opacity, zero movement
 *   • "scale" — scale 0.92 → 1 + fade (cards, features)
 *   • "blur"  — blur 12px → 0 + opacity (poetic, text)
 *   • "rise"  — big y offset + scale + fade (hero sub-elements)
 *
 * All variants respect prefers-reduced-motion by rendering static.
 * Uses ease-out-expo cubic for the Awwwards-grade smooth stop.
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  variant = "slide",
  duration,
  className,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={cn(className)}>{children}</div>;
  }

  const offset = offsets[direction];
  let initial: Record<string, number | string>;
  let animate: Record<string, number | string>;
  let defaultDuration = 0.6;

  switch (variant) {
    case "fade":
      initial = { opacity: 0 };
      animate = { opacity: 1 };
      defaultDuration = 0.55;
      break;
    case "scale":
      initial = { opacity: 0, scale: 0.92 };
      animate = { opacity: 1, scale: 1 };
      defaultDuration = 0.7;
      break;
    case "blur":
      initial = { opacity: 0, filter: "blur(12px)" };
      animate = { opacity: 1, filter: "blur(0px)" };
      defaultDuration = 0.75;
      break;
    case "rise":
      initial = { opacity: 0, y: 50, scale: 0.96 };
      animate = { opacity: 1, y: 0, scale: 1 };
      defaultDuration = 0.8;
      break;
    case "slide":
    default:
      initial = { opacity: 0, x: offset.x, y: offset.y };
      animate = { opacity: 1, x: 0, y: 0 };
      defaultDuration = 0.6;
  }

  return (
    <m.div
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin: "-80px", amount: 0.2 }}
      transition={{
        duration: duration ?? defaultDuration,
        delay,
        ease: EASE_OUT_EXPO,
      }}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}
