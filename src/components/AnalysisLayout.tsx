import type { ChordAnalysis, ParsedChord } from "../lib/chordTheory";
import { AnalysisPanel } from "./AnalysisPanel";
import { ChordDetailPanel } from "./ChordDetailPanel";

type AnalysisLayoutProps = {
  activeIndex: number | null;
  playableCount: number;
  selectedIndex: number;
  selectedChord?: ChordAnalysis;
  chords: ParsedChord[];
  onSelectChord: (index: number) => void;
  onPreviewChord: (chord: ChordAnalysis) => void;
  onPreviewPattern: (chord: ChordAnalysis) => void;
  onPreviewPatternEvent: (midiNotes: number[]) => void;
  onPreviewNote: (midiNote: number) => void;
};

export function AnalysisLayout({
  activeIndex,
  playableCount,
  selectedIndex,
  selectedChord,
  chords,
  onSelectChord,
  onPreviewChord,
  onPreviewPattern,
  onPreviewPatternEvent,
  onPreviewNote,
}: AnalysisLayoutProps) {
  return (
    <section className="analysis-layout">
      <AnalysisPanel
        activeIndex={activeIndex}
        playableCount={playableCount}
        selectedIndex={selectedIndex}
        chords={chords}
        onSelectChord={onSelectChord}
      />
      <ChordDetailPanel
        selectedChord={selectedChord}
        onPreviewChord={onPreviewChord}
        onPreviewPattern={onPreviewPattern}
        onPreviewPatternEvent={onPreviewPatternEvent}
        onPreviewNote={onPreviewNote}
      />
    </section>
  );
}
