/**
 * Narrative Swarm — core types.
 *
 * The swarm is a single persistent WebGL point cloud rendered in the root
 * layout. It morphs between *phases* in response to scroll, route changes,
 * mouse, and form state. Each phase describes TARGET positions + colors for
 * each particle; the engine lerps current state toward the target every
 * frame, producing organic flock-like motion.
 */

// 3D coordinate helpers — we use Float32Array flat layouts (x,y,z) for
// every-particle arrays, which is what WebGL wants and what SIMD-friendly
// loops prefer.
export type Vec3 = readonly [number, number, number];
export type RGBA = readonly [number, number, number, number];

/**
 * A Phase describes where every particle should be AT a given moment.
 * It's a pure function of (index, time, mouse, scroll, routeProgress).
 *
 * `computeTarget` writes the target (x,y,z) into `out` at `3*i`, `3*i+1`, `3*i+2`.
 * `computeColor`  writes (r,g,b,a) at `4*i..4*i+3`.
 *
 * Writing via `out` arrays instead of returning per-particle objects avoids
 * allocating 3000+ arrays per frame.
 */
export interface Phase {
  id: string;

  /** Called once per frame (or less) to fill the target position buffer. */
  computeTarget(
    count: number,
    time: number,        // ms since engine start
    mouse: Vec3,         // normalized: [-1..1, -1..1, 0]
    scroll: number,      // 0..1 page progress
    out: Float32Array,   // length = count * 3
  ): void;

  /** Optional — static colors unless phase wants to animate them. */
  computeColor?(
    count: number,
    time: number,
    out: Float32Array,   // length = count * 4
  ): void;

  /** How quickly particles snap to target (0..1, ~0.05 = organic, ~0.2 = snappy). */
  stiffness?: number;

  /** Optional extra jitter/noise applied on top of target (adds life). */
  jitterAmplitude?: number;

  /**
   * Engine-level viewport boundary behavior for this phase.
   *
   * When enabled, targets that would fall outside a safe rectangle
   * (centered, with `padding` fraction on each side) get softly pushed
   * back inward — particles "feel" the window walls. This makes the
   * swarm look adaptive: a wide window lets the cloud breathe, a narrow
   * one compresses it.
   *
   * Defaults to `{ padding: 0.08, overshoot: 0.25 }` on desktop (≥768px),
   * disabled on mobile. Set to `false` to fully opt out — essential for
   * phases that need particles to exit the frame (e.g. paint-gun spray).
   */
  boundary?: false | { padding?: number; overshoot?: number };
}

/**
 * The swarm store — what the rest of the app reads/writes to orchestrate
 * the narrative. Kept deliberately small.
 */
export interface SwarmState {
  currentPhase: Phase;
  targetPhase: Phase | null;         // set during A → B transitions
  transitionProgress: number;        // 0..1
  transitionDurationMs: number;      // how long a phase swap should take
  mouse: Vec3;                        // normalized [-1..1, -1..1, 0]
  scroll: number;                     // 0..1 page progress
  routePath: string;                  // for cross-route transitions
  paused: boolean;                    // global kill-switch (reduced motion, off-screen, etc.)
  /**
   * Page-level horizontal offset applied to every particle target, in
   * unit space. Lets a route bias the entire swarm left or right (e.g.
   * homepage on desktop pushes +0.4 to clear the heading block on the
   * left; collection pages leave it centered at 0).
   */
  anchorOffsetX: number;

  // mutators
  setPhase(next: Phase, opts?: { durationMs?: number }): void;
  setMouse(m: Vec3): void;
  setScroll(s: number): void;
  setPaused(p: boolean): void;
  setRoute(path: string): void;
  setAnchorOffsetX(x: number): void;
  /** internal — called by engine to advance/finalize transition */
  tickTransition(dt: number): void;
}
