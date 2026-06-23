import { useMemo, useState } from "react";
import { AnalysisLayout } from "./components/AnalysisLayout";
import { AppHeader } from "./components/AppHeader";
import { HeroPanel } from "./components/HeroPanel";
import { SiteFooter } from "./components/SiteFooter";
import { Workspace } from "./components/Workspace";
import { DEFAULT_PROGRESSION } from "./constants/appDefaults";
import { playProgression, previewChord, previewNote, stopPlayback } from "./lib/audioPlayer";
import { CHORD_LIBRARY, isChordAnalysis, parseProgression } from "./lib/chordTheory";

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

  function handleInputChange(nextInput: string) {
    setInput(nextInput);
    setSelectedIndex(0);
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
      <AppHeader
        bpm={bpm}
        isPlaying={isPlaying}
        onBpmChange={setBpm}
        onPlay={handlePlay}
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
        onPreviewNote={previewNote}
      />
      <SiteFooter />
    </main>
  );
}
