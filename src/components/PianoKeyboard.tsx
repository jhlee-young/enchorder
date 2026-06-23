import { KEYBOARD_NOTES } from "../constants/appDefaults";
import { noteName, type ChordAnalysis } from "../lib/chordTheory";

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
        const isBassNote =
          chord.isSlashChord &&
          chord.bassMidiNote !== undefined &&
          noteName(chord.bassMidiNote) === note;
        const isPlayable = isChordTone || isBassNote;
        const midiNote = isBassNote ? chord.bassMidiNote : chord.midiNotes[noteIndex];

        return (
          <button
            key={note}
            className={[
              "key",
              note.includes("#") ? "key--black" : "key--white",
              isPlayable ? "is-on" : "",
              isBassNote ? "is-bass" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={!isPlayable}
            onClick={() => {
              if (isPlayable && midiNote !== undefined) {
                onPreviewNote(midiNote);
              }
            }}
            aria-label={
              isBassNote
                ? `Play bass note ${chord.bassNote ?? note}`
                : isChordTone
                  ? `Play note ${note}`
                  : `${note} is not in ${chord.raw}`
            }
          >
            {note}
          </button>
        );
      })}
    </div>
  );
}
