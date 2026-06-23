import type { ChordAnalysis } from "../lib/chordTheory";
import { ChordDetail } from "./ChordDetail";
import { SectionHeading } from "./SectionHeading";

type ChordDetailPanelProps = {
  selectedChord?: ChordAnalysis;
  onPreviewChord: (chord: ChordAnalysis) => void;
  onPreviewPattern: (chord: ChordAnalysis) => void;
  onPreviewPatternEvent: (midiNotes: number[]) => void;
  onPreviewNote: (midiNote: number) => void;
};

export function ChordDetailPanel({
  selectedChord,
  onPreviewChord,
  onPreviewPattern,
  onPreviewPatternEvent,
  onPreviewNote,
}: ChordDetailPanelProps) {
  return (
    <aside className="detail-panel" aria-label="Selected chord details">
      <SectionHeading title="Chord Detail" description="Learn one sound at a time." />
      {selectedChord ? (
        <ChordDetail
          key={selectedChord.id}
          chord={selectedChord}
          onPreview={() => onPreviewChord(selectedChord)}
          onPreviewPattern={() => onPreviewPattern(selectedChord)}
          onPreviewPatternEvent={onPreviewPatternEvent}
          onPreviewNote={onPreviewNote}
        />
      ) : (
        <div className="detail-empty">
          <p>Select a readable chord to see its notes.</p>
        </div>
      )}
    </aside>
  );
}
