import type { ChordLibraryItem } from "../lib/chordTheory";
import { ChordLibrary } from "./ChordLibrary";
import { ProgressionComposer } from "./ProgressionComposer";

type WorkspaceProps = {
  input: string;
  libraryItems: ChordLibraryItem[];
  onInputChange: (input: string) => void;
  onInsertExample: (example: string) => void;
};

export function Workspace({
  input,
  libraryItems,
  onInputChange,
  onInsertExample,
}: WorkspaceProps) {
  return (
    <section className="workspace">
      <ProgressionComposer input={input} onInputChange={onInputChange} />
      <ChordLibrary items={libraryItems} onInsertExample={onInsertExample} />
    </section>
  );
}
