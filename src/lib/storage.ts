export type ProgressState = {
  completedSessionIds: string[];
  currentSessionId: string;
};

const KEY = "7v7-progress";

export const defaultProgress: ProgressState = {
  completedSessionIds: [],
  currentSessionId: "session-winger-1"
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return defaultProgress;
  try {
    return JSON.parse(raw) as ProgressState;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: ProgressState) {
  window.localStorage.setItem(KEY, JSON.stringify(progress));
}
