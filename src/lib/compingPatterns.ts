import type { ChordAnalysis } from "./chordTheory";
import { noteName } from "./chordTheory";

export type CompingPatternEvent = {
  noteNames: string[];
  midiNotes: number[];
  includesRoot: boolean;
};

function createEvent(chord: ChordAnalysis, noteIndexes: number[]): CompingPatternEvent {
  return {
    midiNotes: noteIndexes.map((noteIndex) => chord.midiNotes[noteIndex]),
    noteNames: noteIndexes.map((noteIndex) => chord.notes[noteIndex]),
    includesRoot: noteIndexes.includes(0),
  };
}

function getIndexCombinations(indexes: number[], size: number): number[][] {
  if (size === 0) {
    return [[]];
  }

  if (indexes.length < size) {
    return [];
  }

  return indexes.flatMap((index, position) =>
    getIndexCombinations(indexes.slice(position + 1), size - 1).map((rest) => [index, ...rest]),
  );
}

export function getCompingPattern(chord: ChordAnalysis): CompingPatternEvent[] {
  const voicings = getCompingVoicings(chord);

  if (voicings.length === 0) {
    return [];
  }

  const rootVoicings = voicings.filter((event) => event.includesRoot);
  const rootVoicing = rootVoicings[rootVoicings.length - 1] ?? voicings[0];
  const upperVoicings = voicings.filter((event) => !event.includesRoot);
  const colorVoicing = upperVoicings[upperVoicings.length - 1] ?? voicings[voicings.length - 1] ?? rootVoicing;
  const lightVoicing = upperVoicings[0] ?? voicings[0];

  return [
    rootVoicing,
    colorVoicing,
    colorVoicing,
    lightVoicing,
    colorVoicing,
    lightVoicing,
    rootVoicing,
  ];
}

export function getCompingVoicings(chord: ChordAnalysis): CompingPatternEvent[] {
  if (chord.midiNotes.length < 3) {
    return [];
  }

  const noteIndexes = chord.notes.map((_, index) => index);
  const voicingIndexes = Array.from(
    { length: chord.notes.length - 2 },
    (_, index) => index + 3,
  ).flatMap((size) => getIndexCombinations(noteIndexes, size));
  const voicings = voicingIndexes.map((indexes) => createEvent(chord, indexes));

  const bassMidiNote = chord.bassMidiNote;

  if (bassMidiNote === undefined) {
    return voicings;
  }

  const fullVoicingIndex = voicings.findIndex((event) => event.midiNotes.length === chord.midiNotes.length);
  const fullVoicing = voicings[fullVoicingIndex];

  if (!fullVoicing) {
    return voicings;
  }

  const bassNoteName = chord.bassNote ?? noteName(bassMidiNote);

  return voicings.map((event, index) =>
    index === fullVoicingIndex
      ? {
          midiNotes: [bassMidiNote, ...fullVoicing.midiNotes],
          noteNames: [bassNoteName, ...fullVoicing.noteNames],
          includesRoot: fullVoicing.includesRoot,
        }
      : event,
  );
}
