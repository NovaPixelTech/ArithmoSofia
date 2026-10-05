/**
 * Ancient-Greek-flavoured generative loop, synthesised entirely with the
 * Web Audio API — no audio assets required.
 *
 * Instrumentation modelled on the Greek lyre (kithara) ensemble:
 *   - `pluck`  : a struck string, fast attack with exponential decay
 *   - `aulos`  : a double-reed drone with slow swell and vibrato
 *   - `bass`   : a low plucked string marking the bar
 *   - `frame`  : a frame drum / tympanon thump
 *   - `clap`   : a light hand clap on the off-beats
 *
 * Melodic material is drawn from the ancient Greek modes (Dorian, Phrygian,
 * Lydian, Mixolydian) so the loop has the character of theōidia / aulos
 * music rather than a modern scale.
 */

interface Mode {
  name: string;
  steps: number[];
}

const MODES: Record<string, Mode> = {
  dorian: { name: 'Dorian', steps: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: 'Phrygian', steps: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: 'Lydian', steps: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: 'Mixolydian', steps: [0, 2, 4, 5, 7, 9, 10] },
};

interface Note {
  /** position on the eighth-note grid, in steps from the start of the motif */
  step: number;
  /** length in steps */
  len: number;
  /** scale degree; may exceed the mode length to cross octaves */
  degree: number;
  vel?: number;
}

interface Motif {
  mode: string;
  root: number;
  melody: Note[];
  /** drone degrees held underneath, in steps */
  drone: { step: number; len: number; degree: number; vel?: number }[];
  bass: { step: number; degree: number; vel?: number }[];
  frame: number[];
  clap: number[];
}

/** Sixteenth-note grid: 16 steps per 4/4 bar. */
const STEPS_PER_BAR = 16;
const STEPS_PER_MOTIF = STEPS_PER_BAR * 2;

const MOTIFS: Motif[] = [
  {
    // Rising arch in the Dorian mode — the most widely attested Greek ethos
    mode: 'dorian',
    root: 62,
    melody: [
      { step: 0, len: 2, degree: 0 },
      { step: 2, len: 2, degree: 2 },
      { step: 4, len: 2, degree: 4 },
      { step: 6, len: 1, degree: 5 },
      { step: 7, len: 1, degree: 4 },
      { step: 8, len: 4, degree: 2 },
      { step: 12, len: 2, degree: 4 },
      { step: 14, len: 2, degree: 7 },
    ],
    drone: [
      { step: 0, len: 16, degree: 0, vel: 0.5 },
      { step: 16, len: 16, degree: 4, vel: 0.5 },
    ],
    bass: [
      { step: 0, degree: 0 },
      { step: 16, degree: 0 },
    ],
    frame: [0, 8, 16, 24],
    clap: [4, 12, 20, 28],
  },
  {
    // Descending Phrygian — the characteristic "spanakmiktis" colour
    mode: 'phrygian',
    root: 65,
    melody: [
      { step: 0, len: 3, degree: 4 },
      { step: 3, len: 1, degree: 3 },
      { step: 4, len: 2, degree: 2 },
      { step: 6, len: 2, degree: 1 },
      { step: 8, len: 4, degree: 0, vel: 0.8 },
      { step: 12, len: 1, degree: -1 },
      { step: 13, len: 1, degree: 0 },
      { step: 14, len: 2, degree: 2 },
    ],
    drone: [
      { step: 0, len: 16, degree: 0, vel: 0.55 },
      { step: 16, len: 16, degree: 2, vel: 0.5 },
    ],
    bass: [
      { step: 0, degree: 0 },
      { step: 16, degree: 0 },
    ],
    frame: [0, 8, 16, 24],
    clap: [6, 12, 22, 28],
  },
  {
    // Bright Lydian open fifths
    mode: 'lydian',
    root: 67,
    melody: [
      { step: 0, len: 2, degree: 0 },
      { step: 2, len: 1, degree: 4 },
      { step: 3, len: 1, degree: 2 },
      { step: 4, len: 2, degree: 4 },
      { step: 6, len: 2, degree: 7 },
      { step: 8, len: 4, degree: 6 },
      { step: 12, len: 2, degree: 4 },
      { step: 14, len: 2, degree: 2 },
    ],
    drone: [
      { step: 0, len: 16, degree: 0, vel: 0.45 },
      { step: 16, len: 16, degree: 6, vel: 0.45 },
    ],
    bass: [
      { step: 0, degree: 0 },
      { step: 16, degree: 0 },
    ],
    frame: [0, 8, 16, 24],
    clap: [4, 12, 20, 28],
  },
  {
    // Mixolydian resolve back toward the tonic
    mode: 'mixolydian',
    root: 60,
    melody: [
      { step: 0, len: 4, degree: 0 },
      { step: 4, len: 2, degree: 2 },
      { step: 6, len: 2, degree: 4 },
      { step: 8, len: 2, degree: 6 },
      { step: 10, len: 2, degree: 4 },
      { step: 12, len: 4, degree: 2 },
      { step: 16, len: 2, degree: 4 },
      { step: 18, len: 2, degree: 3 },
      { step: 20, len: 4, degree: 2 },
      { step: 24, len: 2, degree: 1 },
      { step: 26, len: 2, degree: 2 },
      { step: 28, len: 4, degree: 0, vel: 0.85 },
    ],
    drone: [
      { step: 0, len: 16, degree: 0, vel: 0.5 },
      { step: 16, len: 16, degree: 0, vel: 0.45 },
    ],
    bass: [
      { step: 0, degree: 0 },
      { step: 16, degree: 0 },
    ],
    frame: [0, 8, 16, 24],
    clap: [4, 12, 20, 28],
  },
];

