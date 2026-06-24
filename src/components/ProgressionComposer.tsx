import { useState } from "react";

type ProgressionComposerProps = {
  input: string;
  onGenerateProgression: () => void;
  onInputChange: (input: string) => void;
};

export function ProgressionComposer({
  input,
  onGenerateProgression,
  onInputChange,
}: ProgressionComposerProps) {
  const [isRolling, setIsRolling] = useState(false);

  function handleRoll() {
    if (isRolling) {
      return;
    }

    setIsRolling(true);
    window.setTimeout(() => {
      onGenerateProgression();
      setIsRolling(false);
    }, 420);
  }

  return (
    <div className="composer">
      <div className="composer__label-row">
        <label className="field-label" htmlFor="progression-input">
          Progression
        </label>
        <button
          className={["button", "button--roll", isRolling ? "is-rolling" : ""]
            .filter(Boolean)
            .join(" ")}
          disabled={isRolling}
          onClick={handleRoll}
          aria-label="Roll a progression"
          type="button"
        >
          <svg
            aria-hidden="true"
            className="button--roll__icon"
            viewBox="0 0 24 24"
          >
            <rect x="4" y="4" width="16" height="16" rx="3" fill="none" />
            <circle cx="8.5" cy="8.5" r="1.25" />
            <circle cx="15.5" cy="8.5" r="1.25" />
            <circle cx="12" cy="12" r="1.25" />
            <circle cx="8.5" cy="15.5" r="1.25" />
            <circle cx="15.5" cy="15.5" r="1.25" />
          </svg>
        </button>
      </div>
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
