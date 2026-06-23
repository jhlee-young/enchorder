import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_BPM, DEFAULT_PROGRESSION } from "../constants/appDefaults";
import {
  clearPracticeState,
  loadPracticeState,
  PRACTICE_STORAGE_KEY,
  savePracticeState,
} from "./practiceStorage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
});

describe("practiceStorage", () => {
  it("loads a valid saved practice state", () => {
    storage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({ input: "C/E G/B", bpm: 108 }));

    expect(loadPracticeState(storage)).toEqual({ input: "C/E G/B", bpm: 108 });
  });

  it("falls back when stored JSON is invalid", () => {
    storage.setItem(PRACTICE_STORAGE_KEY, "{bad json");

    expect(loadPracticeState(storage)).toEqual({
      input: DEFAULT_PROGRESSION,
      bpm: DEFAULT_BPM,
    });
  });

  it("normalizes empty input and unusual bpm values", () => {
    storage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({ input: "   ", bpm: 240 }));

    expect(loadPracticeState(storage)).toEqual({
      input: DEFAULT_PROGRESSION,
      bpm: 180,
    });

    storage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({ input: "Am7 D7", bpm: Number.NaN }));

    expect(loadPracticeState(storage)).toEqual({
      input: "Am7 D7",
      bpm: DEFAULT_BPM,
    });
  });

  it("saves practice state as JSON with a clamped bpm", () => {
    savePracticeState({ input: "Dm7 G7 Cmaj7", bpm: 20 }, storage);

    expect(storage.getItem(PRACTICE_STORAGE_KEY)).toBe(
      JSON.stringify({ input: "Dm7 G7 Cmaj7", bpm: 50 }),
    );
  });

  it("clears saved practice state", () => {
    storage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({ input: "C", bpm: 92 }));

    clearPracticeState(storage);

    expect(storage.getItem(PRACTICE_STORAGE_KEY)).toBeNull();
  });
});
