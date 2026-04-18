"use client";

/**
 * ScrollParallax — applique une translation Y subtile à son contenu
 * proportionnelle au scroll. Utile pour donner de la profondeur à un
 * élément décoratif (photo atelier, quote, illustration) sans animer
 * tout le container.
 *
 * Speed : 1 = scroll normal (no-op), 0.7 = plus lent (donne l'impression
 * que l'élément est au loin), 1.3 = plus rapide (proche, foreground).
 * Tout écart par rapport à 1 crée du parallax.
 *
 * Désactivé en prefers-reduced-motion.
 */

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollParallaxProps {
  children: ReactNode;
  /** Vitesse relative. 0.6..1.4 typique. Défaut 0.85 (slight slowdown). */
  speed?: number;
  /** Clamp max offset en pixels. Défaut 60. */
  maxOffset?: number;
  className?: string;
}

export function ScrollParallax({
  children,
  speed = 0.85,
  maxOffset = 60,
  className,
}: ScrollParallaxProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let raf = 0;
    const delta = 1 - speed; // if speed < 1 → delta > 0 → positive offset as we scroll down

    function update() {
      raf = 0;
      if (!wrap || !inner) return;
      const rect = wrap.getBoundingClientRect();
      // Center of the element relative to the viewport center, normalized to [-1, 1] roughly.
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const fromCenter = (elementCenter - viewportCenter) / window.innerHeight;
      // Offset is opposite the scroll direction, scaled by delta.
      const raw = -fromCenter * delta * 100;
      const clamped = Math.max(-maxOffset, Math.min(maxOffset, raw));
      inner.style.transform = `translate3d(0, ${clamped}px, 0)`;
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [speed, maxOffset]);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={innerRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