const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

function degreeToMidi(mode: Mode, root: number, degree: number): number {
  const len = mode.steps.length;
  const oct = Math.floor(degree / len);
  const idx = ((degree % len) + len) % len;
  return root + mode.steps[idx] + oct * 12;
}

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.15;

class GreekMusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private wet: GainNode | null = null;
  private dry: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private timer: number | null = null;
  private fadeTimer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private running = false;
  private tempo = 76;
  private targetVolume = 0.16;
  private currentVolume = 0;
  private readonly loopLength = MOTIFS.length * STEPS_PER_MOTIF;

  get isRunning() {
    return this.running;
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctor: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      this.ctx = ctx;

      this.master = ctx.createGain();
      this.master.gain.value = 0;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -22;
      comp.knee.value = 26;
      comp.ratio.value = 5;
      comp.attack.value = 0.006;
      comp.release.value = 0.28;

      this.bus = ctx.createGain();
      this.bus.gain.value = 1;

      const convolver = ctx.createConvolver();
      convolver.buffer = this.buildImpulse(ctx, 2.8, 2.6);

      this.dry = ctx.createGain();
      this.dry.gain.value = 0.72;
      this.wet = ctx.createGain();
      this.wet.gain.value = 0.42;

      this.bus.connect(this.dry).connect(this.master);
      this.bus.connect(convolver).connect(this.wet).connect(this.master);
      this.master.connect(comp).connect(ctx.destination);

      this.noiseBuffer = this.buildNoise(ctx);
    }
    return this.ctx;
  }

  private buildNoise(ctx: AudioContext): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * 1.2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  /** Exponentially decaying stereo noise → a plausible stone-hall reverb. */
  private buildImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      }
    }
    return buf;
  }

  private noiseSource(ctx: AudioContext, when: number, duration: number): AudioBufferSourceNode {
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    src.start(when);
    src.stop(when + duration + 0.05);
    return src;
  }

  /** A struck, quickly-decaying string. */
  private pluck(when: number, freq: number, duration: number, vel: number) {
    const ctx = this.ctx!;
    const bus = this.bus!;

    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 1.2;
    lp.frequency.setValueAtTime(Math.min(freq * 10, 9000), when);
    lp.frequency.exponentialRampToValueAtTime(Math.max(freq * 2.1, 220), when + duration);

    const partials: [OscillatorType, number, number][] = [
      ['sawtooth', 1, 0.5],
      ['triangle', 2.01, 0.26],
      ['sine', 3.02, 0.12],
      ['sine', 4.98, 0.07],
      ['sine', 0.5, 0.16],
    ];

    for (const [type, mult, amp] of partials) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq * mult, when);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 6, when);
      const pg = ctx.createGain();
      pg.gain.value = amp;
      osc.connect(pg).connect(lp);
      osc.start(when);
      osc.stop(when + duration + 0.1);
    }

    // pick attack
    const pick = this.noiseSource(ctx, when, 0.03);
    const pickFilter = ctx.createBiquadFilter();
    pickFilter.type = 'bandpass';
    pickFilter.frequency.value = Math.min(freq * 4, 6000);
    pickFilter.Q.value = 1.4;
    const pickGain = ctx.createGain();
    pickGain.gain.setValueAtTime(vel * 0.32, when);
    pickGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.04);
    pick.connect(pickFilter).connect(pickGain).connect(g);

    const peak = vel * 0.34;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(peak, when + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    lp.connect(g).connect(bus);
  }

  /** Double-reed drone with slow swell and vibrato. */
  private aulos(when: number, freq: number, duration: number, vel: number) {
    const ctx = this.ctx!;
    const bus = this.bus!;

    const g = ctx.createGain();
    const swell = Math.max(0.35, duration * 0.9);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vel * 0.11, when + swell * 0.45);
    g.gain.linearRampToValueAtTime(vel * 0.085, when + swell * 0.8);
    g.gain.linearRampToValueAtTime(0.0001, when + duration);

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq * 2.6;
    bp.Q.value = 2.4;

    const vib = ctx.createOscillator();
    vib.type = 'sine';
    vib.frequency.value = 4.8;
    const vibDepth = ctx.createGain();
    vibDepth.gain.setValueAtTime(0, when);
    vibDepth.gain.linearRampToValueAtTime(7, when + Math.min(duration * 0.5, 4));
    vib.connect(vibDepth);

    for (const [type, detune] of [
      ['sawtooth', -5],
      ['sawtooth', 6],
      ['sine', 0],
    ] as [OscillatorType, number][]) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, when);
      osc.detune.setValueAtTime(detune, when);
      vibDepth.connect(osc.detune);
      const og = ctx.createGain();
      og.gain.value = type === 'sine' ? 0.4 : 0.3;
      osc.connect(og).connect(bp);
      osc.start(when);
      osc.stop(when + duration + 0.15);
    }

    vib.start(when);
    vib.stop(when + duration + 0.15);

    bp.connect(g).connect(bus);
  }

  /** Frame drum / tympanon thump. */
  private frame(when: number, vel: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(178, when);
    osc.frequency.exponentialRampToValueAtTime(46, when + 0.16);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vel * 0.5, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.34);

    const skin = this.noiseSource(ctx, when, 0.09);
    const skinFilter = ctx.createBiquadFilter();
    skinFilter.type = 'lowpass';
    skinFilter.frequency.value = 1400;
    const skinGain = ctx.createGain();
    skinGain.gain.setValueAtTime(vel * 0.1, when);
    skinGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.09);
    skin.connect(skinFilter).connect(skinGain).connect(g);

    osc.connect(g).connect(this.bus!);
    osc.start(when);
    osc.stop(when + 0.4);
  }

  /** Light hand clap / finger snap. */
  private clap(when: number, vel: number) {
    const ctx = this.ctx!;
    const src = this.noiseSource(ctx, when, 0.09);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 3200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vel * 0.07, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.08);
    src.connect(hp).connect(g).connect(this.bus!);
  }

  /**
   * Schedule everything that lands on grid `step`. Motifs play in sequence —
   * each occupies one contiguous `STEPS_PER_MOTIF` window of the loop.
   */
  private scheduleStep(step: number, when: number) {
    const motif = MOTIFS[Math.floor(step / STEPS_PER_MOTIF)];
    if (!motif) return;
    const local = step % STEPS_PER_MOTIF;
    const mode = MODES[motif.mode];
    if (!mode) return;

    for (const n of motif.melody) {
      if (n.step !== local) continue;
      const midi = degreeToMidi(mode, motif.root, n.degree);
      this.pluck(when, midiToFreq(midi), this.stepDur(n.len) * 1.7, n.vel ?? 1);
    }
    for (const d of motif.drone) {
      if (d.step !== local) continue;
      const midi = degreeToMidi(mode, motif.root - 24, d.degree);
      this.aulos(when, midiToFreq(midi), this.stepDur(d.len) * 0.96, d.vel ?? 1);
    }
    for (const b of motif.bass) {
      if (b.step !== local) continue;
      const midi = degreeToMidi(mode, motif.root - 12, b.degree);
      this.pluck(when, midiToFreq(midi), this.stepDur(4) * 2.4, (b.vel ?? 1) * 0.9);
    }
    if (motif.frame.includes(local)) this.frame(when, 1);
    if (motif.clap.includes(local)) this.clap(when, 1);
  }

  /** Duration of `steps` sixteenth notes. */
  private stepDur(steps: number) {
    return ((60 / this.tempo) * 0.25) * steps;
  }

  private tick = () => {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextTime < ctx.currentTime + SCHEDULE_AHEAD) {
      this.scheduleStep(this.step, this.nextTime);
      this.step = (this.step + 1) % this.loopLength;
      this.nextTime += this.stepDur(1);
    }
  };

  private fade = () => {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    if (this.running) {
      if (this.currentVolume < this.targetVolume) {
        this.currentVolume = Math.min(this.targetVolume, this.currentVolume + 0.004);
      } else if (this.currentVolume > this.targetVolume) {
        this.currentVolume = Math.max(this.targetVolume, this.currentVolume - 0.01);
      }
    } else if (this.currentVolume > 0) {
      this.currentVolume = Math.max(0, this.currentVolume - 0.01);
    }
    master.gain.setTargetAtTime(this.currentVolume, now, 0.08);

    if (this.running || this.currentVolume > 0) {
      this.fadeTimer = window.setTimeout(this.fade, 60);
    } else {
      this.fadeTimer = null;
    }
  };

  async start(volume?: number) {
    if (volume !== undefined) this.targetVolume = volume;
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        /* resume can reject before a user gesture; next tick retries */
      }
    }
    if (this.running) return;

    this.running = true;
    this.step = 0;
    this.nextTime = ctx.currentTime + 0.08;
    this.timer = window.setInterval(this.tick, LOOKAHEAD_MS);
    if (this.fadeTimer === null) this.fadeTimer = window.setTimeout(this.fade, 0);
  }

  setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(0.5, volume));
  }

  stop() {
    this.running = false;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.fade();
  }

  dispose() {
    this.stop();
    if (this.fadeTimer !== null) {
      window.clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }
    this.currentVolume = 0;
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.master = null;
      this.bus = null;
      this.wet = null;
      this.dry = null;
      this.noiseBuffer = null;
    }
  }
}

