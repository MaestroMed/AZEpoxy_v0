"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";

/**
 * Galaxy phase — particles form a slow-rotating 3D spiral galaxy.
 *
 * Uses a log-spiral (like a barred spiral galaxy) with Z depth jitter.
 * Each particle has a stable angular offset (seeded) so the whole thing
 * rotates as a rigid body, not a random mess. Rotation speed is small so
 * the parallax feels cosmic rather than frantic.
 */

const ARMS = 3;                       // number of spiral arms
const TWIST = 2.8;                    // how tightly the arms wrap
const RADIUS_INNER = 0.15;
const RADIUS_OUTER = 0.85;
const ROT_SPEED_RAD_PER_SEC = 0.08;   // ~1 full turn per 78s
const Z_SCATTER = 0.35;

let cachedSeeds: Float32Array | null = null;
let cachedColors: Float32Array | null = null;

/** Precompute each particle's stable (armAngle, radius, zOffset, brightness). */
function buildSeeds(count: number): Float32Array {
  const rand = mulberry32(0xc0_5_7);
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const arm = Math.floor(rand() * ARMS);
    const armAngle = (arm / ARMS) * Math.PI * 2;
    // Radius biased toward the middle so we get a dense core + thinning arms.
    const rBase = Math.pow(rand(), 0.75); // skew toward small r
    const r = RADIUS_INNER + (RADIUS_OUTER - RADIUS_INNER) * rBase;
    const jitter = (rand() - 0.5) * 0.3;   // off-arm scatter
    const z = (rand() - 0.5) * Z_SCATTER * (1 - rBase * 0.7);
    out[i * 4] = armAngle + jitter;
    out[i * 4 + 1] = r;
    out[i * 4 + 2] = z;
    out[i * 4 + 3] = 0.5 + rand() * 0.5;
  }
  return out;
}

/** Cosmic palette — violet / cyan / gold, weighted so we mostly see deep purple with jewels. */
function buildColors(count: number): Float32Array {
  const rand = mulberry32(0xbee);
  const out = new Float32Array(count * 4);
  const palette: Array<[number, number, number, number]> = [
    [...hexToRgb("#4A148C"), 0.85] as [number, number, number, number], // deep violet
    [...hexToRgb("#7B2FBE"), 0.85] as [number, number, number, number], // mid purple
    [...hexToRgb("#26C6DA"), 0.9] as [number, number, number, number],  // cyan sparkle
    [...hexToRgb("#FFD54F"), 1.0] as [number, number, number, number],  // gold jewel
    [...hexToRgb("#E0E7FF"), 0.95] as [number, number, number, number], // cold star
  ];
  // Weighted selection — mostly violet, rare gold/cyan = jewel stars.
  const weights = [0.45, 0.3, 0.1, 0.05, 0.1];
  const cum: number[] = [];
  weights.reduce((acc, w, i) => (cum[i] = acc + w), 0);
  for (let i = 0; i < count; i++) {
    const r = rand();
    let idx = 0;
    while (idx < weights.length - 1 && r > cum[idx]) idx++;
    const [pr, pg, pb, pa] = palette[idx];
    out[i * 4] = pr;
    out[i * 4 + 1] = pg;
    out[i * 4 + 2] = pb;
    out[i * 4 + 3] = pa;
  }
  return out;
}

export const GALAXY_PHASE: Phase = {
  id: "galaxy",
  stiffness: 0.04,        // slow settle for cosmic feel
  jitterAmplitude: 0.003,
  // Spirale circulaire — doit rester centrée.
  anchorPreference: "center",

  computeTarget(count, time, mouse, _scroll, out) {
    if (!cachedSeeds || cachedSeeds.length !== count * 4) {
      cachedSeeds = buildSeeds(count);
    }
    const rot = (time / 1000) * ROT_SPEED_RAD_PER_SEC;
    // Subtle mouse-driven Z tilt for parallax.
    const tiltX = mouse[1] * 0.18;
    const tiltY = mouse[0] * 0.18;
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);

    for (let i = 0; i < count; i++) {
      const armAngle = cachedSeeds[i * 4];
      const r = cachedSeeds[i * 4 + 1];
      const z0 = cachedSeeds[i * 4 + 2];

      // Log-spiral: theta = armAngle + TWIST * log(r/innerR) + globalRot
      const theta =
        armAngle + TWIST * Math.log(r / RADIUS_INNER) + rot;

      let x = Math.cos(theta) * r;
      let y = Math.sin(theta) * r;
      let z = z0;

      // Tilt (rotate around X-axis): y' = y*cos - z*sin, z' = y*sin + z*cos
      const yT = y * cosX - z * sinX;
      const zT = y * sinX + z * cosX;
      y = yT;
      z = zT;

      // And a small yaw from mouse.x
      const cosY = Math.cos(tiltY);
      const sinY = Math.sin(tiltY);
      const xT = x * cosY + z * sinY;
      const zT2 = -x * sinY + z * cosY;
      x = xT;
      z = zT2;

      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = z;
    }
  },

  computeColor(count, _time, out) {
    if (!cachedColors || cachedColors.length !== count * 4) {
      cachedColors = buildColors(count);
    }
    out.set(cachedColors);
  },
};
