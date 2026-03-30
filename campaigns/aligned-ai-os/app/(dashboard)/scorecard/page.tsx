"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Crosshair,
  Link2,
  BatteryCharging,
  ShieldCheck,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import { SCORECARD_CATEGORIES, calculateScore, getOverallScore } from "@/lib/scorecard";
import { getScorecardWindow } from "@/lib/scorecard-window";
import { chatQueryUrl, buildSixCsTrendCoachPrompt } from "@/lib/chat-deep-links";
import {
  findLatestMissedWindowManualEntry,
  getMissedWindowNoDataRange,
  hasMeaningfulScores,
  hasScoredSubmissionInRelevantWindow,
  parseScorecardNotes,
  shouldShowFirstSubmissionFallback,
} from "@/lib/scorecard-entry-state";

type ScorecardEntry = {
  id: string;
  createdAt: string;
  weekStart: string;
  scores: Record<string, number>;
  notes: string | null;
};

const ICONS: Record<string, React.ElementType> = {
  crosshair: Crosshair,
  link: Link2,
  "battery-charging": BatteryCharging,
  "shield-check": ShieldCheck,
  zap: Zap,
  users: Users,
};

function getScorecardScoreColor(score: number) {
  if (score <= 30) return "#ef4444";
  if (score <= 55) return "#f97316";
  if (score <= 79) return "#eab308";
  return "#22c55e";
}

