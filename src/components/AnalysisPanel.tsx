import type { ParsedChord } from "../lib/chordTheory";
import { ChordCell } from "./ChordCell";
import { SectionHeading } from "./SectionHeading";

type AnalysisPanelProps = {
  activeIndex: number | null;
  playableCount: number;
  selectedIndex: number;
  chords: ParsedChord[];
  onSelectChord: (index: number) => void;
};

export function AnalysisPanel({
  activeIndex,
  playableCount,
  selectedIndex,
  chords,
  onSelectChord,
}: AnalysisPanelProps) {
  return (
    <div className="analysis-panel">
      <SectionHeading title="Analysis" description={`${playableCount} playable chords`} />
      <div className="chord-grid">
        {chords.map((chord, index) => (
          <ChordCell
            key={chord.id}
            chord={chord}
            isActive={activeIndex === index}
            isSelected={selectedIndex === index}
            onSelect={() => onSelectChord(index)}
          />
        ))}
      </div>
    </div>
  );
}
