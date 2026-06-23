import { KEYBOARD_NOTES } from "../constants/appDefaults";
import type { ChordAnalysis } from "../lib/chordTheory";

type PianoKeyboardProps = {
  chord: ChordAnalysis;
  onPreviewNote: (midiNote: number) => void;
};

export function PianoKeyboard({ chord, onPreviewNote }: PianoKeyboardProps) {
  return (
    <div className="keyboard" aria-label={`${chord.raw} notes on keyboard`}>
      {KEYBOARD_NOTES.map((note) => {
        const noteIndex = chord.notes.indexOf(note);
        const isChordTone = noteIndex >= 0;
        const midiNote = chord.midiNotes[noteIndex];

        return (
          <button
            key={note}
            className={[
              "key",
              note.includes("#") ? "key--black" : "key--white",
              isChordTone ? "is-on" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={!isChordTone}
            onClick={() => {
              if (isChordTone) {
                onPreviewNote(midiNote);
              }
            }}
            aria-label={isChordTone ? `Play note ${note}` : `${note} is not in ${chord.raw}`}
          >
            {note}
          </button>
        );
      })}
    </div>
  );
}
