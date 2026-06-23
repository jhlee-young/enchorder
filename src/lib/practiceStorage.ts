import { DEFAULT_BPM, DEFAULT_PROGRESSION } from "../constants/appDefaults";
import { clampBpm } from "../utils/number";

export type PracticeState = {
  input: string;
  bpm: number;
};

export const PRACTICE_STORAGE_KEY = "enchorder.practice.v1";

export const DEFAULT_PRACTICE_STATE: PracticeState = {
  input: DEFAULT_PROGRESSION,
  bpm: DEFAULT_BPM,
};

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function normalizePracticeState(value: unknown): PracticeState {
  if (!value || typeof value !== "object") {
    return DEFAULT_PRACTICE_STATE;
  }

  const candidate = value as Partial<PracticeState>;
  const input =
    typeof candidate.input === "string" && candidate.input.trim()
      ? candidate.input
      : DEFAULT_PRACTICE_STATE.input;
  const bpm =
    typeof candidate.bpm === "number" && Number.isFinite(candidate.bpm)
      ? clampBpm(candidate.bpm)
      : DEFAULT_PRACTICE_STATE.bpm;

  return { input, bpm };
}

export function loadPracticeState(storage: Storage | null = getStorage()): PracticeState {
  if (!storage) {
    return DEFAULT_PRACTICE_STATE;
  }

  try {
    const rawValue = storage.getItem(PRACTICE_STORAGE_KEY);

    if (!rawValue) {
      return DEFAULT_PRACTICE_STATE;
    }

    return normalizePracticeState(JSON.parse(rawValue));
  } catch {
    return DEFAULT_PRACTICE_STATE;
  }
}

export function savePracticeState(
  state: PracticeState,
  storage: Storage | null = getStorage(),
) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      PRACTICE_STORAGE_KEY,
      JSON.stringify({
        input: state.input,
        bpm: clampBpm(state.bpm),
      }),
    );
  } catch {
    // Storage can be unavailable in private browsing or locked-down contexts.
  }
}

export function clearPracticeState(storage: Storage | null = getStorage()) {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(PRACTICE_STORAGE_KEY);
  } catch {
    // Keep reset safe even when localStorage is blocked.
  }
}
