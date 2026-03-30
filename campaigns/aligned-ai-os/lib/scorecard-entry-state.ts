import {
  getMostRecentScorecardWindow,
  isDateInScorecardWindow,
  isSameEasternCalendarWeek,
  type ScorecardWindow,
} from "@/lib/scorecard-window";

const DAY_MS = 24 * 60 * 60 * 1000;

export type ScorecardEntryLike = {
  id: string;
  createdAt: string;
  scores: Record<string, unknown> | null | undefined;
  notes?: string | null;
  oneThing?: string | null;
};

export type ParsedScorecardNotes = {
  oneThing: string | null;
  reflections: Record<string, string>;
};

function sortEntriesNewestFirst<T extends { createdAt: string }>(entries: T[]): T[] {
  return [...entries].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

export function parseScorecardNotes(notes: string | null | undefined): ParsedScorecardNotes {
  if (!notes) return { oneThing: null, reflections: {} };
  try {
    const parsed = JSON.parse(notes) as {
      oneThing?: string;
      reflections?: Record<string, string>;
    };
    return {
      oneThing: parsed.oneThing?.trim() || null,
      reflections: parsed.reflections || {},
    };
  } catch {
    return { oneThing: null, reflections: {} };
  }
}

export function getEntryOneThing(
  entry:
    | {
        notes?: string | null;
        oneThing?: string | null;
      }
    | null
    | undefined
): string | null {
  if (!entry) return null;
  if (typeof entry.oneThing === "string") {
    const trimmed = entry.oneThing.trim();
    return trimmed || null;
  }
  return parseScorecardNotes(entry.notes).oneThing;
}

export function hasMeaningfulScores(
  scores: Record<string, unknown> | null | undefined
): boolean {
  if (!scores || typeof scores !== "object") return false;
  return Object.values(scores).some((value) => {
    if (typeof value === "number" && Number.isFinite(value)) return true;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed);
    }
    return false;
  });
}

export function getRelevantScorecardWindow(win: ScorecardWindow) {
  return win.canSubmit
    ? { opensAt: win.opensAt, closesAt: win.closesAt }
    : getMostRecentScorecardWindow(win);
}

export function hasScoredSubmissionInRelevantWindow<T extends ScorecardEntryLike>(
  entries: T[],
  win: ScorecardWindow
): boolean {
  const relevantWindow = getRelevantScorecardWindow(win);
  return entries.some(
    (entry) =>
      hasMeaningfulScores(entry.scores) &&
      isDateInScorecardWindow(entry.createdAt, relevantWindow)
  );
}

export function shouldShowFirstSubmissionFallback<T extends ScorecardEntryLike>(
  entries: T[],
  submittedInRelevantWindow: boolean,
  now: Date = new Date()
): boolean {
  const scoredEntries = sortEntriesNewestFirst(entries).filter((entry) =>
    hasMeaningfulScores(entry.scores)
  );
  const latestScoredEntry = scoredEntries[0];
  return (
    scoredEntries.length === 1 &&
    !!latestScoredEntry &&
    !submittedInRelevantWindow &&
    isSameEasternCalendarWeek(latestScoredEntry.createdAt, now)
  );
}

export function findLatestMissedWindowManualEntry<T extends ScorecardEntryLike>(
  entries: T[],
  win: ScorecardWindow
): T | null {
  if (win.canSubmit) return null;
  const relevantWindow = getMostRecentScorecardWindow(win);
  const afterTs = relevantWindow.closesAt.getTime();
  const beforeTs = win.nextOpen.getTime();
  return (
    sortEntriesNewestFirst(entries).find((entry) => {
      const entryTs = new Date(entry.createdAt).getTime();
      return (
        entryTs > afterTs &&
        entryTs < beforeTs &&
        !hasMeaningfulScores(entry.scores) &&
        !!getEntryOneThing(entry)
      );
    }) || null
  );
}

export function getLatestVitalActionEntry<T extends ScorecardEntryLike>(entries: T[]): T | null {
  return sortEntriesNewestFirst(entries).find((entry) => !!getEntryOneThing(entry)) || null;
}

export function getMissedWindowNoDataRange(win: ScorecardWindow) {
  const lastFriday = new Date(win.nextOpen.getTime() - 7 * DAY_MS);
  const lastMonday = new Date(lastFriday.getTime() - 4 * DAY_MS);
  const format = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const start = format(lastMonday);
  const end = format(lastFriday);
  return {
    start,
    end,
    label:
      start === end
        ? `No data available for the week of ${start}.`
        : `No data available for the week of ${start} – ${end}.`,
  };
}
