"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";
import { POPULAR_RAL, RAL_COLORS } from "@/lib/ral-colors";

/**
 * RAL Cascade phase — célébration du nuancier.
 *
 * Chaque particule garde sa propre teinte RAL au lieu de partager une
 * couleur globale (comme AZ phase). Les teintes changent individuellement
 * sur un cycle long avec phase offset per-particle → effet "champ de
 * confettis colorés qui respire".
 *
 * Les particules sont arrangées en un nuage en forme de colonne large
 * qui "tombe" lentement (drift Y) puis wraps — métaphore d'un catalogue
 * qu'on feuillette en continu.
 */

// Pre-compute the palette once (module-scoped, reused across mounts).
const PALETTE: Array<[number, number, number]> = (
  POPULAR_RAL.length >= 24 ? POPULAR_RAL : RAL_COLORS
).map((c) => hexToRgb(c.hex));

const CYCLE_SEC = 14;           // chaque particule renouvelle sa teinte sur ~14s
const DRIFT_SEC = 18;            // temps pour qu'une particule traverse l'écran
const CLOUD_WIDTH = 1.55;        // étendue horizontale
const CLOUD_HEIGHT = 1.8;         // étendue verticale (wraps around)

let cachedSeeds: Float32Array | null = null;
// [baseX, baseY, baseZ, size, ralOffset0..1, personalPulse]

function buildSeeds(count: number): Float32Array {
  const rand = mulberry32(0xca5cade);
  const out = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    out[i * 6] = (rand() - 0.5) * 2 * CLOUD_WIDTH;      // base x
    out[i * 6 + 1] = (rand() - 0.5) * CLOUD_HEIGHT;      // base y
    out[i * 6 + 2] = (rand() - 0.5) * 0.5;                // z scatter
    out[i * 6 + 3] = 0;                                    // reserved
    out[i * 6 + 4] = rand();                               // ral offset in palette (0..1)
    out[i * 6 + 5] = rand() * Math.PI * 2;                 // personal pulse phase
  }
  return out;
}

export const RAL_CASCADE_PHASE: Phase = {
  id: "ral-cascade",
  stiffness: 0.07,
  jitterAmplitude: 0.003,
  // Cascade pleine largeur — centré.
  anchorPreference: "center",

  computeTarget(count, time, mouse, _scroll, out) {
    if (!cachedSeeds || cachedSeeds.length !== count * 6) {
      cachedSeeds = buildSeeds(count);
    }

    const t = time / 1000;
    const mx = mouse[0] * 0.12;
    const my = mouse[1] * 0.08;
    const driftT = t / DRIFT_SEC; // 0..1 per cycle

    for (let i = 0; i < count; i++) {
      const baseX = cachedSeeds[i * 6];
      const baseY = cachedSeeds[i * 6 + 1];
      const baseZ = cachedSeeds[i * 6 + 2];
      const personalPulse = cachedSeeds[i * 6 + 5];

      // Slow vertical drift — particles fall from top, wrap at bottom.
      // Phase offset per particle so they don't all move in lockstep.
      const wrappedY = ((baseY - driftT * CLOUD_HEIGHT + personalPulse * 0.05)
        + CLOUD_HEIGHT * 10) % CLOUD_HEIGHT - CLOUD_HEIGHT / 2;

      // Subtle horizontal sway + mouse parallax.
      const sway = Math.sin(t * 0.35 + personalPulse) * 0.06;

      out[i * 3] = baseX + sway + mx;
      out[i * 3 + 1] = wrappedY + my;
      out[i * 3 + 2] = baseZ + Math.sin(t * 0.8 + personalPulse) * 0.04;
    }
  },

  computeColor(count, time, out) {
    if (!cachedSeeds) {
      for (let i = 0; i < count; i++) {
        out[i * 4] = 1; out[i * 4 + 1] = 0.5; out[i * 4 + 2] = 0.2; out[i * 4 + 3] = 0.9;
      }
      return;
    }

    const t = time / 1000;
    const nPalette = PALETTE.length;
    // Subtle global flicker to unify the cloud.
    const flicker = 1 + 0.04 * Math.sin(t * 0.8);

    for (let i = 0; i < count; i++) {
      const ralOffset = cachedSeeds[i * 6 + 4];
      const personalPulse = cachedSeeds[i * 6 + 5];

      // Each particle progresses through the palette independently.
      // Its offset into the palette = ralOffset (stable) + time progression.
      const progress = (t / CYCLE_SEC + ralOffset) % 1;
      const slot = progress * nPalette;
      const i0 = Math.floor(slot);
      const i1 = (i0 + 1) % nPalette;
      const f = slot - i0;
      const a = PALETTE[i0];
      const b = PALETTE[i1];

      // Per-particle breath pulse — 8% amplitude.
      const breath = 1 + 0.08 * Math.sin(t * 1.3 + personalPulse);

      out[i * 4] = Math.min(1, (a[0] + (b[0] - a[0]) * f) * flicker * breath);
      out[i * 4 + 1] = Math.min(1, (a[1] + (b[1] - a[1]) * f) * flicker * breath);
      out[i * 4 + 2] = Math.min(1, (a[2] + (b[2] - a[2]) * f) * flicker * breath);
      out[i * 4 + 3] = 0.88;
    }
  },
};
