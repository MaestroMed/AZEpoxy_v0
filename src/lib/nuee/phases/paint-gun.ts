"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32, smoothstep } from "../utils";

/**
 * Paint-Gun phase — the money shot.
 *
 * Split the particle pool into two roles:
 *   • ANCHORS (~25%): rigid — form the silhouette of a stylized paint gun
 *     on the left, positions sampled from an offscreen bitmap so the shape
 *     stays sharp regardless of particle count.
 *   • SPRAY  (~75%): dynamic — each particle traces a parametric trajectory
 *     from the gun's nozzle outward, with cone spread + noise curl. Color
 *     and alpha cycle along the trajectory: orange/white near the nozzle,
 *     fading to cinder at the far edge, then WARPING back to the nozzle
 *     (the respawn is hidden by the alpha fade, so it looks continuous).
 *
 * We keep Phase stateless by expressing each spray particle's state as a
 * pure function of `(time + personalSeed) mod cycleLength`.
 */

const GUN_CANVAS_W = 512;
const GUN_CANVAS_H = 256;

// Gun positioned in the LEFT quarter of the screen — we want empty space
// on the right for the spray to fan out cinematically.
const ANCHOR_SCALE = 0.6;
const GUN_OFFSET_X = -0.5;
const GUN_OFFSET_Y = 0.1;
const NOZZLE_LOCAL = { x: 0.46, y: 0.0 };  // in unit-box local coords (±1)
const NOZZLE_WORLD = {
  x: GUN_OFFSET_X + NOZZLE_LOCAL.x * ANCHOR_SCALE,
  y: GUN_OFFSET_Y + NOZZLE_LOCAL.y * ANCHOR_SCALE,
};

// Trajectory tuning
const CYCLE_SEC = 2.4;                 // full spray traversal
const SPREAD_ANGLE = Math.PI / 5;      // ±36° cone
const BASE_SPEED = 1.1;                // units traversed per cycle
const CURL_AMPLITUDE = 0.18;            // perpendicular sway

let cachedAnchorPositions: Float32Array | null = null;
let cachedIsAnchor: Uint8Array | null = null;
let cachedSpraySeeds: Float32Array | null = null;

function sampleGunSilhouette(): Array<[number, number]> {
  const canvas = document.createElement("canvas");
  canvas.width = GUN_CANVAS_W;
  canvas.height = GUN_CANVAS_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";

  // Schematic paint gun — chunky, readable at particle density.
  // Body box.
  const cx = GUN_CANVAS_W * 0.38;
  const cy = GUN_CANVAS_H * 0.48;

  // Main body (trapezoidal).
  ctx.beginPath();
  ctx.moveTo(cx - 80, cy - 32);
  ctx.lineTo(cx + 40, cy - 32);
  ctx.lineTo(cx + 40, cy + 18);
  ctx.lineTo(cx - 80, cy + 22);
  ctx.closePath();
  ctx.fill();

  // Barrel (extending to the nozzle on the right).
  ctx.beginPath();
  ctx.moveTo(cx + 40, cy - 14);
  ctx.lineTo(cx + 170, cy - 6);
  ctx.lineTo(cx + 180, cy + 6);
  ctx.lineTo(cx + 40, cy + 8);
  ctx.closePath();
  ctx.fill();

  // Handle (angled down-left).
  ctx.beginPath();
  ctx.moveTo(cx - 70, cy + 22);
  ctx.lineTo(cx - 36, cy + 22);
  ctx.lineTo(cx - 24, cy + 82);
  ctx.lineTo(cx - 78, cy + 78);
  ctx.closePath();
  ctx.fill();

  // Trigger guard (small curved notch).
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 22);
  ctx.lineTo(cx - 8, cy + 22);
  ctx.lineTo(cx - 2, cy + 46);
  ctx.lineTo(cx - 34, cy + 50);
  ctx.closePath();
  ctx.fill();

  // Top cup (paint reservoir — makes it read as a spray gun).
  ctx.beginPath();
  ctx.moveTo(cx - 32, cy - 32);
  ctx.lineTo(cx - 10, cy - 62);
  ctx.lineTo(cx + 18, cy - 62);
  ctx.lineTo(cx + 22, cy - 32);
  ctx.closePath();
  ctx.fill();

  const data = ctx.getImageData(0, 0, GUN_CANVAS_W, GUN_CANVAS_H).data;
  const opaque: Array<[number, number]> = [];
  for (let y = 0; y < GUN_CANVAS_H; y += 2) {
    for (let x = 0; x < GUN_CANVAS_W; x += 2) {
      if (data[(y * GUN_CANVAS_W + x) * 4 + 3] > 200) {
        // Map to [-1..1] normalized box.
        const nx = (x / GUN_CANVAS_W) * 2 - 1;
        const ny = -((y / GUN_CANVAS_H) * 2 - 1) * (GUN_CANVAS_H / GUN_CANVAS_W);
        opaque.push([nx, ny]);
      }
    }
  }
  return opaque;
}

