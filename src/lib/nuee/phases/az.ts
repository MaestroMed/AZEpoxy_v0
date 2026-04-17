"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";

/**
 * AZ phase — particles form the letters "AZ" in the hero.
 *
 * We sample the target positions by rendering the text to an offscreen
 * canvas once (on first use), reading back the alpha channel, and picking
 * `N` random opaque pixels. The sampled positions are stored as normalized
 * device coordinates (-1..1) in a cached Float32Array.
 *
 * This approach means we can swap the text for anything else (collection
 * names, section titles) without touching shaders.
 */

const TEXT = "AZ";
const SAMPLE_CANVAS_W = 512;
const SAMPLE_CANVAS_H = 256;
const PARTICLE_COUNT = 3000;

let cachedTargets: Float32Array | null = null;
let cachedColors: Float32Array | null = null;

/** Build a (count*3) Float32Array of normalized x,y,z positions sampled from opaque text pixels. */
function buildTargets(count: number): Float32Array {
  if (typeof document === "undefined") {
    // SSR — return zeros; engine only runs client-side anyway.
    return new Float32Array(count * 3);
  }

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_CANVAS_W;
  canvas.height = SAMPLE_CANVAS_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array(count * 3);

  // Render the text as big and bold as possible.
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  // font-display stack mimicking our "Outfit" display font fallback;
  // the exact glyph doesn't matter, shape is what matters.
  ctx.font = `900 ${SAMPLE_CANVAS_H * 0.85}px "Outfit", system-ui, sans-serif`;
  ctx.fillText(TEXT, SAMPLE_CANVAS_W / 2, SAMPLE_CANVAS_H / 2);

  const data = ctx.getImageData(0, 0, SAMPLE_CANVAS_W, SAMPLE_CANVAS_H).data;

  // Collect all opaque pixel coordinates.
  const opaque: number[] = [];
  // Sparse sample every other pixel to keep memory small yet uniform.
  for (let y = 0; y < SAMPLE_CANVAS_H; y += 2) {
    for (let x = 0; x < SAMPLE_CANVAS_W; x += 2) {
      if (data[(y * SAMPLE_CANVAS_W + x) * 4 + 3] > 200) {
        opaque.push(x, y);
      }
    }
  }

  const rand = mulberry32(0xa2 ^ count);
  const out = new Float32Array(count * 3);
  const n = opaque.length / 2;

  if (n === 0) return out;

  // Aspect ratio — we want the text to look wide in our 16:9-ish hero.
  // Normalize x to [-1, 1] and y to [-aspect, aspect] with aspect such that
  // the text spans roughly 60% of horizontal screen.
  const aspect = SAMPLE_CANVAS_H / SAMPLE_CANVAS_W;
  const scale = 0.75;

  for (let i = 0; i < count; i++) {
    const pick = Math.floor(rand() * n) * 2;
    const px = opaque[pick];
    const py = opaque[pick + 1];
    // sub-pixel jitter for organic edges
    const jx = rand() * 2 - 1;
    const jy = rand() * 2 - 1;
    const nx = ((px + jx) / SAMPLE_CANVAS_W) * 2 - 1;
    const ny = -(((py + jy) / SAMPLE_CANVAS_H) * 2 - 1) * aspect;
    const nz = (rand() - 0.5) * 0.15; // slight Z depth for parallax feel
    out[i * 3] = nx * scale;
    out[i * 3 + 1] = ny * scale;
    out[i * 3 + 2] = nz;
  }

  return out;
}

/** Build per-particle colors — hot ember palette matching AZ brand. */
function buildColors(count: number): Float32Array {
  const rand = mulberry32(42);
  const out = new Float32Array(count * 4);
  const palette: Array<[number, number, number]> = [
    hexToRgb("#E85D2C"), // brand orange
    hexToRgb("#FF7A48"), // orange-light
    hexToRgb("#FFD7B8"), // pale ember
    hexToRgb("#C84818"), // orange-dark
  ];
  for (let i = 0; i < count; i++) {
    const [r, g, b] = palette[Math.floor(rand() * palette.length)];
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = 0.8 + rand() * 0.2;
  }
  return out;
}

export const AZ_PHASE: Phase = {
  id: "az",
  stiffness: 0.08,
  jitterAmplitude: 0.002,

  computeTarget(count, _time, mouse, _scroll, out) {
    if (!cachedTargets || cachedTargets.length !== count * 3) {
      cachedTargets = buildTargets(count);
    }
    // Copy cached targets — then offset slightly based on mouse for parallax "breath".
    const mx = mouse[0] * 0.02;
    const my = mouse[1] * 0.02;
    for (let i = 0; i < count; i++) {
      out[i * 3] = cachedTargets[i * 3] + mx;
      out[i * 3 + 1] = cachedTargets[i * 3 + 1] - my;
      out[i * 3 + 2] = cachedTargets[i * 3 + 2];
    }
  },

  computeColor(count, _time, out) {
    if (!cachedColors || cachedColors.length !== count * 4) {
      cachedColors = buildColors(count);
    }
    out.set(cachedColors);
  },
};

export { PARTICLE_COUNT };
