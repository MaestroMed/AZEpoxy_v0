"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";

/**
 * Oven phase — four de cuisson thermolaquage à 200°C.
 *
 * Visuellement distinct du Molten Pool : ici on ne voit pas un bassin
 * liquide mais une NAPPE de chaleur qui monte en vagues, comme
 * l'infrarouge dans un four. Les particules sont arrangées en une
 * grille horizontale large, chacune respirant sur une sinusoïde Y
 * avec une température qui pulse.
 *
 * Température = couleur + amplitude du mouvement :
 *   Particules chaudes (blanc-jaune) oscillent plus fort et plus vite.
 *   Particules froides (rouge sombre) restent près de la ligne
 *   horizontale. Sur un cycle thermique de 6s, l'ensemble se
 *   réchauffe puis refroidit — respiration du four.
 */

const GRID_W = 1.9;                 // largeur horizontale totale
const BASELINE_Y = -0.05;            // hauteur de la ligne de base
const WAVE_AMPLITUDE = 0.55;         // hauteur max des flammes (unit)
const WAVE_SPEED_BASE = 0.45;        // rad/s de base
const THERMAL_CYCLE_SEC = 6;

let cachedSeeds: Float32Array | null = null;  // [col, row, tempOffset, speedMul]

function buildSeeds(count: number): Float32Array {
  const rand = mulberry32(0x07e10); // "oven" seed-ish
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    // Grid layout : each particle has a fixed column position + a
    // stable "row" that maps to height within the flame.
    out[i * 4] = (rand() - 0.5) * 2 * GRID_W;      // col (x base)
    out[i * 4 + 1] = Math.pow(rand(), 0.8);        // row factor [0..1]
                                                    // (pow < 1 biases toward
                                                    // the base, more density)
    out[i * 4 + 2] = rand();                        // personal thermal offset
    out[i * 4 + 3] = 0.7 + rand() * 0.6;            // oscillation speed mul
  }
  return out;
}

export const OVEN_PHASE: Phase = {
  id: "oven",
  stiffness: 0.08,
  jitterAmplitude: 0.0035,
  // Nappe de flammes pleine largeur — centrée.
  anchorPreference: "center",

  computeTarget(count, time, mouse, _scroll, out) {
    if (!cachedSeeds || cachedSeeds.length !== count * 4) {
      cachedSeeds = buildSeeds(count);
    }

    const t = time / 1000;
    // Mouse = "ouvrir/fermer la porte du four" : tilt global subtle.
    const tiltX = mouse[0] * 0.08;
    const tiltY = mouse[1] * 0.06;

    // Global thermal cycle (0..1 over THERMAL_CYCLE_SEC seconds).
    const cycleT = (t / THERMAL_CYCLE_SEC) % 1;
    // Gaussian-ish heating curve : peaks mid-cycle (0.5), tails off.
    const globalHeat = Math.exp(-Math.pow((cycleT - 0.5) * 3, 2));

    for (let i = 0; i < count; i++) {
      const col = cachedSeeds[i * 4];
      const row = cachedSeeds[i * 4 + 1];
      const thermalOffset = cachedSeeds[i * 4 + 2];
      const speedMul = cachedSeeds[i * 4 + 3];

      // Each particle's personal temperature : mix of global cycle
      // and its own phase offset. Hotter = higher and more oscillation.
      const personalHeat = Math.sin(t * 0.9 + thermalOffset * 6.28) * 0.5 + 0.5;
      const localHeat = globalHeat * 0.7 + personalHeat * 0.3;

      // X : stable column with tiny sinusoidal sway (convection).
      const swayX = Math.sin(t * WAVE_SPEED_BASE * speedMul + thermalOffset * 4) * 0.06 * localHeat;

      // Y : rises with heat. Higher rows (closer to top) rise more.
      const riseBase = row * WAVE_AMPLITUDE * localHeat;
      const pulse = Math.sin(t * 1.6 * speedMul + thermalOffset * 8) * 0.04 * localHeat;
      const yPos = BASELINE_Y + riseBase + pulse;

      // Z : hotter particles come forward slightly.
      const zPos = (localHeat - 0.5) * 0.25 + Math.sin(t * 1.1 + thermalOffset * 5) * 0.03;

      out[i * 3] = col + swayX + tiltX;
      out[i * 3 + 1] = yPos + tiltY;
      out[i * 3 + 2] = zPos;
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
    const cycleT = (t / THERMAL_CYCLE_SEC) % 1;
    const globalHeat = Math.exp(-Math.pow((cycleT - 0.5) * 3, 2));

    const cold = hexToRgb("#6B1F08");       // cinder / barely glowing
    const warm = hexToRgb("#E85D2C");       // brand orange
    const hot = hexToRgb("#FFB347");        // bright orange-yellow
    const incandescent = hexToRgb("#FFF2D5"); // near-white

    for (let i = 0; i < count; i++) {
      const row = cachedSeeds[i * 4 + 1];
      const thermalOffset = cachedSeeds[i * 4 + 2];
      const personalHeat = Math.sin(t * 0.9 + thermalOffset * 6.28) * 0.5 + 0.5;
      const localHeat = globalHeat * 0.7 + personalHeat * 0.3;

      // Height boosts perceived temperature : flames look hotter at the
      // top where they concentrate.
      const temp = Math.min(1, localHeat + row * 0.25);

      let r: number, g: number, b: number;
      if (temp < 0.33) {
        const u = temp / 0.33;
        r = cold[0] + (warm[0] - cold[0]) * u;
        g = cold[1] + (warm[1] - cold[1]) * u;
        b = cold[2] + (warm[2] - cold[2]) * u;
      } else if (temp < 0.7) {
        const u = (temp - 0.33) / 0.37;
        r = warm[0] + (hot[0] - warm[0]) * u;
        g = warm[1] + (hot[1] - warm[1]) * u;
        b = warm[2] + (hot[2] - warm[2]) * u;
      } else {
        const u = (temp - 0.7) / 0.3;
        r = hot[0] + (incandescent[0] - hot[0]) * u;
        g = hot[1] + (incandescent[1] - hot[1]) * u;
        b = hot[2] + (incandescent[2] - hot[2]) * u;
      }

      // Flicker per-particle (4% amplitude, high frequency) → feu vivant.
      const flicker = 1 + 0.04 * Math.sin(t * 8 + thermalOffset * 20);
      out[i * 4] = Math.min(1, r * flicker);
      out[i * 4 + 1] = Math.min(1, g * flicker);
      out[i * 4 + 2] = Math.min(1, b * flicker);
      // Alpha : chaud = opaque, froid = semi-transparent.
      out[i * 4 + 3] = 0.6 + temp * 0.35;
    }
  },
};
