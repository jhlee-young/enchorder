import type { ChordAnalysis } from "./chordTheory";
import { midiToNote } from "./chordTheory";

type ToneModule = typeof import("tone");
type PlayableInstrument = {
  triggerAttackRelease: (
    notes: string | string[],
    duration: string | number,
    time?: number | string,
    velocity?: number,
  ) => unknown;
};

let toneModule: ToneModule | null = null;
let sampler: import("tone").Sampler | null = null;
let fallbackSynth: import("tone").PolySynth | null = null;
let outputVolume: import("tone").Volume | null = null;
let samplerState: "idle" | "loading" | "ready" | "fallback" = "idle";

const PIANO_SAMPLE_URLS = {
  C4: "C4.mp3",
  "D#4": "Ds4.mp3",
  "F#4": "Fs4.mp3",
  A4: "A4.mp3",
  C5: "C5.mp3",
};

async function getTone() {
  if (!toneModule) {
    toneModule = await import("tone");
  }

  return toneModule;
}

function createOutputChain(Tone: ToneModule) {
  if (!outputVolume) {
    const reverb = new Tone.Reverb({
      decay: 1.25,
      preDelay: 0.015,
      wet: 0.16,
    }).toDestination();

    const filter = new Tone.Filter({
      frequency: 4200,
      type: "lowpass",
      rolloff: -12,
    }).connect(reverb);

    outputVolume = new Tone.Volume(-8).connect(filter);
  }

  return outputVolume;
}

function createFallbackSynth(Tone: ToneModule) {
  if (!fallbackSynth) {
    fallbackSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.01,
        decay: 0.35,
        sustain: 0.18,
        release: 1.1,
      },
    }).connect(createOutputChain(Tone));
  }

  return fallbackSynth;
}

function createSampler(Tone: ToneModule) {
  if (sampler || samplerState === "fallback") {
    return;
  }

  samplerState = "loading";

  sampler = new Tone.Sampler({
    urls: PIANO_SAMPLE_URLS,
    baseUrl: "/audio/piano/",
    attack: 0.002,
    release: 1.25,
    curve: "exponential",
    onload: () => {
      samplerState = "ready";
    },
    onerror: () => {
      samplerState = "fallback";
    },
  }).connect(createOutputChain(Tone));
}

async function getInstrument(): Promise<PlayableInstrument> {
  const Tone = await getTone();
  createSampler(Tone);

  if (sampler && samplerState === "ready" && sampler.loaded) {
    return sampler;
  }

  return createFallbackSynth(Tone);
}

export async function previewChord(chord: ChordAnalysis, duration = "1.2s") {
  const Tone = await getTone();
  await Tone.start();
  const instrument = await getInstrument();
  instrument.triggerAttackRelease(chord.midiNotes.map(midiToNote), duration, undefined, 0.82);
}

export async function previewNote(midiNote: number, duration = "0.75s") {
  const Tone = await getTone();
  await Tone.start();
  const instrument = await getInstrument();
  instrument.triggerAttackRelease(midiToNote(midiNote), duration, undefined, 0.88);
}

export async function playProgression(
  chords: ChordAnalysis[],
  bpm: number,
  onStep: (index: number) => void,
  onDone: () => void,
) {
  const Tone = await getTone();
  await Tone.start();
  const instrument = await getInstrument();
  Tone.Transport.cancel();
  Tone.Transport.stop();
  Tone.Transport.bpm.value = bpm;

  const beatSeconds = 60 / bpm;
  const chordDuration = beatSeconds * 2;

  chords.forEach((chord, index) => {
    Tone.Transport.schedule((time) => {
      onStep(index);
      instrument.triggerAttackRelease(
        chord.midiNotes.map(midiToNote),
        chordDuration * 0.85,
        time,
        0.78,
      );
    }, index * chordDuration);
  });

  Tone.Transport.schedule(() => {
    onDone();
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }, chords.length * chordDuration);

  Tone.Transport.start();
}

export async function stopPlayback() {
  const Tone = await getTone();
  Tone.Transport.stop();
  Tone.Transport.cancel();
}
