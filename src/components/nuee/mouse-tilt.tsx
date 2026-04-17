"use client";

/**
 * MouseTilt — wraps a child in a container that tilts in 3D based on
 * cursor position. Pure CSS perspective/transform, no framer-motion
 * required, so it's light and composes cleanly with anything inside.
 *
 * Max tilt ~12° by default, spring-eased via CSS transition (180ms).
 * Disabled on coarse pointers (mobile) — tilting without a cursor is
 * pointless and causes weird behavior on touch.
 *
 * Usage:
 *   <MouseTilt className="...">
 *     <Card />
 *   </MouseTilt>
 */

import { useEffect, useRef, type ReactNode } from "react";

interface MouseTiltProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees (default 12). */
  intensity?: number;
  /** Scale on hover (default 1.02). */
  hoverScale?: number;
}

export function MouseTilt({
  children,
  className,
  intensity = 12,
  hoverScale = 1.02,
}: MouseTiltProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let rect: DOMRect | null = null;

    const onEnter = () => {
      rect = wrap.getBoundingClientRect();
      inner.style.transition = "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)";
    };

    const onMove = (e: MouseEvent) => {
      if (!rect) rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      // Tilt axes: rotating AROUND X depends on vertical mouse pos,
      // AROUND Y on horizontal. Invert so the card "looks" at the cursor.
      const rotY = (px - 0.5) * intensity;
      const rotX = -(py - 0.5) * intensity;
      inner.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${hoverScale})`;
    };

    const onLeave = () => {
      inner.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
      rect = null;
    };

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [intensity, hoverScale]);

  return (
    <div ref={wrapRef} className={className} style={{ perspective: "900px" }}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
