import { useEffect, useMemo, useRef, useState } from "react";
import { AnalysisLayout } from "./components/AnalysisLayout";
import { AppHeader } from "./components/AppHeader";
import { HeroPanel } from "./components/HeroPanel";
import { SiteFooter } from "./components/SiteFooter";
import { Workspace } from "./components/Workspace";
import {
  playProgression,
  previewChord,
  previewChordPattern,
  previewMidiNotes,
  previewNote,
  stopPlayback,
} from "./lib/audioPlayer";
import { CHORD_LIBRARY, isChordAnalysis, parseProgression } from "./lib/chordTheory";
import {
  clearPracticeState,
  DEFAULT_PRACTICE_STATE,
  loadPracticeState,
  savePracticeState,
} from "./lib/practiceStorage";

export default function App() {
  const [practiceState, setPracticeState] = useState(loadPracticeState);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasLoadedPracticeState = useRef(false);
  const skipNextSave = useRef(false);
  const { input, bpm } = practiceState;

  const parsedChords = useMemo(() => parseProgression(input), [input]);
  const playableChords = parsedChords.filter(isChordAnalysis);
  const selectedChord = parsedChords[selectedIndex] ?? parsedChords[0];
  const selectedAnalysis = selectedChord && isChordAnalysis(selectedChord) ? selectedChord : undefined;

  useEffect(() => {
    if (!hasLoadedPracticeState.current) {
      hasLoadedPracticeState.current = true;
      return;
    }

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    savePracticeState(practiceState);
  }, [practiceState]);

  function handleInputChange(nextInput: string) {
    setPracticeState((currentState) => ({ ...currentState, input: nextInput }));
    setSelectedIndex(0);
  }

  function insertExample(example: string) {
    const nextInput = input.trim() ? `${input.trim()} ${example}` : example;
    setPracticeState((currentState) => ({ ...currentState, input: nextInput }));
  }

  function handleBpmChange(nextBpm: number) {
    setPracticeState((currentState) => ({ ...currentState, bpm: nextBpm }));
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

  async function handleReset() {
    if (isPlaying) {
      await handleStop();
    } else {
      setActiveIndex(null);
    }

    clearPracticeState();
    skipNextSave.current = true;
    setPracticeState({ ...DEFAULT_PRACTICE_STATE });
    setSelectedIndex(0);
  }

  return (
    <main className="app-shell">
      <AppHeader
        bpm={bpm}
        isPlaying={isPlaying}
        onBpmChange={handleBpmChange}
        onPlay={handlePlay}
        onReset={handleReset}
        onStop={handleStop}
      />
      <HeroPanel />
      <Workspace
        input={input}
        libraryItems={CHORD_LIBRARY}
        onInputChange={handleInputChange}
        onInsertExample={insertExample}
      />
      <AnalysisLayout
        activeIndex={activeIndex}
        playableCount={playableChords.length}
        selectedIndex={selectedIndex}
        selectedChord={selectedAnalysis}
        chords={parsedChords}
        onSelectChord={setSelectedIndex}
        onPreviewChord={previewChord}
        onPreviewPattern={(chord) => previewChordPattern(chord, bpm)}
        onPreviewPatternEvent={previewMidiNotes}
        onPreviewNote={previewNote}
      />
      <SiteFooter />
    </main>
  );
}
