// Global audio engine: one <audio> element + WebAudio analyser shared
// between the player UI and the WebGL background.

type Listener = (s: EngineState) => void;

export interface EngineState {
  currentSrc: string | null;
  playing: boolean;
  time: number;
  duration: number;
}

let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let freq: Uint8Array<ArrayBuffer> | null = null;

const audio = new Audio();
audio.crossOrigin = "anonymous";
audio.preload = "metadata";

let state: EngineState = {
  currentSrc: null,
  playing: false,
  time: 0,
  duration: 0,
};

const listeners = new Set<Listener>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l(state));
}

function ensureCtx() {
  if (ctx) return;
  ctx = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const src = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.82;
  src.connect(analyser);
  analyser.connect(ctx.destination);
  freq = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
}

audio.addEventListener("timeupdate", () => {
  state.time = audio.currentTime;
  emit();
});
audio.addEventListener("loadedmetadata", () => {
  state.duration = audio.duration;
  emit();
});
let endedHandler: (() => void) | null = null;

/** Register a callback fired when the current track finishes (auto-advance). */
export function setOnEnded(fn: (() => void) | null) {
  endedHandler = fn;
}

audio.addEventListener("ended", () => {
  state.playing = false;
  state.time = 0;
  emit();
  endedHandler?.();
});

export function subscribe(l: Listener) {
  listeners.add(l);
  l(state);
  return () => {
    listeners.delete(l);
  };
}

export function playTrack(src: string) {
  ensureCtx();
  if (state.currentSrc === src && state.playing) {
    audio.pause();
    state.playing = false;
    emit();
    return;
  }
  if (state.currentSrc !== src) {
    audio.src = src;
    state.currentSrc = src;
    state.time = 0;
    state.duration = 0;
  }
  ctx!.resume();
  // play() rejects on autoplay-policy errors or when interrupted by a
  // quick track switch ("The play() request was interrupted") — swallow
  // it and roll the state back instead of an unhandled rejection.
  audio.play().catch(() => {
    state.playing = false;
    emit();
  });
  state.playing = true;
  emit();
}

export function seek(t: number) {
  if (!state.currentSrc || !isFinite(t)) return;
  const clamped = Math.max(0, Math.min(t, state.duration || 0));
  audio.currentTime = clamped;
  state.time = clamped;
  emit();
}

/** 0..1 — overall loudness, bass-heavy. Used to drive the shader. */
export function getLevel(): number {
  if (!analyser || !freq || !state.playing) return 0;
  analyser.getByteFrequencyData(freq);
  // focus on low-mid: bins 2..40
  let sum = 0;
  const n = 38;
  for (let i = 2; i < 2 + n; i++) sum += freq[i];
  return Math.min(1, sum / n / 200);
}

export function getFreqArray(): Uint8Array<ArrayBuffer> | null {
  if (!analyser || !freq || !state.playing) return null;
  analyser.getByteFrequencyData(freq);
  return freq;
}
