import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { isChordAnalysis, parseChord } from "../lib/chordTheory";
import { ChordDetail } from "./ChordDetail";

function renderChordDetail(chordName: string) {
  const chord = parseChord(chordName);

  expect(isChordAnalysis(chord)).toBe(true);
  if (!isChordAnalysis(chord)) {
    throw new Error(`${chordName} did not parse`);
  }

  const onPreview = vi.fn();
  const onPreviewPattern = vi.fn();
  const onPreviewPatternEvent = vi.fn();
  const onPreviewNote = vi.fn();

  render(
    <ChordDetail
      chord={chord}
      onPreview={onPreview}
      onPreviewPattern={onPreviewPattern}
      onPreviewPatternEvent={onPreviewPatternEvent}
      onPreviewNote={onPreviewNote}
    />,
  );

  return { onPreviewPattern, onPreviewPatternEvent };
}

describe("ChordDetail", () => {
  it("keeps advanced controls closed by default", () => {
    renderChordDetail("Dm9");

    const advancedPanel = screen.getByText("Advanced").closest("details");

    expect(advancedPanel).not.toBeNull();
    expect(advancedPanel).not.toHaveAttribute("open");
  });

  it("shows minor nine comping voicings inside advanced controls", () => {
    const { onPreviewPattern, onPreviewPatternEvent } = renderChordDetail("Dm9");

    fireEvent.click(screen.getByText("Advanced"));

    const voicings = screen.getByLabelText("Dm9 comping voicings");
    const facVoicing = screen.getByRole("button", { name: "Play pattern FAC" });

    expect(screen.getByText("Comping voicings")).toBeInTheDocument();
    expect(voicings).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Play pattern FAC" })).toHaveLength(1);
    expect(within(voicings).getAllByText("D")[0]).toHaveClass("pattern-note--root");
    expect(within(voicings).getAllByText("A").length).toBeGreaterThan(0);

    fireEvent.click(facVoicing);

    expect(onPreviewPatternEvent).toHaveBeenCalledWith([65, 69, 72]);

    fireEvent.click(screen.getByRole("button", { name: "Pattern" }));

    expect(onPreviewPattern).toHaveBeenCalledOnce();
  });

  it("shows voicings but disables the full pattern button when no rhythm pattern exists", () => {
    renderChordDetail("Cmaj7");

    fireEvent.click(screen.getByText("Advanced"));

    expect(screen.getByLabelText("Cmaj7 comping voicings")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play pattern CEG" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pattern" })).toBeDisabled();
  });
});
