export type ChordQualityKey =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "sus2"
  | "sus4"
  | "six"
  | "seven"
  | "nine"
  | "majorSeven"
  | "majorNine"
  | "minorSeven"
  | "minorNine"
  | "diminishedSeven"
  | "halfDiminished"
  | "addNine";

export type ChordAnalysis = {
  id: string;
  raw: string;
  root: string;
  quality: ChordQualityKey;
  qualityLabel: string;
  notes: string[];
  midiNotes: number[];
  description: string;
  error?: never;
};

export type ChordError = {
  id: string;
  raw: string;
  error: string;
};

export type ParsedChord = ChordAnalysis | ChordError;

export type ChordLibraryItem = {
  label: string;
  example: string;
  quality: ChordQualityKey;
  description: string;
  notesFormula: string;
};

const NOTE_NAMES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const ROOT_TO_PITCH_CLASS: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

const QUALITY_DEFINITIONS: Record<
  ChordQualityKey,
  {
    aliases: string[];
    label: string;
    intervals: number[];
    description: (root: string, notes: string[]) => string;
  }
> = {
  major: {
    aliases: ["", "M", "maj"],
    label: "Major",
    intervals: [0, 4, 7],
    description: (root, notes) =>
      `${root} major uses a root, a major third, and a perfect fifth: ${notes.join(", ")}.`,
  },
  minor: {
    aliases: ["m", "min", "-"],
    label: "Minor",
    intervals: [0, 3, 7],
    description: (root, notes) =>
      `${root} minor lowers the third, giving the chord a darker color: ${notes.join(", ")}.`,
  },
  diminished: {
    aliases: ["dim", "o"],
    label: "Diminished",
    intervals: [0, 3, 6],
    description: (root, notes) =>
      `${root} diminished stacks two minor thirds: ${notes.join(", ")}.`,
  },
  augmented: {
    aliases: ["aug", "+"],
    label: "Augmented",
    intervals: [0, 4, 8],
    description: (root, notes) =>
      `${root} augmented raises the fifth for a bright, unstable sound: ${notes.join(", ")}.`,
  },
  sus2: {
    aliases: ["sus2"],
    label: "Suspended 2",
    intervals: [0, 2, 7],
    description: (root, notes) =>
      `${root} sus2 replaces the third with the second: ${notes.join(", ")}.`,
  },
  sus4: {
    aliases: ["sus4", "sus"],
    label: "Suspended 4",
    intervals: [0, 5, 7],
    description: (root, notes) =>
      `${root} sus4 replaces the third with the fourth: ${notes.join(", ")}.`,
  },
  six: {
    aliases: ["6"],
    label: "Sixth",
    intervals: [0, 4, 7, 9],
    description: (root, notes) =>
      `${root}6 adds the sixth to a major chord: ${notes.join(", ")}.`,
  },
  seven: {
    aliases: ["7"],
    label: "Dominant 7",
    intervals: [0, 4, 7, 10],
    description: (root, notes) =>
      `${root}7 adds a flat seventh to a major chord: ${notes.join(", ")}.`,
  },
  nine: {
    aliases: ["9"],
    label: "Dominant 9",
    intervals: [0, 4, 7, 10, 14],
    description: (root, notes) =>
      `${root}9 adds a ninth above a dominant seventh chord: ${notes.join(", ")}.`,
  },
  majorSeven: {
    aliases: ["maj7", "M7", "ma7"],
    label: "Major 7",
    intervals: [0, 4, 7, 11],
    description: (root, notes) =>
      `${root}maj7 adds the seventh scale note to a major chord: ${notes.join(", ")}.`,
  },
  majorNine: {
    aliases: ["maj9", "M9", "ma9"],
    label: "Major 9",
    intervals: [0, 4, 7, 11, 14],
    description: (root, notes) =>
      `${root}maj9 adds a ninth above a major seventh chord: ${notes.join(", ")}.`,
  },
  minorSeven: {
    aliases: ["m7", "min7", "-7"],
    label: "Minor 7",
    intervals: [0, 3, 7, 10],
    description: (root, notes) =>
      `${root}m7 adds a flat seventh to a minor chord: ${notes.join(", ")}.`,
  },
  minorNine: {
    aliases: ["m9", "min9", "-9"],
    label: "Minor 9",
    intervals: [0, 3, 7, 10, 14],
    description: (root, notes) =>
      `${root}m9 adds a ninth above a minor seventh chord: ${notes.join(", ")}.`,
  },
  diminishedSeven: {
    aliases: ["dim7", "o7"],
    label: "Diminished 7",
    intervals: [0, 3, 6, 9],
    description: (root, notes) =>
      `${root}dim7 stacks minor thirds through the seventh: ${notes.join(", ")}.`,
  },
  halfDiminished: {
    aliases: ["m7b5", "min7b5", "ø", "ø7"],
    label: "Half-diminished",
    intervals: [0, 3, 6, 10],
    description: (root, notes) =>
      `${root}m7b5 is a minor seventh chord with a lowered fifth: ${notes.join(", ")}.`,
  },
  addNine: {
    aliases: ["add9"],
    label: "Add 9",
    intervals: [0, 4, 7, 14],
    description: (root, notes) =>
      `${root}add9 adds the ninth above a major chord: ${notes.join(", ")}.`,
  },
};

