"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ── RAL color cycle ──────────────────────────────────────────────────────────
const RAL_CYCLE = [
  [0, 180, 216],   // #00b4d8 — cyan brand
  [226, 83, 3],    // #e25303 — orange 2004
  [240, 202, 0],   // #f0ca00 — jaune 1023
  [0, 124, 176],   // #007cb0 — bleu 5015
  [193, 18, 28],   // #c1121c — rouge 3020
  [15, 67, 54],    // #0f4336 — vert 6005
  [187, 64, 119],  // #bb4077 — rose 4010
  [255, 255, 255], // blanc
];

function lerpColor(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

/**
 * Color breathing: all particles share the SAME base color at any moment.
 * A spatial wave (based on particle x/y position) adds a subtle offset
 * so the color sweeps across the screen like light passing through powder.
 *
 * @param spatialOffset - tiny offset based on particle position (0 to ~0.06)
 * @param globalTime - performance.now()
 * @param w - viewport width for normalization
 */
function getBreathingColor(
  px: number,
  py: number,
  globalTime: number,
  w: number,
  h: number
): string {
  // Global breath: slow cycle through RAL colors (~4s per color)
  const breathSpeed = 0.00008;
  const globalPhase = (globalTime * breathSpeed) % 1;

  // Spatial wave: particles on the left/top shift slightly ahead
  // Creates a "light sweep" effect across the powder cloud
  const spatialWave = ((px / w) * 0.06 + (py / h) * 0.03);

  const t = ((globalPhase + spatialWave) % 1 + 1) % 1;
  const idx = t * RAL_CYCLE.length;
  const i = Math.floor(idx);
  const frac = idx - i;
  const a = RAL_CYCLE[i % RAL_CYCLE.length];
  const b = RAL_CYCLE[(i + 1) % RAL_CYCLE.length];
  return lerpColor(a, b, frac);
}

// For cursor glow — just the global breath color, no spatial offset
function getGlobalBreathColor(globalTime: number): string {
  const t = ((globalTime * 0.00008) % 1 + 1) % 1;
  const idx = t * RAL_CYCLE.length;
  const i = Math.floor(idx);
  const frac = idx - i;
  const a = RAL_CYCLE[i % RAL_CYCLE.length];
  const b = RAL_CYCLE[(i + 1) % RAL_CYCLE.length];
  return lerpColor(a, b, frac);
}

// ── Phases ───────────────────────────────────────────────────────────────────
const PHASE_SCATTER = 0;
const PHASE_ATTRACT = 1;
const PHASE_FORMED = 2;
const PHASE_PULSE = 3;

const PHASE_DURATIONS = [90, 180, 300, 200]; // frames

// ── Particle type ────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  size: number;
  baseSize: number;
  opacity: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  attraction: number;
  depth: number;
  // Powder enhancements
  isDust: boolean;         // true = micro-dust (70%), false = grain (30%)
  turbSeed: number;        // unique seed for turbulence offset
  shimmerSpeed: number;    // per-particle opacity pulse speed
  shimmerPhase: number;    // starting phase for shimmer
  mass: number;            // affects gravity (lighter dust floats more)
}

