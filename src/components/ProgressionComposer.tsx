type ProgressionComposerProps = {
  input: string;
  onInputChange: (input: string) => void;
};

export function ProgressionComposer({ input, onInputChange }: ProgressionComposerProps) {
  return (
    <div className="composer">
      <label className="field-label" htmlFor="progression-input">
        Progression
      </label>
      <textarea
        id="progression-input"
        className="progression-input"
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        spellCheck={false}
        placeholder="Try: Cmaj7 | Am7 D7 | Gmaj7"
      />
      <p className="hint">Use spaces or bars to separate chords. Example: Cmaj7 | Am7 D7 | Gmaj7</p>
    </div>
  );
}
