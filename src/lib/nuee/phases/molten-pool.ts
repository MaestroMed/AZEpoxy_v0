"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";

/**
 * Molten Pool phase — poétique du thermolaquage à 200°C.
 *
 * Un bassin elliptique de métal en fusion : les particules orbitent
 * lentement autour d'un centre, plus vite en périphérie qu'au cœur
 * (physique de piscine tourbillonnaire). Des rides de surface viennent
 * d'un noise empilé. ~8% des particules s'échappent vers le haut
 * comme de la vapeur, respawn à la surface (cycle 4s).
 *
 * Température = couleur :
 *   • Centre (r petit)   → blanc-jaune éclatant (#FFE4B5)
 *   • Milieu             → orange plein (#FF7A48)
 *   • Bord (r grand)     → orange foncé / cendre (#8B2E0A)
 *   • Vapeur qui s'élève → orange → transparent (fade sur life)
 */

const POOL_RADIUS = 0.78;           // rayon du bassin en unit space
const POOL_FLATTEN = 0.45;          // écrasement vertical (ellipse)
const STEAM_RATIO = 0.09;           // 9% des particules sont de la vapeur
const STEAM_CYCLE_SEC = 3.8;
const STEAM_RISE = 1.3;              // hauteur max au-dessus du bassin

let cachedSeeds: Float32Array | null = null;  // [angle, r, rotSpeed, phase] × N
let cachedRoles: Uint8Array | null = null;    // 0 = pool, 1 = steam

function buildSeeds(count: number): Float32Array {
  const rand = mulberry32(0xf1055);
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    out[i * 4] = rand() * Math.PI * 2;                    // base angle
    // sqrt(rand) gives uniform disc density; pow(.75) slightly
    // concentrates toward the hot center — feels more like real
    // molten metal where the core is densest.
    out[i * 4 + 1] = Math.pow(rand(), 0.75) * POOL_RADIUS; // base radius
    out[i * 4 + 2] = 0.18 + rand() * 0.35;                 // rotation speed rad/s
    out[i * 4 + 3] = rand();                                // personal phase
  }
  return out;
}

function buildRoles(count: number): Uint8Array {
  const rand = mulberry32(0xf1056);
  const out = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    out[i] = rand() < STEAM_RATIO ? 1 : 0;
  }
  return out;
}

/** Cheap surface ripple via layered sines — no Simplex dep. */
function ripple(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 4.1 + t * 0.9) * 0.012 +
    Math.cos(y * 3.7 + t * 1.2) * 0.010 +
    Math.sin((x + y) * 2.3 + t * 0.6) * 0.008
  );
}

// ── Color lerp helpers ─────────────────────────────────────────────────
const HOT_CORE = hexToRgb("#FFE4B5");   // near-white yellow
const MID_MELT = hexToRgb("#FF7A48");   // bright orange
const COOL_EDGE = hexToRgb("#8B2E0A");  // cinder
const STEAM_BASE = hexToRgb("#FFAB85");

function lerp3(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
  out: Float32Array,
  o: number,
) {
  out[o] = a[0] + (b[0] - a[0]) * t;
  out[o + 1] = a[1] + (b[1] - a[1]) * t;
  out[o + 2] = a[2] + (b[2] - a[2]) * t;
}

