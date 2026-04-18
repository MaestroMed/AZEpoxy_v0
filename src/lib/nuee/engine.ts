"use client";

/**
 * Narrative Swarm — WebGL2 engine.
 *
 * Keeps three particle-sized buffers alive for the lifetime of the page:
 *   • positions[count*3] — current (x,y,z), lerped each frame
 *   • colors[count*4]    — (r,g,b,a), updated per phase
 *   • sizes[count]       — base point size (varied per-particle)
 *
 * Each frame we:
 *   1. Ask the current phase to compute target positions (into `targetA`).
 *   2. If a transition is in flight, ask the target phase too (into `targetB`)
 *      and blend based on `transitionProgress`.
 *   3. Spring current positions toward that blended target.
 *   4. Upload positions to the GPU and draw gl.POINTS.
 */

import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shaders";
import { easeInOutCubic, mulberry32 } from "./utils";
import { getSwarm } from "./store";

export interface EngineHandle {
  dispose(): void;
  setParticleCount(n: number): void;
  getCanvas(): HTMLCanvasElement;
}

const DEFAULT_COUNT_DESKTOP = 3000;
const DEFAULT_COUNT_MOBILE = 1500;

export function pickDefaultCount(): number {
  if (typeof navigator === "undefined") return DEFAULT_COUNT_DESKTOP;
  // Cheap heuristic: mobile chipsets report 4-8 cores, laptops 8-16, desktops 16+.
  const cores = navigator.hardwareConcurrency ?? 4;
  const isCoarse = matchMedia?.("(pointer: coarse)")?.matches ?? false;
  if (isCoarse || cores < 6) return DEFAULT_COUNT_MOBILE;
  return DEFAULT_COUNT_DESKTOP;
}

// ── GL helpers ──────────────────────────────────────────────────────────
function compile(gl: WebGL2RenderingContext, src: string, type: number): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw new Error("createShader failed");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`shader compile: ${log}`);
  }
  return s;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const p = gl.createProgram();
  if (!p) throw new Error("createProgram failed");
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(`program link: ${log}`);
  }
  return p;
}

