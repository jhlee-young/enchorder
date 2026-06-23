import type { ChordAnalysis } from "./chordTheory";
import { midiToNote } from "./chordTheory";

type ToneModule = typeof import("tone");

let toneModule: ToneModule | null = null;
let synth: import("tone").PolySynth | null = null;

async function getTone() {
  if (!toneModule) {
    toneModule = await import("tone");
  }

  if (!synth) {
    synth = new toneModule.PolySynth(toneModule.Synth, {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.015,
        decay: 0.18,
        sustain: 0.45,
        release: 0.8,
      },
    }).toDestination();
  }

  return toneModule;
}

export async function previewChord(chord: ChordAnalysis, duration = "1.2s") {
  const Tone = await getTone();
  await Tone.start();
  synth?.triggerAttackRelease(chord.midiNotes.map(midiToNote), duration);
}

export async function playProgression(
  chords: ChordAnalysis[],
  bpm: number,
  onStep: (index: number) => void,
  onDone: () => void,
) {
  const Tone = await getTone();
  await Tone.start();
  Tone.Transport.cancel();
  Tone.Transport.stop();
  Tone.Transport.bpm.value = bpm;

  const beatSeconds = 60 / bpm;
  const chordDuration = beatSeconds * 2;

  chords.forEach((chord, index) => {
    Tone.Transport.schedule((time) => {
      onStep(index);
      synth?.triggerAttackRelease(chord.midiNotes.map(midiToNote), chordDuration * 0.85, time);
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
