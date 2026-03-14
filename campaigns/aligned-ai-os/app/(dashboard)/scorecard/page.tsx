"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { SCORECARD_CATEGORIES, calculateScore, getOverallScore } from "@/lib/scorecard";

type ScorecardEntry = {
  id: string;
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

export default function ScorecardPage() {
  const [entries, setEntries] = useState<ScorecardEntry[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [oneThing, setOneThing] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("clarity");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<"score" | "reflect" | "onething">("score");

  useEffect(() => {
    SCORECARD_CATEGORIES.forEach((c) => {
      setAnswers((prev) => ({ ...prev, [c.key]: [0, 0, 0, 0, 0] }));
    });

    fetch("/api/scorecard")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries || []);
        if (data.currentWeek) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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
      <header className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">6Cs Scorecard</h1>
            <p className="text-sm text-muted-foreground">
              {step === "score" && "Rate each statement 1-5 for this week"}
              {step === "reflect" && "One reflection per C — what would move you forward?"}
              {step === "onething" && "The Vital Action that makes everything else easier"}
            </p>
          </div>
          {allAnswered() && (
            <div className="text-center">
              <div className="text-2xl font-bold font-serif text-accent">{overall}%</div>
              <div className="text-xs text-muted-foreground">Overall</div>
            </div>
          )}
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