const engine = new GreekMusicEngine();
const STORAGE_KEY = 'arithmosofia-music';

export interface MusicPreferences {
  enabled: boolean;
  volume: number;
}

function readPreferences(): MusicPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MusicPreferences>;
      return {
        enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : true,
        volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(0.5, parsed.volume)) : 0.16,
      };
    }
  } catch {
    /* ignore malformed storage */
  }
  return { enabled: true, volume: 0.16 };
}

function writePreferences(prefs: MusicPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore storage errors */
  }
}

type Listener = (prefs: MusicPreferences) => void;

let prefs = typeof window === 'undefined' ? { enabled: false, volume: 0.16 } : readPreferences();
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l({ ...prefs }));
}

function apply() {
  engine.setVolume(prefs.volume);
  if (prefs.enabled) {
    void engine.start(prefs.volume);
  } else {
    engine.stop();
  }
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPreferences(): MusicPreferences {
  return { ...prefs };
}

/** User-initiated audio unlock — browsers block autoplay until a gesture. */
export function primeAudio() {
  if (!prefs.enabled) return;
  void engine.start(prefs.volume);
}

export function setMusicEnabled(enabled: boolean) {
  prefs = { ...prefs, enabled };
  writePreferences(prefs);
  apply();
  emit();
}

export function setMusicVolume(volume: number) {
  prefs = { ...prefs, volume: Math.max(0, Math.min(0.5, volume)) };
  writePreferences(prefs);
  engine.setVolume(prefs.volume);
  if (prefs.enabled) void engine.start(prefs.volume);
  emit();
}

export function toggleMusic() {
  setMusicEnabled(!prefs.enabled);
}

if (typeof window !== 'undefined') {
  prefs = readPreferences();
  const unlock = () => {
    if (prefs.enabled) void engine.start(prefs.volume);
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('keydown', unlock);
}