export const CHORD_LIBRARY: ChordLibraryItem[] = [
  {
    label: "Major",
    example: "C",
    quality: "major",
    description: "Stable and clear. Start here.",
    notesFormula: "1 3 5",
  },
  {
    label: "Minor",
    example: "Cm",
    quality: "minor",
    description: "Like major, but with a lowered third.",
    notesFormula: "1 b3 5",
  },
  {
    label: "Dominant 7",
    example: "D7",
    quality: "seven",
    description: "A major chord with a flat seventh.",
    notesFormula: "1 3 5 b7",
  },
  {
    label: "Major 7",
    example: "Cmaj7",
    quality: "majorSeven",
    description: "Smooth major color with a seventh.",
    notesFormula: "1 3 5 7",
  },
  {
    label: "Minor 7",
    example: "Am7",
    quality: "minorSeven",
    description: "A common soft minor sound.",
    notesFormula: "1 b3 5 b7",
  },
  {
    label: "Minor 9",
    example: "Dm9",
    quality: "minorNine",
    description: "Minor seventh with a ninth on top.",
    notesFormula: "1 b3 5 b7 9",
  },
  {
    label: "Major 9",
    example: "Cmaj9",
    quality: "majorNine",
    description: "Major seventh with a ninth on top.",
    notesFormula: "1 3 5 7 9",
  },
  {
    label: "Suspended 4",
    example: "Gsus4",
    quality: "sus4",
    description: "No third, so it feels open.",
    notesFormula: "1 4 5",
  },
  {
    label: "Diminished",
    example: "Bdim",
    quality: "diminished",
    description: "Tense and compact.",
    notesFormula: "1 b3 b5",
  },
  {
    label: "Add 9",
    example: "Fadd9",
    quality: "addNine",
    description: "Major with an added ninth.",
    notesFormula: "1 3 5 9",
  },
];

const ALIASES = Object.entries(QUALITY_DEFINITIONS)
  .flatMap(([quality, definition]) =>
    definition.aliases.map((alias) => ({ alias, quality: quality as ChordQualityKey })),
  )
  .sort((a, b) => b.alias.length - a.alias.length);

export function parseProgression(input: string): ParsedChord[] {
  return input
    .split(/[\s|]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token, index) => parseChord(token, index));
}

export function parseChord(raw: string, index = 0): ParsedChord {
  const match = raw.match(/^([A-G](?:#|b)?)(.*)$/);

  if (!match) {
    return {
      id: `${index}-${raw}`,
      raw,
      error: "We can't read this chord yet. Try C, Cm, Cmaj7, or D7.",
    };
  }

  const [, root, suffix] = match;
  const pitchClass = ROOT_TO_PITCH_CLASS[root];

  if (pitchClass === undefined) {
    return {
      id: `${index}-${raw}`,
      raw,
      error: "Use a root note from A to G, with optional # or b.",
    };
  }

  const aliasMatch = ALIASES.find(({ alias }) => alias === suffix);

  if (!aliasMatch) {
    return {
      id: `${index}-${raw}`,
      raw,
      error: "We can't read this chord type yet. Try major, minor, 7, 9, maj7, maj9, m7, m9, sus4, dim, or add9.",
    };
  }

  const definition = QUALITY_DEFINITIONS[aliasMatch.quality];
  const notes = definition.intervals.map((interval) => noteName(pitchClass + interval));
  const midiNotes = definition.intervals.map((interval) => 60 + pitchClass + interval);

  return {
    id: `${index}-${raw}`,
    raw,
    root,
    quality: aliasMatch.quality,
    qualityLabel: definition.label,
    notes,
    midiNotes,
    description: definition.description(root, notes),
  };
}

export function isChordAnalysis(chord: ParsedChord): chord is ChordAnalysis {
  return !("error" in chord);
}

export function noteName(value: number): string {
  return NOTE_NAMES_SHARP[((value % 12) + 12) % 12];
}

export function midiToNote(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${noteName(midi)}${octave}`;
}
