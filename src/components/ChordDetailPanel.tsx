import type { ChordAnalysis } from "../lib/chordTheory";
import { ChordDetail } from "./ChordDetail";
import { SectionHeading } from "./SectionHeading";

type ChordDetailPanelProps = {
  selectedChord?: ChordAnalysis;
  onPreviewChord: (chord: ChordAnalysis) => void;
  onPreviewNote: (midiNote: number) => void;
};

export function ChordDetailPanel({
  selectedChord,
  onPreviewChord,
  onPreviewNote,
}: ChordDetailPanelProps) {
  return (
    <aside className="detail-panel" aria-label="Selected chord details">
      <SectionHeading title="Chord Detail" description="Learn one sound at a time." />
      {selectedChord ? (
        <ChordDetail
          chord={selectedChord}
          onPreview={() => onPreviewChord(selectedChord)}
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
