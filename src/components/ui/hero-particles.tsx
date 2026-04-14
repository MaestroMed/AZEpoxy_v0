"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ── RAL color cycle ──────────────────────────────────────────────────────────
const RAL_CYCLE = [
  [0, 180, 216],   // #00b4d8 — cyan brand
  [193, 18, 28],   // #c1121c — rouge 3020
  [240, 202, 0],   // #f0ca00 — jaune 1023
  [0, 124, 176],   // #007cb0 — bleu 5015
  [226, 83, 3],    // #e25303 — orange 2004
  [15, 67, 54],    // #0f4336 — vert 6005
  [187, 64, 119],  // #bb4077 — rose 4010
  [56, 62, 66],    // #383e42 — gris 7016
  [255, 255, 255], // blanc
];

function lerpColor(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function getParticleColor(offset: number, globalTime: number): string {
  const t = ((offset + globalTime * 0.00033) % 1 + 1) % 1;
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
  colorOffset: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  attraction: number;
  depth: number;
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
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AZ", w / 2, h / 2 - fontSize * 0.05);

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
    mouse: { x: -9999, y: -9999, active: false },
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

    const count = Math.min(1200, Math.floor((w * h) / 400));
    const targets = generateTargets(w, h, count);
    state.targets = targets;

    // Init particles
    state.particles = targets.map((t) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      tx: t.x,
      ty: t.y,
      size: 0.8 + Math.random() * 2.5,
      baseSize: 0.8 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.5,
      colorOffset: Math.random(),
      orbitRadius: Math.random() * 3,
      orbitSpeed: 0.01 + Math.random() * 0.03,
      orbitAngle: Math.random() * Math.PI * 2,
      attraction: 0.01 + Math.random() * 0.03,
      depth: 0.3 + Math.random() * 0.7,
    }));

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
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
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

      // ── Clear with trail ──
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const trailAlpha = 0.15 + scrollFactor * 0.3;
      ctx!.fillStyle = `rgba(26,26,46,${trailAlpha})`;
      ctx!.fillRect(0, 0, w, h);

      // ── Grid background (fades on scroll) ──
      const gridAlpha = Math.max(0, 0.06 - scrollFactor * 0.12);
      if (gridAlpha > 0.001) {
        ctx!.strokeStyle = `rgba(255,255,255,${gridAlpha})`;
        ctx!.lineWidth = 0.5;
        const gridSize = 60;
        ctx!.beginPath();
        for (let x = 0; x < w; x += gridSize) {
          ctx!.moveTo(x, 0);
          ctx!.lineTo(x, h);
        }
        for (let y = 0; y < h; y += gridSize) {
          ctx!.moveTo(0, y);
          ctx!.lineTo(w, y);
        }
        ctx!.stroke();
      }

      // ── Update & draw particles ──
      const mouseRadius = 180;
      const mouseRadiusSq = mouseRadius * mouseRadius;
      const scrollOpacity = 1 - scrollFactor * 0.8;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Phase-specific behavior
        if (phase === PHASE_SCATTER) {
          // Brownian motion
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1 - 0.02;
          p.vx *= 0.98;
          p.vy *= 0.98;

          // Mouse attract in scatter
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < mouseRadiusSq && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const force = 0.8 / dist;
              p.vx += dx * force * 0.02;
              p.vy += dy * force * 0.02;
            }
          }
        } else if (phase === PHASE_ATTRACT) {
          // Ramp attraction
          const ramp = Math.min(pf / 120, 1);
          const attrForce = p.attraction * ramp;
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx += dx * attrForce;
          p.vy += dy * attrForce;
          p.vx *= 0.92;
          p.vy *= 0.92;

          // Mouse distortion
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
          // Orbit around target
          p.orbitAngle += p.orbitSpeed;
          const ox = p.tx + Math.cos(p.orbitAngle) * p.orbitRadius;
          const oy = p.ty + Math.sin(p.orbitAngle) * p.orbitRadius;
          const dx = ox - p.x;
          const dy = oy - p.y;
          p.vx += dx * 0.08;
          p.vy += dy * 0.08;
          p.vx *= 0.85;
          p.vy *= 0.85;

          // Mouse repulse then return
          if (mouse.active) {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mdSq = mdx * mdx + mdy * mdy;
            if (mdSq < mouseRadiusSq && mdSq > 1) {
              const md = Math.sqrt(mdSq);
              const force = (mouseRadius - md) / mouseRadius;
              p.vx -= mdx / md * force * 1.5;
              p.vy -= mdy / md * force * 1.5;
            }
          }
        } else if (phase === PHASE_PULSE) {
          // Pulse: expand/contract from center
          const cx = w / 2;
          const cy = h / 2;
          const pulse = Math.sin(pf * 0.05) * 2.5;
          const dirX = p.tx - cx;
          const dirY = p.ty - cy;
          const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const pulseX = p.tx + (dirX / len) * pulse;
          const pulseY = p.ty + (dirY / len) * pulse;

          const dx = pulseX - p.x;
          const dy = pulseY - p.y;
          p.vx += dx * 0.08;
          p.vy += dy * 0.08;
          p.vx *= 0.85;
          p.vy *= 0.85;

          // Kick at end of pulse → back to scatter
          if (pf > PHASE_DURATIONS[PHASE_PULSE] - 10) {
            p.vx += (Math.random() - 0.5) * 3;
            p.vy += (Math.random() - 0.5) * 3;
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
            drawSize = p.baseSize * (1 + proximity * 0.5);
          }
        }

        // Draw particle
        const color = getParticleColor(p.colorOffset, now);
        const alpha = p.opacity * scrollOpacity;
        if (alpha < 0.01) continue;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.globalAlpha = alpha;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      // ── Cursor glow (desktop only) ──
      if (mouse.active && !("ontouchstart" in window)) {
        const cursorColor = getParticleColor(0, now);
        const grad = ctx!.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 120
        );
        grad.addColorStop(0, cursorColor.replace("rgb", "rgba").replace(")", ",0.12)"));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx!.fill();

        // Crosshair
        ctx!.strokeStyle = cursorColor.replace("rgb", "rgba").replace(")", ",0.15)");
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        // top
        ctx!.moveTo(mouse.x, mouse.y - 20);
        ctx!.lineTo(mouse.x, mouse.y - 8);
        // bottom
        ctx!.moveTo(mouse.x, mouse.y + 8);
        ctx!.lineTo(mouse.x, mouse.y + 20);
        // left
        ctx!.moveTo(mouse.x - 20, mouse.y);
        ctx!.lineTo(mouse.x - 8, mouse.y);
        // right
        ctx!.moveTo(mouse.x + 8, mouse.y);
        ctx!.lineTo(mouse.x + 20, mouse.y);
        ctx!.stroke();

        // Center dot
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = cursorColor.replace("rgb", "rgba").replace(")", ",0.6)");
        ctx!.fill();
      }

      // ── Overlay text on canvas ──
      // "ÉPOXY" + tagline (formed/pulse)
      if (state.textAlpha > 0.01) {
        const ta = state.textAlpha * scrollOpacity;
        const textScale = Math.min(w / 100, h / 60, 8);
        const epoxySize = Math.round(textScale * 16);
        const taglineSize = Math.round(Math.max(10, textScale * 5));
        const baseY = h / 2 + textScale * 30;

        ctx!.textAlign = "center";
        ctx!.textBaseline = "top";

        // "ÉPOXY"
        ctx!.font = `300 ${epoxySize}px "Outfit", "Helvetica Neue", sans-serif`;
        ctx!.fillStyle = `rgba(0,180,216,${ta * 0.8})`;
        ctx!.letterSpacing = "0.3em";
        ctx!.fillText("ÉPOXY", w / 2, baseY);
        ctx!.letterSpacing = "0px";

        // Tagline
        ctx!.font = `300 ${taglineSize}px "Inter", system-ui, sans-serif`;
        ctx!.fillStyle = `rgba(255,255,255,${ta * 0.4})`;
        ctx!.fillText("THERMOLAQUAGE POUDRE · ÎLE-DE-FRANCE", w / 2, baseY + epoxySize + 8);
      }

      // Metrics bottom
      {
        const metricsAlpha = 0.35 * scrollOpacity;
        if (metricsAlpha > 0.01) {
          const metricSize = Math.max(9, Math.min(10, w / 140));
          ctx!.font = `300 ${metricSize}px ui-monospace, monospace`;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "bottom";
          ctx!.fillStyle = `rgba(0,180,216,${metricsAlpha})`;
          ctx!.fillText("200°C  ·  120μm  ·  0 COV", w / 2, h - h * 0.06);
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