export default function ScorecardPage() {
  const [entries, setEntries] = useState<ScorecardEntry[]>([]);
  const [currentWeekEntry, setCurrentWeekEntry] = useState<ScorecardEntry | null>(
    null
  );
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [oneThing, setOneThing] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("clarity");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<"score" | "reflect" | "onething">("score");
  const [hasAnySubmissions, setHasAnySubmissions] = useState(false);
  const [vitalActionExpanded, setVitalActionExpanded] = useState(false);
  const [manualVitalAction, setManualVitalAction] = useState("");
  const [manualVitalActionSaving, setManualVitalActionSaving] = useState(false);
  const [manualVitalActionError, setManualVitalActionError] = useState<string | null>(
    null
  );

  useEffect(() => {
    SCORECARD_CATEGORIES.forEach((c) => {
      setAnswers((prev) => ({ ...prev, [c.key]: [0, 0, 0, 0, 0] }));
    });

    fetch("/api/scorecard")
      .then((r) => r.json())
      .then((data) => {
        const past = data.entries || [];
        const cw = data.currentWeek ?? null;
        const cwHasScores = hasMeaningfulScores(cw?.scores);
        setEntries(past);
        setCurrentWeekEntry(cw);
        setHasAnySubmissions(!!(cw || past.length > 0));
        if (cwHasScores) {
          setSubmitted(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function setAnswer(categoryKey: string, questionIdx: number, value: number) {
    setAnswers((prev) => {
      const updated = { ...prev };
      updated[categoryKey] = [...(updated[categoryKey] || [0, 0, 0, 0, 0])];
      updated[categoryKey][questionIdx] = value;
      return updated;
    });
  }

  function getScores(): Record<string, number> {
    const scores: Record<string, number> = {};
    SCORECARD_CATEGORIES.forEach((c) => {
      scores[c.key] = calculateScore(answers[c.key] || [0, 0, 0, 0, 0]);
    });
    return scores;
  }

  function allAnswered(): boolean {
    return SCORECARD_CATEGORIES.every((c) =>
      (answers[c.key] || []).every((a) => a > 0)
    );
  }

  async function handleSubmit() {
    const scores = getScores();
    const notesPayload = JSON.stringify({
      reflections,
      oneThing,
    });

    const res = await fetch("/api/scorecard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scores, notes: notesPayload }),
    });

    if (res.ok) setSubmitted(true);
  }

  const scores = getScores();
  const overall = getOverallScore(scores);

  const allEntriesOrdered = useMemo(() => {
    const all = [
      ...(currentWeekEntry ? [currentWeekEntry] : []),
      ...entries,
    ];
    return all.sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
  }, [currentWeekEntry, entries]);

  /** Same ordering as dashboard: current week first, then past (newest first from API). */
  const scoredEntriesMerged = useMemo(() => {
    const past = entries.filter((entry) => hasMeaningfulScores(entry.scores));
    const cur =
      currentWeekEntry &&
      hasMeaningfulScores(currentWeekEntry.scores)
        ? currentWeekEntry
        : null;
    return cur ? [cur, ...past] : past;
  }, [currentWeekEntry, entries]);

  const sixCsCoachHref = useMemo(() => {
    const list = scoredEntriesMerged;
    if (list.length < 1) {
      return chatQueryUrl(
        "I submitted my latest 6Cs scorecard. Help me interpret what moved, what my lowest C is signaling, and one Vital Action adjustment for next week."
      );
    }
    const latestS = list[0].scores;
    const prevS = list[1]?.scores;
    let weakest = {
      label: SCORECARD_CATEGORIES[0].label,
      val: 101,
    };
    for (const c of SCORECARD_CATEGORIES) {
      const v = latestS[c.key] || 0;
      if (v < weakest.val) weakest = { label: c.label, val: v };
    }
    let declineLabel: string | undefined;
    let declineDelta: number | undefined;
    if (prevS) {
      let worstD = 0;
      for (const c of SCORECARD_CATEGORIES) {
        const d = (latestS[c.key] || 0) - (prevS[c.key] || 0);
        if (d < worstD) {
          worstD = d;
          declineLabel = c.label;
          declineDelta = d;
        }
      }
    }
    return chatQueryUrl(
      buildSixCsTrendCoachPrompt({
        weakestLabel: weakest.label,
        weakestPct: weakest.val,
        declinedLabel: declineLabel,
        declineDelta: declineDelta,
      })
    );
  }, [scoredEntriesMerged]);

  const window = getScorecardWindow();
  const missedWindowRange = getMissedWindowNoDataRange(window);
  const canSubmit = window.canSubmit || !hasAnySubmissions;
  const currentWindowSubmitted = hasScoredSubmissionInRelevantWindow(
    allEntriesOrdered,
    window
  );
  const showFirstSubmissionFallback = shouldShowFirstSubmissionFallback(
    allEntriesOrdered,
    currentWindowSubmitted
  );

  const latestScoredForOffWindow = scoredEntriesMerged[0] || null;
  const latestScoredNotes = parseScorecardNotes(latestScoredForOffWindow?.notes);
  const { oneThing: offWindowOneThing, reflections: offWindowReflections } =
    latestScoredNotes;
  const offWindowVisibleReflections = SCORECARD_CATEGORIES.map((category) => ({
    key: category.key,
    label: category.label,
    value: offWindowReflections[category.key]?.trim() || "",
  })).filter((r) => r.value);
  const missedWindow =
    scoredEntriesMerged.length > 0 &&
    !window.canSubmit &&
    !currentWindowSubmitted &&
    !showFirstSubmissionFallback;
  const missedWindowManualEntry = missedWindow
    ? findLatestMissedWindowManualEntry(allEntriesOrdered, window)
    : null;
  const missedWindowManualOneThing = parseScorecardNotes(
    missedWindowManualEntry?.notes
  ).oneThing;
  const missedWindowPlaceholder =
    latestScoredNotes.oneThing ||
    parseScorecardNotes(scoredEntriesMerged[1]?.notes).oneThing ||
    "";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  async function handleManualVitalActionSave() {
    const oneThing = manualVitalAction.trim();
    if (!oneThing) {
      setManualVitalActionError("Enter your Vital Action for the week.");
      return;
    }

    setManualVitalActionSaving(true);
    setManualVitalActionError(null);

    try {
      const res = await fetch("/api/scorecard/vital-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oneThing }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setManualVitalActionError(
          data?.error || "Could not save your Vital Action."
        );
        setManualVitalActionSaving(false);
        return;
      }

      globalThis.window.location.reload();
    } catch {
      setManualVitalActionError("Could not save your Vital Action.");
      setManualVitalActionSaving(false);
    }
  }

  if (!canSubmit && !submitted) {
    return (
      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b border-border space-y-2">
          <h1 className="text-lg font-semibold">6Cs Scorecard</h1>
          <p className="text-sm text-muted-foreground">Weekly alignment check</p>
          {scoredEntriesMerged.length > 0 && (
            <Link
              href={sixCsCoachHref}
              className="inline-flex text-xs sm:text-sm font-medium text-accent hover:underline"
            >
              Coach on 6Cs →
            </Link>
          )}
        </header>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-2xl mx-auto space-y-10 pb-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10">
                <ClipboardCheck className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-xl font-serif font-bold">
                Scorecard is only available during the weekly window
              </h2>
              <p className="text-muted-foreground">{window.message}</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                ← Back to dashboard
              </Link>
            </div>

            {missedWindow ? (
              <>
                {missedWindowManualOneThing ? (
                  <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-5">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          This Week&apos;s Vital Action
                        </p>
                        <p className="font-medium leading-snug whitespace-pre-wrap break-words mt-2">
                          {missedWindowManualOneThing}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-accent/30 bg-card p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                          Window missed
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            This Week&apos;s Vital Action
                          </p>
                          <p className="text-lg font-semibold leading-snug">
                            Set the move ALFRED should anchor this week
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          You missed the full 6Cs review, but you can still set the single action
                          that should stay front and center for the week ahead.
                        </p>
                        <textarea
                          value={manualVitalAction}
                          onChange={(event) => {
                            setManualVitalAction(event.target.value);
                            if (manualVitalActionError) setManualVitalActionError(null);
                          }}
                          placeholder={
                            missedWindowPlaceholder || "My Vital Action this week is..."
                          }
                          rows={3}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {manualVitalActionError && (
                          <p className="text-sm text-destructive">{manualVitalActionError}</p>
                        )}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Reflections stay locked until the next scorecard window opens on Friday.
                          </p>
                          <button
                            type="button"
                            onClick={handleManualVitalActionSave}
                            disabled={manualVitalActionSaving}
                            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {manualVitalActionSaving ? "Saving..." : "Set Vital Action"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-dashed border-border p-5 space-y-3 flex flex-col items-center justify-center text-center">
                  <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-medium">6Cs Scorecard</p>
                  <p className="text-sm text-muted-foreground">{missedWindowRange.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Your next scorecard will be available Friday at 12pm.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Same Vital Action + 6C reflections pattern as dashboard (read-only) */}
                {offWindowOneThing ? (
                  <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-5">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          This Week&apos;s Vital Action
                        </p>
                        {latestScoredForOffWindow && (
                          <p className="text-xs text-muted-foreground mt-1">
                            From week of{" "}
                            {new Date(
                              latestScoredForOffWindow.weekStart
                            ).toLocaleDateString()}
                          </p>
                        )}
                        <p className="font-medium leading-snug whitespace-pre-wrap break-words mt-2">
                          {offWindowOneThing}
                        </p>
                      </div>
                    </div>
                    {offWindowVisibleReflections.length > 0 && (
                      <>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => setVitalActionExpanded((o) => !o)}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
                            aria-expanded={vitalActionExpanded}
                            aria-controls="scorecard-offwindow-reflections"
                          >
                            {vitalActionExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <span>View my 6C reflections</span>
                          </button>
                        </div>
                        {vitalActionExpanded && (
                          <div
                            id="scorecard-offwindow-reflections"
                            className="mt-4 pt-4 border-t border-border/60 space-y-2"
                          >
                            {offWindowVisibleReflections.map((reflection) => (
                              <div
                                key={reflection.key}
                                className="rounded-xl border border-border bg-background/60 px-4 py-3"
                              >
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                  {reflection.label}
                                </p>
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                                  {reflection.value}
                                </p>
                              </div>
                            ))}
                            <div className="pt-2 flex justify-center">
                              <button
                                type="button"
                                onClick={() => setVitalActionExpanded(false)}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
                              >
                                <ChevronUp className="h-4 w-4" />
                                <span>Collapse</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 p-5 flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        This Week&apos;s Vital Action
                      </p>
                      <p className="font-medium text-muted-foreground mt-1">
                        {scoredEntriesMerged.length > 0
                          ? "Your latest scorecard doesn't have a Vital Action saved yet. When the window opens, complete the final step to set one."
                          : "Complete your first scorecard when the window opens to set your Vital Action here."}
                      </p>
                    </div>
                  </div>
                )}

                {latestScoredForOffWindow && (
                  <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-accent shrink-0" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Latest 6Cs scores
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Week of{" "}
                        {new Date(
                          latestScoredForOffWindow.weekStart
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-end gap-3">
                      <span
                        className="text-4xl font-bold font-serif"
                        style={{
                          color: getScorecardScoreColor(
                            getOverallScore(latestScoredForOffWindow.scores)
                          ),
                        }}
                      >
                        {getOverallScore(latestScoredForOffWindow.scores)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {SCORECARD_CATEGORIES.map((c) => {
                        const Icon = ICONS[c.icon];
                        const pct = latestScoredForOffWindow.scores[c.key] || 0;
                        const scoreColor = getScorecardScoreColor(pct);
                        return (
                          <div
                            key={c.key}
                            className="flex flex-col items-center p-2.5 rounded-xl border border-border bg-background/50"
                          >
                            {Icon && (
                              <Icon className="h-5 w-5 mb-1" style={{ color: scoreColor }} />
                            )}
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {c.label}
                            </p>
                            <p
                              className="text-lg font-bold tabular-nums"
                              style={{ color: scoreColor }}
                            >
                              {pct}%
                            </p>
                            <div className="w-full h-1.5 rounded-full bg-muted/50 mt-1 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: scoreColor,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Link
                      href={sixCsCoachHref}
                      className="inline-flex text-sm font-semibold text-accent hover:underline pt-1"
                    >
                      Coach on these 6Cs →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b border-border">
          <h1 className="text-lg font-semibold">6Cs Scorecard</h1>
          <p className="text-sm text-muted-foreground">Weekly alignment check</p>
        </header>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10">
              <ClipboardCheck className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-serif font-bold">
              Scorecard Submitted
            </h2>
            <p className="text-muted-foreground">
              Your AI coach now has this week&apos;s 6Cs data. Ask it to run your
              weekly review for personalized insights.
            </p>
            <Link
              href={sixCsCoachHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              Open Alfred with a 6Cs-focused prompt →
            </Link>

            {entries.length > 0 && (
              <div className="space-y-3 pt-8 border-t border-border text-left">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Previous Weeks
                </h2>
                {entries.map((entry) => {
                  const avg = getOverallScore(entry.scores);
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-xl border border-border p-4"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          Week of {new Date(entry.weekStart).toLocaleDateString()}
                        </p>
                        <div className="flex gap-3 mt-1 flex-wrap">
                          {SCORECARD_CATEGORIES.map((c) => (
                            <span key={c.key} className="text-xs text-muted-foreground">
                              {c.label.slice(0, 4)}: {entry.scores[c.key] || 0}%
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-lg font-bold font-serif">{avg}%</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-6 py-4 border-b border-border space-y-3">
        <div className="rounded-xl border-2 border-accent/30 bg-accent/5 px-4 py-3">
          <p className="font-semibold text-sm">
            {hasAnySubmissions
              ? window.message
              : "Complete your first 6Cs scorecard whenever you're ready. After this, future scorecards will open Friday at 12pm and close Sunday at 6pm Eastern."}
          </p>
          {hasAnySubmissions && window.countdownMessage && (
            <p className="text-muted-foreground text-sm mt-1 font-mono">{window.countdownMessage}</p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold">6Cs Scorecard</h1>
            <p className="text-sm text-muted-foreground">
              {step === "score" && "Rate each statement 1-5 for this week"}
              {step === "reflect" && "One reflection per C — what would move you forward?"}
              {step === "onething" && "The Vital Action that makes everything else easier"}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {hasAnySubmissions && (
              <Link
                href={sixCsCoachHref}
                className="text-xs sm:text-sm font-medium text-accent hover:underline whitespace-nowrap"
              >
                Coach on 6Cs →
              </Link>
            )}
            {allAnswered() && (
              <div className="text-center">
                <div className="text-2xl font-bold font-serif text-accent">{overall}%</div>
                <div className="text-xs text-muted-foreground">Overall</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto space-y-4">
          {step === "score" && (
            <>
              {SCORECARD_CATEGORIES.map((category) => {
                const Icon = ICONS[category.icon];
                const isExpanded = expandedCategory === category.key;
                const categoryScore = calculateScore(answers[category.key] || [0, 0, 0, 0, 0]);
                const allAnsweredInCategory = (answers[category.key] || []).every((a) => a > 0);

                return (
                  <div
                    key={category.key}
                    className="rounded-xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : category.key)
                      }
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5 text-accent" />}
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {allAnsweredInCategory && (
                          <span className="text-sm font-medium text-accent">
                            {categoryScore}%
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                        {category.questions.map((question, qIdx) => (
                          <div key={qIdx} className="space-y-2">
                            <p className="text-sm">{question}</p>
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  onClick={() =>
                                    setAnswer(category.key, qIdx, value)
                                  }
                                  className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                                    (answers[category.key]?.[qIdx] || 0) === value
                                      ? "bg-accent text-accent-foreground"
                                      : (answers[category.key]?.[qIdx] || 0) >= value
                                        ? "bg-accent/20 text-accent"
                                        : "bg-muted hover:bg-secondary"
                                  }`}
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => setStep("reflect")}
                disabled={!allAnswered()}
                className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                Continue to Reflections
              </button>
            </>
          )}

          {step === "reflect" && (
            <>
              {SCORECARD_CATEGORIES.map((category) => {
                const Icon = ICONS[category.icon];
                return (
                  <div
                    key={category.key}
                    className="rounded-xl border border-border p-5 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 text-accent" />}
                      <h3 className="font-medium">{category.label}</h3>
                      <span className="text-sm text-accent ml-auto">
                        {scores[category.key]}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {category.reflectionPrompt}
                    </p>
                    <textarea
                      value={reflections[category.key] || ""}
                      onChange={(e) =>
                        setReflections((prev) => ({
                          ...prev,
                          [category.key]: e.target.value,
                        }))
                      }
                      placeholder="..."
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                );
              })}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("score")}
                  className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("onething")}
                  className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === "onething" && (
            <>
              <div className="rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-semibold text-lg font-serif">
                  The Vital Action
                </h3>
                <p className="text-sm text-muted-foreground">
                  What&apos;s your Vital Action—the single move that would make every other reflection on
                  this page either easier or completely unnecessary?
                </p>
                <textarea
                  value={oneThing}
                  onChange={(e) => setOneThing(e.target.value)}
                  placeholder="The Vital Action for next week..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Score Summary */}
              <div className="rounded-xl border border-border p-5 space-y-3">
                <h3 className="font-medium">Your Scores</h3>
                <div className="grid grid-cols-3 gap-3">
                  {SCORECARD_CATEGORIES.map((c) => {
                    const Icon = ICONS[c.icon];
                    return (
                      <div
                        key={c.key}
                        className="flex items-center gap-2 text-sm"
                      >
                        {Icon && <Icon className="h-4 w-4 text-accent" />}
                        <span>{c.label}</span>
                        <span className="ml-auto font-medium">{scores[c.key]}%</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="font-medium">Overall</span>
                  <span className="text-xl font-bold font-serif text-accent">
                    {overall}%
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("reflect")}
                  className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-secondary transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
                >
                  Submit Scorecard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
