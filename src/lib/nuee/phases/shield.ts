"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";

/**
 * Shield phase — "Une protection à vie".
 *
 * Les particules forment une couche dense, semi-sphérique, qui ondule
 * comme un champ de force. Métaphore visuelle de la protection
 * thermolaquée : pas une barrière rigide, mais un tissu vivant qui
 * s'adapte et absorbe les chocs.
 *
 * Construction :
 *   • Chaque particule a un (theta, phi) stable sur une sphère 3D
 *   • Le rayon oscille légèrement par-particule (3-5% d'amplitude) —
 *     le bouclier "respire"
 *   • La sphère rotate très lentement (0.08 rad/s)
 *   • Les particules proches du pôle tournent avec un léger twist
 *     (effet d'enveloppe qui tourne sur elle-même)
 *   • Palette cool metallic : acier → chrome → aurore
 */

const RADIUS_BASE = 0.68;
const RADIUS_PULSE_AMP = 0.04;       // respiration amplitude
const ROT_SPEED = 0.08;               // rad/s
const TWIST_FACTOR = 0.3;             // how much extra rotation near equator

let cachedSeeds: Float32Array | null = null;  // [theta, phi, pulseOffset, sparkleSeed]

function buildSeeds(count: number): Float32Array {
  const rand = mulberry32(0x5b1e1d);
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    // Uniform sphere distribution via rejection-ish using atan2 + acos.
    const theta = rand() * Math.PI * 2;                   // azimuth 0..2π
    const phi = Math.acos(2 * rand() - 1);                // inclination 0..π (uniform)
    out[i * 4] = theta;
    out[i * 4 + 1] = phi;
    out[i * 4 + 2] = rand() * Math.PI * 2;                // breathing offset
    out[i * 4 + 3] = rand();                               // sparkle seed
  }
  return out;
}

export const SHIELD_PHASE: Phase = {
  id: "shield",
  stiffness: 0.06,
  jitterAmplitude: 0.0025,
  // Sphère symétrique — reste centrée.
  anchorPreference: "center",

  computeTarget(count, time, mouse, _scroll, out) {
    if (!cachedSeeds || cachedSeeds.length !== count * 4) {
      cachedSeeds = buildSeeds(count);
    }

    const t = time / 1000;
    // Mouse = "push / press on the shield" — subtle deformation toward cursor.
    const pushX = mouse[0] * 0.08;
    const pushY = mouse[1] * 0.08;
    const rot = t * ROT_SPEED;

    for (let i = 0; i < count; i++) {
      const theta0 = cachedSeeds[i * 4];
      const phi = cachedSeeds[i * 4 + 1];
      const pulseOffset = cachedSeeds[i * 4 + 2];

      // Twist : rotation more pronounced near the equator (sin(phi) peak).
      const twist = rot + Math.sin(phi) * TWIST_FACTOR * Math.sin(t * 0.4);
      const theta = theta0 + twist;

      // Radius breathes per-particle.
      const r = RADIUS_BASE + Math.sin(t * 1.2 + pulseOffset) * RADIUS_PULSE_AMP;

      // Spherical → Cartesian (y-up).
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const x = Math.cos(theta) * sinPhi * r;
      const y = cosPhi * r * 0.9;                // slight vertical squash — feels like a dome over the scene
      const z = Math.sin(theta) * sinPhi * r;

      // Mouse deformation — particles on the "front" (z > 0) pushed by cursor
      // inward, particles on the "back" pulled outward. Subtle 3D feel.
      const frontFactor = z > 0 ? 1 : -0.3;
      out[i * 3] = x + pushX * frontFactor * (1 - Math.abs(z));
      out[i * 3 + 1] = y - pushY * frontFactor * (1 - Math.abs(z));
      out[i * 3 + 2] = z;
    }
  },

  computeColor(count, time, out) {
    if (!cachedSeeds) {
      for (let i = 0; i < count; i++) {
        out[i * 4] = 0.8; out[i * 4 + 1] = 0.85; out[i * 4 + 2] = 1.0; out[i * 4 + 3] = 0.85;
      }
      return;
    }

    const t = time / 1000;

    // Palette froide métallique.
    const steel = hexToRgb("#8FA4B8");          // acier brossé
    const chrome = hexToRgb("#D6E4F0");         // chrome clair
    const aurora = hexToRgb("#7DF0D8");         // aurore turquoise (rare)
    const orange = hexToRgb("#FFB088");         // accent chaud (rare, "impact absorbé")

    for (let i = 0; i < count; i++) {
      const phi = cachedSeeds[i * 4 + 1];
      const pulseOffset = cachedSeeds[i * 4 + 2];
      const sparkleSeed = cachedSeeds[i * 4 + 3];

      // Facing factor : closer to equator = more visible/bright.
      // Cos(phi - pi/2) = sin(phi), peaks at equator (phi = pi/2).
      const facing = Math.sin(phi);

      // Occasional sparkle — rare bright orange pulse (impact absorbé).
      const sparkleWave = Math.sin(t * 0.6 + sparkleSeed * 20);
      const isSparkle = sparkleWave > 0.92 && sparkleSeed < 0.08;
      // Occasional aurora pulse — a few particles flash cyan.
      const auroraWave = Math.sin(t * 0.4 + sparkleSeed * 9);
      const isAurora = auroraWave > 0.85 && sparkleSeed > 0.08 && sparkleSeed < 0.18;

      let r: number, g: number, b: number;
      if (isSparkle) {
        r = orange[0]; g = orange[1]; b = orange[2];
      } else if (isAurora) {
        r = aurora[0]; g = aurora[1]; b = aurora[2];
      } else {
        // Lerp steel → chrome based on breathing + facing.
        const u = 0.5 + 0.5 * Math.sin(t * 0.7 + pulseOffset);
        r = steel[0] + (chrome[0] - steel[0]) * u;
        g = steel[1] + (chrome[1] - steel[1]) * u;
        b = steel[2] + (chrome[2] - steel[2]) * u;
      }

      // Alpha : facing-dependent + overall breath.
      const alpha = 0.5 + facing * 0.35 + Math.sin(t * 1.1 + pulseOffset) * 0.05;
      out[i * 4] = r;
      out[i * 4 + 1] = g;
      out[i * 4 + 2] = b;
      out[i * 4 + 3] = Math.max(0.2, Math.min(0.95, alpha));
    }
  },
};
