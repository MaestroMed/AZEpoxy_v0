/**
 * Small math helpers used by the engine + phases. Kept deps-free so they can
 * run inside the tight render loop without import cost.
 */

export const clamp = (v: number, a: number, b: number) =>
  v < a ? a : v > b ? b : v;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp((t - a) / (b - a), 0, 1);
  return x * x * (3 - 2 * x);
};

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Mulberry32 — tiny deterministic PRNG. We seed per-particle to get stable
 * "personality" values (jitter phase, color variance) that survive phase
 * switches without a jarring reshuffle.
 */
export function mulberry32(seed: number) {
  let t = seed | 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convert hex "#RRGGBB" to [r,g,b] floats in 0..1. */
export function hexToRgb(hex: string): [number, number, number] {
  const s = hex.replace("#", "");
  const n = parseInt(s.length === 3
    ? s.split("").map((c) => c + c).join("")
    : s, 16);
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}
