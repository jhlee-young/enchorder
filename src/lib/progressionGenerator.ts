import { isChordAnalysis, parseProgression } from "./chordTheory";

type Degree = "I" | "ii" | "iii" | "IV" | "V" | "vi";

type ChordColor = {
  suffix: string;
  weight: number;
};

const MAJOR_KEYS = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"] as const;

const SCALE_STEPS: Record<Degree, number> = {
  I: 0,
  ii: 2,
  iii: 4,
  IV: 5,
  V: 7,
  vi: 9,
};

const PITCH_CLASS_TO_ROOT = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"] as const;

const ROOT_TO_PITCH_CLASS: Record<string, number> = {
  C: 0,
  Db: 1,
  D: 2,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  Ab: 8,
  A: 9,
  Bb: 10,
  B: 11,
};

const PROGRESSION_TEMPLATES: Degree[][] = [
  ["I", "vi", "IV", "V"],
  ["I", "V", "vi", "IV"],
  ["vi", "IV", "I", "V"],
  ["I", "IV", "V", "I"],
  ["ii", "V", "I", "I"],
  ["I", "iii", "vi", "IV"],
  ["ii", "V", "iii", "vi"],
];

const DEGREE_COLORS: Record<Degree, ChordColor[]> = {
  I: [
    { suffix: "", weight: 4 },
    { suffix: "maj7", weight: 3 },
    { suffix: "maj9", weight: 2 },
  ],
  ii: [
    { suffix: "m7", weight: 4 },
    { suffix: "m9", weight: 2 },
  ],
  iii: [{ suffix: "m7", weight: 1 }],
  IV: [
    { suffix: "", weight: 3 },
    { suffix: "add9", weight: 3 },
    { suffix: "maj7", weight: 2 },
  ],
  V: [
    { suffix: "7", weight: 4 },
    { suffix: "9", weight: 2 },
    { suffix: "sus4", weight: 1 },
  ],
  vi: [
    { suffix: "m7", weight: 4 },
    { suffix: "m9", weight: 2 },
  ],
};

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function weightedRandom(items: ChordColor[]) {
  const totalWeight = items.reduce((total, item) => total + item.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const item of items) {
    cursor -= item.weight;

    if (cursor <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

function getRoot(key: string, degree: Degree) {
  const keyPitchClass = ROOT_TO_PITCH_CLASS[key];
  return PITCH_CLASS_TO_ROOT[(keyPitchClass + SCALE_STEPS[degree]) % PITCH_CLASS_TO_ROOT.length];
}

function buildChord(key: string, degree: Degree) {
  const root = getRoot(key, degree);
  const color = weightedRandom(DEGREE_COLORS[degree]);

  return `${root}${color.suffix}`;
}

export function generateProgression() {
  const key = randomItem(MAJOR_KEYS);
  const template = randomItem(PROGRESSION_TEMPLATES);
  const progression = template.map((degree) => buildChord(key, degree)).join(" | ");
  const parsedChords = parseProgression(progression);

  if (parsedChords.every(isChordAnalysis)) {
    return progression;
  }

  return "Cmaj7 | Am7 | Fadd9 | G7";
}
