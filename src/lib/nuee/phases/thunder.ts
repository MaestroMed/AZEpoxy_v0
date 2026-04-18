"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";

/**
 * Thunder phase — nuée de tempête électrique.
 *
 * Fond : cloud dense en disque large + zigzag "éclairs" sporadiques qui
 * traversent l'écran et illuminent brièvement les particules à proximité.
 *
 * • Positions de base : cloud en disque irrégulier (perlin-ish via
 *   layered sines), drift léger.
 * • Eclairs : chaque 1.5-3s, un éclair démarre à une position random
 *   en haut, descend en zigzag jusqu'en bas. Pendant qu'il passe, les
 *   particules dans sa zone brightness-spike.
 * • Palette : gris orage → bleu froid → blanc éclair (les particules
 *   proches de l'éclair passent temporairement en blanc).
 *
 * Pour l'instant pas assignée à une route — outil dans la boîte, à
 * déployer pour moments dramatiques (hero promo, page spéciale, etc.).
 */

const CLOUD_RADIUS_X = 1.1;
const CLOUD_RADIUS_Y = 0.65;
const DRIFT_SPEED = 0.12;

// Cache per-particle seeds [ baseX, baseY, baseZ, personalPhase ].
let cachedSeeds: Float32Array | null = null;

function buildSeeds(count: number): Float32Array {
  const rand = mulberry32(0xe1ec);
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    // Uniform-ish disk via polar (sqrt for uniform density).
    const ang = rand() * Math.PI * 2;
    const r = Math.sqrt(rand());
    out[i * 4] = Math.cos(ang) * r * CLOUD_RADIUS_X;
    out[i * 4 + 1] = Math.sin(ang) * r * CLOUD_RADIUS_Y;
    out[i * 4 + 2] = (rand() - 0.5) * 0.4;
    out[i * 4 + 3] = rand() * Math.PI * 2;
  }
  return out;
}

/**
 * Generate a lightning bolt path as series of points.
 * Triggered sporadically, moves top → bottom in zigzag.
 * Returns null if no bolt is currently active.
 */
function currentBolt(timeSec: number): { x0: number; y0: number; progress: number; zigzagSeed: number } | null {
  // Bolts start at integer seconds (approximately), spaced 1.8-3.2s apart.
  // Use a deterministic schedule based on time intervals.
  const intervalLength = 2.4;
  const slotIndex = Math.floor(timeSec / intervalLength);
  const slotStart = slotIndex * intervalLength;
  const slotOffset = ((slotIndex * 0.6180339887) % 1) * 1.0; // golden-ratio hash for variety
  const boltStart = slotStart + slotOffset;
  const boltDuration = 0.55;

  if (timeSec < boltStart || timeSec > boltStart + boltDuration) return null;

  const progress = (timeSec - boltStart) / boltDuration;
  // Starting X : deterministic per slot.
  const rand = mulberry32(slotIndex * 1103515245);
  const x0 = (rand() - 0.5) * 1.8;
  const y0 = 0.8; // top of cloud
  return { x0, y0, progress, zigzagSeed: rand() };
}

/** Compute current bolt tip position (x, y) at `progress` along its path. */
function boltTip(bolt: { x0: number; y0: number; progress: number; zigzagSeed: number }) {
  const p = bolt.progress;
  // Y descends from +0.8 to -0.8.
  const y = bolt.y0 - p * 1.6;
  // X zigzags with deterministic noise based on seed and progress.
  const zigAmp = 0.22;
  const zig = Math.sin(p * 18 + bolt.zigzagSeed * 12) * zigAmp * (1 - p * 0.3);
  return { x: bolt.x0 + zig, y };
}

export const THUNDER_PHASE: Phase = {
  id: "thunder",
  stiffness: 0.06,
  jitterAmplitude: 0.003,
  anchorPreference: "center",

  computeTarget(count, time, mouse, _scroll, out) {
    if (!cachedSeeds || cachedSeeds.length !== count * 4) {
      cachedSeeds = buildSeeds(count);
    }

    const t = time / 1000;
    // Mouse = léger déplacement collectif du cloud.
    const mx = mouse[0] * 0.06;
    const my = mouse[1] * 0.06;

    for (let i = 0; i < count; i++) {
      const baseX = cachedSeeds[i * 4];
      const baseY = cachedSeeds[i * 4 + 1];
      const baseZ = cachedSeeds[i * 4 + 2];
      const phase = cachedSeeds[i * 4 + 3];

      // Slow drift — cloud swirls gently.
      const driftX = Math.sin(t * DRIFT_SPEED + phase) * 0.08;
      const driftY = Math.cos(t * DRIFT_SPEED * 0.7 + phase * 1.3) * 0.05;

      out[i * 3] = baseX + driftX + mx;
      out[i * 3 + 1] = baseY + driftY + my;
      out[i * 3 + 2] = baseZ + Math.sin(t * 0.9 + phase) * 0.05;
    }
  },

  computeColor(count, time, out) {
    if (!cachedSeeds) {
      for (let i = 0; i < count; i++) {
        out[i * 4] = 0.7; out[i * 4 + 1] = 0.75; out[i * 4 + 2] = 0.9; out[i * 4 + 3] = 0.8;
      }
      return;
    }

    const t = time / 1000;
    const stormGray = hexToRgb("#4A5568");
    const coldBlue = hexToRgb("#7F94B5");
    const flashWhite = hexToRgb("#F0F7FF");
    const hotAccent = hexToRgb("#FFE1A8");

    const bolt = currentBolt(t);
    const tip = bolt ? boltTip(bolt) : null;

    for (let i = 0; i < count; i++) {
      const baseX = cachedSeeds[i * 4];
      const baseY = cachedSeeds[i * 4 + 1];
      const phase = cachedSeeds[i * 4 + 3];

      // Base : gradient storm-gray → cold-blue based on height.
      const hFactor = (baseY + CLOUD_RADIUS_Y) / (CLOUD_RADIUS_Y * 2); // 0..1
      const baseR = stormGray[0] + (coldBlue[0] - stormGray[0]) * hFactor;
      const baseG = stormGray[1] + (coldBlue[1] - stormGray[1]) * hFactor;
      const baseB = stormGray[2] + (coldBlue[2] - stormGray[2]) * hFactor;

      // Subtle breath pulse — storm's rumble.
      const breath = 1 + 0.04 * Math.sin(t * 0.8 + phase * 2);

      // Proximity to lightning bolt — particles within ~0.3 unit flash white.
      let flash = 0;
      if (tip) {
        const dx = baseX - tip.x;
        const dy = baseY - tip.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.45) {
          // Gaussian falloff, scaled by bolt "intensity" (peaks mid-bolt).
          const intensity = Math.sin(bolt!.progress * Math.PI);
          flash = Math.exp(-dist * dist * 25) * intensity;
        }
      }

      let r = baseR * breath;
      let g = baseG * breath;
      let b = baseB * breath;
      if (flash > 0) {
        // Mix toward flash-white, then toward hot accent on peak.
        const u = Math.min(1, flash * 1.4);
        r = r * (1 - u) + (u > 0.8 ? hotAccent[0] : flashWhite[0]) * u;
        g = g * (1 - u) + (u > 0.8 ? hotAccent[1] : flashWhite[1]) * u;
        b = b * (1 - u) + (u > 0.8 ? hotAccent[2] : flashWhite[2]) * u;
      }

      out[i * 4] = Math.min(1, r);
      out[i * 4 + 1] = Math.min(1, g);
      out[i * 4 + 2] = Math.min(1, b);
      out[i * 4 + 3] = 0.72 + flash * 0.28;
    }
  },
};
