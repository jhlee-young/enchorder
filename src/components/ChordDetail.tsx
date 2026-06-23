import type { ChordAnalysis } from "../lib/chordTheory";
import { getCompingVoicings } from "../lib/compingPatterns";
import { PianoKeyboard } from "./PianoKeyboard";

type ChordDetailProps = {
  chord: ChordAnalysis;
  onPreview: () => void;
  onPreviewPatternEvent: (midiNotes: number[]) => void;
  onPreviewNote: (midiNote: number) => void;
};

export function ChordDetail({
  chord,
  onPreview,
  onPreviewPatternEvent,
  onPreviewNote,
}: ChordDetailProps) {
  const compingVoicings = getCompingVoicings(chord);
  const hasVoicings = compingVoicings.length > 0;

  return (
    <div className="chord-detail">
      <div className="detail-title-row">
        <p className="detail-symbol">{chord.raw}</p>
        <button className="button" onClick={onPreview}>
          Sound
        </button>
      </div>
      <dl className="detail-list">
        <div>
          <dt>Root</dt>
          <dd>{chord.root}</dd>
        </div>
        <div>
          <dt>Chord type</dt>
          <dd>{chord.qualityLabel}</dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>{chord.notes.join(" ")}</dd>
        </div>
        {chord.isSlashChord && chord.bassNote ? (
          <div>
            <dt>Bass note</dt>
            <dd>{chord.bassNote}</dd>
          </div>
        ) : null}
      </dl>
      <p className="detail-description">{chord.description}</p>
      <p className="keyboard-hint">Tap a highlighted key to hear one note.</p>
      <PianoKeyboard chord={chord} onPreviewNote={onPreviewNote} />
      <details className="advanced-panel">
        <summary>Advanced</summary>
        <div className="advanced-panel__content">
          <div className="advanced-panel__header">
            <div>
              <p className="advanced-panel__title">Comping voicings</p>
              <p className="advanced-panel__copy">
                Tap a shape to hear one way to play this chord.
              </p>
            </div>
          </div>
          {hasVoicings ? (
            <div className="pattern-strip" aria-label={`${chord.raw} comping voicings`}>
              {compingVoicings.map((event, eventIndex) => (
                <button
                  key={`${event.noteNames.join("")}-${eventIndex}`}
                  className={[
                    "pattern-event",
                    event.includesRoot ? "pattern-event--root" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => onPreviewPatternEvent(event.midiNotes)}
                  aria-label={`Play pattern ${event.noteNames.join("")}`}
                >
                  {event.noteNames.map((noteName, noteIndex) => {
                    const isRootNote = event.midiNotes[noteIndex] === chord.midiNotes[0];

                    return (
                      <span
                        key={`${noteName}-${noteIndex}`}
                        className={["pattern-note", isRootNote ? "pattern-note--root" : ""]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {noteName}
                      </span>
                    );
                  })}
                </button>
              ))}
            </div>
          ) : (
            <p className="advanced-panel__empty">No voicings yet for this chord type.</p>
          )}
        </div>
      </details>
    </div>
  );
}
