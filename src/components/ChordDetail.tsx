import type { ChordAnalysis } from "../lib/chordTheory";
import { PianoKeyboard } from "./PianoKeyboard";

type ChordDetailProps = {
  chord: ChordAnalysis;
  onPreview: () => void;
  onPreviewNote: (midiNote: number) => void;
};

export function ChordDetail({ chord, onPreview, onPreviewNote }: ChordDetailProps) {
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
      </dl>
      <p className="detail-description">{chord.description}</p>
      <p className="keyboard-hint">Tap a highlighted key to hear one note.</p>
      <PianoKeyboard chord={chord} onPreviewNote={onPreviewNote} />
    </div>
  );
}
