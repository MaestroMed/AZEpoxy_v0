"use client";

import dynamic from "next/dynamic";

/**
 * The hero canvas (800+ lines of particle animation) is split into its own
 * client chunk and loaded only after the rest of the page is interactive.
 * A static brand gradient + grid stands in during the load so the hero
 * never shifts layout (CLS) and users with prefers-reduced-motion keep the
 * fallback permanently.
 */
const HeroParticlesImpl = dynamic(
  () => import("./hero-particles").then((m) => m.HeroParticles),
  { ssr: false, loading: HeroFallback }
);

export function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, #1A1A2E 0%, #0F0F1A 100%), radial-gradient(ellipse at 30% 40%, rgba(232, 93, 44, 0.25), transparent 60%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

/**
 * Drop-in replacement for the original `<HeroParticles />`. Reserves the
 * full hero height via the parent section so swapping in the canvas after
 * hydration doesn't shift other content.
 */
export function HeroParticles() {
  return <HeroParticlesImpl />;
}