function buildAnchors(count: number): { positions: Float32Array; isAnchor: Uint8Array } {
  const isAnchor = new Uint8Array(count);
  const positions = new Float32Array(count * 3); // anchor positions only; spray uses seeds

  if (typeof document === "undefined") return { positions, isAnchor };

  const rand = mulberry32(0x9a1);
  const anchorCount = Math.floor(count * 0.25);
  const silhouette = sampleGunSilhouette();
  if (silhouette.length === 0) {
    return { positions, isAnchor };
  }

  for (let i = 0; i < anchorCount; i++) {
    isAnchor[i] = 1;
    const [px, py] = silhouette[Math.floor(rand() * silhouette.length)];
    const jx = (rand() - 0.5) * 0.015;
    const jy = (rand() - 0.5) * 0.015;
    positions[i * 3] = GUN_OFFSET_X + px * ANCHOR_SCALE + jx;
    positions[i * 3 + 1] = GUN_OFFSET_Y + py * ANCHOR_SCALE + jy;
    positions[i * 3 + 2] = (rand() - 0.5) * 0.12;
  }
  // Spray indices leave `isAnchor` zero.
  return { positions, isAnchor };
}

function buildSpraySeeds(count: number): Float32Array {
  // Per-particle seeds: [angleOffset, speedMul, curlPhase, lifeOffset]
  const rand = mulberry32(0x9b2);
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    out[i * 4] = (rand() - 0.5) * 2 * SPREAD_ANGLE; // angle within cone
    out[i * 4 + 1] = 0.8 + rand() * 0.4;            // speed multiplier
    out[i * 4 + 2] = rand() * Math.PI * 2;          // curl phase
    out[i * 4 + 3] = rand() * CYCLE_SEC;            // life offset (desync respawns)
  }
  return out;
}

