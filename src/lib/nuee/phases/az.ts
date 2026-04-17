"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";
import { POPULAR_RAL, RAL_COLORS } from "@/lib/ral-colors";

/**
 * AZ phase — the identity beat of the hero.
 *
 * Particles form a two-line logotype:
 *   ▸ Line 1 — "AZ"        (huge, the signature letters)
 *   ▸ Line 2 — "ÉPOXY"     (medium, wordmark)
 * with a thin "THERMOLAQUAGE POUDRE · ÎLE-DE-FRANCE" caption underneath.
 *
 * Colors are NOT static — a subset of particles slowly cycles through the
 * RAL palette (the product we sell), picking a hue every ~6s and lerping
 * smoothly to the next. The remaining particles stay cold-white/cyan for
 * crisp sparkle highlights against the dark hero.
 *
 * Horizontal page-level bias is applied at the engine level via
 * store.anchorOffsetX — this phase keeps the logotype locally centered.
 */

// Hero logotype layout is drawn into a 1024×512 bitmap.
const SAMPLE_W = 1024;
const SAMPLE_H = 512;

let cachedTargets: Float32Array | null = null;
let cachedPersonalities: Float32Array | null = null;
// Per-particle role: 0 = RAL-cycling, 1 = cold sparkle. Stored as a
// Uint8Array so we can check it cheaply inside the per-frame color loop.
let cachedRoles: Uint8Array | null = null;

const SAMPLE_POPULAR_ONLY = POPULAR_RAL.length >= 8 ? POPULAR_RAL : RAL_COLORS;

/** Draw the logotype into an offscreen canvas and return all opaque (x,y). */
function sampleLogotype(): Array<[number, number]> {
  if (typeof document === "undefined") return [];
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_W;
  canvas.height = SAMPLE_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";

  // ── Line 1 — "AZ" — dominant, heavy weight.
  ctx.font = `900 320px "Outfit", system-ui, sans-serif`;
  ctx.fillText("AZ", SAMPLE_W / 2, 310);

  // ── Line 2 — "ÉPOXY" — medium, letter-spaced.
  ctx.font = `500 82px "Outfit", system-ui, sans-serif`;
  // Manual letter-spacing for bitmap mode (ctx.letterSpacing is spotty).
  const epoxy = "ÉPOXY";
  const epoxyWidth = ctx.measureText(epoxy).width;
  const spacing = 12;
  const totalW = epoxyWidth + spacing * (epoxy.length - 1);
  let x = (SAMPLE_W - totalW) / 2;
  ctx.textAlign = "left";
  for (const ch of epoxy) {
    ctx.fillText(ch, x, 410);
    x += ctx.measureText(ch).width + spacing;
  }

  // ── Line 3 — tagline — small, letter-spaced.
  ctx.font = `400 28px "Outfit", system-ui, sans-serif`;
  const tag = "THERMOLAQUAGE POUDRE · ÎLE-DE-FRANCE";
  const tagWidth = ctx.measureText(tag).width;
  const tagSpacing = 2;
  const tagTotal = tagWidth + tagSpacing * (tag.length - 1);
  x = (SAMPLE_W - tagTotal) / 2;
  for (const ch of tag) {
    ctx.fillText(ch, x, 470);
    x += ctx.measureText(ch).width + tagSpacing;
  }

  const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
  const opaque: Array<[number, number]> = [];
  for (let y = 0; y < SAMPLE_H; y += 2) {
    for (let x = 0; x < SAMPLE_W; x += 2) {
      if (data[(y * SAMPLE_W + x) * 4 + 3] > 180) {
        opaque.push([x, y]);
      }
    }
  }
  return opaque;
}

/** Build per-particle target positions sampled from the logotype bitmap. */
function buildTargets(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const opaque = sampleLogotype();
  if (opaque.length === 0) return out;

  const rand = mulberry32(0xa2 ^ count);
  const aspect = SAMPLE_H / SAMPLE_W;
  const scale = 0.88;
  const n = opaque.length;
  for (let i = 0; i < count; i++) {
    const [px, py] = opaque[Math.floor(rand() * n)];
    const jx = (rand() - 0.5) * 1.6;
    const jy = (rand() - 0.5) * 1.6;
    const nx = (((px + jx) / SAMPLE_W) * 2 - 1) * scale;
    const ny = -(((py + jy) / SAMPLE_H) * 2 - 1) * aspect * scale;
    out[i * 3] = nx;
    out[i * 3 + 1] = ny;
    out[i * 3 + 2] = (rand() - 0.5) * 0.18;
  }
  return out;
}

/** Per-particle personality: [phaseOffset, pulsePhase, satJitter, hueDriftSpeed]. */
function buildPersonalities(count: number): Float32Array {
  const rand = mulberry32(0xa3);
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    out[i * 4] = rand() * Math.PI * 2;           // cycle phase offset
    out[i * 4 + 1] = rand() * Math.PI * 2;       // brightness pulse offset
    out[i * 4 + 2] = 0.85 + rand() * 0.3;        // saturation jitter (0.85..1.15)
    out[i * 4 + 3] = 0.9 + rand() * 0.35;        // hue drift speed (0.9..1.25)
  }
  return out;
}

