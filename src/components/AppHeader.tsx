import { clampBpm } from "../utils/number";

type AppHeaderProps = {
  bpm: number;
  isPlaying: boolean;
  onBpmChange: (bpm: number) => void;
  onPlay: () => void;
  onStop: () => void;
};

export function AppHeader({
  bpm,
  isPlaying,
  onBpmChange,
  onPlay,
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
        <button className="button button--primary" onClick={onPlay} disabled={isPlaying}>
          Play
        </button>
        <button className="button" onClick={onStop}>
          Stop
        </button>
      </div>
    </header>
  );
}
