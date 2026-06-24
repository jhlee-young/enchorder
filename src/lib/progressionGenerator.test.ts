import { describe, expect, it } from "vitest";
import { isChordAnalysis, parseProgression } from "./chordTheory";
import { generateProgression } from "./progressionGenerator";

describe("generateProgression", () => {
  it("returns a readable progression", () => {
    const progression = generateProgression();

    expect(progression).not.toBe("");
    expect(progression).toContain(" | ");
  });

  it("returns four pipe-separated chord slots", () => {
    for (let index = 0; index < 100; index += 1) {
      const progression = generateProgression();
      const slots = progression.split(" | ");

      expect(slots).toHaveLength(4);
      expect(slots.every((slot) => !slot.includes(" "))).toBe(true);
    }
  });

  it("only returns playable chords", () => {
    for (let index = 0; index < 100; index += 1) {
      const chords = parseProgression(generateProgression());

      expect(chords.length).toBeGreaterThan(0);
      expect(chords.every(isChordAnalysis)).toBe(true);
    }
  });
});
