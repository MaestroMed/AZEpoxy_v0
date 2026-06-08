"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "fade" | "slide" | "scale" | "blur" | "rise";
export type RevealDirection = "up" | "down" | "left" | "right";
type RevealTag = "div" | "li" | "span";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: RevealDirection;
  variant?: RevealVariant;
  duration?: number;
  className?: string;
  once?: boolean;
  /** Élément HTML rendu — utile pour préserver la sémantique (ex. `li`). */
  as?: RevealTag;
}

/**
 * Reveal on-scroll — implémenté en IntersectionObserver + CSS (pas de
 * framer-motion).
 *
 * Pourquoi : framer-motion `whileInView` lit la géométrie (getBoundingClientRect)
 * de chaque élément au montage → reflow synchrone × N éléments = layout
 * thrashing (≈1.4s de styleLayout sur l'accueil mobile, qui retardait le LCP).
 * L'IntersectionObserver est asynchrone et hors main-thread : zéro thrash.
 *
 * Robustesse (jamais bloqué invisible) :
 *   • reduced-motion → visible, sans animation (CSS)
 *   • JS désactivé   → <noscript> dans le layout révèle tout
 *   • IO en échec / onglet en arrière-plan → filet setTimeout 1.6s
 *
 * Le style initial (opacity:0 + transform) vit en CSS (.az-reveal dans
 * globals.css), piloté par les attributs data-* ci-dessous.
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  variant = "slide",
  duration,
  className,
  once = true,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            if (once) io.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.15 },
    );
    io.observe(el);
    const safety = setTimeout(() => setShown(true), 1600);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [once]);

  const Tag = as as "div";
  const style: React.CSSProperties = {};
  if (delay) style.transitionDelay = `${delay}s`;
  if (duration) style.transitionDuration = `${duration}s`;

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      data-reveal={variant}
      data-dir={direction}
      data-shown={shown ? "true" : "false"}
      style={style}
      className={cn("az-reveal", className)}
    >
      {children}
    </Tag>
  );
}
