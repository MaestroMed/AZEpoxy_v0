/**
 * GLSL shaders for the narrative swarm point cloud.
 *
 * Design: ONE vertex shader + ONE fragment shader for every particle in
 * every phase. Phases differ only in the per-particle target positions
 * + colors that we upload to the buffer. The GPU does NO phase logic —
 * keeps shader compilation fast and avoids giant branch-heavy shaders.
 *
 * The fragment shader produces a soft circular "blob" with additive-ish
 * alpha so when many particles overlap we get a natural bloom.
 */

export const VERTEX_SHADER = /* glsl */ `#version 300 es
precision highp float;

in vec3 a_pos;          // current position, NDC-ish (-1..1 with aspect)
in vec4 a_color;        // rgba, 0..1
in float a_size;        // base point size in pixels

uniform float u_time;   // seconds
uniform vec2  u_viewport; // pixels
uniform float u_dpr;      // devicePixelRatio

out vec4 v_color;

void main() {
  // Simple orthographic projection — we author in NDC-adjacent space.
  // Aspect correction: keep x within ±1 at all viewport widths, and let
  // y scale with viewport height so shapes don't squish.
  float aspect = u_viewport.x / max(u_viewport.y, 1.0);
  vec3 p = a_pos;
  p.x /= aspect;               // "1 unit" on Y reads wider than on X

  gl_Position = vec4(p.xy, p.z * 0.5, 1.0);

  // Depth fade — particles behind (z<0) look smaller & dimmer.
  float depthT = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
  float sizeScale = mix(0.55, 1.15, depthT);
  gl_PointSize = a_size * sizeScale * u_dpr;

  float alphaScale = mix(0.55, 1.0, depthT);
  v_color = vec4(a_color.rgb, a_color.a * alphaScale);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 frag;

void main() {
  // gl_PointCoord is (0..1, 0..1) per-point; center is (0.5, 0.5).
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  // Two-stop falloff: tight bright core + wider soft halo (halves of the
  // disc). This reads better against dark overlays than a pure gaussian.
  float core = smoothstep(0.5, 0.0, d);       // 0..1 outer to center
  float halo = smoothstep(0.5, 0.15, d);       // 0..1 outside inner core
  float glow = halo * 0.35 + pow(core, 1.6) * 0.85;

  // With premultipliedAlpha:false and blendFunc(SRC_ALPHA, ONE), we just
  // output the color scaled by glow, and alpha controls the per-particle
  // additive contribution.
  float a = v_color.a * glow;
  frag = vec4(v_color.rgb, a);
}
`;