export const MOLTEN_POOL_PHASE: Phase = {
  id: "molten-pool",
  stiffness: 0.07,
  jitterAmplitude: 0.0025,

  computeTarget(count, time, mouse, _scroll, out) {
    if (!cachedSeeds || cachedSeeds.length !== count * 4) {
      cachedSeeds = buildSeeds(count);
    }
    if (!cachedRoles || cachedRoles.length !== count) {
      cachedRoles = buildRoles(count);
    }

    const t = time / 1000;
    // Mouse = "stir the pool" — slight tilt of the whole ellipse
    // toward the cursor, like leaning over a liquid surface.
    const tiltX = mouse[0] * 0.12;
    const tiltY = mouse[1] * 0.08;

    for (let i = 0; i < count; i++) {
      const role = cachedRoles[i];
      const a0 = cachedSeeds[i * 4];
      const r0 = cachedSeeds[i * 4 + 1];
      const rotSpeed = cachedSeeds[i * 4 + 2];
      const personalPhase = cachedSeeds[i * 4 + 3];

      if (role === 1) {
        // Steam: rise from the surface, narrow as it goes up, respawn.
        const life = ((t + personalPhase * STEAM_CYCLE_SEC) % STEAM_CYCLE_SEC) / STEAM_CYCLE_SEC;
        const spawnX = Math.cos(a0) * r0 * 0.8;
        const spawnY = Math.sin(a0) * r0 * POOL_FLATTEN * 0.8;
        const wiggle = Math.sin(t * 1.4 + personalPhase * 10) * 0.04 * (1 - life * 0.6);
        out[i * 3] = spawnX * (1 - life * 0.35) + wiggle + tiltX;
        out[i * 3 + 1] = spawnY + life * STEAM_RISE + tiltY;
        out[i * 3 + 2] = Math.sin(t * 0.7 + personalPhase) * 0.08;
      } else {
        // Pool: orbit + surface ripple.
        const theta = a0 + rotSpeed * t;
        const rippleAmp = ripple(
          Math.cos(theta) * r0,
          Math.sin(theta) * r0,
          t + personalPhase * 6.28,
        );
        const rr = r0 + rippleAmp;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        out[i * 3] = cosT * rr + tiltX;
        out[i * 3 + 1] = sinT * rr * POOL_FLATTEN + tiltY;
        // Z — center particles bubble upward (lava feel), edge dives down.
        const bubbling = Math.sin(t * 2 + personalPhase * 6) * 0.04;
        out[i * 3 + 2] = (POOL_RADIUS - r0) * 0.35 + bubbling;
      }
    }
  },

  computeColor(count, time, out) {
    if (!cachedSeeds || !cachedRoles) {
      for (let i = 0; i < count; i++) {
        out[i * 4] = 1;
        out[i * 4 + 1] = 0.5;
        out[i * 4 + 2] = 0.2;
        out[i * 4 + 3] = 0.9;
      }
      return;
    }

    const t = time / 1000;
    // Subtle heat flicker — the whole pool's glow pulses ~2% every ~1.5s.
    const flicker = 1 + 0.03 * Math.sin(t * 4.2);

    for (let i = 0; i < count; i++) {
      const role = cachedRoles[i];
      const r0 = cachedSeeds[i * 4 + 1];
      const phase = cachedSeeds[i * 4 + 3];

      if (role === 1) {
        // Steam: color fades with life.
        const life = ((t + phase * STEAM_CYCLE_SEC) % STEAM_CYCLE_SEC) / STEAM_CYCLE_SEC;
        lerp3(STEAM_BASE, COOL_EDGE, life, out, i * 4);
        out[i * 4] *= flicker;
        out[i * 4 + 1] *= flicker;
        out[i * 4 + 2] *= flicker;
        // Alpha rises then falls — visible mid-flight, invisible at spawn/die.
        const alpha =
          life < 0.15
            ? life / 0.15
            : life > 0.75
              ? (1 - life) / 0.25
              : 1;
        out[i * 4 + 3] = alpha * 0.7;
      } else {
        // Pool: temperature lerp. Hot core (r=0) → MID → cool edge.
        const tRad = r0 / POOL_RADIUS;
        if (tRad < 0.5) {
          lerp3(HOT_CORE, MID_MELT, tRad * 2, out, i * 4);
        } else {
          lerp3(MID_MELT, COOL_EDGE, (tRad - 0.5) * 2, out, i * 4);
        }
        // Per-particle breathing — slight brightness pulse.
        const breath = 1 + 0.08 * Math.sin(t * 1.5 + phase * 6.28);
        out[i * 4] = Math.min(1, out[i * 4] * flicker * breath);
        out[i * 4 + 1] = Math.min(1, out[i * 4 + 1] * flicker * breath);
        out[i * 4 + 2] = Math.min(1, out[i * 4 + 2] * flicker * breath);
        out[i * 4 + 3] = 0.88;
      }
    }
  },
};
