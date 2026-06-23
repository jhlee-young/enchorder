import type { ParsedChord } from "../lib/chordTheory";

type ChordCellProps = {
  chord: ParsedChord;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
};

export function ChordCell({ chord, isActive, isSelected, onSelect }: ChordCellProps) {
  return (
    <button
      className={[
        "chord-cell",
        isActive ? "is-active" : "",
        isSelected ? "is-selected" : "",
        "error" in chord ? "has-error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onSelect}
    >
      <span className="chord-cell__symbol">{chord.raw}</span>
      {"error" in chord ? (
        <span className="chord-cell__error">{chord.error}</span>
      ) : (
        <>
          <span>
            <b>Root</b> {chord.root}
          </span>
          <span>
            <b>Type</b> {chord.qualityLabel}
          </span>
          <span>
            <b>Notes</b> {chord.notes.join(" ")}
          </span>
        </>
      )}
    </button>
  );
}