/** Per-particle role assignment (0=RAL, 1=cold sparkle) — ~20% sparkle. */
function buildRoles(count: number): Uint8Array {
  const rand = mulberry32(0xa4);
  const out = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    out[i] = rand() < 0.2 ? 1 : 0;
  }
  return out;
}

// ── RAL cycling ─────────────────────────────────────────────────────────
// How long we dwell on each RAL color before morphing to the next.
const RAL_DWELL_MS = 3200;
const RAL_BLEND_MS = 1800;
const RAL_CYCLE_MS = RAL_DWELL_MS + RAL_BLEND_MS;

/** Pick two consecutive RAL hues + blend factor based on time. */
function ralColorAt(timeMs: number): [number, number, number] {
  const n = SAMPLE_POPULAR_ONLY.length;
  const totalT = timeMs / RAL_CYCLE_MS;
  const i = Math.floor(totalT) % n;
  const j = (i + 1) % n;
  const frac = totalT - Math.floor(totalT);      // 0..1 within this slot
  const blendT = Math.max(0, Math.min(1, (frac * RAL_CYCLE_MS - RAL_DWELL_MS) / RAL_BLEND_MS));
  const c1 = hexToRgb(SAMPLE_POPULAR_ONLY[i].hex);
  const c2 = hexToRgb(SAMPLE_POPULAR_ONLY[j].hex);
  return [
    c1[0] + (c2[0] - c1[0]) * blendT,
    c1[1] + (c2[1] - c1[1]) * blendT,
    c1[2] + (c2[2] - c1[2]) * blendT,
  ];
}

/** Cold-sparkle palette — crisp highlights that read above the RAL cloud. */
const SPARKLE_COLORS: Array<[number, number, number]> = [
  hexToRgb("#E6F5FF"), // near-white cyan
  hexToRgb("#B8E0FF"), // ice blue
  hexToRgb("#FFFFFF"), // pure white
  hexToRgb("#A7D3FF"), // pale sky
];

export const AZ_PHASE: Phase = {
  id: "az",
  stiffness: 0.08,
  jitterAmplitude: 0.0018,

  computeTarget(count, _time, mouse, _scroll, out) {
    if (!cachedTargets || cachedTargets.length !== count * 3) {
      cachedTargets = buildTargets(count);
    }
    // Light mouse parallax — feels like the letters breathe under the cursor.
    const mx = mouse[0] * 0.025;
    const my = mouse[1] * 0.025;
    for (let i = 0; i < count; i++) {
      out[i * 3] = cachedTargets[i * 3] + mx;
      out[i * 3 + 1] = cachedTargets[i * 3 + 1] - my;
      out[i * 3 + 2] = cachedTargets[i * 3 + 2];
    }
  },

  computeColor(count, time, out) {
    if (!cachedPersonalities || cachedPersonalities.length !== count * 4) {
      cachedPersonalities = buildPersonalities(count);
    }
    if (!cachedRoles || cachedRoles.length !== count) {
      cachedRoles = buildRoles(count);
    }

    // Current RAL hue, blended across the transition between two codes.
    const [rr, rg, rb] = ralColorAt(time);
    // Global brightness pulse — ~6% amplitude, 3.5s period.
    const tSec = time / 1000;
    const globalPulse = 1 + 0.06 * Math.sin(tSec * (Math.PI / 1.75));

    for (let i = 0; i < count; i++) {
      const role = cachedRoles[i];
      const satJit = cachedPersonalities[i * 4 + 2];
      const pulseOff = cachedPersonalities[i * 4 + 1];
      const perPart = 1 + 0.1 * Math.sin(tSec * 1.8 + pulseOff);
      const brightness = globalPulse * perPart;

      if (role === 1) {
        // Cold sparkle — tinted slightly by the RAL hue so it harmonizes,
        // but stays mostly white/cyan to pop above the cloud.
        const palette = SPARKLE_COLORS[i % SPARKLE_COLORS.length];
        out[i * 4] = Math.min(1, (palette[0] * 0.82 + rr * 0.18) * brightness);
        out[i * 4 + 1] = Math.min(1, (palette[1] * 0.82 + rg * 0.18) * brightness);
        out[i * 4 + 2] = Math.min(1, (palette[2] * 0.82 + rb * 0.18) * brightness);
        out[i * 4 + 3] = 0.95;
      } else {
        // RAL-cycling particle. Apply per-particle saturation jitter for life.
        // Mix the RAL hue with a tiny bit of warm-white to keep midtones
        // from going fully saturated (reads better against dark).
        const r = rr * 0.82 + 0.16;
        const g = rg * 0.82 + 0.16;
        const b = rb * 0.82 + 0.16;
        out[i * 4] = Math.min(1, r * satJit * brightness);
        out[i * 4 + 1] = Math.min(1, g * satJit * brightness);
        out[i * 4 + 2] = Math.min(1, b * satJit * brightness);
        out[i * 4 + 3] = 0.85;
      }
    }
  },
};

// No named PARTICLE_COUNT export anymore — the engine picks its own default.
