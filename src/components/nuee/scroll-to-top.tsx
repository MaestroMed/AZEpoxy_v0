"use client";

/**
 * ScrollToTop — fixed bottom-right button with a circular progress
 * ring that fills as the user scrolls. Appears after 40% page scroll.
 *
 * Positioned just above the SoundToggle (same side) so both fit
 * without collision. Click scrolls smoothly to top.
 */

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const CIRCUMFERENCE = 2 * Math.PI * 20; // r=20 → ~125.66

export function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = window.scrollY / max;
      setProgress(p);
      setVisible(p > 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // We always render the button but hide it off-screen when not visible,
  // so CSS transitions can animate in/out without mount/unmount flicker.
  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Revenir en haut de page"
      data-magnetic
      className="group fixed bottom-5 right-5 z-[80] h-12 w-12 rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-all duration-300 hover:border-white/45"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Progress ring (SVG). */}
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="rgb(232,93,44)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <ArrowUp className="relative mx-auto h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}
