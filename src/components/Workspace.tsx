import type { ChordLibraryItem } from "../lib/chordTheory";
import { ChordLibrary } from "./ChordLibrary";
import { ProgressionComposer } from "./ProgressionComposer";

type WorkspaceProps = {
  input: string;
  libraryItems: ChordLibraryItem[];
  onGenerateProgression: () => void;
  onInputChange: (input: string) => void;
  onInsertExample: (example: string) => void;
};

export function Workspace({
  input,
  libraryItems,
  onGenerateProgression,
  onInputChange,
  onInsertExample,
}: WorkspaceProps) {
  return (
    <section className="workspace">
      <ProgressionComposer
        input={input}
        onGenerateProgression={onGenerateProgression}
        onInputChange={onInputChange}
      />
      <ChordLibrary items={libraryItems} onInsertExample={onInsertExample} />
    </section>
  );
}
