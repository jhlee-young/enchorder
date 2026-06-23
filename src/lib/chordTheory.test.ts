import { describe, expect, it } from "vitest";
import { CHORD_LIBRARY, isChordAnalysis, parseChord, parseProgression } from "./chordTheory";

function expectNotes(chordName: string, notes: string[]) {
  const chord = parseChord(chordName);
  expect(isChordAnalysis(chord)).toBe(true);
  if (isChordAnalysis(chord)) {
    expect(chord.notes).toEqual(notes);
  }
}

describe("parseChord", () => {
  it("parses common chord types", () => {
    expectNotes("C", ["C", "E", "G"]);
    expectNotes("Cm", ["C", "D#", "G"]);
    expectNotes("Cmaj7", ["C", "E", "G", "B"]);
    expectNotes("Cmaj9", ["C", "E", "G", "B", "D"]);
    expectNotes("Am7", ["A", "C", "E", "G"]);
    expectNotes("Dm9", ["D", "F", "A", "C", "E"]);
    expectNotes("D7", ["D", "F#", "A", "C"]);
    expectNotes("G9", ["G", "B", "D", "F", "A"]);
    expectNotes("Gm7b5", ["G", "A#", "C#", "F"]);
    expectNotes("F#dim7", ["F#", "A", "C", "D#"]);
    expectNotes("Bbadd9", ["A#", "D", "F", "C"]);
  });

  it("returns a readable error for unknown input", () => {
    const chord = parseChord("hello");
    expect(isChordAnalysis(chord)).toBe(false);
    expect(chord.error).toContain("We can't read this chord");
  });
});

describe("parseProgression", () => {
  it("parses whitespace, lines, and bar separators", () => {
    const chords = parseProgression("Cmaj7 | Am7 D7\nGmaj7");
    expect(chords.map((chord) => chord.raw)).toEqual(["Cmaj7", "Am7", "D7", "Gmaj7"]);
  });

  it("keeps invalid chords as visible error items", () => {
    const chords = parseProgression("C nope G7");
    expect(chords).toHaveLength(3);
    expect(isChordAnalysis(chords[1])).toBe(false);
  });

  it("supports every chord library example", () => {
    for (const item of CHORD_LIBRARY) {
      expect(isChordAnalysis(parseChord(item.example))).toBe(true);
    }
  });
});
