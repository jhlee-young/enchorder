import type { ChordLibraryItem } from "../lib/chordTheory";
import { SectionHeading } from "./SectionHeading";

type ChordLibraryProps = {
  items: ChordLibraryItem[];
  onInsertExample: (example: string) => void;
};

export function ChordLibrary({ items, onInsertExample }: ChordLibraryProps) {
  return (
    <aside className="library" aria-label="Chord library">
      <SectionHeading title="Chord Library" description="Click an example to add it." />
      <div className="library-list">
        {items.map((item) => (
          <button
            key={item.example}
            className="library-item"
            onClick={() => onInsertExample(item.example)}
          >
            <span className="library-item__name">{item.label}</span>
            <span className="library-item__example">{item.example}</span>
            <span className="library-item__formula">{item.notesFormula}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