// ── Generate letterform target points ────────────────────────────────────────
function generateTargets(
  w: number,
  h: number,
  count: number
): { x: number; y: number }[] {
  if (w < 10 || h < 10 || count < 1) return [];

  // Use offscreen canvas to rasterize "AZ" and sample points
  const offscreen = document.createElement("canvas");
  const scale = Math.min(w / 100, h / 60, 8);
  const fontSize = Math.round(scale * 55);
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return [];

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  // Use multiple fallback fonts — canvas font may not have Outfit loaded yet
  ctx.font = `900 ${fontSize}px "Outfit", "Arial Black", "Helvetica Neue", Impact, sans-serif`;
  ctx.textBaseline = "middle";
  // Desktop (>1024): align right. Mobile: center.
  if (w > 1024) {
    ctx.textAlign = "right";
    ctx.fillText("AZ", w * 0.88, h * 0.45);
  } else {
    ctx.textAlign = "center";
    ctx.fillText("AZ", w / 2, h / 2 - fontSize * 0.05);
  }

  const imageData = ctx.getImageData(0, 0, w, h);
  const pixels = imageData.data;

  // Collect all opaque pixel positions
  const candidates: { x: number; y: number }[] = [];
  const step = Math.max(2, Math.round(Math.sqrt((w * h) / (count * 8))));
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (pixels[i + 3] > 128) {
        candidates.push({ x, y });
      }
    }
  }

  // Safety: if rasterization produced no pixels, generate random scatter targets
  if (candidates.length === 0) {
    const result: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      result.push({
        x: w * 0.2 + Math.random() * w * 0.6,
        y: h * 0.2 + Math.random() * h * 0.6,
      });
    }
    return result;
  }

  // Shuffle and pick
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // If we have more candidates than needed, pick evenly
  if (candidates.length >= count) {
    return candidates.slice(0, count);
  }

  // If not enough, duplicate with jitter
  const result = [...candidates];
  while (result.length < count) {
    const base = candidates[Math.floor(Math.random() * candidates.length)];
    result.push({
      x: base.x + (Math.random() - 0.5) * step,
      y: base.y + (Math.random() - 0.5) * step,
    });
  }
  return result;
}

