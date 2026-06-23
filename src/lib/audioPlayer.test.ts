import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseChord, isChordAnalysis } from "./chordTheory";

const toneMockState = vi.hoisted(() => ({
  callSamplerOnload: true,
  samplerLoaded: true,
  samplerOnload: null as null | (() => void),
  samplerTrigger: vi.fn(),
  synthTrigger: vi.fn(),
  start: vi.fn(async () => undefined),
  transportCancel: vi.fn(),
  transportStop: vi.fn(),
  transportStart: vi.fn(),
  transportSchedule: vi.fn(),
}));

vi.mock("tone", () => {
  class Sampler {
    get loaded() {
      return toneMockState.samplerLoaded;
    }

    constructor(options: { onload?: () => void }) {
      toneMockState.samplerOnload = options.onload ?? null;

      if (toneMockState.callSamplerOnload) {
        options.onload?.();
      }
    }

    connect() {
      return this;
    }

    triggerAttackRelease(...args: unknown[]) {
      toneMockState.samplerTrigger(...args);
      return this;
    }
  }

  class PolySynth {
    connect() {
      return this;
    }

    triggerAttackRelease(...args: unknown[]) {
      toneMockState.synthTrigger(...args);
      return this;
    }
  }

  class Reverb {
    toDestination() {
      return this;
    }
  }

  class Filter {
    connect() {
      return this;
    }
  }

  class Volume {
    connect() {
      return this;
    }
  }

  class Synth {}

  return {
    Sampler,
    PolySynth,
    Synth,
    Reverb,
    Filter,
    Volume,
    start: toneMockState.start,
    Transport: {
      bpm: { value: 0 },
      cancel: toneMockState.transportCancel,
      stop: toneMockState.transportStop,
      start: toneMockState.transportStart,
      schedule: toneMockState.transportSchedule,
    },
  };
});

async function importAudioPlayer() {
  vi.resetModules();
  return import("./audioPlayer");
}

beforeEach(() => {
  toneMockState.callSamplerOnload = true;
  toneMockState.samplerLoaded = true;
  toneMockState.samplerOnload = null;
  toneMockState.samplerTrigger.mockClear();
  toneMockState.synthTrigger.mockClear();
  toneMockState.start.mockClear();
  toneMockState.transportCancel.mockClear();
  toneMockState.transportStop.mockClear();
  toneMockState.transportStart.mockClear();
  toneMockState.transportSchedule.mockClear();
});

describe("audioPlayer", () => {
  it("previews one midi note through the sampler path when samples are ready", async () => {
    const { previewNote } = await importAudioPlayer();

    await previewNote(62);

    expect(toneMockState.start).toHaveBeenCalledOnce();
    expect(toneMockState.samplerTrigger).toHaveBeenCalledWith("D4", "0.75s", undefined, 0.88);
    expect(toneMockState.synthTrigger).not.toHaveBeenCalled();
  });

  it("previews a midi note group through the sampler path", async () => {
    const { previewMidiNotes } = await importAudioPlayer();

    await previewMidiNotes([62, 69, 65, 72, 76]);

    expect(toneMockState.start).toHaveBeenCalledOnce();
    expect(toneMockState.samplerTrigger).toHaveBeenCalledWith(
      ["D4", "A4", "F4", "C5", "E5"],
      "0.75s",
      undefined,
      0.82,
    );
  });

  it("skips empty midi note group previews", async () => {
    const { previewMidiNotes } = await importAudioPlayer();

    await previewMidiNotes([]);

    expect(toneMockState.start).not.toHaveBeenCalled();
    expect(toneMockState.samplerTrigger).not.toHaveBeenCalled();
  });

  it("previews a chord through the same sampler path when samples are ready", async () => {
    const { previewChord } = await importAudioPlayer();
    const chord = parseChord("Dm9");

    expect(isChordAnalysis(chord)).toBe(true);
    if (!isChordAnalysis(chord)) {
      return;
    }

    await previewChord(chord);

    expect(toneMockState.samplerTrigger).toHaveBeenCalledWith(
      ["D4", "F4", "A4", "C5", "E5"],
      "1.2s",
      undefined,
      0.82,
    );
  });

  it("previews slash chords with the bass note first", async () => {
    const { previewChord } = await importAudioPlayer();
    const chord = parseChord("C/E");

    expect(isChordAnalysis(chord)).toBe(true);
    if (!isChordAnalysis(chord)) {
      return;
    }

    await previewChord(chord);

    expect(toneMockState.samplerTrigger).toHaveBeenCalledWith(
      ["E3", "C4", "E4", "G4"],
      "1.2s",
      undefined,
      0.82,
    );
  });

  it("schedules each event when previewing a comping pattern", async () => {
    const { previewChordPattern } = await importAudioPlayer();
    const chord = parseChord("Dm9");

    expect(isChordAnalysis(chord)).toBe(true);
    if (!isChordAnalysis(chord)) {
      return;
    }

    await previewChordPattern(chord, 120);

    expect(toneMockState.transportStop).toHaveBeenCalledOnce();
    expect(toneMockState.transportCancel).toHaveBeenCalledOnce();
    expect(toneMockState.transportSchedule).toHaveBeenCalledTimes(8);
    expect(toneMockState.transportSchedule).toHaveBeenNthCalledWith(1, expect.any(Function), 0);
    expect(toneMockState.transportSchedule).toHaveBeenNthCalledWith(2, expect.any(Function), 0.25);
    expect(toneMockState.transportStart).toHaveBeenCalledOnce();

    const firstEvent = toneMockState.transportSchedule.mock.calls[0][0] as (time: number) => void;
    firstEvent(1.5);

    expect(toneMockState.samplerTrigger).toHaveBeenCalledWith(
      ["D4", "A4", "F4", "C5", "E5"],
      0.21,
      1.5,
      0.72,
    );
  });

  it("does not schedule playback for chords without a comping pattern", async () => {
    const { previewChordPattern } = await importAudioPlayer();
    const chord = parseChord("Cmaj7");

    expect(isChordAnalysis(chord)).toBe(true);
    if (!isChordAnalysis(chord)) {
      return;
    }

    await previewChordPattern(chord, 120);

    expect(toneMockState.start).not.toHaveBeenCalled();
    expect(toneMockState.transportSchedule).not.toHaveBeenCalled();
  });

  it("waits for piano samples instead of using the fallback while the sampler is still loading", async () => {
    toneMockState.callSamplerOnload = false;
    toneMockState.samplerLoaded = false;
    const { previewNote } = await importAudioPlayer();

    const previewPromise = previewNote(60);
    await vi.waitFor(() => {
      expect(toneMockState.samplerOnload).toBeTypeOf("function");
    });

    expect(toneMockState.synthTrigger).not.toHaveBeenCalled();
    expect(toneMockState.samplerTrigger).not.toHaveBeenCalled();

    toneMockState.samplerLoaded = true;
    toneMockState.samplerOnload?.();
    await previewPromise;

    expect(toneMockState.samplerTrigger).toHaveBeenCalledWith("C4", "0.75s", undefined, 0.88);
    expect(toneMockState.synthTrigger).not.toHaveBeenCalled();
  });
});
