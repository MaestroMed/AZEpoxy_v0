"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";

/**
 * Flow phase — particles swirl in a dense fluid-like stream driven by
 * 2D Simplex-ish noise. Warm orange/white palette, evokes molten metal
 * or paint projection in motion (the thermolaquage money-shot mood).
 *
 * Noise is approximated with layered sines (good enough for a vector
 * field, zero deps, cheap). Each particle has a seeded personal offset
 * so trajectories feel individual, not lockstep.
 */

const FLOW_SCALE = 1.8;         // how "big" the noise cells are
const FLOW_SPEED = 0.22;         // how fast the field evolves
const DRIFT_RADIUS = 0.95;       // particles stay within this radius

let cachedSeeds: Float32Array | null = null;
let cachedColors: Float32Array | null = null;

function buildSeeds(count: number): Float32Array {
  const rand = mulberry32(0xf10);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Start position uniformly within unit disk.
    const ang = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * DRIFT_RADIUS;
    out[i * 3] = Math.cos(ang) * r;
    out[i * 3 + 1] = Math.sin(ang) * r * 0.6; // flatten vertically
    out[i * 3 + 2] = rand(); // personal phase offset in [0,1]
  }
  return out;
}

function buildColors(count: number): Float32Array {
  const rand = mulberry32(0xf11);
  const out = new Float32Array(count * 4);
  const palette: Array<[number, number, number, number]> = [
    [...hexToRgb("#FF7A48"), 0.85] as [number, number, number, number], // bright orange
    [...hexToRgb("#FFD7B8"), 0.95] as [number, number, number, number], // pale ember
    [...hexToRgb("#FFE4B5"), 1.0] as [number, number, number, number],  // near-white hot
    [...hexToRgb("#E85D2C"), 0.8] as [number, number, number, number],  // brand orange
    [...hexToRgb("#8B2E0A"), 0.7] as [number, number, number, number],  // dark cinder
  ];
  const weights = [0.3, 0.25, 0.15, 0.25, 0.05];
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

/** Cheap smooth value noise via layered sines. Not true Simplex but free + continuous. */
function vfield(x: number, y: number, t: number): [number, number] {
  // Two octaves for richness.
  const a1 = Math.sin(x * FLOW_SCALE + t * 0.6) + Math.cos(y * FLOW_SCALE * 1.3 + t * 0.4);
  const a2 = Math.sin(x * FLOW_SCALE * 2.1 + t * 0.9) + Math.cos(y * FLOW_SCALE * 1.7 - t * 0.5);
  const angle = a1 * 0.7 + a2 * 0.35;
  return [Math.cos(angle), Math.sin(angle)];
}

export const FLOW_PHASE: Phase = {
  id: "flow",
  stiffness: 0.06,
  jitterAmplitude: 0.004,

  computeTarget(count, time, mouse, _scroll, out) {
    if (!cachedSeeds || cachedSeeds.length !== count * 3) {
      cachedSeeds = buildSeeds(count);
    }
    const t = (time / 1000) * FLOW_SPEED;
    const mx = mouse[0] * 0.25;
    const my = mouse[1] * 0.25;
    for (let i = 0; i < count; i++) {
      const baseX = cachedSeeds[i * 3];
      const baseY = cachedSeeds[i * 3 + 1];
      const phase = cachedSeeds[i * 3 + 2];
      // Sample vector field at base position + personal phase offset.
      const [vx, vy] = vfield(
        baseX * 1.2 + phase * 0.5,
        baseY * 1.2 + phase * 0.5,
        t + phase * 6.28,
      );
      // Drift base position by the vector, with gentle centering spring.
      const driftAmp = 0.35;
      const targetX = baseX + vx * driftAmp + mx * 0.3;
      const targetY = baseY + vy * driftAmp - my * 0.3;
      // Z — particles on outer rim push forward for parallax.
      const r = Math.hypot(targetX, targetY);
      const targetZ = (r - 0.5) * 0.6 + Math.sin(t + phase * 4) * 0.05;
      out[i * 3] = targetX;
      out[i * 3 + 1] = targetY * 0.7; // slight widescreen squash
      out[i * 3 + 2] = targetZ;
    }
  },

  computeColor(count, time, out) {
    if (!cachedColors || cachedColors.length !== count * 4) {
      cachedColors = buildColors(count);
    }
    // Subtle brightness pulse — 4% amplitude, ~2s period.
    const pulse = 1 + 0.04 * Math.sin((time / 1000) * Math.PI);
    for (let i = 0; i < count; i++) {
      out[i * 4] = cachedColors[i * 4] * pulse;
      out[i * 4 + 1] = cachedColors[i * 4 + 1] * pulse;
      out[i * 4 + 2] = cachedColors[i * 4 + 2] * pulse;
      out[i * 4 + 3] = cachedColors[i * 4 + 3];
    }
  },
};
