"use client";

/**
 * Minimal procedural sound engine for the narrative swarm.
 *
 * Zero audio files — every sound is generated at runtime via Web Audio
 * API. Keeps bundle lean and gives us live control over pitch/filter/
 * reverb per phase. Defaults to OFF (respect).
 *
 * Design :
 *  • A single AudioContext is created on first `enable()`. Browsers
 *    require a user gesture, so the toggle button doubles as the init
 *    trigger.
 *  • A master gain fades in/out over 600ms (no clicks on toggle).
 *  • A low drone (two detuned saw + LFO-modulated lowpass) forms the
 *    base ambient. Runs continuously while enabled.
 *  • Phase-switch events can layer in short "whoosh" sweeps.
 *
 * The SoundEngine is a singleton keyed to `typeof window` so it survives
 * HMR without leaking oscillators.
 */

type Phase = "ambient" | "whoosh";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientNodes: Array<{ osc: OscillatorNode; gain: GainNode }> = [];
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  enabled = false;

  /** Lazy init — must be called from a user gesture. */
  private async init() {
    if (this.ctx) return;
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    this.ctx = new AC();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);

    // Master lowpass filter — gives the whole thing warmth.
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 1400;
    this.filter.Q.value = 0.4;
    this.filter.connect(this.masterGain);

    // LFO that sweeps the filter cutoff slowly for breathing warmth.
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.value = 0.07; // ~14s period
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 420;
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.lfo.start();

    // Two detuned saws at 55Hz + 55.5Hz → rich low pad.
    const freqs = [55, 55.5, 82.4];
    const types: OscillatorType[] = ["sawtooth", "sawtooth", "triangle"];
    const levels = [0.11, 0.09, 0.05];
    for (let i = 0; i < freqs.length; i++) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = types[i];
      osc.frequency.value = freqs[i];
      g.gain.value = levels[i];
      osc.connect(g);
      g.connect(this.filter);
      osc.start();
      this.ambientNodes.push({ osc, gain: g });
    }
  }

  async enable() {
    await this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.enabled = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.5, now + 0.8);
  }

  disable() {
    if (!this.ctx || !this.masterGain) return;
    this.enabled = false;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.6);
  }

  /** Short filter-swept whoosh — useful on phase transitions. */
  whoosh(intensity = 0.5) {
    if (!this.ctx || !this.masterGain || !this.enabled) return;
    const now = this.ctx.currentTime;
    const dur = 1.1;

    // White noise burst through a band-pass filter swept from 200Hz → 1800Hz.
    const noiseBuffer = this.ctx.createBuffer(
      1,
      Math.floor(this.ctx.sampleRate * dur),
      this.ctx.sampleRate,
    );
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = noiseBuffer;

    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 5;
    bp.frequency.setValueAtTime(220, now);
    bp.frequency.exponentialRampToValueAtTime(1800, now + dur);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(intensity * 0.12, now + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(bp);
    bp.connect(g);
    g.connect(this.masterGain);
    src.start(now);
    src.stop(now + dur);
  }
}

// Singleton bound to the window (survives HMR).
const KEY = "__az_sound_engine__" as const;
declare global {
  interface Window {
    [KEY]?: SoundEngine;
  }
}

export function getSoundEngine(): SoundEngine {
  if (typeof window === "undefined") {
    // SSR — return a stub with no-ops.
    return {
      enabled: false,
      enable: async () => {},
      disable: () => {},
      whoosh: () => {},
    } as unknown as SoundEngine;
  }
  if (!window[KEY]) window[KEY] = new SoundEngine();
  return window[KEY]!;
}