// ── Engine ──────────────────────────────────────────────────────────────
export function createEngine(canvas: HTMLCanvasElement): EngineHandle {
  const ctx = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    // premultipliedAlpha:false lets us use classic additive blending
    // (SRC_ALPHA, ONE) without the browser double-multiplying colors
    // during HTML compositing. Critical for visible glow.
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
  });
  if (!ctx) {
    throw new Error("WebGL2 unavailable");
  }
  // Explicit non-nullable binding so closures (frame loop, dispose, etc.)
  // don't need `!` or re-narrowing.
  const gl: WebGL2RenderingContext = ctx;

  // Program
  const vs = compile(gl, VERTEX_SHADER, gl.VERTEX_SHADER);
  const fs = compile(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
  const prog = link(gl, vs, fs);
  gl.useProgram(prog);

  // Uniforms
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uViewport = gl.getUniformLocation(prog, "u_viewport");
  const uDpr = gl.getUniformLocation(prog, "u_dpr");

  // Attribute locations
  const aPos = gl.getAttribLocation(prog, "a_pos");
  const aColor = gl.getAttribLocation(prog, "a_color");
  const aSize = gl.getAttribLocation(prog, "a_size");

  // Buffers — size chosen by init(count)
  const posBuf = gl.createBuffer()!;
  const colBuf = gl.createBuffer()!;
  const sizeBuf = gl.createBuffer()!;

  // Particle-sized arrays (reallocated when count changes)
  let count = 0;
  let positions = new Float32Array(0);          // current positions (lerped)
  let targetsA = new Float32Array(0);           // current phase's target
  let targetsB = new Float32Array(0);           // incoming phase's target
  let colorsA = new Float32Array(0);
  let colorsB = new Float32Array(0);
  let blendedColors = new Float32Array(0);
  let sizes = new Float32Array(0);

  function allocate(newCount: number) {
    count = newCount;
    positions = new Float32Array(count * 3);
    targetsA = new Float32Array(count * 3);
    targetsB = new Float32Array(count * 3);
    colorsA = new Float32Array(count * 4);
    colorsB = new Float32Array(count * 4);
    blendedColors = new Float32Array(count * 4);
    sizes = new Float32Array(count);

    // Boot state : start with particles VERY dispersed (wide cloud +
    // extra Z depth) so the first transition feels like a cosmic
    // "gathering" — particles swarm in from the dark toward whichever
    // phase is active at mount. Spring stiffness (0.08 default) takes
    // ~2s to fully settle, which is a beautiful first-visit moment
    // without stealing perceived load time.
    const rand = mulberry32(0x1234);
    for (let i = 0; i < count; i++) {
      // Ring-ish dispersion : many particles start OFF-screen in a
      // circle around the viewport edges, rushing inward.
      const ang = rand() * Math.PI * 2;
      const r = 1.8 + rand() * 1.2; // 1.8..3.0 — mostly off-screen
      positions[i * 3] = Math.cos(ang) * r;
      positions[i * 3 + 1] = Math.sin(ang) * r * 0.7;
      positions[i * 3 + 2] = (rand() - 0.5) * 1.2;
      // Sizes bumped — visibility on production compositing over dark
      // overlays was too faint at 2-4px. 4-9px reads much better as glow.
      sizes[i] = rand() < 0.03 ? 14 + rand() * 10 : 4 + rand() * 5;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
    gl.bufferData(gl.ARRAY_BUFFER, blendedColors, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  }

  // Viewport + DPR handling
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Fall back to window.innerWidth/Height if clientWidth returns 0.
    // This happens during the first paint on some SSR-hydration paths,
    // before CSS has laid out the canvas. Without the fallback the
    // canvas would lock to 1×1 forever.
    const w = canvas.clientWidth || window.innerWidth || 1024;
    const h = canvas.clientHeight || window.innerHeight || 768;
    const pw = Math.max(1, Math.round(w * dpr));
    const ph = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    gl.viewport(0, 0, pw, ph);
    gl.uniform2f(uViewport, pw, ph);
    gl.uniform1f(uDpr, dpr);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  // Also watch the window directly — some layout edge cases (particularly
  // the first frame in SSR-hydrated apps) don't trigger ResizeObserver on
  // a 0×0 element.
  window.addEventListener("resize", resize);
  resize();

  // Blending setup for that additive glow bloom.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  // Attribute wiring — done once per buffer; we re-use these bindings every frame.
  function bindAttribs() {
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
    gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);
  }

  // Initial allocation
  allocate(pickDefaultCount());
  bindAttribs();

  // ── Render loop ──────────────────────────────────────────────────────
  let prevTS = performance.now();
  let rafId = 0;
  const startTS = performance.now();

  function frame(ts: number) {
    rafId = requestAnimationFrame(frame);

    const dtMs = Math.min(64, ts - prevTS); // clamp big pauses to 64ms
    prevTS = ts;
    const tSec = (ts - startTS) / 1000;

    const state = getSwarm();
    if (state.paused) return;

    // Advance transition progress.
    if (state.targetPhase) state.tickTransition(dtMs);

    // Compute targets A (current phase).
    state.currentPhase.computeTarget(
      count,
      ts - startTS,
      state.mouse,
      state.scroll,
      targetsA,
    );
    state.currentPhase.computeColor?.(count, ts - startTS, colorsA);

    const transitionT = state.targetPhase
      ? easeInOutCubic(state.transitionProgress)
      : 0;

    const finalTargets = targetsA;
    let finalColors = colorsA;

    if (state.targetPhase) {
      state.targetPhase.computeTarget(
        count,
        ts - startTS,
        state.mouse,
        state.scroll,
        targetsB,
      );
      state.targetPhase.computeColor?.(count, ts - startTS, colorsB);
      // Blend A → B directly into positions' reference via a scratch (targetsA
      // is safe to overwrite — it was just used).
      for (let i = 0; i < count * 3; i++) {
        targetsA[i] = targetsA[i] * (1 - transitionT) + targetsB[i] * transitionT;
      }
      for (let i = 0; i < count * 4; i++) {
        blendedColors[i] = colorsA[i] * (1 - transitionT) + colorsB[i] * transitionT;
      }
      finalColors = blendedColors;
    } else {
      // Single phase — just copy the colors (slight perf waste but simple).
      blendedColors.set(colorsA);
      finalColors = blendedColors;
    }

    // ── Page-level anchor offset — applied to every target BEFORE the
    //    boundary clamp so the clamp still keeps everything in-frame
    //    after the shift. Homepage sets +0.4 on desktop to clear the
    //    heading block; collection pages leave it at 0.
    const anchorX = state.anchorOffsetX ?? 0;
    if (anchorX !== 0) {
      for (let i = 0; i < count; i++) {
        finalTargets[i * 3] += anchorX;
      }
    }

    // ── Viewport boundary — soft clamp to keep the swarm inside a safe
    //    rectangle. Makes the nuée feel adaptive: a wide window lets it
    //    breathe, a narrow one compresses it. Phases that need particles
    //    to exit the frame (paint-gun spray) can opt out via boundary:false.
    //    Desktop-only (≥768px) — mobile viewports are too narrow to notice.
    const boundaryCfg = state.currentPhase.boundary;
    const wpx = canvas.width || 1;
    const hpx = canvas.height || 1;
    if (boundaryCfg !== false && typeof window !== "undefined" && window.innerWidth >= 768) {
      const pad = (boundaryCfg && boundaryCfg.padding) ?? 0.08;
      const overshoot = (boundaryCfg && boundaryCfg.overshoot) ?? 0.25;
      // Match the shader's contain-fit projection: visible unit range is
      // wider on whichever axis is longer.
      //   Landscape (aspect > 1): x ∈ [-aspect, aspect], y ∈ [-1, 1]
      //   Portrait  (aspect < 1): x ∈ [-1, 1], y ∈ [-1/aspect, 1/aspect]
      const aspect = wpx / hpx;
      const limitX = aspect >= 1 ? aspect * (1 - pad) : (1 - pad);
      const limitY = aspect >= 1 ? (1 - pad) : (1 / aspect) * (1 - pad);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const tx = finalTargets[i3];
        const ty = finalTargets[i3 + 1];
        if (tx > limitX) finalTargets[i3] = limitX + (tx - limitX) * overshoot;
        else if (tx < -limitX) finalTargets[i3] = -limitX + (tx + limitX) * overshoot;
        if (ty > limitY) finalTargets[i3 + 1] = limitY + (ty - limitY) * overshoot;
        else if (ty < -limitY) finalTargets[i3 + 1] = -limitY + (ty + limitY) * overshoot;
      }
    }

    // ── Horizontal light-sweep wave — a soft vertical band of extra
    //    brightness slowly traverses the hero left-to-right, like a
    //    reflection catching the particles. Purely additive on colors,
    //    so it works regardless of phase palette. 12s cycle.
    {
      const aspect = wpx / hpx;
      const waveSpan = aspect * 2.6;               // start fully left, finish fully right
      const waveT = (tSec % 12) / 12;              // 0..1 every 12s
      const waveX = -aspect * 1.1 + waveT * waveSpan;
      const waveWidth = 0.55;                       // band half-width
      for (let i = 0; i < count; i++) {
        const dx = finalTargets[i * 3] - waveX;
        const ax = dx < 0 ? -dx : dx;
        if (ax < waveWidth) {
          // Soft bell: 1 at center, 0 at edge.
          const t = ax / waveWidth;
          const strength = (1 - t * t) * 0.45;
          finalColors[i * 4] = Math.min(1, finalColors[i * 4] + strength * 0.85);
          finalColors[i * 4 + 1] = Math.min(1, finalColors[i * 4 + 1] + strength * 0.78);
          finalColors[i * 4 + 2] = Math.min(1, finalColors[i * 4 + 2] + strength * 0.6);
        }
      }
    }

    // Spring current positions toward target.
    const k = state.currentPhase.stiffness ?? 0.06;
    const jitter = state.currentPhase.jitterAmplitude ?? 0;
    const timeSec = tSec;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Per-particle breathing noise — tiny sinusoidal jitter unique per index.
      const phase = (i % 97) * 0.06 + timeSec;
      const jx = Math.sin(phase * 1.3) * jitter;
      const jy = Math.cos(phase * 0.9) * jitter;
      positions[i3] += (finalTargets[i3] + jx - positions[i3]) * k;
      positions[i3 + 1] += (finalTargets[i3 + 1] + jy - positions[i3 + 1]) * k;
      positions[i3 + 2] += (finalTargets[i3 + 2] - positions[i3 + 2]) * k;
    }

    // Upload positions + colors.
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, finalColors);

    // Canvas provides the deep night backdrop itself — avoids needing
    // an opaque HTML overlay on the hero (which would hide the particles).
    // Sections with solid CSS bg below naturally cover the canvas, so
    // this only affects transparent/cosmic zones like the hero.
    gl.clearColor(0.058, 0.058, 0.105, 0.92); // brand-night-ish at 92%
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, tSec);
    gl.drawArrays(gl.POINTS, 0, count);
  }
  rafId = requestAnimationFrame(frame);

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(colBuf);
      gl.deleteBuffer(sizeBuf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
    setParticleCount(n: number) {
      allocate(n);
      bindAttribs();
    },
    getCanvas: () => canvas,
  };
}