// ── Component ────────────────────────────────────────────────────────────────
export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const stateRef = useRef({
    particles: [] as Particle[],
    mouse: { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, active: false },
    phase: PHASE_SCATTER,
    phaseFrame: 0,
    frame: 0,
    startTime: 0,
    scrollFactor: 0,
    textAlpha: 0,
    hintVisible: true,
    scrolled: false,
    width: 0,
    height: 0,
    dpr: 1,
    targets: [] as { x: number; y: number }[],
    rafId: 0,
  });

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Check touch
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);

    // Skip init if canvas has no dimensions yet (SSR hydration edge case)
    if (w < 10 || h < 10) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    state.width = w;
    state.height = h;
    state.dpr = dpr;

    // Dense particle field — most are ultra-fine dust for fluid feel
    const count = Math.min(1500, Math.floor((w * h) / 350));
    const targets = generateTargets(w, h, count);
    state.targets = targets;

    // Init particles — 80% ultra-fine dust, 20% visible grains
    state.particles = targets.map((t) => {
      const isDust = Math.random() < 0.8;
      const baseSize = isDust
        ? 0.2 + Math.random() * 0.8   // dust: 0.2-1.0px — ultra fine
        : 1.2 + Math.random() * 1.8;  // grain: 1.2-3.0px
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        tx: t.x,
        ty: t.y,
        size: baseSize,
        baseSize,
        opacity: isDust
          ? 0.12 + Math.random() * 0.25   // dust: visible but fine
          : 0.35 + Math.random() * 0.4,   // grain: crisp, defined
        orbitRadius: isDust ? Math.random() * 5 : Math.random() * 2,
        orbitSpeed: 0.01 + Math.random() * 0.03,
        orbitAngle: Math.random() * Math.PI * 2,
        attraction: isDust
          ? 0.008 + Math.random() * 0.02   // dust arrives slower
          : 0.015 + Math.random() * 0.035,
        depth: 0.3 + Math.random() * 0.7,
        isDust,
        turbSeed: Math.random() * 1000,
        shimmerSpeed: 0.02 + Math.random() * 0.04,
        shimmerPhase: Math.random() * Math.PI * 2,
        mass: isDust ? 0.2 + Math.random() * 0.3 : 0.6 + Math.random() * 0.4,
      };
    });

    state.phase = PHASE_SCATTER;
    state.phaseFrame = 0;
    state.frame = 0;
    state.startTime = performance.now();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Wait for fonts + ensure layout is ready before initializing
    const startInit = () => {
      init();
      // If init failed because canvas had no size, retry after a short delay
      if (stateRef.current.width < 10) {
        setTimeout(startInit, 100);
        return;
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(startInit);
    } else {
      // Fallback: wait a frame for layout
      requestAnimationFrame(startInit);
    }

    const state = stateRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // ── Mouse / Touch ──
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      state.mouse.vx = nx - state.mouse.x;
      state.mouse.vy = ny - state.mouse.y;
      state.mouse.px = state.mouse.x;
      state.mouse.py = state.mouse.y;
      state.mouse.x = nx;
      state.mouse.y = ny;
      state.mouse.active = true;
      state.hintVisible = false;
    };
    const onMouseLeave = () => {
      state.mouse.active = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      state.mouse.x = touch.clientX - rect.left;
      state.mouse.y = touch.clientY - rect.top;
      state.mouse.active = true;
      state.hintVisible = false;
    };
    const onTouchEnd = () => {
      state.mouse.active = false;
    };
    const onScroll = () => {
      state.scrollFactor = Math.min(window.scrollY / 600, 1);
      state.scrolled = true;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Resize ──
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200);
    };
    window.addEventListener("resize", onResize);

    // ── Hint timeout ──
    const hintTimer = setTimeout(() => {
      // hintVisible stays true until first interaction
    }, 2000);

    // ── Render loop ──
    function render() {
      const { particles, mouse, width: w, height: h, dpr, scrollFactor } = state;
      if (w === 0 || h === 0) {
        state.rafId = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();

      // Phase management
      state.phaseFrame++;
      if (state.phaseFrame >= PHASE_DURATIONS[state.phase]) {
        state.phase = (state.phase + 1) % 4;
        state.phaseFrame = 0;
      }

      const phase = state.phase;
      const pf = state.phaseFrame;

      // Text alpha
      if (phase === PHASE_FORMED || phase === PHASE_PULSE) {
        state.textAlpha = Math.min(state.textAlpha + 1 / 60, 1);
      } else {
        state.textAlpha = Math.max(state.textAlpha - 1 / 30, 0);
      }

      // ── Clear — no smear trails, clean render each frame ──
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Blend bg: slightly warm dark (not pure night) for depth
      const bgR = 20, bgG = 22, bgB = 38;
      const clearAlpha = 0.35 + scrollFactor * 0.5;
      ctx!.fillStyle = `rgba(${bgR},${bgG},${bgB},${clearAlpha})`;
      ctx!.fillRect(0, 0, w, h);

      // ── Ambient glow — warm breathing background gradient ──
      {
        const breathColor = getGlobalBreathColor(now);
        // Subtle ambient pool of light that follows the RAL cycle
        // Positioned where the AZ letterform sits
        const glowX = w > 1024 ? w * 0.75 : w * 0.5;
        const glowY = h * 0.45;
        const ambientGrad = ctx!.createRadialGradient(
          glowX, glowY, 0,
          glowX, glowY, Math.min(w, h) * 0.55
        );
        ambientGrad.addColorStop(0, breathColor.replace("rgb", "rgba").replace(")", ",0.06)"));
        ambientGrad.addColorStop(0.5, breathColor.replace("rgb", "rgba").replace(")", ",0.02)"));
        ambientGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = ambientGrad;
        ctx!.fillRect(0, 0, w, h);
      }

      // ── Update & draw particles ──
      const mouseRadius = 180;
      const mouseRadiusSq = mouseRadius * mouseRadius;
      const scrollOpacity = 1 - scrollFactor * 0.8;
      const frameTime = state.frame;
      // Mouse speed for spray intensity
      const mSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

      // Flow field — faster for more energy
      const flowTime = frameTime * 0.015;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Flow field — spatial coherence: nearby particles share the same flow
        // This is what makes it look like a FLUID instead of random dots
        const fx = p.x / 120; // spatial frequency
        const fy = p.y / 120;
        const flowAngle =
          Math.sin(fx * 1.3 + flowTime) * Math.cos(fy * 0.9 + flowTime * 0.7) * Math.PI +
          Math.sin(fx * 0.7 - flowTime * 0.5) * 0.5;
        const flowStrength = 0.045 * (1 - p.mass * 0.5); // stronger currents
        const flowX = Math.cos(flowAngle) * flowStrength;
        const flowY = Math.sin(flowAngle) * flowStrength;

        // Per-particle micro-jitter (very small, on top of flow)
        const jitter = 0.005 * (1 - p.mass);
        const jx = Math.sin(frameTime * 0.02 + p.turbSeed) * jitter;
        const jy = Math.cos(frameTime * 0.017 + p.turbSeed * 1.3) * jitter;

        // Micro-gravity — dust floats, grains settle gently
        const gravity = p.isDust ? -0.002 * (1 - p.mass) : 0.003 * p.mass;

        // Phase-specific behavior
        if (phase === PHASE_SCATTER) {
          p.vx += flowX + jx;
          p.vy += flowY + gravity + jy;
          p.vx *= 0.993;
          p.vy *= 0.993;

          // Mouse attract — spray cone effect
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < mouseRadiusSq && distSq > 1) {
              const dist = Math.sqrt(distSq);
              // Base attraction
              const force = 0.8 / dist;
              p.vx += dx * force * 0.02;
              p.vy += dy * force * 0.02;
              // Spray: fast cursor movement flings nearby particles along cursor direction
              if (mSpeed > 3 && dist < 100) {
                const sprayForce = Math.min(mSpeed * 0.004, 0.15) * (1 - dist / 100);
                p.vx += mouse.vx * sprayForce * (p.isDust ? 1.5 : 0.8);
                p.vy += mouse.vy * sprayForce * (p.isDust ? 1.5 : 0.8);
              }
            }
          }
        } else if (phase === PHASE_ATTRACT) {
          const ramp = Math.min(pf / 120, 1);
          const attrForce = p.attraction * ramp;
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx += dx * attrForce + flowX * 0.6;
          p.vy += dy * attrForce + flowY * 0.6;
          // Dust damps slower (floats in longer)
          p.vx *= p.isDust ? 0.94 : 0.91;
          p.vy *= p.isDust ? 0.94 : 0.91;

          if (mouse.active) {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mdSq = mdx * mdx + mdy * mdy;
            if (mdSq < mouseRadiusSq && mdSq > 1) {
              const md = Math.sqrt(mdSq);
              const mf = 0.5 / md;
              p.vx += mdx * mf * 0.015;
              p.vy += mdy * mf * 0.015;
            }
          }
        } else if (phase === PHASE_FORMED) {
          p.orbitAngle += p.orbitSpeed;
          const ox = p.tx + Math.cos(p.orbitAngle) * p.orbitRadius;
          const oy = p.ty + Math.sin(p.orbitAngle) * p.orbitRadius;
          // Dust drifts around target more loosely
          const stiffness = p.isDust ? 0.05 : 0.1;
          const dx = ox - p.x + flowX * 4;
          const dy = oy - p.y + flowY * 4;
          p.vx += dx * stiffness;
          p.vy += dy * stiffness;
          p.vx *= 0.85;
          p.vy *= 0.85;

          if (mouse.active) {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mdSq = mdx * mdx + mdy * mdy;
            if (mdSq < mouseRadiusSq && mdSq > 1) {
              const md = Math.sqrt(mdSq);
              const force = (mouseRadius - md) / mouseRadius;
              // Dust is blown further by cursor
              const blowMult = p.isDust ? 2.0 : 1.2;
              p.vx -= mdx / md * force * blowMult;
              p.vy -= mdy / md * force * blowMult;
            }
          }
        } else if (phase === PHASE_PULSE) {
          const cx = w / 2;
          const cy = h / 2;
          const pulse = Math.sin(pf * 0.05) * 2.5;
          const dirX = p.tx - cx;
          const dirY = p.ty - cy;
          const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const pulseX = p.tx + (dirX / len) * pulse;
          const pulseY = p.ty + (dirY / len) * pulse;

          const dx = pulseX - p.x + flowX;
          const dy = pulseY - p.y + flowY;
          p.vx += dx * 0.08;
          p.vy += dy * 0.08;
          p.vx *= 0.85;
          p.vy *= 0.85;

          if (pf > PHASE_DURATIONS[PHASE_PULSE] - 10) {
            const kick = p.isDust ? 4 : 2.5;
            p.vx += (Math.random() - 0.5) * kick;
            p.vy += (Math.random() - 0.5) * kick;
          }
        }

        // Apply velocity with scroll parallax
        const parallax = 1 - scrollFactor * (1 - p.depth) * 0.5;
        p.x += p.vx * parallax;
        p.y += p.vy * parallax;

        // Wrap around (scatter only)
        if (phase === PHASE_SCATTER) {
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }

        // Mouse proximity size boost
        let drawSize = p.baseSize;
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdSq = mdx * mdx + mdy * mdy;
          if (mdSq < mouseRadiusSq) {
            const proximity = 1 - Math.sqrt(mdSq) / mouseRadius;
            drawSize = p.baseSize * (1 + proximity * 0.6);
          }
        }

        // Shimmer — subtle per-particle opacity pulse (light catching grains)
        const shimmer = 1 + Math.sin(frameTime * p.shimmerSpeed + p.shimmerPhase) * 0.15;
        // Breathing color — unified RAL cycle with spatial wave
        const color = getBreathingColor(p.x, p.y, now, w, h);
        const alpha = p.opacity * scrollOpacity * shimmer;
        if (alpha < 0.01) continue;

        // Draw particle — dust as fillRect (faster), grains as arc
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = color;
        if (p.isDust && drawSize < 1.2) {
          // Square pixel dust — faster than arc for tiny particles
          const s = drawSize * 2;
          ctx!.fillRect(p.x - drawSize, p.y - drawSize, s, s);
        } else {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;

      // ── Additive glow pass — THE cinematic secret sauce ──
      // Re-draw a subset of particles with additive blending = luminous where dense
      ctx!.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i += 3) { // every 3rd particle
        const p = particles[i];
        if (p.isDust) continue; // only grains glow
        const glowSize = p.baseSize * 3.5;
        const glowAlpha = p.opacity * scrollOpacity * 0.06;
        if (glowAlpha < 0.005) continue;
        const color = getBreathingColor(p.x, p.y, now, w, h);
        ctx!.globalAlpha = glowAlpha;
        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
      ctx!.globalAlpha = 1;

      // ── Cursor glow — powder spray nozzle (desktop only) ──
      if (mouse.active && !("ontouchstart" in window)) {
        const cursorColor = getGlobalBreathColor(now);
        // Spray cone glow — intensity scales with cursor speed
        const sprayIntensity = Math.min(mSpeed / 20, 1);
        const glowRadius = 100 + sprayIntensity * 60;
        const glowAlpha = 0.08 + sprayIntensity * 0.1;

        const grad = ctx!.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, glowRadius
        );
        grad.addColorStop(0, cursorColor.replace("rgb", "rgba").replace(")", `,${glowAlpha})`));
        grad.addColorStop(0.4, cursorColor.replace("rgb", "rgba").replace(")", `,${glowAlpha * 0.3})`));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx!.fill();

        // Crosshair — thinner, subtler
        ctx!.strokeStyle = cursorColor.replace("rgb", "rgba").replace(")", ",0.12)");
        ctx!.lineWidth = 0.5;
        ctx!.beginPath();
        ctx!.moveTo(mouse.x, mouse.y - 18);
        ctx!.lineTo(mouse.x, mouse.y - 6);
        ctx!.moveTo(mouse.x, mouse.y + 6);
        ctx!.lineTo(mouse.x, mouse.y + 18);
        ctx!.moveTo(mouse.x - 18, mouse.y);
        ctx!.lineTo(mouse.x - 6, mouse.y);
        ctx!.moveTo(mouse.x + 6, mouse.y);
        ctx!.lineTo(mouse.x + 18, mouse.y);
        ctx!.stroke();

        // Center dot — pulses with spray
        const dotSize = 1.5 + sprayIntensity * 1.5;
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, dotSize, 0, Math.PI * 2);
        ctx!.fillStyle = cursorColor.replace("rgb", "rgba").replace(")", ",0.5)");
        ctx!.fill();
      }

      // ── Overlay text on canvas ──
      // "ÉPOXY" + tagline (formed/pulse) — positioned with the letterform
      if (state.textAlpha > 0.01) {
        const ta = state.textAlpha * scrollOpacity;
        const textScale = Math.min(w / 100, h / 60, 8);
        const epoxySize = Math.round(textScale * 14);
        const taglineSize = Math.round(Math.max(9, textScale * 4.5));
        // Align with letterform position
        const textX = w > 1024 ? w * 0.78 : w / 2;
        const baseY = h * 0.45 + textScale * 28;

        ctx!.textAlign = "center";
        ctx!.textBaseline = "top";

        // "ÉPOXY" — breathes with the RAL cycle
        const epoxyColor = getGlobalBreathColor(now);
        ctx!.font = `300 ${epoxySize}px "Outfit", "Helvetica Neue", sans-serif`;
        ctx!.fillStyle = epoxyColor.replace("rgb", "rgba").replace(")", `,${ta * 0.5})`);
        ctx!.letterSpacing = "0.3em";
        ctx!.fillText("ÉPOXY", textX, baseY);
        ctx!.letterSpacing = "0px";

        // Tagline
        ctx!.font = `300 ${taglineSize}px "Inter", system-ui, sans-serif`;
        ctx!.fillStyle = `rgba(255,255,255,${ta * 0.3})`;
        ctx!.fillText("THERMOLAQUAGE POUDRE · ÎLE-DE-FRANCE", textX, baseY + epoxySize + 6);
      }

      // Metrics bottom
      {
        const metricsAlpha = 0.35 * scrollOpacity;
        if (metricsAlpha > 0.01) {
          const metricSize = Math.max(9, Math.min(10, w / 140));
          ctx!.font = `300 ${metricSize}px ui-monospace, monospace`;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "bottom";
          const metricsColor = getGlobalBreathColor(now);
          ctx!.fillStyle = metricsColor.replace("rgb", "rgba").replace(")", `,${metricsAlpha})`);
          const metricsX = w > 1024 ? w * 0.78 : w / 2;
          ctx!.fillText("200°C  ·  120μm  ·  0 COV", metricsX, h - h * 0.06);
        }
      }

      state.frame++;
      state.rafId = requestAnimationFrame(render);
    }

    state.rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(state.rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      clearTimeout(hintTimer);
    };
  }, [reducedMotion, init]);

  // ── Reduced motion fallback ──
  if (reducedMotion) {
    return (
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-night" />
        <div className="absolute inset-0 bg-industrial-grid-dark opacity-40" />
        <div className="absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-brand-orange/25 blur-[140px]" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-brand-orange/15 blur-[120px]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="heading-display text-[clamp(6rem,15vw,14rem)] text-white/[0.04] leading-none select-none">
              AZ
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ cursor: isTouch ? "auto" : "none" }}
        aria-hidden="true"
      />

      {/* Hint overlay */}
      <div
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-1000"
        id="hero-hint"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <p className="font-mono text-[10px] tracking-wider text-[rgba(0,180,216,0.5)]">
          {isTouch ? "Touchez l'écran" : "Déplacez votre curseur"}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        id="hero-scroll-indicator"
        aria-hidden="true"
      >
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/30 to-white/60 animate-pulse" />
      </div>

      {/* Show hint after 2s, hide on interaction */}
      <HintController />
    </>
  );
}

/** Tiny client component to manage hint visibility */
function HintController() {
  useEffect(() => {
    const hint = document.getElementById("hero-hint");
    const scrollInd = document.getElementById("hero-scroll-indicator");
    if (!hint) return;

    const showTimer = setTimeout(() => {
      hint.style.opacity = "1";
    }, 2000);

    const hideHint = () => {
      hint.style.opacity = "0";
      window.removeEventListener("mousemove", hideHint);
      window.removeEventListener("touchstart", hideHint);
    };
    window.addEventListener("mousemove", hideHint, { once: true });
    window.addEventListener("touchstart", hideHint, { once: true });

    const hideScroll = () => {
      if (scrollInd) scrollInd.style.opacity = "0";
      scrollInd?.style.setProperty("transition", "opacity 0.5s");
      window.removeEventListener("scroll", hideScroll);
    };
    window.addEventListener("scroll", hideScroll, { once: true });

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener("mousemove", hideHint);
      window.removeEventListener("touchstart", hideHint);
      window.removeEventListener("scroll", hideScroll);
    };
  }, []);

  return null;
}
