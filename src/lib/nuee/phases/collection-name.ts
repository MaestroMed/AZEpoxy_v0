"use client";

import type { Phase } from "../types";
import { hexToRgb, mulberry32 } from "../utils";

/**
 * CollectionName — factory phase that forms arbitrary text in an
 * arbitrary accent color. Used on /couleurs-ral/[slug] pages so the
 * swarm spells out "PATINA" / "POLARIS" / … in the collection's accent.
 *
 * Cache is keyed by `(name, count)` because the sampled positions depend
 * on both. Building the bitmap is done once per (name, count) and reused
 * across frames.
 */

const SAMPLE_W = 768;
const SAMPLE_H = 256;

const targetCache = new Map<string, Float32Array>();
const colorCache = new Map<string, Float32Array>();

function buildTextTargets(text: string, count: number): Float32Array {
  const key = `${text}|${count}`;
  if (targetCache.has(key)) return targetCache.get(key)!;

  const out = new Float32Array(count * 3);
  if (typeof document === "undefined") return out;

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_W;
  canvas.height = SAMPLE_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return out;

  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  // Pick font size such that the text fills ~80% of width OR uses up to 85% height.
  let fontSize = Math.round(SAMPLE_H * 0.75);
  ctx.font = `900 ${fontSize}px "Outfit", system-ui, sans-serif`;
  while (ctx.measureText(text).width > SAMPLE_W * 0.9 && fontSize > 40) {
    fontSize -= 6;
    ctx.font = `900 ${fontSize}px "Outfit", system-ui, sans-serif`;
  }
  ctx.fillText(text.toUpperCase(), SAMPLE_W / 2, SAMPLE_H / 2);

  const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
  const opaque: number[] = [];
  for (let y = 0; y < SAMPLE_H; y += 2) {
    for (let x = 0; x < SAMPLE_W; x += 2) {
      if (data[(y * SAMPLE_W + x) * 4 + 3] > 200) opaque.push(x, y);
    }
  }

  if (opaque.length === 0) {
    targetCache.set(key, out);
    return out;
  }

  const rand = mulberry32(hashString(text));
  const aspect = SAMPLE_H / SAMPLE_W;
  const scale = 0.9;
  const n = opaque.length / 2;
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(rand() * n) * 2;
    const px = opaque[pick];
    const py = opaque[pick + 1];
    const jx = rand() * 2 - 1;
    const jy = rand() * 2 - 1;
    const nx = ((px + jx) / SAMPLE_W) * 2 - 1;
    const ny = -(((py + jy) / SAMPLE_H) * 2 - 1) * aspect;
    out[i * 3] = nx * scale;
    out[i * 3 + 1] = ny * scale;
    out[i * 3 + 2] = (rand() - 0.5) * 0.2;
  }
  targetCache.set(key, out);
  return out;
}

function buildTextColors(text: string, count: number, accentHex: string): Float32Array {
  const key = `${text}|${accentHex}|${count}`;
  if (colorCache.has(key)) return colorCache.get(key)!;

  const out = new Float32Array(count * 4);
  const rand = mulberry32(hashString(text + accentHex));
  const accent = hexToRgb(accentHex);
  // Variance palette: 70% accent, 30% light tint for sparkle.
  for (let i = 0; i < count; i++) {
    const tint = rand() > 0.7;
    if (tint) {
      // Mix accent with white at ~55%.
      out[i * 4] = accent[0] * 0.45 + 0.55;
      out[i * 4 + 1] = accent[1] * 0.45 + 0.55;
      out[i * 4 + 2] = accent[2] * 0.45 + 0.55;
      out[i * 4 + 3] = 0.95;
    } else {
      out[i * 4] = accent[0];
      out[i * 4 + 1] = accent[1];
      out[i * 4 + 2] = accent[2];
      out[i * 4 + 3] = 0.85 + rand() * 0.15;
    }
  }
  colorCache.set(key, out);
  return out;
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

/** Factory — returns a Phase object bound to the given name + accent. */
export function createCollectionNamePhase(name: string, accentHex: string): Phase {
  return {
    id: `collection-name-${name.toLowerCase()}`,
    stiffness: 0.08,
    jitterAmplitude: 0.0025,
    anchorPreference: "center",

    computeTarget(count, _time, mouse, _scroll, out) {
      const targets = buildTextTargets(name, count);
      const mx = mouse[0] * 0.02;
      const my = mouse[1] * 0.02;
      for (let i = 0; i < count; i++) {
        out[i * 3] = targets[i * 3] + mx;
        out[i * 3 + 1] = targets[i * 3 + 1] - my;
        out[i * 3 + 2] = targets[i * 3 + 2];
      }
    },

    computeColor(count, _time, out) {
      const src = buildTextColors(name, count, accentHex);
      out.set(src);
    },
  };
}
