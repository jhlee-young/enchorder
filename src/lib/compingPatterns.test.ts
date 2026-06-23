import { describe, expect, it } from "vitest";
import { isChordAnalysis, parseChord } from "./chordTheory";
import { getCompingPattern, getCompingVoicings } from "./compingPatterns";

function parseAnalysis(chordName: string) {
  const chord = parseChord(chordName);

  expect(isChordAnalysis(chord)).toBe(true);
  if (!isChordAnalysis(chord)) {
    throw new Error(`${chordName} did not parse`);
  }

  return chord;
}

function getPatternLabels(chordName: string) {
  return getCompingPattern(parseAnalysis(chordName)).map((event) => event.noteNames.join(""));
}

function getVoicingLabels(chordName: string) {
  return getCompingVoicings(parseAnalysis(chordName)).map((event) => event.noteNames.join(""));
}

describe("getCompingPattern", () => {
  it("creates the minor nine comping pattern for Dm9", () => {
    expect(getPatternLabels("Dm9")).toEqual([
      "DAFCE",
      "AFCE",
      "AFCE",
      "AFCE",
      "AFE",
      "FCE",
      "FACE",
    ]);
  });

  it("transposes the same minor nine pattern from the chord root", () => {
    expect(getPatternLabels("Am9")).toEqual([
      "AECGB",
      "ECGB",
      "ECGB",
      "ECGB",
      "ECB",
      "CGB",
      "CEGB",
    ]);
  });

  it("prepends slash bass to the first minor nine pattern event", () => {
    expect(getPatternLabels("Dm9/F")).toEqual([
      "FDAFCE",
      "AFCE",
      "AFCE",
      "AFCE",
      "AFE",
      "FCE",
      "FACE",
    ]);
  });

  it("returns no pattern for unsupported chord types", () => {
    const chord = parseAnalysis("Cmaj7");

    expect(getCompingPattern(chord)).toEqual([]);
  });
});

describe("getCompingVoicings", () => {
  it("creates every minor nine voicing with at least three notes", () => {
    const chord = parseAnalysis("Dm9");
    const voicings = getCompingVoicings(chord);
    const labels = voicings.map((event) => event.noteNames.join(""));

    expect(labels).toContain("FAC");
    expect(labels).toContain("FACE");
    expect(labels).toContain("DFACE");
    expect(voicings.every((event) => event.noteNames.length >= 3)).toBe(true);
  });

  it("does not repeat voicing labels", () => {
    const labels = getVoicingLabels("Dm9");

    expect(new Set(labels).size).toBe(labels.length);
  });

  it("keeps slash bass on the full voicing only", () => {
    const labels = getVoicingLabels("Dm9/F");

    expect(labels).toContain("FDFACE");
    expect(labels).toContain("FAC");
  });

  it("creates voicings for diminished seventh chords", () => {
    const labels = getVoicingLabels("Abdim7");

    expect(labels).toEqual(["G#BD", "G#BF", "G#DF", "BDF", "G#BDF"]);
  });

  it("creates one full voicing for triads", () => {
    expect(getVoicingLabels("C")).toEqual(["CEG"]);
  });

  it("creates voicings for non-minor-nine seventh chords", () => {
    const labels = getVoicingLabels("Cmaj7");

    expect(labels).toEqual(["CEG", "CEB", "CGB", "EGB", "CEGB"]);
  });
});
