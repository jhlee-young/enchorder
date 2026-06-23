import { useMemo, useState } from "react";
import { playProgression, previewChord, stopPlayback } from "./lib/audioPlayer";
import {
  CHORD_LIBRARY,
  type ChordAnalysis,
  isChordAnalysis,
  parseProgression,
} from "./lib/chordTheory";

const DEFAULT_PROGRESSION = "Cmaj7 | Am7 D7 | Gmaj7";
const KEYBOARD_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function clampBpm(value: number) {
  return Math.min(180, Math.max(50, value));
}

export default function App() {
  const [input, setInput] = useState(DEFAULT_PROGRESSION);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [bpm, setBpm] = useState(92);
  const [isPlaying, setIsPlaying] = useState(false);

  const parsedChords = useMemo(() => parseProgression(input), [input]);
  const playableChords = parsedChords.filter(isChordAnalysis);
  const selectedChord = parsedChords[selectedIndex] ?? parsedChords[0];
  const selectedAnalysis = selectedChord && isChordAnalysis(selectedChord) ? selectedChord : undefined;

  function selectChord(index: number) {
    setSelectedIndex(index);
  }

  function insertExample(example: string) {
    const nextInput = input.trim() ? `${input.trim()} ${example}` : example;
    setInput(nextInput);
  }

  async function handlePlay() {
    if (isPlaying || playableChords.length === 0) {
      return;
    }

    setIsPlaying(true);
    await playProgression(
      playableChords,
      bpm,
      (index) => setActiveIndex(index),
      () => {
        setIsPlaying(false);
        setActiveIndex(null);
      },
    );
  }

  async function handleStop() {
    await stopPlayback();
    setIsPlaying(false);
    setActiveIndex(null);
  }

  return (
    <main className="app-shell">
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
              onChange={(event) => setBpm(clampBpm(Number(event.target.value)))}
              aria-describedby="bpm-help"
            />
          </label>
          <span id="bpm-help" className="sr-only">
            Beats per minute
          </span>
          <button className="button button--primary" onClick={handlePlay} disabled={isPlaying}>
            Play
          </button>
          <button className="button" onClick={handleStop}>
            Stop
          </button>
        </div>
      </header>

      <section className="hero-panel" aria-labelledby="main-title">
        <div>
          <p className="eyebrow">Chord names, notes, and sound</p>
          <h1 id="main-title">Hear the chord. See the notes.</h1>
        </div>
        <p className="hero-panel__copy">
          Type a progression, press play, and follow how each chord is built.
        </p>
      </section>

      <section className="workspace">
        <div className="composer">
          <label className="field-label" htmlFor="progression-input">
            Progression
          </label>
          <textarea
            id="progression-input"
            className="progression-input"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setSelectedIndex(0);
            }}
            spellCheck={false}
            placeholder="Try: Cmaj7 | Am7 D7 | Gmaj7"
          />
          <p className="hint">Use spaces or bars to separate chords. Example: Cmaj7 | Am7 D7 | Gmaj7</p>
        </div>

        <aside className="library" aria-label="Chord library">
          <div className="section-heading">
            <h2>Chord Library</h2>
            <p>Click an example to add it.</p>
          </div>
          <div className="library-list">
            {CHORD_LIBRARY.map((item) => (
              <button
                key={item.example}
                className="library-item"
                onClick={() => insertExample(item.example)}
              >
                <span className="library-item__name">{item.label}</span>
                <span className="library-item__example">{item.example}</span>
                <span className="library-item__formula">{item.notesFormula}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="analysis-layout">
        <div className="analysis-panel">
          <div className="section-heading">
            <h2>Analysis</h2>
            <p>{playableChords.length} playable chords</p>
          </div>
          <div className="chord-grid">
            {parsedChords.map((chord, index) => {
              const isActive = activeIndex === index;
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={chord.id}
                  className={[
                    "chord-cell",
                    isActive ? "is-active" : "",
                    isSelected ? "is-selected" : "",
                    "error" in chord ? "has-error" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => selectChord(index)}
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
            })}
          </div>
        </div>

        <aside className="detail-panel" aria-label="Selected chord details">
          <div className="section-heading">
            <h2>Chord Detail</h2>
            <p>Learn one sound at a time.</p>
          </div>
          {selectedAnalysis ? (
            <ChordDetail chord={selectedAnalysis} onPreview={() => previewChord(selectedAnalysis)} />
          ) : (
            <div className="detail-empty">
              <p>Select a readable chord to see its notes.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

function ChordDetail({ chord, onPreview }: { chord: ChordAnalysis; onPreview: () => void }) {
  return (
    <div className="chord-detail">
      <div className="detail-title-row">
        <p className="detail-symbol">{chord.raw}</p>
        <button className="button" onClick={onPreview}>
          Sound
        </button>
      </div>
      <dl className="detail-list">
        <div>
          <dt>Root</dt>
          <dd>{chord.root}</dd>
        </div>
        <div>
          <dt>Chord type</dt>
          <dd>{chord.qualityLabel}</dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>{chord.notes.join(" ")}</dd>
        </div>
      </dl>
      <p className="detail-description">{chord.description}</p>
      <div className="keyboard" aria-label={`${chord.raw} notes on keyboard`}>
        {KEYBOARD_NOTES.map((note) => (
          <span
            key={note}
            className={[
              "key",
              note.includes("#") ? "key--black" : "key--white",
              chord.notes.includes(note) ? "is-on" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  );
}