export const PAINT_GUN_PHASE: Phase = {
  id: "paint-gun",
  stiffness: 0.12,       // snappier — the shape should read immediately
  jitterAmplitude: 0.0015,
  // Spray particles MUST exit the frame on the right to read as real
  // projection. Opt out of the engine's viewport boundary clamp.
  boundary: false,

  computeTarget(count, time, mouse, _scroll, out) {
    if (
      !cachedAnchorPositions ||
      cachedAnchorPositions.length !== count * 3 ||
      !cachedIsAnchor ||
      cachedIsAnchor.length !== count ||
      !cachedSpraySeeds ||
      cachedSpraySeeds.length !== count * 4
    ) {
      const b = buildAnchors(count);
      cachedAnchorPositions = b.positions;
      cachedIsAnchor = b.isAnchor;
      cachedSpraySeeds = buildSpraySeeds(count);
    }

    const t = time / 1000;
    // Mouse "aim" — slightly deflects spray direction toward cursor.
    const aimX = mouse[0] * 0.25;
    const aimY = mouse[1] * 0.25;

    for (let i = 0; i < count; i++) {
      if (cachedIsAnchor[i]) {
        out[i * 3] = cachedAnchorPositions[i * 3];
        out[i * 3 + 1] = cachedAnchorPositions[i * 3 + 1];
        out[i * 3 + 2] = cachedAnchorPositions[i * 3 + 2];
        continue;
      }

      const s0 = cachedSpraySeeds[i * 4];       // angle
      const s1 = cachedSpraySeeds[i * 4 + 1];   // speed mul
      const s2 = cachedSpraySeeds[i * 4 + 2];   // curl phase
      const s3 = cachedSpraySeeds[i * 4 + 3];   // life offset

      // Life in [0..1] for this particle's current cycle.
      const life = ((t + s3) % CYCLE_SEC) / CYCLE_SEC;

      // Direction: base to the right + personal cone angle + aim.
      const dirAngle = s0 + aimY * 0.6;       // mouse Y rotates the cone up/down
      const speed = BASE_SPEED * s1 * (1 + aimX * 0.2);

      // Parametric trajectory:
      //   x grows linearly with life (scaled by speed)
      //   y drifts perpendicular to base direction + slow curl noise
      const traveled = life * speed;
      const perp = Math.sin(t * 1.8 + s2) * CURL_AMPLITUDE * life;

      const bx = Math.cos(dirAngle) * traveled;
      const by = Math.sin(dirAngle) * traveled;
      const nx = NOZZLE_WORLD.x + bx + perp * -Math.sin(dirAngle);
      const ny = NOZZLE_WORLD.y + by + perp * Math.cos(dirAngle);
      // Z drift — spray particles swing forward then back for depth life.
      const nz = Math.sin(life * Math.PI) * 0.18 + Math.cos(t + s2) * 0.02;

      out[i * 3] = nx;
      out[i * 3 + 1] = ny;
      out[i * 3 + 2] = nz;
    }
  },

  computeColor(count, time, out) {
    if (!cachedIsAnchor || !cachedSpraySeeds) {
      // Uninitialized path — emit neutral color until first computeTarget.
      for (let i = 0; i < count; i++) {
        out[i * 4] = 1;
        out[i * 4 + 1] = 0.5;
        out[i * 4 + 2] = 0.2;
        out[i * 4 + 3] = 0.9;
      }
      return;
    }

    const anchorColor = hexToRgb("#E85D2C"); // brand orange — gun body
    // Spray palette by life stage — indexed later.
    const hot = hexToRgb("#FFE4B5");         // near-white hot (nozzle)
    const mid = hexToRgb("#FF7A48");         // bright orange (mid-flight)
    const cool = hexToRgb("#8B2E0A");        // cinder (fade)

    const t = time / 1000;
    for (let i = 0; i < count; i++) {
      if (cachedIsAnchor[i]) {
        out[i * 4] = anchorColor[0];
        out[i * 4 + 1] = anchorColor[1];
        out[i * 4 + 2] = anchorColor[2];
        // Anchor body pulses gently — "the gun is primed".
        out[i * 4 + 3] = 0.85 + Math.sin(t * 2 + i * 0.01) * 0.08;
        continue;
      }
      const s3 = cachedSpraySeeds[i * 4 + 3];
      const life = ((t + s3) % CYCLE_SEC) / CYCLE_SEC;

      // Three-stop gradient: hot (0..0.15) → mid (0.15..0.6) → cool (0.6..1)
      let r: number, g: number, b: number;
      if (life < 0.15) {
        const u = life / 0.15;
        r = hot[0] + (mid[0] - hot[0]) * u;
        g = hot[1] + (mid[1] - hot[1]) * u;
        b = hot[2] + (mid[2] - hot[2]) * u;
      } else if (life < 0.6) {
        const u = (life - 0.15) / 0.45;
        r = mid[0] + (cool[0] - mid[0]) * u * 0.5;
        g = mid[1] + (cool[1] - mid[1]) * u * 0.5;
        b = mid[2] + (cool[2] - mid[2]) * u * 0.5;
      } else {
        const u = (life - 0.6) / 0.4;
        r = mid[0] * (1 - u * 0.7) + cool[0] * u * 0.7;
        g = mid[1] * (1 - u * 0.7) + cool[1] * u * 0.7;
        b = mid[2] * (1 - u * 0.7) + cool[2] * u * 0.7;
      }

      // Alpha: fade-in at spawn, strong middle, fade-out at end.
      const alphaFadeIn = smoothstep(0, 0.12, life);
      const alphaFadeOut = 1 - smoothstep(0.7, 1, life);
      const alpha = alphaFadeIn * alphaFadeOut * 0.95;

      out[i * 4] = r;
      out[i * 4 + 1] = g;
      out[i * 4 + 2] = b;
      out[i * 4 + 3] = alpha;
    }
  },
};
