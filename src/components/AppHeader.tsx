import { clampBpm } from "../utils/number";

type AppHeaderProps = {
  bpm: number;
  isPlaying: boolean;
  onBpmChange: (bpm: number) => void;
  onPlay: () => void;
  onReset: () => void;
  onStop: () => void;
};

export function AppHeader({
  bpm,
  isPlaying,
  onBpmChange,
  onPlay,
  onReset,
  onStop,
}: AppHeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="wordmark">enchorder</p>
        <p className="topbar__status">Chord learning workbench</p>
      </div>
      <div className="transport" aria-label="Playback controls">
        <label className="bpm-control">
          <span>BPM</span>
          <input
            type="number"
            min="50"
            max="180"
            value={bpm}
            onChange={(event) => onBpmChange(clampBpm(Number(event.target.value)))}
            aria-describedby="bpm-help"
          />
        </label>
        <span id="bpm-help" className="sr-only">
          Beats per minute
        </span>
        <button
          className="button button--icon button--primary"
          onClick={onPlay}
          disabled={isPlaying}
          aria-label="Play progression"
        >
          <svg aria-hidden="true" className="button__icon" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <button className="button button--icon" onClick={onStop} aria-label="Stop playback">
          <svg aria-hidden="true" className="button__icon" viewBox="0 0 24 24">
            <rect x="7" y="7" width="10" height="10" rx="1" />
          </svg>
        </button>
        <button className="button button--icon" onClick={onReset} aria-label="Reset practice">
          <svg aria-hidden="true" className="button__icon" viewBox="0 0 24 24">
            <path
              d="M5 7v5h5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M6.2 16A7 7 0 1 0 7 7.8"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
